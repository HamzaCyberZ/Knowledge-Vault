import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user } = useAuthStore();
  const location = useLocation();

  // Check if user is logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check if admin route requires admin
  if (requireAdmin && user.role !== 'admin') {
    console.log('Not admin, redirecting to dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  // If user is admin and tries to access user dashboard, let them access admin
  // Or if regular user tries to access admin, redirect them
  
  return children;
};

export default ProtectedRoute;