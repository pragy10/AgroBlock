const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Register new user
router.post('/register', userController.registerUser);

// Get all users
router.get('/', userController.getAllUsers);

// Get users by role
router.get('/role/:role', userController.getUsersByRole);

// Get user by wallet address
router.get('/wallet/:walletAddress', userController.getUserByWallet);

module.exports = router;
