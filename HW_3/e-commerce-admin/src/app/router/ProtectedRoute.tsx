import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

import { useAppSelector } from '@/app/store/hooks';
import { selectIsAuthenticated } from '@/entities/user/model/userSelectors';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
