import api from './api';

export const subscriptionService = {
  // 📋 Get available plans
  getPlans: async () => {
    const response = await api.get('/subscriptions/plans');
    return response.data;
  },

  // 👤 Get my subscription
  getMySubscription: async () => {
    const response = await api.get('/subscriptions/my-subscription');
    return response.data;
  },

  // 💳 Create subscription
  createSubscription: async (planData) => {
    const response = await api.post('/subscriptions/create', planData);
    return response.data;
  },

  // ✅ Verify subscription (after payment)
  verifySubscription: async (sessionId) => {
    const response = await api.post('/subscriptions/verify', { sessionId });
    return response.data;
  },

  // 🚫 Cancel subscription
  cancelSubscription: async () => {
    const response = await api.post('/subscriptions/cancel');
    return response.data;
  },
};