import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedAdminRoute({ children }) {
  const { user, isAdmin } = useAuth();

  // If not logged in or not an admin, redirect to login
  if (!user || !isAdmin()) {
    return <Navigate to="/login" replace />;
  }

  // If user is an admin, render the protected content
  return children;
}

export default ProtectedAdminRoute; 