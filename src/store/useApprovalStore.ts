import { create } from 'zustand';
import { Approval, ApprovalStatus, ApprovalLevel } from '@/types';
import { approvals, getApprovalsByApproverId, getApprovalsByStatus, checkEscalation } from '@/mock/data/approvals';
import dayjs from 'dayjs';

interface ApprovalState {
  approvals: Approval[];
  pendingCount: number;
  loading: boolean;
  selectedApproval: Approval | null;
  
  loadApprovals: (approverId: string) => void;
  loadAllApprovals: () => void;
  selectApproval: (id: string) => void;
  processApproval: (id: string, approved: boolean, comment: string) => Promise<{ success: boolean; message: string }>;
  approveApproval: (id: string, approverId: string, comment: string) => Promise<{ success: boolean; message: string }>;
  rejectApproval: (id: string, approverId: string, comment: string) => Promise<{ success: boolean; message: string }>;
  checkAndEscalate: () => void;
  getPendingCount: () => number;
  getApprovalsByStatus: (status: ApprovalStatus) => Approval[];
}

export const useApprovalStore = create<ApprovalState>((set, get) => ({
  approvals: [],
  pendingCount: 0,
  loading: false,
  selectedApproval: null,

  loadApprovals: (approverId: string) => {
    const mockUserApprovals = approvals.filter(a =>
      a.approverId === approverId || (a.escalated && a.level === 'hr_manager')
    );

    const stateApprovals = get().approvals;

    const existingIds = new Set(stateApprovals.map(a => a.id));
    const newMockApprovals = mockUserApprovals.filter(a => !existingIds.has(a.id));

    const merged = [...stateApprovals, ...newMockApprovals].sort((a, b) => {
      const aIsNew = a.id.startsWith('approval-') && !a.id.startsWith('approval-0');
      const bIsNew = b.id.startsWith('approval-') && !b.id.startsWith('approval-0');
      if (aIsNew && !bIsNew) return -1;
      if (!aIsNew && bIsNew) return 1;
      return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
    });

    set({
      approvals: merged,
      pendingCount: merged.filter(a => a.status === 'pending' || a.status === 'escalated').length
    });
  },

  loadAllApprovals: () => {
    const stateApprovals = get().approvals;
    const existingIds = new Set(stateApprovals.map(a => a.id));
    const newMockApprovals = approvals.filter(a => !existingIds.has(a.id));

    const merged = [...stateApprovals, ...newMockApprovals].sort((a, b) => {
      const aIsNew = a.id.startsWith('approval-') && !a.id.startsWith('approval-0');
      const bIsNew = b.id.startsWith('approval-') && !b.id.startsWith('approval-0');
      if (aIsNew && !bIsNew) return -1;
      if (!aIsNew && bIsNew) return 1;
      return dayjs(b.createdAt).valueOf() - dayjs(a.createdAt).valueOf();
    });

    set({ 
      approvals: merged,
      pendingCount: merged.filter(a => a.status === 'pending' || a.status === 'escalated').length
    });
  },

  selectApproval: (id: string) => {
    const approval = approvals.find(a => a.id === id);
    set({ selectedApproval: approval || null });
  },

  processApproval: async (id: string, approved: boolean, comment: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const approval = get().approvals.find(a => a.id === id);
    if (!approval) {
      return { success: false, message: '审批记录不存在' };
    }
    
    const newStatus: ApprovalStatus = approved ? 'approved' : 'rejected';
    
    if (approval.level === 'supervisor' && approved) {
      const hrApproval: Approval = {
        ...approval,
        id: `approval-${Date.now()}`,
        level: 'hr_manager' as ApprovalLevel,
        approverId: 'user-201',
        approverName: 'HR总监',
        status: 'pending' as ApprovalStatus,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      };
      
      set(state => ({
        approvals: state.approvals.map(a => 
          a.id === id ? { ...a, status: newStatus, processedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'), comment } : a
        ).concat(hrApproval),
        pendingCount: state.pendingCount,
      }));
      
      return { success: true, message: '审批通过，已提交HR经理复核' };
    }
    
    set(state => ({
      approvals: state.approvals.map(a => 
        a.id === id ? { ...a, status: newStatus, processedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'), comment } : a
      ),
      pendingCount: state.pendingCount - 1,
    }));
    
    return { success: true, message: approved ? '审批通过' : '已驳回' };
  },

  checkAndEscalate: () => {
    const toEscalate = checkEscalation();
    
    if (toEscalate.length > 0) {
      set(state => {
        const escalatedApprovals = state.approvals.map(a => {
          if (toEscalate.find(e => e.id === a.id)) {
            return {
              ...a,
              status: 'escalated' as ApprovalStatus,
              escalated: true,
              escalatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
              escalationReason: '主管超过48小时未处理，已自动越级至HR经理。'
            };
          }
          return a;
        });
        
        const hrApprovals = toEscalate.map(a => ({
          ...a,
          id: `approval-escalated-${Date.now()}-${a.id}`,
          level: 'hr_manager' as ApprovalLevel,
          approverId: 'user-201',
          approverName: 'HR总监',
          status: 'pending' as ApprovalStatus,
          escalated: true,
          escalatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
          escalationReason: '主管超过48小时未处理，已自动越级。',
          createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        }));
        
        return {
          approvals: [...escalatedApprovals, ...hrApprovals],
        };
      });
    }
  },

  getPendingCount: () => {
    return get().approvals.filter(a => a.status === 'pending' || a.status === 'escalated').length;
  },

  approveApproval: async (id: string, approverId: string, comment: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const approval = get().approvals.find(a => a.id === id);
    if (!approval) {
      return { success: false, message: '审批记录不存在' };
    }

    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

    if (approval.level === 'supervisor') {
      const hrApproval: Approval = {
        ...approval,
        id: `approval-${Date.now()}`,
        level: 'hr_manager' as ApprovalLevel,
        approverId: 'user-201',
        approverName: 'HR总监',
        status: 'pending' as ApprovalStatus,
        comment: undefined,
        processedAt: undefined,
        createdAt: now,
      };

      set(state => ({
        approvals: state.approvals.map(a =>
          a.id === id ? { ...a, status: 'approved' as ApprovalStatus, processedAt: now, comment } : a
        ).concat(hrApproval),
        pendingCount: state.pendingCount,
      }));

      return { success: true, message: '审批通过，已提交HR经理复核' };
    }

    set(state => ({
      approvals: state.approvals.map(a =>
        a.id === id ? { ...a, status: 'approved' as ApprovalStatus, processedAt: now, comment } : a
      ),
      pendingCount: state.pendingCount - 1,
    }));

    return { success: true, message: '审批通过' };
  },

  rejectApproval: async (id: string, approverId: string, comment: string) => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const approval = get().approvals.find(a => a.id === id);
    if (!approval) {
      return { success: false, message: '审批记录不存在' };
    }

    const now = dayjs().format('YYYY-MM-DD HH:mm:ss');

    set(state => ({
      approvals: state.approvals.map(a =>
        a.id === id ? { ...a, status: 'rejected' as ApprovalStatus, processedAt: now, comment } : a
      ),
      pendingCount: state.pendingCount - 1,
    }));

    return { success: true, message: '已驳回' };
  },

  getApprovalsByStatus: (status: ApprovalStatus) => {
    return get().approvals.filter(a => a.status === status);
  },
}));
