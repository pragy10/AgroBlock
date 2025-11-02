const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  txHash: String,
  type: String,
  from: String,
  to: String,
  productId: String,
  data: mongoose.Schema.Types.Mixed
}, { _id: false });

const blockSchema = new mongoose.Schema({
  blockNumber: {
    type: Number,
    required: true,
    unique: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  transactions: [transactionSchema],
  previousHash: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  nonce: {
    type: Number,
    default: 0
  },
  miner: {
    type: String,
    default: '0x0000000000000000000000000000000000000000'
  },
  gasUsed: {
    type: String,
    default: '0.002 ETH'
  },
  difficulty: {
    type: Number,
    default: 1000000
  }
});

module.exports = mongoose.model('Block', blockSchema);
