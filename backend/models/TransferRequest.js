const mongoose = require('mongoose');

const transferRequestSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  fromWallet: {
    type: String,
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toWallet: {
    type: String,
    required: true
  },
  requestType: {
    type: String,
    enum: ['distributor_request', 'retailer_request', 'consumer_purchase'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending'
  },
  message: {
    type: String,
    default: ''
  },
  proposedPrice: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    default: ''
  },
  expectedDeliveryDate: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  respondedAt: {
    type: Date
  },
  blockchainTxHash: {
    type: String
  }
});

module.exports = mongoose.model('TransferRequest', transferRequestSchema);
