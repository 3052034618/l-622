import { create } from 'zustand';
import { DashboardStats, DepartmentStats, TimeSeriesData, PackageStats, Department } from '@/types';
import { getDashboardStats, getDepartmentStats, generateTimeSeriesData, getNotStartedEmployees, getPackageStats } from '@/mock/data/statistics';
import { departments } from '@/mock/data/users';

interface DashboardState {
  stats: DashboardStats | null;
  departmentStats: DepartmentStats[];
  timeSeriesData: TimeSeriesData[];
  notStartedEmployees: { id: string; name: string; department: string; employeeNo: string }[];
  notStartedList: { id: string; name: string; department: string; employeeNo: string }[];
  packageStats: PackageStats[];
  departments: Department[];
  filters: {
    departmentId: string;
    packageId: string;
    dateRange: [string, string] | null;
  };
  loading: boolean;
  isLoading: boolean;
  lastUpdated: string | null;
  
  loadDashboardData: () => Promise<void>;
  loadData: () => Promise<void>;
  refreshData: () => Promise<void>;
  setFilter: (key: keyof DashboardState['filters'], value: string | null) => void;
  resetFilters: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  stats: null,
  departmentStats: [],
  timeSeriesData: [],
  notStartedEmployees: [],
  notStartedList: [],
  packageStats: [],
  departments: departments,
  filters: {
    departmentId: '',
    packageId: '',
    dateRange: null,
  },
  loading: false,
  isLoading: false,
  lastUpdated: null,

  loadDashboardData: async () => {
    set({ loading: true, isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const stats = getDashboardStats();
    const deptStats = getDepartmentStats();
    const timeData = generateTimeSeriesData(7);
    const notStarted = getNotStartedEmployees();
    const pkgStats = getPackageStats();
    
    set({
      stats,
      departmentStats: deptStats,
      timeSeriesData: timeData,
      notStartedEmployees: notStarted,
      notStartedList: notStarted,
      packageStats: pkgStats,
      loading: false,
      isLoading: false,
      lastUpdated: new Date().toISOString(),
    });
  },

  loadData: async () => {
    return get().loadDashboardData();
  },

  refreshData: async () => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const stats = getDashboardStats();
    const timeData = generateTimeSeriesData(7);
    
    const fluctuate = (val: number, range: number) => Math.max(0, val + Math.floor(Math.random() * range * 2) - range);
    
    set(state => ({
      stats: state.stats ? {
        ...state.stats,
        todayAppointments: fluctuate(state.stats.todayAppointments, 3),
        todayCompleted: fluctuate(state.stats.todayCompleted, 2),
        abnormalReports: fluctuate(state.stats.abnormalReports, 1),
        pendingApprovals: fluctuate(state.stats.pendingApprovals, 1),
        completionRate: Math.min(100, Math.max(0, state.stats.completionRate + Math.floor(Math.random() * 5) - 2)),
      } : stats,
      timeSeriesData: timeData,
      loading: false,
      lastUpdated: new Date().toISOString(),
    }));
  },

  setFilter: (key, value) => {
    set(state => ({
      filters: {
        ...state.filters,
        [key]: value,
      }
    }));
    
    get().loadDashboardData();
  },

  resetFilters: () => {
    set({
      filters: {
        departmentId: '',
        packageId: '',
        dateRange: null,
      }
    });
    get().loadDashboardData();
  },
}));
