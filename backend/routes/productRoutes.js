const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect } = require('../middleware/auth');
const { upload } = require('../utils/imageUpload');

// Register new product (with image upload)
router.post('/register', protect, upload.array('images', 5), productController.registerProduct);

// Update product status and location
router.put('/:productId/status', protect, productController.updateProductStatus);

// Get all products
router.get('/', productController.getAllProducts);

// Get available products (filtered by role)
router.get('/available', productController.getAvailableProducts);

// Get product by ID with history
router.get('/:productId', productController.getProductById);

// Get products by owner ID
router.get('/owner/:ownerId', productController.getProductsByOwner);

module.exports = router;
