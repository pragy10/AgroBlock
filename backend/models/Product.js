const mongoose = require('mongoose');

const locationHistorySchema = new mongoose.Schema({
  location: String,
  latitude: Number,
  longitude: Number,
  timestamp: {
    type: Date,
    default: Date.now
  },
  status: String,
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    default: 'kg'
  },
  price: {
    type: Number,
    default: 0
  },
  images: [{
    url: String,
    publicId: String
  }],
  currentOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  currentOwnerWallet: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['registered', 'pending_distribution', 'in_transit', 'at_distributor', 'at_retailer', 'sold', 'delivered'],
    default: 'registered'
  },
  originLocation: {
    type: String,
    required: true
  },
  originLatitude: {
    type: Number
  },
  originLongitude: {
    type: Number
  },
  currentLocation: {
    type: String,
    required: true
  },
  currentLatitude: {
    type: Number
  },
  currentLongitude: {
    type: Number
  },
  locationHistory: [locationHistorySchema],
  harvestDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date
  },
  certifications: [{
    name: String,
    issuedBy: String,
    issuedDate: Date,
    certificateUrl: String
  }],
  qualityMetrics: {
    temperature: Number,
    humidity: Number,
    ph: Number,
    lastChecked: Date
  },
  supplyChain: [{
    role: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    wallet: String,
    receivedAt: Date,
    status: String,
    blockchainTxHash: String
  }],
  qrCode: {
    type: String
  },
  blockchainTxHash: {
    type: String
  },
  smartContractAddress: {
    type: String,
    default: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb'
  },
  ipfsHash: {
    type: String
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
