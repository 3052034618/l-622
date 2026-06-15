import { DashboardStats, DepartmentStats, TimeSeriesData, PackageStats } from '@/types';
import { departments } from './users';
import { appointments } from './appointments';
import { reports, getAbnormalReportsCount } from './reports';
import { getPendingApprovalsCount } from './approvals';
import dayjs from 'dayjs';

export const getDashboardStats = (): DashboardStats => {
  const today = dayjs().format('YYYY-MM-DD');
  const todayAppts = appointments.filter(a => a.appointmentDate === today);
  const todayCompleted = todayAppts.filter(a => a.status === 'completed');
  
  const totalBudget = departments.reduce((sum, d) => sum + d.budget, 0);
  const totalUsed = departments.reduce((sum, d) => sum + d.usedBudget, 0);
  
  const totalEmployees = departments.reduce((sum, d) => sum + d.employeeCount, 0);
  const completedCount = appointments.filter(a => a.status === 'completed').length;
  const notStarted = totalEmployees - appointments.length;
  const inProgress = appointments.filter(a => a.status === 'confirmed').length;
  const pending = appointments.filter(a => a.status === 'pending').length;

  return {
    todayAppointments: todayAppts.length,
    todayCompleted: todayCompleted.length,
    completionRate: todayAppts.length > 0 ? Math.round((todayCompleted.length / todayAppts.length) * 100) : 0,
    abnormalReports: getAbnormalReportsCount(),
    budgetUsed: totalUsed,
    budgetTotal: totalBudget,
    budgetProgress: Math.round((totalUsed / totalBudget) * 100),
    pendingApprovals: getPendingApprovalsCount(),
    notStartedCount: notStarted,
    completedReports: completedCount,
    abnormalCount: getAbnormalReportsCount(),
    totalSpent: totalUsed,
    completedToday: todayCompleted.length,
    inProgress,
    pending,
    budgetSpent: totalUsed,
    totalBudget,
    totalEmployees,
  };
};

export const getDepartmentStats = (): DepartmentStats[] => {
  return departments.map(dept => {
    const deptAppts = appointments.filter(a => a.departmentId === dept.id);
    const completedCount = deptAppts.filter(a => a.status === 'completed').length;
    const pendingCount = deptAppts.filter(a => a.status === 'confirmed' || a.status === 'pending').length;
    const notStartedCount = dept.employeeCount - deptAppts.length;
    const deptReports = reports.filter(r => {
      const appt = appointments.find(a => a.id === r.appointmentId);
      return appt?.departmentId === dept.id && r.status === 'abnormal';
    });

    return {
      departmentId: dept.id,
      departmentName: dept.name,
      totalEmployees: dept.employeeCount,
      completedCount,
      completionRate: dept.employeeCount > 0 ? Math.round((completedCount / dept.employeeCount) * 100) : 0,
      pendingCount,
      notStartedCount,
      abnormalCount: deptReports.length,
      budgetUsed: dept.usedBudget,
      budgetTotal: dept.budget,
      totalCount: dept.employeeCount,
    };
  });
};

export const generateTimeSeriesData = (days: number = 7): TimeSeriesData[] => {
  const data: TimeSeriesData[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = dayjs().subtract(i, 'day').format('MM-DD');
    data.push({
      date,
      appointments: Math.floor(Math.random() * 20) + 15,
      completed: Math.floor(Math.random() * 15) + 10,
      abnormal: Math.floor(Math.random() * 5) + 1,
    });
  }
  return data;
};

export const getNotStartedEmployees = () => {
  const allEmployeeIds = new Set(appointments.map(a => a.userId));
  const notStarted = [
    { id: 'user-011', name: '孙七', department: '技术研发部', departmentName: '技术研发部', employeeNo: 'EMP2023011', gender: 'male', age: 26, recommendedPackage: '基础体检套餐A', estimatedCost: 880 },
    { id: 'user-012', name: '周八', department: '技术研发部', departmentName: '技术研发部', employeeNo: 'EMP2023012', gender: 'female', age: 30, recommendedPackage: '标准体检套餐B', estimatedCost: 1680 },
    { id: 'user-013', name: '吴九', department: '市场营销部', departmentName: '市场营销部', employeeNo: 'EMP2023013', gender: 'male', age: 35, recommendedPackage: '标准体检套餐B', estimatedCost: 1680 },
    { id: 'user-014', name: '郑十', department: '财务部', departmentName: '财务部', employeeNo: 'EMP2022010', gender: 'female', age: 42, recommendedPackage: '精英体检套餐C', estimatedCost: 3280 },
    { id: 'user-015', name: '冯十一', department: '运营部', departmentName: '运营部', employeeNo: 'EMP2022011', gender: 'male', age: 28, recommendedPackage: '基础体检套餐A', estimatedCost: 880 },
  ];
  return notStarted.filter(e => !allEmployeeIds.has(e.id));
};

export const getPackageStats = (): PackageStats[] => {
  const packageCounts: Record<string, PackageStats> = {};
  appointments.forEach(appt => {
    if (!packageCounts[appt.packageId]) {
      packageCounts[appt.packageId] = { 
        packageId: appt.packageId, 
        packageName: appt.packageName, 
        name: appt.packageName, 
        count: 0 
      };
    }
    packageCounts[appt.packageId].count++;
  });
  return Object.values(packageCounts);
};
