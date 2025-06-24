import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Crown, Edit3, Settings, LogOut, Sparkles, Star, Heart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoginButton from '../components/LoginButton';

function Profile() {
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden flex flex-col">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-800/30 via-indigo-800/20 to-blue-800/30 animate-gradient-shift"></div>
          
          {/* Floating Sparkles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <Sparkles 
                key={i}
                size={Math.random() * 6 + 4} 
                className="absolute text-white/20 animate-pulse-gentle"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-8 flex-1">
          <div className="text-center">
            <User size={64} className="mx-auto mb-6 text-purple-300/60 animate-pulse-gentle" />
            <h2 className="text-3xl font-serif text-purple-100 mb-4">Welcome to Your Profile</h2>
            <p className="text-lg text-purple-200/80 font-rounded mb-8">Please log in to continue your journey</p>
            <LoginButton />
          </div>
        </div>

        {/* Copyright Footer */}
        <div className="relative z-10 text-center py-4">
          <p className="text-xs text-white/60 font-serif">
            © 2025 Truly. All rights reserved.
          </p>
        </div>
      </div>
    );
  }

  const handleSaveProfile = () => {
    // In a real app, this would save to backend
    setIsEditing(false);
    // Update user context with new name if needed
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 relative overflow-hidden pt-24 flex flex-col">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-800/30 via-indigo-800/20 to-blue-800/30 animate-gradient-shift"></div>
        
        {/* Floating Sparkles */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(25)].map((_, i) => (
            <Sparkles 
              key={i}
              size={Math.random() * 6 + 4} 
              className="absolute text-white/20 animate-pulse-gentle"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Gentle Stars */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <Star 
              key={i}
              size={Math.random() * 4 + 2} 
              className="absolute text-white/15 animate-pulse-slow"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto p-8 flex-1">
        {/* Profile Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="relative inline-block mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-purple-500/30 to-pink-500/30 backdrop-blur-sm border-2 border-purple-300/40 rounded-full flex items-center justify-center glow-button">
              <User size={40} className="text-purple-200" />
              
              {/* Premium Crown Badge */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center border-2 border-white/20">
                <Crown size={16} className="text-white" />
                <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-30"></div>
              </div>
            </div>
          </div>
          
          <h1 className="text-3xl font-cursive text-purple-100 mb-2 glow-text">Your Sacred Profile</h1>
          <p className="text-lg font-serif text-purple-200/80">Where your journey is honored and celebrated</p>
        </div>

        {/* Profile Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Personal Information */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 glow-message animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-cursive text-purple-100">Personal Information</h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors duration-300"
              >
                <Edit3 size={18} className="text-purple-300" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-serif text-purple-300/80 mb-2">Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-2xl text-purple-100 font-serif focus:outline-none focus:border-purple-300/60 focus:bg-white/15 transition-all duration-300 glow-input"
                  />
                ) : (
                  <div className="flex items-center gap-3">
                    <p className="text-lg font-serif text-purple-100">{user.name}</p>
                    <Crown size={16} className="text-yellow-400/80" />
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-serif text-purple-300/80 mb-2">Email</label>
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-purple-300/60" />
                  <p className="text-lg font-serif text-purple-100">{user.email}</p>
                </div>
              </div>

              {/* Membership Status */}
              <div>
                <label className="block text-sm font-serif text-purple-300/80 mb-2">Membership</label>
                <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-300/30 rounded-2xl">
                  <Crown size={20} className="text-yellow-400" />
                  <div>
                    <p className="font-cursive text-yellow-200">Premium Member</p>
                    <p className="text-sm text-yellow-300/70 font-serif">Founder's Pass - Lifetime Access</p>
                  </div>
                </div>
              </div>

              {/* Save Button (when editing) */}
              {isEditing && (
                <button
                  onClick={handleSaveProfile}
                  className="w-full py-3 bg-gradient-to-r from-purple-500/40 to-pink-500/40 backdrop-blur-sm border border-purple-300/40 rounded-2xl text-purple-100 font-cursive hover:from-purple-500/50 hover:to-pink-500/50 hover:border-purple-300/60 transition-all duration-300 glow-button"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>

          {/* Account Actions */}
          <div className="space-y-6">
            {/* Journey Stats */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 glow-message animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h2 className="text-2xl font-cursive text-purple-100 mb-6">Your Journey</h2>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-white/5 rounded-2xl">
                  <Heart size={24} className="mx-auto mb-2 text-pink-300/80" />
                  <p className="text-2xl font-serif text-pink-200">12</p>
                  <p className="text-sm font-cursive text-pink-300/70">Heartprints</p>
                </div>
                
                <div className="text-center p-4 bg-white/5 rounded-2xl">
                  <Sparkles size={24} className="mx-auto mb-2 text-purple-300/80" />
                  <p className="text-2xl font-serif text-purple-200">8</p>
                  <p className="text-sm font-cursive text-purple-300/70">Rituals</p>
                </div>
                
                <div className="text-center p-4 bg-white/5 rounded-2xl">
                  <Star size={24} className="mx-auto mb-2 text-yellow-300/80" />
                  <p className="text-2xl font-serif text-yellow-200">5</p>
                  <p className="text-sm font-cursive text-yellow-300/70">Garden Blooms</p>
                </div>
                
                <div className="text-center p-4 bg-white/5 rounded-2xl">
                  <Crown size={24} className="mx-auto mb-2 text-orange-300/80" />
                  <p className="text-2xl font-serif text-orange-200">∞</p>
                  <p className="text-sm font-cursive text-orange-300/70">Premium Days</p>
                </div>
              </div>
            </div>

            {/* Account Settings */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-8 glow-message animate-fade-in" style={{ animationDelay: '0.4s' }}>
              <h2 className="text-2xl font-cursive text-purple-100 mb-6">Account Settings</h2>
              
              <div className="space-y-4">
                <button
                  onClick={() => navigate('/premium')}
                  className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-sm border border-yellow-300/30 rounded-2xl text-yellow-200 hover:from-yellow-500/30 hover:to-orange-500/30 hover:border-yellow-300/50 transition-all duration-300 glow-button"
                >
                  <Crown size={20} />
                  <span className="font-serif">Manage Subscription</span>
                </button>
                
                <button className="w-full flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-2xl text-purple-200 transition-colors duration-300">
                  <Settings size={20} className="text-purple-300" />
                  <span className="font-serif">Privacy Settings</span>
                </button>
                
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-4 bg-red-500/20 hover:bg-red-500/30 border border-red-300/30 hover:border-red-300/50 rounded-2xl text-red-200 transition-all duration-300"
                >
                  <LogOut size={20} />
                  <span className="font-serif">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Message */}
        <div className="text-center mt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <p className="text-lg font-cursive text-purple-300/70 italic">
            "Your profile is a reflection of your beautiful journey..."
          </p>
        </div>
      </div>

      {/* Copyright Footer */}
      <div className="relative z-10 text-center py-4">
        <p className="text-xs text-white/60 font-serif">
          © 2025 Truly. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default Profile;