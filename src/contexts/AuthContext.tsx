import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { User as SupabaseUser, AuthError as SupabaseAuthError } from '@supabase/supabase-js';
import LoginModal from '../components/LoginModal';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  showLoginModal: (options?: { initialMode?: 'login' | 'signup'; initialName?: string }) => void;
  hideLoginModal: () => void;
  authError: string | null;
  clearAuthError: () => void;
  showEmailConfirmation: boolean;
  hideEmailConfirmation: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

interface LoginModalOptions {
  initialMode?: 'login' | 'signup';
  initialName?: string;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [loginModalOptions, setLoginModalOptions] = useState<LoginModalOptions>({});

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setAuthError(error.message);
        } else if (session?.user) {
          await setUserFromSupabaseUser(session.user);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setAuthError('Failed to load session');
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        
        if (event === 'SIGNED_IN' && session?.user) {
          await setUserFromSupabaseUser(session.user);
          setAuthError(null);
          setIsLoginModalOpen(false);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
        
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const setUserFromSupabaseUser = async (supabaseUser: SupabaseUser) => {
    // Extract name from user metadata or use email prefix as fallback
    const name = supabaseUser.user_metadata?.name || 
                 supabaseUser.user_metadata?.full_name || 
                 supabaseUser.email?.split('@')[0] || 
                 'User';

    const userData: User = {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: name
    };
    
    setUser(userData);
  };

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        await setUserFromSupabaseUser(data.user);
        console.log('✅ Login successful:', data.user.email);
        setIsLoginModalOpen(false);
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed';
      setAuthError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<void> => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
            full_name: name
          }
        }
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        console.log('✅ Signup successful:', data.user.email);
        
        // If email confirmation is disabled, user will be automatically signed in
        if (data.session) {
          await setUserFromSupabaseUser(data.user);
          setIsLoginModalOpen(false);
        } else {
          // If email confirmation is enabled, show confirmation message
          setShowEmailConfirmation(true);
          setIsLoginModalOpen(false);
        }
      }
    } catch (error) {
      console.error('❌ Signup error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Signup failed';
      setAuthError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    setAuthError(null);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      console.log('✅ Logout successful');
    } catch (error) {
      console.error('❌ Logout error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Logout failed';
      setAuthError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const showLoginModal = (options: LoginModalOptions = {}) => {
    setIsLoginModalOpen(true);
    setAuthError(null);
    setLoginModalOptions(options);
  };

  const hideLoginModal = () => {
    setIsLoginModalOpen(false);
    setAuthError(null);
    setLoginModalOptions({});
  };

  const clearAuthError = () => {
    setAuthError(null);
  };

  const hideEmailConfirmation = () => {
    setShowEmailConfirmation(false);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    isLoading,
    showLoginModal,
    hideLoginModal,
    authError,
    clearAuthError,
    showEmailConfirmation,
    hideEmailConfirmation
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={hideLoginModal}
        onLogin={login}
        onSignup={signup}
        error={authError}
        onClearError={clearAuthError}
        initialMode={loginModalOptions.initialMode}
        initialName={loginModalOptions.initialName}
      />
      
      {/* Email Confirmation Modal */}
      {showEmailConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={hideEmailConfirmation}></div>
          <div className="relative w-full max-w-md mx-4 bg-gradient-to-br from-purple-900/95 via-indigo-900/95 to-blue-900/95 backdrop-blur-lg border border-purple-300/30 rounded-3xl p-8 shadow-2xl animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500/30 to-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">📧</span>
              </div>
              <h2 className="text-2xl font-serif text-purple-100 mb-4">Check Your Email</h2>
              <p className="text-purple-200/80 font-rounded mb-6 leading-relaxed">
                We've sent you a confirmation link. Please check your email and click the link to complete your registration.
              </p>
              <button
                onClick={hideEmailConfirmation}
                className="px-6 py-3 bg-gradient-to-r from-purple-500/40 to-pink-500/40 backdrop-blur-sm border border-purple-300/40 rounded-2xl text-purple-100 font-serif hover:from-purple-500/50 hover:to-pink-500/50 hover:border-purple-300/60 transition-all duration-300 glow-button"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}