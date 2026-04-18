const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

// 🛣️ Admin routes
router.get('/stats', protect, adminOnly, userController.getStats);
router.get('/', protect, adminOnly, userController.getUsers);
router.get('/:id', protect, adminOnly, userController.getUser);
router.put('/:id', protect, adminOnly, userController.updateUser);
router.delete('/:id', protect, adminOnly, userController.deleteUser);

module.exports = router;