const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { BlockchainSimulator } = require('../contracts/AgriSupplyChain.sol');
const { generateQRCode } = require('../utils/qrGenerator');

// Register new product (Farmer only)
exports.registerProduct = async (req, res) => {
  try {
    const { 
      name, 
      category, 
      quantity, 
      unit, 
      ownerId, 
      originLocation, 
      harvestDate,
      expiryDate 
    } = req.body;
    
    // Get farmer details
    const farmer = await User.findById(ownerId);
    if (!farmer || farmer.role !== 'farmer') {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid farmer ID or user is not a farmer' 
      });
    }
    
    // Generate unique product ID
    const productId = `PROD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    
    // Simulate blockchain smart contract call
    const blockchainTx = await BlockchainSimulator.registerProduct({
      productId,
      name,
      ownerWallet: farmer.walletAddress,
      originLocation,
      harvestDate
    });
    
    // Create product in database
    const product = new Product({
      productId,
      name,
      category,
      quantity,
      unit,
      currentOwner: farmer._id,
      currentOwnerWallet: farmer.walletAddress,
      originLocation,
      currentLocation: originLocation,
      harvestDate,
      expiryDate,
      blockchainTxHash: blockchainTx.txHash,
      smartContractAddress: blockchainTx.contractAddress,
      ipfsHash: BlockchainSimulator.generateIPFSHash(),
      status: 'registered'
    });
    
    // Generate QR code
    const qrCode = await generateQRCode(product);
    product.qrCode = qrCode;
    
    await product.save();
    
    // Create initial transaction record
    const transaction = new Transaction({
      productId: product.productId,
      fromOwner: farmer._id,
      fromWallet: farmer.walletAddress,
      toOwner: farmer._id,
      toWallet: farmer.walletAddress,
      transactionType: 'register',
      blockchainTxHash: blockchainTx.txHash,
      gasUsed: blockchainTx.gasUsed,
      blockNumber: blockchainTx.blockNumber,
      location: originLocation,
      notes: 'Product registered on blockchain'
    });
    
    await transaction.save();
    
    res.status(201).json({
      success: true,
      message: 'Product registered successfully on blockchain',
      data: {
        product,
        blockchainTx: {
          txHash: blockchainTx.txHash,
          blockNumber: blockchainTx.blockNumber,
          gasUsed: blockchainTx.gasUsed,
          contractAddress: blockchainTx.contractAddress
        }
      }
    });
  } catch (error) {
    console.error('Product registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during product registration',
      error: error.message 
    });
  }
};

// Transfer product ownership
exports.transferProduct = async (req, res) => {
  try {
    const { productId, fromOwnerId, toOwnerId, location, temperature, humidity, notes } = req.body;
    
    // Get product
    const product = await Product.findOne({ productId });
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    // Verify current owner
    if (product.currentOwner.toString() !== fromOwnerId) {
      return res.status(403).json({ 
        success: false, 
        message: 'Unauthorized: You are not the current owner' 
      });
    }
    
    // Get users
    const fromOwner = await User.findById(fromOwnerId);
    const toOwner = await User.findById(toOwnerId);
    
    if (!fromOwner || !toOwner) {
      return res.status(404).json({ 
        success: false, 
        message: 'Owner not found' 
      });
    }
    
    // Simulate blockchain smart contract call
    const blockchainTx = await BlockchainSimulator.transferOwnership(
      productId,
      fromOwner.walletAddress,
      toOwner.walletAddress
    );
    
    // Update product ownership
    product.currentOwner = toOwner._id;
    product.currentOwnerWallet = toOwner.walletAddress;
    product.currentLocation = location || product.currentLocation;
    product.status = 'in-transit';
    product.blockchainTxHash = blockchainTx.txHash;
    
    await product.save();
    
    // Create transaction record
    const transaction = new Transaction({
      productId: product.productId,
      fromOwner: fromOwner._id,
      fromWallet: fromOwner.walletAddress,
      toOwner: toOwner._id,
      toWallet: toOwner.walletAddress,
      transactionType: 'transfer',
      blockchainTxHash: blockchainTx.txHash,
      gasUsed: blockchainTx.gasUsed,
      blockNumber: blockchainTx.blockNumber,
      location,
      temperature,
      humidity,
      notes: notes || `Transferred from ${fromOwner.role} to ${toOwner.role}`
    });
    
    await transaction.save();
    
    res.status(200).json({
      success: true,
      message: 'Ownership transferred successfully on blockchain',
      data: {
        product,
        transaction,
        blockchainTx: {
          txHash: blockchainTx.txHash,
          blockNumber: blockchainTx.blockNumber,
          gasUsed: blockchainTx.gasUsed
        }
      }
    });
  } catch (error) {
    console.error('Transfer error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during transfer',
      error: error.message 
    });
  }
};

// Get product by ID with full history
exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await Product.findOne({ productId }).populate('currentOwner');
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    // Get transaction history
    const history = await Transaction.find({ productId })
      .populate('fromOwner')
      .populate('toOwner')
      .sort({ timestamp: 1 });
    
    res.status(200).json({
      success: true,
      data: {
        product,
        history,
        totalTransactions: history.length
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate('currentOwner')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};

// Get products by owner
exports.getProductsByOwner = async (req, res) => {
  try {
    const { ownerId } = req.params;
    
    const products = await Product.find({ currentOwner: ownerId })
      .populate('currentOwner')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get products by owner error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error',
      error: error.message 
    });
  }
};
