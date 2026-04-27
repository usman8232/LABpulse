import { Navigate } from 'react-router-dom';

import { useAuthStore } from '../../stores/auth-store';

export function RoleGuard({ allowedRole, children }) {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== allowedRole) {
    return <Navigate to={user.role === 'HOST' ? '/host' : '/client'} replace />;
  }

  return children;
}
