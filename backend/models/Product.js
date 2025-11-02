const mongoose = require('mongoose');

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
    enum: ['registered', 'in-transit', 'delivered', 'sold'],
    default: 'registered'
  },
  originLocation: {
    type: String,
    required: true
  },
  currentLocation: {
    type: String,
    required: true
  },
  harvestDate: {
    type: Date,
    required: true
  },
  expiryDate: {
    type: Date
  },
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
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
