/**
 * Subscription Model
 * Manages user subscription plans and payment status
 */
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One subscription per user
    },
    plan: {
      type: String,
      enum: ['none', 'basic', 'premium', 'enterprise'],
      default: 'none',
    },
    status: {
      type: String,
      enum: ['active', 'cancelled', 'expired', 'pending', 'trial'],
      default: 'pending',
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    billingCycle: {
      type: String,
      enum: ['monthly', 'yearly', 'lifetime'],
      default: 'monthly',
    },
    // Date tracking
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
    },
    trialEndsAt: Date,
    cancelledAt: Date,
    // Payment info (reference only, sensitive data handled by Stripe)
    paymentMethod: {
      type: String,
      enum: ['stripe', 'paypal', 'manual', 'free'],
      default: 'manual',
    },
    stripeSubscriptionId: String,
    stripeCustomerId: String,
    // Features included
    features: [
      {
        type: String,
        enum: [
          'basic_access',
          'premium_books',
          'unlimited_downloads',
          'offline_reading',
          'ai_recommendations',
          'advanced_search',
          'api_access',
        ],
      },
    ],
    // Usage tracking
    downloadCount: {
      type: Number,
      default: 0,
    },
    downloadLimit: {
      type: Number,
      default: 10, // Limit for basic plans
    },
  },
  {
    timestamps: true,
  }
);

// 🔍 Check if subscription is active
subscriptionSchema.methods.isActive = function () {
  return this.status === 'active' && this.endDate > new Date();
};

// ⏰ Days remaining
subscriptionSchema.virtual('daysRemaining').get(function () {
  if (!this.isActive()) return 0;
  return Math.ceil((this.endDate - new Date()) / (1000 * 60 * 60 * 24));
});

module.exports = mongoose.model('Subscription', subscriptionSchema);