import React, { useState } from 'react';
import { X, Eye, EyeOff, Mail, Lock, User, AlertCircle } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, password: string) => Promise<void>;
  onSignup: (email: string, password: string, name: string) => Promise<void>;
  error?: string | null;
  onClearError?: () => void;
  initialMode?: 'login' | 'signup';
  initialName?: string;
}

function LoginModal({ isOpen, onClose, onLogin, onSignup, error, onClearError, initialMode, initialName }: LoginModalProps) {
  const [isSignup, setIsSignup] = useState(initialMode === 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(initialName || '');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update modal state when props change
  useEffect(() => {
    if (initialMode) {
      setIsSignup(initialMode === 'signup');
    }
    if (initialName) {
      setName(initialName);
    }
  }, [initialMode, initialName]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignup && !name)) return;

    setIsLoading(true);
    onClearError?.();
    
    try {
      if (isSignup) {
        await onSignup(email, password, name);
      } else {
        await onLogin(email, password);
      }
      
      // Close modal and reset form on successful authentication
      onClose();
      resetForm();
    } catch (error) {
      // Error is handled by the auth context and will be displayed
      console.error('Authentication error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setShowPassword(false);
    setIsSignup(false);
    onClearError?.();
  };

  const handleClose = () => {
    onClose();
    resetForm();
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    onClearError?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      ></div>
      
      {/* Modal */}
      <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-lg border border-purple-300/30 rounded-3xl p-8 shadow-2xl animate-fade-in">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 text-purple-300/70 hover:text-purple-200 hover:bg-white/10 rounded-full transition-all duration-300"
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif text-purple-100 mb-2">
            {isSignup ? 'Join TRULY' : 'Welcome Back'}
          </h2>
          <p className="text-purple-300/80 font-rounded text-sm">
            {isSignup 
              ? 'Create your sanctuary for self-discovery' 
              : 'Continue your journey of becoming'
            }
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-300/30 rounded-2xl flex items-start gap-3">
            <AlertCircle size={18} className="text-red-300 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-red-200 font-serif text-sm leading-relaxed">
                {error}
              </p>
              {error.includes('email') && (
                <p className="text-red-300/70 font-rounded text-xs mt-1">
                  Please check your email and try again
                </p>
              )}
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Field (Signup only) */}
          {isSignup && (
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <User size={18} className="text-purple-300/60" />
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-2xl text-purple-100 placeholder-purple-300/60 font-rounded focus:outline-none focus:border-purple-300/60 focus:bg-white/15 transition-all duration-300 glow-input"
                required={isSignup}
                disabled={isLoading}
              />
            </div>
          )}

          {/* Email Field */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Mail size={18} className="text-purple-300/60" />
            </div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-2xl text-purple-100 placeholder-purple-300/60 font-rounded focus:outline-none focus:border-purple-300/60 focus:bg-white/15 transition-all duration-300 glow-input"
              required
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
              <Lock size={18} className="text-purple-300/60" />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-purple-300/30 rounded-2xl text-purple-100 placeholder-purple-300/60 font-rounded focus:outline-none focus:border-purple-300/60 focus:bg-white/15 transition-all duration-300 glow-input"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300/60 hover:text-purple-300 transition-colors duration-300"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !email || !password || (isSignup && !name)}
            className="w-full py-4 bg-gradient-to-r from-purple-500/40 to-pink-500/40 backdrop-blur-sm border border-purple-300/40 rounded-2xl text-purple-100 font-serif text-lg hover:from-purple-500/50 hover:to-pink-500/50 hover:border-purple-300/60 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed glow-button"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-purple-300/30 border-t-purple-300 rounded-full animate-spin"></div>
                {isSignup ? 'Creating Account...' : 'Signing In...'}
              </div>
            ) : (
              isSignup ? 'Create Account' : 'Sign In'
            )}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="text-center mt-6">
          <button
            onClick={toggleMode}
            className="text-purple-300/80 font-rounded text-sm hover:text-purple-200 transition-colors duration-300"
            disabled={isLoading}
          >
            {isSignup 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"
            }
          </button>
        </div>

        {/* Forgot Password (Login only) */}
        {!isSignup && (
          <div className="text-center mt-3">
            <button 
              className="text-purple-400/70 font-rounded text-xs hover:text-purple-300 transition-colors duration-300"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginModal;