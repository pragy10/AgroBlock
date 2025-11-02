const Product = require('../models/Product');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { BlockchainSimulator } = require('../contracts/AgriSupplyChain.sol');
const { generateQRCode } = require('../utils/qrGenerator');
const { convertToBase64 } = require('../utils/imageUpload');
const BlockchainHelper = require('../utils/blockchainHelper');

// Register new product (Farmer only) with images
exports.registerProduct = async (req, res) => {
  try {
    const { 
      name,
      description,
      category, 
      quantity, 
      unit, 
      price,
      ownerId, 
      originLocation,
      originLatitude,
      originLongitude,
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
    
    // Process uploaded images
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => ({
        url: convertToBase64(file),
        publicId: `${productId}-${Date.now()}`
      }));
    }

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
      description,
      category,
      quantity,
      unit,
      price,
      images,
      currentOwner: farmer._id,
      currentOwnerWallet: farmer.walletAddress,
      originLocation,
      originLatitude: parseFloat(originLatitude) || null,
      originLongitude: parseFloat(originLongitude) || null,
      currentLocation: originLocation,
      currentLatitude: parseFloat(originLatitude) || null,
      currentLongitude: parseFloat(originLongitude) || null,
      harvestDate,
      expiryDate,
      blockchainTxHash: blockchainTx.txHash,
      smartContractAddress: blockchainTx.contractAddress,
      ipfsHash: BlockchainSimulator.generateIPFSHash(),
      status: 'registered',
      supplyChain: [{
        role: 'farmer',
        user: farmer._id,
        wallet: farmer.walletAddress,
        receivedAt: new Date(),
        status: 'registered',
        blockchainTxHash: blockchainTx.txHash
      }],
      locationHistory: [{
        location: originLocation,
        latitude: parseFloat(originLatitude) || null,
        longitude: parseFloat(originLongitude) || null,
        status: 'registered',
        updatedBy: farmer._id
      }]
    });
    
    // Generate QR code
    const qrCode = await generateQRCode(product);
    product.qrCode = qrCode;
    
    await product.save();
    
    // Create initial transaction record
    const transaction = new Transaction({
      productId: product.productId,
      product: product._id,
      fromOwner: farmer._id,
      fromWallet: farmer.walletAddress,
      toOwner: farmer._id,
      toWallet: farmer.walletAddress,
      transactionType: 'register',
      blockchainTxHash: blockchainTx.txHash,
      gasUsed: blockchainTx.gasUsed,
      blockNumber: blockchainTx.blockNumber,
      location: originLocation,
      latitude: parseFloat(originLatitude) || null,
      longitude: parseFloat(originLongitude) || null,
      notes: 'Product registered on blockchain'
    });
    
    await transaction.save();

    // Add to blockchain
    await BlockchainHelper.createBlock([{
      txHash: blockchainTx.txHash,
      type: 'PRODUCT_REGISTRATION',
      from: farmer.walletAddress,
      to: farmer.walletAddress,
      productId: product.productId,
      data: {
        name,
        category,
        farmer: farmer.name,
        location: originLocation
      }
    }]);
    
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

// Update product status and location
exports.updateProductStatus = async (req, res) => {
  try {
    const { productId } = req.params;
    const { status, location, latitude, longitude, temperature, humidity, notes, userId } = req.body;

    const product = await Product.findOne({ productId }).populate('currentOwner');
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Simulate blockchain transaction
    const txHash = BlockchainSimulator.generateTxHash();

    // Update product status and location
    if (status) product.status = status;
    if (location) product.currentLocation = location;
    if (latitude) product.currentLatitude = parseFloat(latitude);
    if (longitude) product.currentLongitude = parseFloat(longitude);

    // Update quality metrics
    if (temperature || humidity) {
      product.qualityMetrics = {
        temperature: parseFloat(temperature) || product.qualityMetrics?.temperature,
        humidity: parseFloat(humidity) || product.qualityMetrics?.humidity,
        lastChecked: new Date()
      };
    }

    // Add to location history
    product.locationHistory.push({
      location: location || product.currentLocation,
      latitude: parseFloat(latitude) || product.currentLatitude,
      longitude: parseFloat(longitude) || product.currentLongitude,
      status: status || product.status,
      updatedBy: userId
    });

    product.blockchainTxHash = txHash;
    await product.save();

    // Create transaction record
    const transaction = new Transaction({
      productId: product.productId,
      product: product._id,
      fromOwner: product.currentOwner._id,
      fromWallet: product.currentOwner.walletAddress,
      toOwner: product.currentOwner._id,
      toWallet: product.currentOwner.walletAddress,
      transactionType: 'status_update',
      blockchainTxHash: txHash,
      gasUsed: BlockchainSimulator.calculateGas(),
      location: location || product.currentLocation,
      latitude: parseFloat(latitude) || null,
      longitude: parseFloat(longitude) || null,
      temperature: parseFloat(temperature) || null,
      humidity: parseFloat(humidity) || null,
      notes: notes || 'Status updated'
    });

    await transaction.save();

    // Add to blockchain
    await BlockchainHelper.createBlock([{
      txHash,
      type: 'STATUS_UPDATE',
      from: product.currentOwner.walletAddress,
      to: product.currentOwner.walletAddress,
      productId: product.productId,
      data: {
        status,
        location,
        updatedBy: product.currentOwner.name
      }
    }]);

    res.status(200).json({
      success: true,
      message: 'Product status updated on blockchain',
      data: {
        product,
        transaction
      }
    });
  } catch (error) {
    console.error('Update product status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// Get product by ID with full journey
exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    
    const product = await Product.findOne({ productId })
      .populate('currentOwner')
      .populate('supplyChain.user')
      .populate('locationHistory.updatedBy');
      
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

// Get all available products (for distributors/retailers/consumers)
exports.getAvailableProducts = async (req, res) => {
  try {
    const { role } = req.query;

    let query = { isAvailable: true };

    // Filter based on user role
    if (role === 'distributor') {
      query.status = 'registered';
    } else if (role === 'retailer') {
      query.status = 'at_distributor';
    } else if (role === 'consumer') {
      query.status = 'at_retailer';
    }

    const products = await Product.find(query)
      .populate('currentOwner')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get available products error:', error);
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
