const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Register new product (Farmer)
router.post('/register', productController.registerProduct);

// Transfer product ownership
router.post('/transfer', productController.transferProduct);

// Get all products
router.get('/', productController.getAllProducts);

// Get product by ID with history
router.get('/:productId', productController.getProductById);

// Get products by owner ID
router.get('/owner/:ownerId', productController.getProductsByOwner);

module.exports = router;
