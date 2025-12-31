import { Navigate, Outlet } from 'react-router-dom';
import { hasValidSession } from '../utils/auth';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

/**
 * A wrapper component that checks for an active session
 * and redirects to the login page if not authenticated.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = hasValidSession();

  if (!isAuthenticated) {
    // If not authenticated, redirect to the login page
    return <Navigate to="/login" replace />;
  }

  // If authenticated, render the child component or Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
