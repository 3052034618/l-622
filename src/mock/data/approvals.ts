import { Approval } from '@/types';
import dayjs from 'dayjs';

export const approvals: Approval[] = [
  {
    id: 'approval-001',
    appointmentId: 'appt-005',
    applicantId: 'user-002',
    applicantName: '张经理',
    applicantDepartment: '技术研发部',
    approverId: 'user-002',
    approverName: '张经理',
    packageName: '精英体检套餐C',
    itemCount: 15,
    exceedAmount: 880,
    departmentName: '技术研发部',
    level: 'supervisor',
    status: 'approved',
    amount: 3880,
    budgetExceed: 880,
    departmentBudget: 135000,
    departmentUsed: 89500,
    createdAt: dayjs().subtract(4, 'day').format('YYYY-MM-DD HH:mm:ss'),
    processedAt: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
    comment: '符合管理层体检标准，同意。',
    escalated: false,
  },
  {
    id: 'approval-002',
    appointmentId: 'appt-006',
    applicantId: 'user-003',
    applicantName: '李经理',
    applicantDepartment: '市场营销部',
    approverId: 'user-003',
    approverName: '李经理',
    packageName: '女性专属套餐',
    itemCount: 19,
    exceedAmount: 180,
    departmentName: '市场营销部',
    level: 'supervisor',
    status: 'pending',
    amount: 1980,
    budgetExceed: 180,
    departmentBudget: 84000,
    departmentUsed: 62300,
    createdAt: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss'),
    escalated: false,
  },
  {
    id: 'approval-003',
    appointmentId: 'appt-008',
    applicantId: 'user-005',
    applicantName: '赵经理',
    applicantDepartment: '财务部',
    approverId: 'user-005',
    approverName: '赵经理',
    packageName: '精英体检套餐C',
    itemCount: 15,
    exceedAmount: 1280,
    departmentName: '财务部',
    level: 'supervisor',
    status: 'escalated',
    amount: 3280,
    budgetExceed: 1280,
    departmentBudget: 45000,
    departmentUsed: 31500,
    createdAt: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
    escalated: true,
    escalatedAt: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    escalationReason: '主管超过48小时未处理，已自动越级至HR经理。',
  },
  {
    id: 'approval-004',
    appointmentId: 'appt-009',
    applicantId: 'user-006',
    applicantName: '刘经理',
    applicantDepartment: '运营部',
    approverId: 'user-201',
    approverName: 'HR总监',
    packageName: '精英体检套餐C',
    itemCount: 15,
    exceedAmount: 980,
    departmentName: '运营部',
    level: 'hr_manager',
    status: 'pending',
    amount: 2980,
    budgetExceed: 980,
    departmentBudget: 96000,
    departmentUsed: 74200,
    createdAt: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    escalated: false,
  },
  {
    id: 'approval-005',
    appointmentId: 'appt-010',
    applicantId: 'user-007',
    applicantName: '陈经理',
    applicantDepartment: '行政部',
    approverId: 'user-007',
    approverName: '陈经理',
    packageName: '标准体检套餐B',
    itemCount: 13,
    exceedAmount: 680,
    departmentName: '行政部',
    level: 'supervisor',
    status: 'rejected',
    amount: 2680,
    budgetExceed: 680,
    departmentBudget: 54000,
    departmentUsed: 42300,
    createdAt: dayjs().subtract(5, 'day').format('YYYY-MM-DD HH:mm:ss'),
    processedAt: dayjs().subtract(4, 'day').format('YYYY-MM-DD HH:mm:ss'),
    comment: '超出预算较多，建议选择标准套餐或调整可选项目。',
    escalated: false,
  },
];

export const getApprovalsByApproverId = (approverId: string): Approval[] => {
  return approvals.filter(a => a.approverId === approverId);
};

export const getApprovalsByStatus = (status: Approval['status']): Approval[] => {
  return approvals.filter(a => a.status === status);
};

export const getPendingApprovalsCount = (): number => {
  return approvals.filter(a => a.status === 'pending' || a.status === 'escalated').length;
};

export const getApprovalById = (id: string): Approval | undefined => {
  return approvals.find(a => a.id === id);
};

export const getApprovalsByApplicantId = (applicantId: string): Approval[] => {
  return approvals.filter(a => a.applicantId === applicantId);
};

export const checkEscalation = (): Approval[] => {
  const now = dayjs();
  return approvals.filter(a => {
    if (a.status !== 'pending' || a.level !== 'supervisor') return false;
    const createdAt = dayjs(a.createdAt);
    const hoursDiff = now.diff(createdAt, 'hour');
    return hoursDiff >= 48;
  });
};
