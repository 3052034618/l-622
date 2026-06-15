import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom';
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

const ProtectedRoute = ({ children, requiredPermission }: { children: React.ReactNode; requiredPermission?: string }) => {
  const { isAuthenticated } = useAuthStore();
  const { hasPermission } = usePermission();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Layout>{children}</Layout>;
};

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/appointment',
    element: (
      <ProtectedRoute requiredPermission="appointment:create">
        <AppointmentPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/appointment/history',
    element: (
      <ProtectedRoute requiredPermission="appointment:view">
        <AppointmentHistoryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports',
    element: (
      <ProtectedRoute requiredPermission="report:view">
        <ReportListPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/reports/entry',
    element: (
      <ProtectedRoute requiredPermission="report:create">
        <ReportEntryPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/approvals',
    element: (
      <ProtectedRoute requiredPermission="approval:view">
        <ApprovalPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/statistics',
    element: (
      <ProtectedRoute requiredPermission="statistics:view">
        <StatisticsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/packages',
    element: (
      <ProtectedRoute requiredPermission="admin:manage">
        <PackageManagementPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/rules',
    element: (
      <ProtectedRoute requiredPermission="admin:manage">
        <RulesConfigurationPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin/users',
    element: (
      <ProtectedRoute requiredPermission="admin:manage">
        <UserManagementPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);
