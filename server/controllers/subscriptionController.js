/**
 * Subscription Controller
 * Manages subscription plans, payments, and access control
 */
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// 💳 Subscription plans configuration
const PLANS = {
  basic: {
    price: 9.99,
    features: ['basic_access', 'ai_recommendations'],
    downloadLimit: 10,
  },
  premium: {
    price: 19.99,
    features: ['basic_access', 'premium_books', 'unlimited_downloads', 'ai_recommendations', 'advanced_search'],
    downloadLimit: 999999,
  },
  enterprise: {
    price: 49.99,
    features: ['basic_access', 'premium_books', 'unlimited_downloads', 'ai_recommendations', 'advanced_search', 'api_access'],
    downloadLimit: 999999,
  },
};

// 📋 Get available plans
exports.getPlans = async (req, res) => {
  res.json({
    success: true,
    plans: PLANS,
  });
};

// 👤 Get current subscription
exports.getSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user.id });

    if (!subscription) {
      return res.json({
        success: true,
        subscription: null,
        message: 'No active subscription',
      });
    }

    res.json({
      success: true,
      subscription,
    });
    
  } catch (error) {
    next(error);
  }
};

// 🔄 Create subscription (Stripe integration)
exports.createSubscription = async (req, res, next) => {
  try {
    const { plan, billingCycle = 'monthly' } = req.body;
    
    if (!PLANS[plan]) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plan selected',
      });
    }

    // Calculate price based on billing cycle
    let price = PLANS[plan].price;
    if (billingCycle === 'yearly') {
      price = price * 10; // 2 months free
    }

    // Create or get Stripe customer
    let user = await User.findById(req.user.id);
    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
      });
      stripeCustomerId = customer.id;
      user.stripeCustomerId = stripeCustomerId;
      await user.save();
    }

    // Create subscription in database
    const endDate = new Date();
    if (billingCycle === 'monthly') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (billingCycle === 'yearly') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }

    const subscription = await Subscription.create({
      user: req.user.id,
      plan,
      status: 'pending',
      price,
      billingCycle,
      endDate,
      features: PLANS[plan].features,
      downloadLimit: PLANS[plan].downloadLimit,
      stripeCustomerId,
    });

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Knowledge Vault ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan`,
              description: `${billingCycle} subscription`,
            },
            unit_amount: Math.round(price * 100), // Convert to cents
            recurring: billingCycle === 'monthly' ? { interval: 'month' } : undefined,
          },
          quantity: 1,
        },
      ],
      mode: billingCycle === 'monthly' ? 'subscription' : 'payment',
      success_url: `${process.env.CLIENT_URL}/subscription/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/subscription/cancel`,
      metadata: {
        subscriptionId: subscription._id.toString(),
        userId: req.user.id,
      },
    });

    res.json({
      success: true,
      sessionId: session.id,
      subscriptionId: subscription._id,
    });
    
  } catch (error) {
    next(error);
  }
};

// ✅ Verify and activate subscription
exports.verifySubscription = async (req, res, next) => {
  try {
    const { sessionId } = req.body;
    
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status !== 'paid') {
      return res.status(400).json({
        success: false,
        message: 'Payment not completed',
      });
    }

    const subscription = await Subscription.findById(session.metadata.subscriptionId);
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found',
      });
    }

    // Update subscription
    subscription.status = 'active';
    subscription.stripeSubscriptionId = session.subscription;
    await subscription.save();

    // Update user
    await User.findByIdAndUpdate(session.metadata.userId, {
      subscription: subscription._id,
      subscriptionStatus: 'active',
    });

    res.json({
      success: true,
      message: 'Subscription activated successfully',
      subscription,
    });
    
  } catch (error) {
    next(error);
  }
};

// 🚫 Cancel subscription
exports.cancelSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.findOne({ user: req.user.id });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'No active subscription found',
      });
    }

    // Cancel in Stripe if applicable
    if (subscription.stripeSubscriptionId) {
      await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);
    }

    subscription.status = 'cancelled';
    subscription.cancelledAt = new Date();
    await subscription.save();

    // Update user
    await User.findByIdAndUpdate(req.user.id, {
      subscriptionStatus: 'cancelled',
    });

    res.json({
      success: true,
      message: 'Subscription cancelled. You have access until the end of your billing period.',
    });
    
  } catch (error) {
    next(error);
  }
};

// 🎁 Create free trial (Admin only)
exports.createTrial = async (req, res, next) => {
  try {
    const { userId, days = 7 } = req.body;

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + days);

    const subscription = await Subscription.create({
      user: userId,
      plan: 'premium',
      status: 'trial',
      price: 0,
      billingCycle: 'monthly',
      endDate,
      features: PLANS.premium.features,
      downloadLimit: 5, // Limited during trial
    });

    await User.findByIdAndUpdate(userId, {
      subscription: subscription._id,
      subscriptionStatus: 'active',
    });

    res.json({
      success: true,
      message: `Trial activated for ${days} days`,
      subscription,
    });
    
  } catch (error) {
    next(error);
  }
};