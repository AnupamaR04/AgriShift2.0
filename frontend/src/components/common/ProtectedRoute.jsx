import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function ProtectedRoute({ children, requireCompleteProfile = false }) {
  const { user, profile, loading, isProfileComplete } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-agri-cream flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-agri-paddy border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs font-semibold text-agri-forest tracking-wide">
            Loading Kerala Farmer Dashboard...
          </span>
        </div>
      </div>
    );
  }

  // If user is null, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If page explicitly requires a completed profile and it's not complete
  if (requireCompleteProfile && !isProfileComplete) {
    return <Navigate to="/profile-setup" replace />;
  }

  return children;
}

export default ProtectedRoute;
