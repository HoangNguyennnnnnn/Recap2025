import { Navigate, Outlet } from 'react-router-dom';
import { hasValidSession } from '../utils/auth';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  if (!hasValidSession()) {
    return <Navigate to="/login" replace />;
  }
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
