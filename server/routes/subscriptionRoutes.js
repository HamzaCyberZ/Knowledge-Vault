const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');
const { protect, adminOnly } = require('../middleware/auth');

// 🛣️ Routes
router.get('/plans', subscriptionController.getPlans);
router.get('/my-subscription', protect, subscriptionController.getSubscription);
router.post('/create', protect, subscriptionController.createSubscription);
router.post('/verify', protect, subscriptionController.verifySubscription);
router.post('/cancel', protect, subscriptionController.cancelSubscription);

// Admin routes
router.post('/trial', protect, adminOnly, subscriptionController.createTrial);

module.exports = router;