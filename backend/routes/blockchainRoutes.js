const express = require('express');
const router = express.Router();
const Block = require('../models/Block');
const BlockchainHelper = require('../utils/blockchainHelper');

// Get blockchain overview
router.get('/overview', async (req, res) => {
  try {
    const overview = await BlockchainHelper.getBlockchainOverview();
    res.status(200).json({
      success: true,
      data: overview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get all blocks
router.get('/blocks', async (req, res) => {
  try {
    const blocks = await Block.find().sort({ blockNumber: -1 }).limit(50);
    res.status(200).json({
      success: true,
      count: blocks.length,
      data: blocks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Get block by number
router.get('/blocks/:blockNumber', async (req, res) => {
  try {
    const block = await Block.findOne({ blockNumber: req.params.blockNumber });
    
    if (!block) {
      return res.status(404).json({
        success: false,
        message: 'Block not found'
      });
    }

    res.status(200).json({
      success: true,
      data: block
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = router;
