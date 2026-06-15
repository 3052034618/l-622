export type UserRole = 'employee' | 'doctor' | 'hr' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  departmentId: string;
  departmentName: string;
  age: number;
  gender: 'male' | 'female';
  employeeNo: string;
  avatar?: string;
  email?: string;
  phone?: string;
}

export interface Department {
  id: string;
  name: string;
  managerId: string;
  managerName: string;
  employeeCount: number;
  budget: number;
  usedBudget: number;
}

export interface PackageItem {
  id: string;
  name: string;
  description: string;
  price: number;
  isOptional: boolean;
  selected: boolean;
  category: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  targetGender?: 'male' | 'female' | 'all';
  minAge?: number;
  maxAge?: number;
  targetMinAge: number;
  targetMaxAge: number;
  isRecommended: boolean;
  isPopular: boolean;
  items: PackageItem[];
  imageUrl?: string;
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'locked' | 'waived';

export interface Appointment {
  id: string;
  userId: string;
  userName: string;
  packageId: string;
  packageName: string;
  appointmentNo: string;
  appointmentDate: string;
  appointmentTime: string;
  timeSlot: string;
  items: { id: string; name: string; price: number }[];
  status: AppointmentStatus;
  lockedAt?: string;
  lockedExpireAt?: string;
  totalPrice: number;
  selectedItems: string[];
  isWaived: boolean;
  createdAt: string;
  departmentId: string;
  departmentName: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  capacity: number;
  booked: number;
  available: number;
  doctorId?: string;
  doctorName?: string;
  isRecommended: boolean;
  isLocked: boolean;
  lockUserId?: string;
}

export type ReportStatus = 'draft' | 'submitted' | 'normal' | 'abnormal' | 'recheck_required' | 'pending';

export interface ReportItem {
  id: string;
  name: string;
  value: string;
  unit?: string;
  referenceRange?: string;
  isAbnormal: boolean;
  abnormalType?: 'high' | 'low';
  category: string;
}

export interface Report {
  id: string;
  appointmentId: string;
  userId: string;
  userName: string;
  patientName: string;
  reportNo: string;
  packageName: string;
  totalAmount: number;
  doctorAdvice: string;
  verifiedAt: string;
  userGender: 'male' | 'female';
  userAge: number;
  doctorId: string;
  doctorName: string;
  examDate: string;
  status: ReportStatus;
  items: ReportItem[];
  abnormalItems: string[];
  suggestion: string;
  createdAt: string;
  updatedAt: string;
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'escalated';
export type ApprovalLevel = 'supervisor' | 'hr_manager';

export interface Approval {
  id: string;
  appointmentId: string;
  applicantId: string;
  applicantName: string;
  applicantDepartment: string;
  approverId: string;
  approverName: string;
  packageName: string;
  itemCount: number;
  exceedAmount: number;
  departmentName: string;
  level: ApprovalLevel;
  status: ApprovalStatus;
  amount: number;
  budgetExceed: number;
  departmentBudget: number;
  departmentUsed: number;
  createdAt: string;
  processedAt?: string;
  comment?: string;
  escalated: boolean;
  escalatedAt?: string;
  escalationReason?: string;
}

export interface DashboardStats {
  todayAppointments: number;
  todayCompleted: number;
  completionRate: number;
  abnormalReports: number;
  budgetUsed: number;
  budgetTotal: number;
  budgetProgress: number;
  pendingApprovals: number;
  notStartedCount: number;
  completedReports: number;
  abnormalCount: number;
  totalSpent: number;
  completedToday: number;
  inProgress: number;
  pending: number;
  budgetSpent: number;
  totalBudget: number;
  totalEmployees: number;
}

export interface DepartmentStats {
  departmentId: string;
  departmentName: string;
  totalEmployees: number;
  completedCount: number;
  completionRate: number;
  pendingCount: number;
  notStartedCount: number;
  abnormalCount: number;
  budgetUsed: number;
  budgetTotal: number;
  totalCount: number;
}

export interface PackageStats {
  packageId: string;
  packageName: string;
  name: string;
  count: number;
}

export interface TimeSeriesData {
  date: string;
  appointments: number;
  completed: number;
  abnormal: number;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'appointment' | 'report' | 'approval' | 'system';
  title: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  relatedId?: string;
}

export interface SystemRules {
  lockDuration: number;
  approvalTimeout: number;
  escalationTimeout: number;
  budgetWarningThreshold: number;
  maxOptionalItems: number;
}
