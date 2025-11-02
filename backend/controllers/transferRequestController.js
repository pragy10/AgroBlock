const TransferRequest = require('../models/TransferRequest');
const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { BlockchainSimulator } = require('../contracts/AgriSupplyChain.sol');
const BlockchainHelper = require('../utils/blockchainHelper');

// Create a transfer request (Distributor/Retailer/Consumer requests product)
exports.createTransferRequest = async (req, res) => {
  try {
    const { productId, toUserId, message, proposedPrice, expectedDeliveryDate } = req.body;
    
    // Get product
    const product = await Product.findOne({ productId }).populate('currentOwner');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Product is not available for transfer'
      });
    }

    // Get requesting user
    const toUser = await User.findById(toUserId);
    if (!toUser) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Determine request type based on roles
    let requestType;
    const currentOwnerRole = product.currentOwner.role;
    const requesterRole = toUser.role;

    if (currentOwnerRole === 'farmer' && requesterRole === 'distributor') {
      requestType = 'distributor_request';
    } else if (currentOwnerRole === 'distributor' && requesterRole === 'retailer') {
      requestType = 'retailer_request';
    } else if (currentOwnerRole === 'retailer' && requesterRole === 'consumer') {
      requestType = 'consumer_purchase';
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid request: Transfer not allowed between these roles'
      });
    }

    // Create transfer request
    const transferRequest = new TransferRequest({
      productId: product.productId,
      product: product._id,
      fromUser: product.currentOwner._id,
      fromWallet: product.currentOwner.walletAddress,
      toUser: toUser._id,
      toWallet: toUser.walletAddress,
      requestType,
      message,
      proposedPrice,
      location: toUser.location,
      expectedDeliveryDate
    });

    await transferRequest.save();

    // Create blockchain transaction for request
    const txHash = BlockchainSimulator.generateTxHash();
    const transaction = new Transaction({
      productId: product.productId,
      product: product._id,
      fromOwner: product.currentOwner._id,
      fromWallet: product.currentOwner.walletAddress,
      toOwner: toUser._id,
      toWallet: toUser.walletAddress,
      transactionType: 'request',
      blockchainTxHash: txHash,
      gasUsed: BlockchainSimulator.calculateGas(),
      location: toUser.location,
      notes: `Transfer request from ${requesterRole}`,
      metadata: {
        requestId: transferRequest._id,
        requestType
      }
    });

    await transaction.save();

    // Add to blockchain
    await BlockchainHelper.createBlock([{
      txHash,
      type: 'TRANSFER_REQUEST',
      from: product.currentOwner.walletAddress,
      to: toUser.walletAddress,
      productId: product.productId,
      data: {
        requester: toUser.name,
        role: requesterRole,
        message
      }
    }]);

    res.status(201).json({
      success: true,
      message: 'Transfer request created successfully',
      data: {
        request: transferRequest,
        transaction
      }
    });
  } catch (error) {
    console.error('Transfer request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get all transfer requests for a user
exports.getTransferRequests = async (req, res) => {
  try {
    const { userId, type } = req.query;

    let query = {};
    
    if (type === 'received') {
      query.fromUser = userId;
    } else if (type === 'sent') {
      query.toUser = userId;
    } else {
      query.$or = [{ fromUser: userId }, { toUser: userId }];
    }

    const requests = await TransferRequest.find(query)
      .populate('product')
      .populate('fromUser')
      .populate('toUser')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: requests.length,
      data: requests
    });
  } catch (error) {
    console.error('Get transfer requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Accept transfer request
exports.acceptTransferRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { location, latitude, longitude } = req.body;

    const request = await TransferRequest.findById(requestId)
      .populate('product')
      .populate('fromUser')
      .populate('toUser');

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Transfer request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been processed'
      });
    }

    // Update request status
    request.status = 'accepted';
    request.respondedAt = new Date();
    await request.save();

    // Get product
    const product = await Product.findById(request.product._id);

    // Simulate blockchain transfer
    const txHash = BlockchainSimulator.generateTxHash();
    
    // Update product ownership
    product.currentOwner = request.toUser._id;
    product.currentOwnerWallet = request.toWallet;
    product.currentLocation = location || request.location;
    product.currentLatitude = latitude;
    product.currentLongitude = longitude;
    
    // Update status based on new owner role
    if (request.toUser.role === 'distributor') {
      product.status = 'at_distributor';
    } else if (request.toUser.role === 'retailer') {
      product.status = 'at_retailer';
    } else if (request.toUser.role === 'consumer') {
      product.status = 'sold';
    }

    // Add to supply chain
    product.supplyChain.push({
      role: request.toUser.role,
      user: request.toUser._id,
      wallet: request.toWallet,
      receivedAt: new Date(),
      status: product.status,
      blockchainTxHash: txHash
    });

    // Add location history
    product.locationHistory.push({
      location: location || request.location,
      latitude,
      longitude,
      status: product.status,
      updatedBy: request.toUser._id
    });

    product.blockchainTxHash = txHash;
    await product.save();

    // Create blockchain transaction
    const transaction = new Transaction({
      productId: product.productId,
      product: product._id,
      fromOwner: request.fromUser._id,
      fromWallet: request.fromWallet,
      toOwner: request.toUser._id,
      toWallet: request.toWallet,
      transactionType: 'accept',
      blockchainTxHash: txHash,
      gasUsed: BlockchainSimulator.calculateGas(),
      location: location || request.location,
      latitude,
      longitude,
      notes: `Transfer accepted by ${request.fromUser.name}`,
      metadata: {
        requestId: request._id,
        requestType: request.requestType
      }
    });

    await transaction.save();

    // Update request with tx hash
    request.blockchainTxHash = txHash;
    await request.save();

    // Add to blockchain
    await BlockchainHelper.createBlock([{
      txHash,
      type: 'TRANSFER_ACCEPTED',
      from: request.fromWallet,
      to: request.toWallet,
      productId: product.productId,
      data: {
        acceptedBy: request.fromUser.name,
        receivedBy: request.toUser.name,
        newStatus: product.status
      }
    }]);

    res.status(200).json({
      success: true,
      message: 'Transfer request accepted and recorded on blockchain',
      data: {
        request,
        product,
        transaction
      }
    });
  } catch (error) {
    console.error('Accept transfer request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Reject transfer request
exports.rejectTransferRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { reason } = req.body;

    const request = await TransferRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Transfer request not found'
      });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Request has already been processed'
      });
    }

    request.status = 'rejected';
    request.respondedAt = new Date();
    request.message = reason || 'Request rejected';
    await request.save();

    res.status(200).json({
      success: true,
      message: 'Transfer request rejected',
      data: request
    });
  } catch (error) {
    console.error('Reject transfer request error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};
