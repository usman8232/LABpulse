import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom';

import { AppShell } from '../components/layout/app-shell';
import { RoleGuard } from '../components/auth/role-guard';
import { useCurrentUser } from '../hooks/use-auth';
import { useAuthStore } from '../stores/auth-store';
import { ClientDashboardPage } from '../pages/client-dashboard-page';
import { HostAlertsPage } from '../pages/host-alerts-page';
import { HostDashboardPage } from '../pages/host-dashboard-page';
import { HostDeviceDetailPage } from '../pages/host-device-detail-page';
import { HostRegistrationsPage } from '../pages/host-registrations-page';
import { HostReportsPage } from '../pages/host-reports-page';
import { LoginPage } from '../pages/login-page';

function ProtectedApp() {
  const { isLoading } = useCurrentUser();
  const user = useAuthStore((state) => state.user);

  if (isLoading) {
    return <div className="grid min-h-screen place-items-center text-slate-500">Loading LABPulse...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <AppShell />;
}

function RoleRedirect() {
  const user = useAuthStore((state) => state.user);
  return <Navigate to={user?.role === 'HOST' ? '/host' : '/client'} replace />;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedApp />,
    children: [
      { index: true, element: <RoleRedirect /> },
      { path: 'host', element: <RoleGuard allowedRole="HOST"><HostDashboardPage /></RoleGuard> },
      { path: 'host/registrations', element: <RoleGuard allowedRole="HOST"><HostRegistrationsPage /></RoleGuard> },
      { path: 'host/alerts', element: <RoleGuard allowedRole="HOST"><HostAlertsPage /></RoleGuard> },
      { path: 'host/reports', element: <RoleGuard allowedRole="HOST"><HostReportsPage /></RoleGuard> },
      { path: 'host/devices/:deviceId', element: <RoleGuard allowedRole="HOST"><HostDeviceDetailPage /></RoleGuard> },
      { path: 'client', element: <RoleGuard allowedRole="CLIENT"><ClientDashboardPage /></RoleGuard> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
