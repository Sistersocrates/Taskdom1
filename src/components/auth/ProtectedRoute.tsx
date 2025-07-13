import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUserStore } from '../../store/userStore';
import { supabase } from '../../lib/supabase';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, isAuthenticated, initialize } = useUserStore();
  const [subscription, setSubscription] = useState<any>(null);
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      initialize();
    }
  }, [isAuthenticated, isLoading, initialize]);

  useEffect(() => {
    if (user) {
      const fetchSubscription = async () => {
        const { data } = await supabase
          .from('stripe_subscriptions')
          .select('*')
          .eq('customer_id', user.id)
          .single();
        setSubscription(data);
        setIsSubscriptionLoading(false);
      };
      fetchSubscription();
    } else if (!isLoading) {
      setIsSubscriptionLoading(false);
    }
  }, [user, isLoading]);

  if (isLoading || isSubscriptionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-accent mx-auto mb-4" />
          <p className="text-primary-text">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!subscription || new Date(subscription.current_period_end * 1000) < new Date()) {
    return <Navigate to="/pricing" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;