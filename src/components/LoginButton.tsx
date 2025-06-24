import React, { useState } from 'react';
import { LogIn, User, LogOut, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginButtonProps {
  hideUsername?: boolean;
}

function LoginButton({ hideUsername = false }: LoginButtonProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout, showLoginModal } = useAuth();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  if (isAuthenticated && user) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-full text-purple-200 hover:bg-white/20 hover:border-purple-300/50 transition-all duration-300 glow-button"
        >
          <User size={18} />
          {!hideUsername && (
            <span className="font-rounded text-sm hidden sm:inline">{user.name}</span>
          )}
          {/* Premium Badge (mock) */}
          <Crown size={14} className="text-yellow-400/80" />
        </button>

        {/* User Menu Dropdown */}
        {showUserMenu && (
          <div className="absolute top-full right-0 mt-2 w-48 bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-lg border border-purple-300/30 rounded-2xl p-4 shadow-2xl animate-fade-in z-50">
            <div className="text-center mb-3 pb-3 border-b border-purple-300/20">
              <div className="flex items-center justify-center gap-2 mb-1">
                <p className="text-purple-100 font-serif text-sm">{user.name}</p>
                <Crown size={12} className="text-yellow-400/80" />
              </div>
              <p className="text-purple-300/70 font-rounded text-xs">{user.email}</p>
              <p className="text-yellow-400/80 font-cursive text-xs mt-1">Premium Member</p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-3 py-2 text-purple-200 hover:bg-white/10 rounded-xl transition-all duration-300 font-rounded text-sm"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        )}

        {/* Click outside to close menu */}
        {showUserMenu && (
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setShowUserMenu(false)}
          ></div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={showLoginModal}
      className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-full text-purple-200 hover:bg-white/20 hover:border-purple-300/50 transition-all duration-300 glow-button"
    >
      <LogIn size={18} />
      <span className="font-rounded text-sm">Log In</span>
    </button>
  );
}

export default LoginButton;