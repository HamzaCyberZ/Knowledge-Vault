import React, { createContext, useContext, useState, useCallback } from 'react';
import toast from 'react-hot-toast';

// Create context
const AuthContext = createContext(null);

const API_URL = 'http://localhost:5000/api/auth';

// Provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load user from token
  const loadUser = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await fetch(`${API_URL}/me`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('token');
        setUser(null);
      }
    } catch (error) {
      console.error('Load user failed:', error);
      localStorage.removeItem('token');
      setUser(null);
    }
  }, []);

  // Login function
  const login = async (formData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Welcome back!');
      return { success: true, user: data.user };
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (formData) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Account created successfully!');
      return { success: true, user: data.user };
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out successfully');
    window.location.href = '/login';
  }, []);

  // Context value
  const value = {
    user,
    isLoading,
    loadUser,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook - YEH EXPORT SABSE IMPORTANT HAI
export const useAuthStore = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuthStore must be used within an AuthProvider');
  }
  return context;
};

// Default export bhi de dein (optional)
export default AuthContext;