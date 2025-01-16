import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthenticationProvider';
import { AuthStatus } from '../contexts/AuthenticationProvider';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { authState } = useAuth();

  if (authState.status === AuthStatus.LOADING) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (authState.status === AuthStatus.UNAUTHENTICATED) {
    return <Navigate to="/authentication?mode=login" replace />;
  }

  return <>{children}</>;
}; 