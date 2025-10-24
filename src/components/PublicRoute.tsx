import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

/**
 * PublicRoute - Redirect authenticated users away from public pages
 * Use this for Login, ChangePassword pages
 */
export const PublicRoute = ({ children }: PublicRouteProps) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-700 font-medium">Đang tải...</p>
        </div>
      </div>
    );
  }

  // If user is authenticated, redirect to personal-info
  if (isAuthenticated) {
    return <Navigate to="/personal-info" replace />;
  }

  return <>{children}</>;
};

