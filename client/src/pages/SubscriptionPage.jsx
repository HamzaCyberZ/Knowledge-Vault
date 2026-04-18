import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Crown, Zap, Building2, Loader2 } from 'lucide-react';
import { subscriptionService } from '../services/subscriptionService';
import { useAuthStore } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';

const PLANS = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for casual readers',
    price: 9.99,
    features: [
      'Access to basic library',
      '10 downloads per month',
      'AI recommendations',
      'Standard support',
    ],
    icon: Zap,
    color: 'blue',
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'For serious book lovers',
    price: 19.99,
    popular: true,
    features: [
      'Access to premium books',
      'Unlimited downloads',
      'Advanced AI recommendations',
      'Offline reading',
      'Priority support',
    ],
    icon: Crown,
    color: 'purple',
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For organizations',
    price: 49.99,
    features: [
      'Everything in Premium',
      'API access',
      'Custom integrations',
      'Dedicated support',
      'Team management',
    ],
    icon: Building2,
    color: 'amber',
  },
];

const SubscriptionPage = () => {
  const { user } = useAuthStore();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processingPlan, setProcessingPlan] = useState(null);

  useEffect(() => {
    fetchCurrentSubscription();
  }, []);

  const fetchCurrentSubscription = async () => {
    try {
      const response = await subscriptionService.getMySubscription();
      setCurrentPlan(response.subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const handleSubscribe = async (planId) => {
    setProcessingPlan(planId);
    try {
      const response = await subscriptionService.createSubscription({
        plan: planId,
        billingCycle: 'monthly',
      });

      // Redirect to Stripe Checkout
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
      await stripe.redirectToCheckout({
        sessionId: response.sessionId,
      });
    } catch (error) {
      toast.error('Failed to initiate checkout');
      setProcessingPlan(null);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription?')) return;
    
    setLoading(true);
    try {
      await subscriptionService.cancelSubscription();
      toast.success('Subscription cancelled successfully');
      fetchCurrentSubscription();
    } catch (error) {
      toast.error('Failed to cancel subscription');
    } finally {
      setLoading(false);
    }
  };

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900">Choose Your Plan</h1>
          <p className="mt-4 text-xl text-gray-600">
            Unlock unlimited access to our digital library
          </p>
        </div>

        {/* Current Subscription */}
        {currentPlan?.status === 'active' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-12 bg-white rounded-2xl shadow-lg p-6 border-2 border-primary-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Current Plan</h2>
                <p className="text-gray-600 mt-1">
                  You are subscribed to the <span className="font-semibold capitalize">{currentPlan.plan}</span> plan
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Renews on {new Date(currentPlan.endDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={handleCancel}
                disabled={loading}
                className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
              >
                {loading ? 'Cancelling...' : 'Cancel Plan'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan, index) => {
            const Icon = plan.icon;
            const isCurrentPlan = currentPlan?.plan === plan.id && currentPlan?.status === 'active';
            
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                  plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary-500 text-white px-4 py-1 rounded-bl-lg text-sm font-medium">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  <div className={`inline-flex p-3 rounded-lg ${colorClasses[plan.color]}`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  <h3 className="mt-4 text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-2 text-gray-600">{plan.description}</p>

                  <div className="mt-6">
                    <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                    <span className="text-gray-500">/month</span>
                  </div>

                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={isCurrentPlan || processingPlan === plan.id}
                    className={`mt-8 w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      isCurrentPlan
                        ? 'bg-gray-100 text-gray-500 cursor-default'
                        : plan.popular
                        ? 'bg-primary-600 text-white hover:bg-primary-700'
                        : 'bg-gray-900 text-white hover:bg-gray-800'
                    } disabled:opacity-50`}
                  >
                    {processingPlan === plan.id ? (
                      <span className="flex items-center justify-center">
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Processing...
                      </span>
                    ) : isCurrentPlan ? (
                      'Current Plan'
                    ) : (
                      'Get Started'
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I cancel my subscription anytime?',
                a: 'Yes, you can cancel your subscription at any time. You will continue to have access until the end of your billing period.',
              },
              {
                q: 'What payment methods do you accept?',
                a: 'We accept all major credit cards and process payments securely through Stripe.',
              },
              {
                q: 'Can I switch plans later?',
                a: 'Yes, you can upgrade or downgrade your plan at any time. Changes will take effect on your next billing cycle.',
              },
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow p-6">
                <h3 className="font-medium text-gray-900">{faq.q}</h3>
                <p className="mt-2 text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;