import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Crown, Home, User, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginButton from './LoginButton';
import NotificationBell from './NotificationBell';

function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Don't show navigation on the main welcome page
  if (location.pathname === '/') {
    return null;
  }

  const goBack = () => {
    navigate(-1);
  };

  const goHome = () => {
    if (isAuthenticated) {
      navigate('/home');
    } else {
      navigate('/');
    }
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  return (
    <>
      {/* Back Button - Top Left */}
      <button
        onClick={goBack}
        className="fixed top-6 left-6 z-30 p-3 bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-full text-purple-200 hover:bg-white/20 hover:border-purple-300/50 transition-all duration-300 glow-button group"
        title="Go Back"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-300" />
        
        {/* Hover Sparkle Effect */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute top-1 right-1 w-1 h-1 bg-purple-300 rounded-full animate-pulse"></div>
          <div className="absolute bottom-1 left-1 w-1 h-1 bg-pink-300 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
        </div>
      </button>

      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-20 flex items-center justify-between p-6 bg-white/5 backdrop-blur-sm border-b border-white/10">
        {/* Left side - Empty space for back button */}
        <div className="w-16"></div>

        {/* Right side - Home, Premium, Notifications, Profile/Login */}
        <div className="flex items-center gap-4">
          {/* Home Button */}
          <button
            onClick={goHome}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-indigo-300/30 rounded-full text-indigo-200 hover:bg-white/20 hover:border-indigo-300/50 transition-all duration-300 glow-button group"
            title="Go Home"
          >
            <Home size={18} className="group-hover:scale-110 transition-transform duration-300" />
            <span className="font-serif text-sm hidden sm:inline">Home</span>
            
            {/* Glow Effect on Hover */}
            <div className="absolute inset-0 rounded-full bg-indigo-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse-gentle"></div>
          </button>

          {/* Premium Button */}
          <button
            onClick={() => navigate('/premium')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-300/30 rounded-full text-yellow-200 hover:from-yellow-500/30 hover:to-orange-500/30 hover:border-yellow-300/50 transition-all duration-300 glow-button group"
          >
            <Crown size={18} className="group-hover:rotate-12 transition-transform duration-300" />
            <span className="font-cursive text-sm hidden sm:inline">✨ Premium</span>
          </button>

          {/* Notification Bell */}
          <NotificationBell />

          {/* Profile Button (if authenticated) or Login Button */}
          {isAuthenticated ? (
            <button
              onClick={goToProfile}
              className="relative p-3 bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-full text-purple-200 hover:bg-white/20 hover:border-purple-300/50 transition-all duration-300 glow-button group"
              title="Profile"
            >
              <User size={18} className="group-hover:scale-110 transition-transform duration-300" />
              
              {/* Premium Badge for authenticated users */}
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                <Crown size={10} className="text-white" />
                <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
              </div>
            </button>
          ) : (
            <LoginButton hideUsername={true} />
          )}
        </div>
      </div>
    </>
  );
}

export default NavigationBar;