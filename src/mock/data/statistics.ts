import { DashboardStats, DepartmentStats, TimeSeriesData, PackageStats } from '@/types';
import { departments } from './users';
import { appointments } from './appointments';
import { reports, getAbnormalReportsCount } from './reports';
import { getPendingApprovalsCount } from './approvals';
import dayjs from 'dayjs';

export interface FilterParams {
  departmentId?: string;
  packageId?: string;
  date?: string;
}

export interface NotStartedEmployee {
  id: string;
  name: string;
  department: string;
  departmentName: string;
  employeeNo: string;
  gender: 'male' | 'female';
  age: number;
  recommendedPackage: string;
  estimatedCost: number;
}

export const getDashboardStats = (filters?: FilterParams): DashboardStats => {
  const targetDate = filters?.date || dayjs().format('YYYY-MM-DD');
  
  let filteredAppts = appointments;
  if (filters?.departmentId) {
    filteredAppts = filteredAppts.filter(a => a.departmentId === filters.departmentId);
  }
  if (filters?.packageId) {
    filteredAppts = filteredAppts.filter(a => a.packageId === filters.packageId);
  }
  if (filters?.date) {
    filteredAppts = filteredAppts.filter(a => a.appointmentDate === filters.date);
  }

  const todayAppts = filteredAppts.filter(a => a.appointmentDate === targetDate);
  const todayCompleted = todayAppts.filter(a => a.status === 'completed');
  
  let filteredDepts = departments;
  if (filters?.departmentId) {
    filteredDepts = filteredDepts.filter(d => d.id === filters.departmentId);
  }
  
  const totalBudget = filteredDepts.reduce((sum, d) => sum + d.budget, 0);
  const totalUsed = filteredAppts.reduce((sum, a) => sum + (a.totalPrice || 0), 0);
  
  const totalEmployees = filteredDepts.reduce((sum, d) => sum + d.employeeCount, 0);
  const completedCount = filteredAppts.filter(a => a.status === 'completed').length;
  const notStarted = Math.max(0, totalEmployees - filteredAppts.length);
  const inProgress = filteredAppts.filter(a => a.status === 'confirmed').length;
  const pending = filteredAppts.filter(a => a.status === 'pending').length;
  
  const abnormalCount = filters?.departmentId 
    ? reports.filter(r => {
        const appt = appointments.find(a => a.id === r.appointmentId);
        return appt?.departmentId === filters.departmentId && (r.status === 'abnormal' || r.status === 'recheck_required');
      }).length
    : getAbnormalReportsCount();

  return {
    todayAppointments: todayAppts.length,
    todayCompleted: todayCompleted.length,
    completionRate: todayAppts.length > 0 ? Math.round((todayCompleted.length / todayAppts.length) * 100) : 0,
    abnormalReports: abnormalCount,
    budgetUsed: totalUsed,
    budgetTotal: totalBudget,
    budgetProgress: totalBudget > 0 ? Math.round((totalUsed / totalBudget) * 100) : 0,
    pendingApprovals: getPendingApprovalsCount(),
    notStartedCount: notStarted,
    completedReports: completedCount,
    abnormalCount,
    totalSpent: totalUsed,
    completedToday: todayCompleted.length,
    inProgress,
    pending,
    budgetSpent: totalUsed,
    totalBudget,
    totalEmployees,
  };
};

export const getDepartmentStats = (filters?: FilterParams): DepartmentStats[] => {
  let filteredDepts = departments;
  if (filters?.departmentId) {
    filteredDepts = filteredDepts.filter(d => d.id === filters.departmentId);
  }
  
  return filteredDepts.map(dept => {
    let deptAppts = appointments.filter(a => a.departmentId === dept.id);
    if (filters?.packageId) {
      deptAppts = deptAppts.filter(a => a.packageId === filters.packageId);
    }
    const completedCount = deptAppts.filter(a => a.status === 'completed').length;
    const pendingCount = deptAppts.filter(a => a.status === 'confirmed' || a.status === 'pending').length;
    const notStartedCount = Math.max(0, dept.employeeCount - deptAppts.length);
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

export const getNotStartedEmployees = (filters?: FilterParams) => {
  let filteredAppts = appointments;
  if (filters?.departmentId) {
    filteredAppts = filteredAppts.filter(a => a.departmentId === filters.departmentId);
  }
  if (filters?.packageId) {
    filteredAppts = filteredAppts.filter(a => a.packageId === filters.packageId);
  }
  
  const allEmployeeIds = new Set(filteredAppts.map(a => a.userId));
  const notStarted: NotStartedEmployee[] = [
    { id: 'user-011', name: '孙七', department: '技术研发部', departmentName: '技术研发部', employeeNo: 'EMP2023011', gender: 'male', age: 26, recommendedPackage: '基础体检套餐A', estimatedCost: 880 },
    { id: 'user-012', name: '周八', department: '技术研发部', departmentName: '技术研发部', employeeNo: 'EMP2023012', gender: 'female', age: 30, recommendedPackage: '标准体检套餐B', estimatedCost: 1680 },
    { id: 'user-013', name: '吴九', department: '市场营销部', departmentName: '市场营销部', employeeNo: 'EMP2023013', gender: 'male', age: 35, recommendedPackage: '标准体检套餐B', estimatedCost: 1680 },
    { id: 'user-014', name: '郑十', department: '财务部', departmentName: '财务部', employeeNo: 'EMP2022010', gender: 'female', age: 42, recommendedPackage: '精英体检套餐C', estimatedCost: 3280 },
    { id: 'user-015', name: '冯十一', department: '运营部', departmentName: '运营部', employeeNo: 'EMP2022011', gender: 'male', age: 28, recommendedPackage: '基础体检套餐A', estimatedCost: 880 },
  ];
  
  let result = notStarted.filter(e => !allEmployeeIds.has(e.id));
  if (filters?.departmentId) {
    result = result.filter(e => {
      const dept = departments.find(d => d.id === filters.departmentId);
      return dept ? e.departmentName === dept.name : true;
    });
  }
  return result;
};

export const getPackageStats = (filters?: FilterParams): PackageStats[] => {
  let filteredAppts = appointments;
  if (filters?.departmentId) {
    filteredAppts = filteredAppts.filter(a => a.departmentId === filters.departmentId);
  }
  if (filters?.packageId) {
    filteredAppts = filteredAppts.filter(a => a.packageId === filters.packageId);
  }
  
  const packageCounts: Record<string, PackageStats> = {};
  filteredAppts.forEach(appt => {
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
