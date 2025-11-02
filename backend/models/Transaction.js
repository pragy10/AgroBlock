const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
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
    enum: ['register', 'transfer', 'delivery', 'sale'],
    required: true
  },
  blockchainTxHash: {
    type: String,
    required: true
  },
  gasUsed: {
    type: String,
    default: '0.0021 ETH'
  },
  blockNumber: {
    type: Number,
    default: function() {
      return Math.floor(Math.random() * 1000000) + 15000000;
    }
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  location: {
    type: String,
    default: ''
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
  }
});

module.exports = mongoose.model('Transaction', transactionSchema);
