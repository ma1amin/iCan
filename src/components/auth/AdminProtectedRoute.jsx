import React from 'react';
import { useAdminAuthContext } from '../../context/AdminAuthContext';
import { Navigate } from 'react-router-dom';
import './AdminProtectedRoute.css';

const AdminProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAdminAuthContext();

  if (isLoading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoute;
