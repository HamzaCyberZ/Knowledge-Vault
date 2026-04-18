/**
 * User Controller
 * Admin user management and analytics
 */
const User = require('../models/User');
const Book = require('../models/Book');
const Subscription = require('../models/Subscription');

// 📊 Get all users (Admin)
exports.getUsers = async (req, res, next) => {
  try {
    const { role, status, search, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (role) query.role = role;
    if (status) query.subscriptionStatus = status;
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
      ];
    }

    const users = await User.find(query)
      .populate('subscription', 'plan status endDate')
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      users,
    });
    
  } catch (error) {
    next(error);
  }
};

// 👤 Get single user (Admin)
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('subscription')
      .populate('readingHistory.book', 'title author coverImage')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.json({
      success: true,
      user,
    });
    
  } catch (error) {
    next(error);
  }
};

// ✏️ Update user (Admin)
exports.updateUser = async (req, res, next) => {
  try {
    const { role, isActive, subscriptionStatus } = req.body;
    
    const updateData = {};
    if (role) updateData.role = role;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (subscriptionStatus) updateData.subscriptionStatus = subscriptionStatus;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'User updated successfully',
      user,
    });
    
  } catch (error) {
    next(error);
  }
};

// 🗑️ Delete user (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Prevent self-deletion
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete your own account',
      });
    }

    // Clean up subscriptions
    await Subscription.deleteOne({ user: req.params.id });
    
    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
    
  } catch (error) {
    next(error);
  }
};

// 📈 Get dashboard stats (Admin)
exports.getStats = async (req, res, next) => {
  try {
    const stats = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ subscriptionStatus: 'active' }),
      Book.countDocuments(),
      Book.countDocuments({ isPremium: true }),
      Subscription.countDocuments({ status: 'active' }),
    ]);

    // Recent activity
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

    const recentBooks = await Book.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title author views createdAt');

    // Revenue calculation (simplified)
    const activeSubscriptions = await Subscription.find({ status: 'active' });
    const monthlyRevenue = activeSubscriptions.reduce((acc, sub) => acc + sub.price, 0);

    res.json({
      success: true,
      stats: {
        totalUsers: stats[0],
        activeSubscribers: stats[1],
        totalBooks: stats[2],
        premiumBooks: stats[3],
        activeSubscriptions: stats[4],
        monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
      },
      recentActivity: {
        users: recentUsers,
        books: recentBooks,
      },
    });
    
  } catch (error) {
    next(error);
  }
};