const crypto = require('crypto');
const Block = require('../models/Block');

class BlockchainHelper {
  // Generate hash for a block
  static generateHash(blockNumber, timestamp, transactions, previousHash, nonce) {
    const data = blockNumber + timestamp + JSON.stringify(transactions) + previousHash + nonce;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Create a new block on the blockchain
  static async createBlock(transactions) {
    try {
      // Get the latest block
      const latestBlock = await Block.findOne().sort({ blockNumber: -1 });
      
      const blockNumber = latestBlock ? latestBlock.blockNumber + 1 : 1;
      const previousHash = latestBlock ? latestBlock.hash : '0000000000000000000000000000000000000000000000000000000000000000';
      const timestamp = new Date();
      const nonce = Math.floor(Math.random() * 1000000);
      
      const hash = this.generateHash(blockNumber, timestamp, transactions, previousHash, nonce);
      
      const newBlock = new Block({
        blockNumber,
        timestamp,
        transactions,
        previousHash,
        hash,
        nonce,
        gasUsed: `${(Math.random() * 0.005 + 0.001).toFixed(4)} ETH`,
        difficulty: 1000000 + Math.floor(Math.random() * 100000)
      });
      
      await newBlock.save();
      return newBlock;
    } catch (error) {
      console.error('Error creating block:', error);
      throw error;
    }
  }

  // Get blockchain overview
  static async getBlockchainOverview() {
    try {
      const totalBlocks = await Block.countDocuments();
      const latestBlocks = await Block.find().sort({ blockNumber: -1 }).limit(10);
      
      return {
        totalBlocks,
        latestBlocks,
        chainHeight: latestBlocks[0]?.blockNumber || 0,
        lastBlockTime: latestBlocks[0]?.timestamp
      };
    } catch (error) {
      console.error('Error getting blockchain overview:', error);
      throw error;
    }
  }
}

module.exports = BlockchainHelper;
