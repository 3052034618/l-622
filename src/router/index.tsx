import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { Layout } from '@/components/layout/Layout';
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { AppointmentPage } from '@/pages/AppointmentPage';
import { AppointmentHistoryPage } from '@/pages/AppointmentHistoryPage';
import { ReportListPage } from '@/pages/ReportListPage';
import { ReportEntryPage } from '@/pages/ReportEntryPage';
import { ApprovalPage } from '@/pages/ApprovalPage';
import { StatisticsPage } from '@/pages/StatisticsPage';
import { PackageManagementPage } from '@/pages/admin/PackageManagementPage';
import { RulesConfigurationPage } from '@/pages/admin/RulesConfigurationPage';
import { UserManagementPage } from '@/pages/admin/UserManagementPage';
import { usePermission } from '@/hooks/usePermission';
import { ReactNode } from 'react';

const ProtectedRoute = ({ children, permission }: { children: ReactNode; permission?: string }) => {
  const { isAuthenticated } = useAuthStore();
  const { hasPermission } = usePermission();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <Layout />,
    children: [
      { path: '/', element: <DashboardPage /> },
      { path: '/dashboard', element: <DashboardPage /> },
      { path: '/appointment', element: <ProtectedRoute permission="appointment:create"><AppointmentPage /></ProtectedRoute> },
      { path: '/appointment/history', element: <ProtectedRoute permission="appointment:view"><AppointmentHistoryPage /></ProtectedRoute> },
      { path: '/reports', element: <ProtectedRoute permission="report:view"><ReportListPage /></ProtectedRoute> },
      { path: '/reports/entry', element: <ProtectedRoute permission="report:create"><ReportEntryPage /></ProtectedRoute> },
      { path: '/approvals', element: <ProtectedRoute permission="approval:view"><ApprovalPage /></ProtectedRoute> },
      { path: '/statistics', element: <ProtectedRoute permission="statistics:view"><StatisticsPage /></ProtectedRoute> },
      { path: '/admin/packages', element: <ProtectedRoute permission="admin:manage"><PackageManagementPage /></ProtectedRoute> },
      { path: '/admin/rules', element: <ProtectedRoute permission="admin:manage"><RulesConfigurationPage /></ProtectedRoute> },
      { path: '/admin/users', element: <ProtectedRoute permission="admin:manage"><UserManagementPage /></ProtectedRoute> },
      { path: '*', element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);
