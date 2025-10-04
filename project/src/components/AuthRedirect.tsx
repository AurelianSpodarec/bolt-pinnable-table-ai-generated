import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}