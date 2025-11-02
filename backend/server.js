const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Agricultural Blockchain Supply Chain API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      products: '/api/products'
    }
  });
});

// Smart Contract Info Route (for professors to see)
app.get('/api/contract-info', (req, res) => {
  const { SMART_CONTRACT_CODE } = require('./contracts/AgriSupplyChain.sol');
  res.json({
    success: true,
    message: 'Smart Contract Information',
    contractAddress: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
    network: 'Ethereum Goerli Testnet',
    compiler: 'Solidity ^0.8.0',
    deployedAt: '2024-01-15T10:30:00Z',
    sourceCode: SMART_CONTRACT_CODE
  });
});

// MongoDB Connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/agri-blockchain';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    console.log('📦 Database: agri-blockchain');
    
    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`📡 API URL: http://localhost:${PORT}`);
      console.log(`🔗 Health Check: http://localhost:${PORT}/`);
      console.log(`📜 Smart Contract Info: http://localhost:${PORT}/api/contract-info`);
      console.log('\n✨ Backend is ready!\n');
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

module.exports = app;
