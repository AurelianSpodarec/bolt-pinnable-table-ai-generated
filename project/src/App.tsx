import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { useAuthStore } from './store/authStore';
import { AuthGuard } from './components/AuthGuard';
import { AuthRedirect } from './components/AuthRedirect';
import { DashboardLayout } from './components/DashboardLayout';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { ResetPassword } from './pages/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { Settings } from './pages/Settings';
import { Posts } from './pages/Posts';
import { CreatePost } from './pages/CreatePost';
import { LinkedInCallback } from './pages/LinkedInCallback';

export default function App() {
  const { setUser } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthRedirect><Landing /></AuthRedirect>} />
        <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
        <Route path="/signup" element={<AuthRedirect><SignUp /></AuthRedirect>} />
        <Route path="/reset-password" element={<AuthRedirect><ResetPassword /></AuthRedirect>} />
        
        {/* Protected routes with dashboard layout */}
        <Route element={<AuthGuard><DashboardLayout /></AuthGuard>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/create" element={<CreatePost />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* LinkedIn OAuth callback route - outside of protected routes */}
        <Route path="/settings/linkedin/callback" element={<LinkedInCallback />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}