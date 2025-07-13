import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import LibraryPage from './pages/LibraryPage';
import ReadingPage from './pages/ReadingPage';
import AnalyticsPage from './pages/AnalyticsPage';
import BookClubPage from './pages/BookClubPage';
import OnboardingPage from './pages/OnboardingPage';
import VoiceSettingsPage from './pages/VoiceSettingsPage';
import PraiseCustomizerPage from './pages/PraiseCustomizerPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import GamificationPage from './pages/GamificationPage';
import PricingPage from './pages/PricingPage';
import CheckoutSuccessPage from './pages/CheckoutSuccessPage';
import CheckoutCancelPage from './pages/CheckoutCancelPage';
import ProductivityHabitsPage from './pages/ProductivityHabitsPage';
import SharePage from './pages/SharePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import LandingPage from './pages/LandingPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ProtectedRoute from './components/auth/ProtectedRoute';
import SocialShareModal from './components/social/SocialShareModal';
import AuthCallbackPage from './pages/AuthCallbackPage';
import { useUserStore } from './store/userStore';
import { useSocialShare } from './hooks/useSocialShare';
import { supabase } from './lib/supabase';

function App() {
  const { initialize, isAuthenticated, isLoading } = useUserStore();
  const { isShareModalOpen, shareContent, closeShareModal } = useSocialShare();

  useEffect(() => {
    // Initialize user data on app load
    initialize();
    
    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event);
        if (event === 'SIGNED_IN' && session) {
          initialize();
        } else if (event === 'SIGNED_OUT') {
          initialize();
        }
      }
    );

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [initialize]);

  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/share" element={<SharePage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          
          {/* Onboarding */}
          <Route 
            path="/onboarding" 
            element={
              isAuthenticated ? <OnboardingPage /> : <Navigate to="/login" replace />
            } 
          />
          
          {/* Protected routes */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/library" 
            element={
              <ProtectedRoute>
                <LibraryPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reading/:bookId" 
            element={
              <ProtectedRoute>
                <ReadingPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/analytics" 
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/productivity" 
            element={
              <ProtectedRoute>
                <ProductivityHabitsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/streaks" 
            element={
              <ProtectedRoute>
                <GamificationPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/club/:clubId" 
            element={
              <ProtectedRoute>
                <BookClubPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/voice-settings" 
            element={
              <ProtectedRoute>
                <VoiceSettingsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/praise-customizer" 
            element={
              <ProtectedRoute>
                <PraiseCustomizerPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/settings" 
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/"} replace />} />
        </Routes>

        {/* Global Social Share Modal */}
        {shareContent && (
          <SocialShareModal
            isOpen={isShareModalOpen}
            onClose={closeShareModal}
            content={shareContent}
          />
        )}
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;