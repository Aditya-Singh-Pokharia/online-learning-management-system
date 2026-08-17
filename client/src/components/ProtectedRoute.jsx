import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Spinner from './Spinner';

// Wrap a page element: <ProtectedRoute role="instructor"><Page/></ProtectedRoute>
// - Redirects to /login if not authenticated
// - Redirects home if authenticated but wrong role
export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner label="Checking your session..." />;
  }
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
}
