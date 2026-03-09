import { Navigate } from 'react-router';
import { useAuth } from '../../../lib/AuthContext';
import { UserRole } from '../../../lib/auth';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  
  console.log('🛡️ ProtectedRoute - Loading:', loading, 'User:', user);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
          <p className="text-xs text-gray-400 mt-2">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    console.log('🚫 No user found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.log('⛔ User role not allowed, redirecting');
    // Redirect to appropriate dashboard based on user role
    const rolePaths: Record<UserRole, string> = {
      admin: '/admin',
      student: '/student',
      teacher: '/teacher',
      parent: '/parent',
    };
    return <Navigate to={rolePaths[user.role]} replace />;
  }

  console.log('✅ Access granted!');
  return <>{children}</>;
}