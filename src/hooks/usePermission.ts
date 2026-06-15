import { useMemo } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { UserRole } from '@/types';

const permissionMap: Record<string, UserRole[]> = {
  'appointment:create': ['employee', 'admin'],
  'appointment:view': ['employee', 'doctor', 'hr', 'admin'],
  'report:view': ['employee', 'doctor', 'hr', 'admin'],
  'report:create': ['doctor', 'admin'],
  'approval:view': ['hr', 'admin'],
  'statistics:view': ['hr', 'admin'],
  'admin:manage': ['admin'],
};

export function usePermission() {
  const { user, hasPermission: authHasPermission } = useAuthStore();

  const hasPermission = useMemo(() => {
    return (permission: string) => {
      if (!user) return false;
      const allowedRoles = permissionMap[permission];
      if (!allowedRoles) return false;
      return allowedRoles.includes(user.role);
    };
  }, [user]);

  const canAccess = useMemo(() => {
    return (roles: UserRole[]) => authHasPermission(roles);
  }, [authHasPermission]);

  const isEmployee = useMemo(() => user?.role === 'employee', [user]);
  const isDoctor = useMemo(() => user?.role === 'doctor', [user]);
  const isHR = useMemo(() => user?.role === 'hr', [user]);
  const isAdmin = useMemo(() => user?.role === 'admin', [user]);
  const isManager = useMemo(() => ['hr', 'admin'].includes(user?.role || ''), [user]);

  const canViewDashboard = useMemo(() => {
    return !!user;
  }, [user]);

  const canMakeAppointment = useMemo(() => {
    return user?.role === 'employee';
  }, [user]);

  const canViewReports = useMemo(() => {
    return ['employee', 'doctor', 'hr', 'admin'].includes(user?.role || '');
  }, [user]);

  const canEnterReport = useMemo(() => {
    return user?.role === 'doctor';
  }, [user]);

  const canViewApprovals = useMemo(() => {
    return ['hr', 'admin'].includes(user?.role || '');
  }, [user]);

  const canViewStatistics = useMemo(() => {
    return ['hr', 'admin'].includes(user?.role || '');
  }, [user]);

  const canManageAdmin = useMemo(() => {
    return user?.role === 'admin';
  }, [user]);

  return {
    user,
    hasPermission,
    canAccess,
    isEmployee,
    isDoctor,
    isHR,
    isAdmin,
    isManager,
    canViewDashboard,
    canMakeAppointment,
    canViewReports,
    canEnterReport,
    canViewApprovals,
    canViewStatistics,
    canManageAdmin,
  };
}
