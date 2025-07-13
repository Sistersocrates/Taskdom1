import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Info, LogIn, Eye, EyeOff, Mail } from 'lucide-react';
import { Card, CardBody, CardHeader } from '../ui/Card';
import { supabase, signInWithGoogle, signIn, signUp } from '../../lib/supabase';
import { useUserStore } from '../../store/userStore';
import Button from '../ui/Button';
import Input from '../ui/Input';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'sign_in' | 'sign_up' | 'magic_link' | 'forgotten_password';
  onSuccess?: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialView = 'sign_in',
  onSuccess
}) => {
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState(initialView);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [attemptedCredentials, setAttemptedCredentials] = useState<{email: string, password: string} | null>(null);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const { initialize } = useUserStore();

  if (!isOpen) return null;

  const handleGoogleSignIn = async () => {
    try {
      setIsGoogleLoading(true);
      setError(null);
      
      const { error } = await signInWithGoogle();
      
      if (error) {
        console.warn('Google sign-in error:', error);
        setError('Failed to sign in with Google. Please try again.');
      }
      
      // Note: We don't call onSuccess here because the redirect will happen
      // and the auth state change listener will handle the success case
    } catch (err) {
      console.error('Unexpected error during Google sign-in:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    try {
      setIsEmailLoading(true);
      setError(null);
      setAttemptedCredentials({ email, password });
      
      const { data, error } = await signIn(email, password);
      
      if (error) {
        console.warn('Email sign-in error:', error);
        if (error.message.includes('Invalid login credentials')) {
          setError('No account found with these credentials. Please check your email and password, or create a new account.');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Please check your email and click the confirmation link before signing in.');
        } else {
          setError(error.message || 'Failed to sign in. Please try again.');
        }
        return;
      }
      
      if (data.user) {
        setAttemptedCredentials(null);
        initialize();
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      console.error('Unexpected error during email sign-in:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    if (!firstName) {
      setError('Please enter your first name');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    try {
      setIsEmailLoading(true);
      setError(null);
      
      const { data, error } = await signUp(email, password, firstName);
      
      if (error) {
        console.warn('Email sign-up error:', error);
        if (error.message.includes('already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else {
          setError(error.message || 'Failed to create account. Please try again.');
        }
        return;
      }
      
      if (data.user) {
        initialize();
        onSuccess?.();
        onClose();
      }
    } catch (err) {
      console.error('Unexpected error during email sign-up:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    try {
      setIsEmailLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        console.warn('Password reset error:', error);
        setError(error.message || 'Failed to send password reset email. Please try again.');
        return;
      }
      
      setResetEmailSent(true);
    } catch (err) {
      console.error('Unexpected error during password reset:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleSwitchToSignUp = () => {
    if (attemptedCredentials) {
      // Pre-fill the email from the failed sign-in attempt
      setEmail(attemptedCredentials.email);
      setPassword('');
    }
    setCurrentView('sign_up');
    setError(null);
    setAttemptedCredentials(null);
  };

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in:', session.user.id);
        setError(null);
        setAttemptedCredentials(null);
        
        // The user profile is now created by a database trigger,
        // so we don't need to manually create it here.

        initialize(); // Initialize user data after sign-in
        onSuccess?.();
        onClose();

      } else if (event === 'SIGNED_OUT') {
        setError(null);
        setAttemptedCredentials(null);
      } else if (event === 'USER_UPDATED') {
        console.log('User updated');
        // Optionally, re-initialize user data if needed
        initialize();
      }
    });

    return () => subscription.unsubscribe();
  }, [onSuccess, onClose, initialize]);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="max-w-md w-full max-h-[calc(100vh-2rem)] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between border-b border-gray-800 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">
            {currentView === 'sign_in' ? 'Sign In' : 
             currentView === 'sign_up' ? 'Create Account' : 
             currentView === 'forgotten_password' ? 'Reset Password' : 'Sign In'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </CardHeader>
        <CardBody className="p-6 overflow-y-auto flex-1">
          {/* Google Sign In Button */}
          {currentView !== 'forgotten_password' && (
            <div className="mb-6">
              <Button
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
                fullWidth
                variant="outline"
                className="flex items-center justify-center bg-white text-gray-800 hover:bg-gray-100"
              >
                {isGoogleLoading ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                      <path fill="none" d="M1 1h22v22H1z" />
                    </svg>
                    Sign in with Google
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Divider */}
          {currentView !== 'forgotten_password' && (
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-gray-700 w-full"></div>
              <div className="bg-card px-4 text-sm text-gray-400 absolute">or</div>
            </div>
          )}

          {/* Email/Password Form */}
          {currentView === 'sign_in' && (
            <form onSubmit={handleEmailSignIn} className="space-y-4">
              <Input
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                fullWidth
                required
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  fullWidth
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('forgotten_password');
                    setError(null);
                  }}
                  className="text-sm text-accent hover:text-accent-hover"
                >
                  Forgot password?
                </button>
              </div>
              <Button
                type="submit"
                fullWidth
                disabled={isEmailLoading}
                className="mt-2"
              >
                {isEmailLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </Button>
              <p className="text-center text-sm text-gray-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={handleSwitchToSignUp}
                  className="text-accent hover:text-accent-hover"
                >
                  Sign up
                </button>
              </p>
            </form>
          )}

          {currentView === 'sign_up' && (
            <form onSubmit={handleEmailSignUp} className="space-y-4">
              <Input
                type="text"
                label="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Your first name"
                fullWidth
                required
              />
              <Input
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                fullWidth
                required
              />
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  fullWidth
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="text-xs text-gray-400">
                Password must be at least 6 characters long
              </div>
              <Button
                type="submit"
                fullWidth
                disabled={isEmailLoading}
                className="mt-2"
              >
                {isEmailLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Creating Account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </Button>
              <p className="text-center text-sm text-gray-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setCurrentView('sign_in');
                    setError(null);
                    setAttemptedCredentials(null);
                  }}
                  className="text-accent hover:text-accent-hover"
                >
                  Sign in
                </button>
              </p>
            </form>
          )}

          {currentView === 'forgotten_password' && (
            <div className="space-y-4">
              {resetEmailSent ? (
                <div className="bg-success-900/20 border border-success-700/30 text-success-300 p-4 rounded-lg">
                  <h3 className="font-medium text-lg mb-2">Password Reset Email Sent</h3>
                  <p className="mb-4">
                    We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions to reset your password.
                  </p>
                  <p className="text-sm">
                    If you don't see the email, please check your spam folder or try again.
                  </p>
                  <Button
                    onClick={() => {
                      setCurrentView('sign_in');
                      setResetEmailSent(false);
                    }}
                    className="mt-4"
                    fullWidth
                  >
                    Return to Sign In
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword}>
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <Mail className="h-5 w-5 text-accent mr-2" />
                      <h3 className="text-lg font-medium text-white">Reset Your Password</h3>
                    </div>
                    <p className="text-gray-400 mb-4">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                    <Input
                      type="email"
                      label="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      fullWidth
                      required
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentView('sign_in')}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isEmailLoading}
                      className="flex-1"
                    >
                      {isEmailLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </span>
                      ) : (
                        'Send Reset Link'
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* Help Notice for New Users */}
          {currentView === 'sign_in' && (
            <div className="mt-4 p-3 bg-blue-900/30 border border-blue-700 rounded-lg">
              <div className="flex items-start space-x-2">
                <Info className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-blue-200">
                    <strong>First time here?</strong> You'll need to create an account first. Click "Sign up" below to get started.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Display with Enhanced Messaging */}
          {error && (
            <div className="mt-4 p-3 bg-red-900/30 border border-red-700 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle className="h-4 w-4 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-red-300 mb-2">{error}</p>
                  {error.includes('No account found with these credentials') && currentView === 'sign_in' && (
                    <div className="text-xs text-red-200 space-y-2">
                      <p>This usually means:</p>
                      <ul className="list-disc list-inside space-y-1 ml-2">
                        <li>You haven't created an account yet</li>
                        <li>There's a typo in your email or password</li>
                        <li>You signed up with a different email address</li>
                      </ul>
                      {attemptedCredentials && (
                        <button
                          onClick={handleSwitchToSignUp}
                          className="mt-2 text-xs bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition-colors"
                        >
                          Create account with {attemptedCredentials.email}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default AuthModal;