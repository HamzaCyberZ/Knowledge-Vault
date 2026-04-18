import api from './api';

export const userService = {
  // 📊 Get dashboard stats (Admin)
  getStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  // 👥 Get all users (Admin)
  getUsers: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // 👤 Get single user (Admin)
  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // ✏️ Update user (Admin)
  updateUser: async (id, data) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  // 🗑️ Delete user (Admin)
  deleteUser: async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },
};