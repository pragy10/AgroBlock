const express = require('express');
const router = express.Router();
const transferRequestController = require('../controllers/transferRequestController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Create transfer request
router.post('/', transferRequestController.createTransferRequest);

// Get transfer requests
router.get('/', transferRequestController.getTransferRequests);

// Accept transfer request
router.put('/:requestId/accept', transferRequestController.acceptTransferRequest);

// Reject transfer request
router.put('/:requestId/reject', transferRequestController.rejectTransferRequest);

module.exports = router;
