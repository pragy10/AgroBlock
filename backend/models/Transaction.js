const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  },
  fromOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fromWallet: {
    type: String,
    required: true
  },
  toOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toWallet: {
    type: String,
    required: true
  },
  transactionType: {
    type: String,
    enum: ['register', 'request', 'accept', 'transfer', 'delivery', 'sale', 'status_update'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'confirmed'
  },
  blockchainTxHash: {
    type: String,
    required: true
  },
  blockNumber: {
    type: Number,
    default: function() {
      return Math.floor(Math.random() * 1000000) + 15000000;
    }
  },
  gasUsed: {
    type: String,
    default: '0.0021 ETH'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String,
    default: ''
  },
  latitude: {
    type: Number
  },
  longitude: {
    type: Number
  },
  temperature: {
    type: Number
  },
  humidity: {
    type: Number
  },
  notes: {
    type: String,
    default: ''
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
