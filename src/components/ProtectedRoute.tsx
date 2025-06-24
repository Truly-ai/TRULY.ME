import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, showLoginModal } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      showLoginModal();
    }
  }, [isAuthenticated, isLoading, showLoginModal]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-300/30 border-t-purple-300 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-200 font-serif">Loading your sanctuary...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-purple-100 mb-4">Access Required</h2>
          <p className="text-purple-200/80 font-rounded">Please log in to continue your journey</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;