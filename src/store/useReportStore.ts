import { create } from 'zustand';
import { Report, ReportItem, ReportStatus, Appointment, User } from '@/types';
import { reports, getReportsByUserId, getReportsByDoctorId, getReportById } from '@/mock/data/reports';
import dayjs from 'dayjs';

interface ReportState {
  reports: Report[];
  currentReport: Report | null;
  loading: boolean;
  draftReport: Partial<Report> | null;
  validationErrors: string[];
  
  loadUserReports: (userId: string) => void;
  loadDoctorReports: (doctorId: string) => void;
  loadAllReports: () => void;
  selectReport: (id: string) => void;
  createDraft: (appointment: Appointment, user: User) => void;
  updateDraftItem: (itemId: string, value: string, isAbnormal: boolean, abnormalType?: 'high' | 'low') => void;
  updateReportItem: (itemId: string, field: keyof ReportItem, value: any) => void;
  updateDraftSuggestion: (suggestion: string) => void;
  updateDoctorAdvice: (advice: string) => void;
  validateReport: () => { valid: boolean; errors: string[]; abnormalCount: number };
  submitReport: (doctorId?: string, doctorName?: string) => Promise<{ success: boolean; message: string }>;
  markAsRecheck: (reportId: string) => Promise<{ success: boolean; message: string }>;
  clearDraft: () => void;
  loadAllReports: () => void;
}
const defaultExamItems: Omit<ReportItem, 'id'>[] = [
  { name: '身高', value: '', unit: 'cm', category: '一般检查', isAbnormal: false },
  { name: '体重', value: '', unit: 'kg', referenceRange: '根据身高计算', category: '一般检查', isAbnormal: false },
  { name: '血压', value: '', unit: 'mmHg', referenceRange: '90-140/60-90', category: '一般检查', isAbnormal: false },
  { name: '心率', value: '', unit: '次/分', referenceRange: '60-100', category: '一般检查', isAbnormal: false },
  { name: '白细胞计数', value: '', unit: '10^9/L', referenceRange: '4-10', category: '血常规', isAbnormal: false },
  { name: '红细胞计数', value: '', unit: '10^12/L', referenceRange: '男4-5.5/女3.5-5', category: '血常规', isAbnormal: false },
  { name: '血红蛋白', value: '', unit: 'g/L', referenceRange: '男120-160/女110-150', category: '血常规', isAbnormal: false },
  { name: '血小板计数', value: '', unit: '10^9/L', referenceRange: '100-300', category: '血常规', isAbnormal: false },
  { name: '谷丙转氨酶(ALT)', value: '', unit: 'U/L', referenceRange: '0-40', category: '肝功能', isAbnormal: false },
  { name: '谷草转氨酶(AST)', value: '', unit: 'U/L', referenceRange: '0-40', category: '肝功能', isAbnormal: false },
  { name: '总胆红素', value: '', unit: 'μmol/L', referenceRange: '3.4-17.1', category: '肝功能', isAbnormal: false },
  { name: '肌酐', value: '', unit: 'μmol/L', referenceRange: '男44-133/女70-106', category: '肾功能', isAbnormal: false },
  { name: '尿素氮', value: '', unit: 'mmol/L', referenceRange: '2.9-8.2', category: '肾功能', isAbnormal: false },
  { name: '尿酸', value: '', unit: 'μmol/L', referenceRange: '男150-420/女90-360', category: '肾功能', isAbnormal: false },
  { name: '总胆固醇', value: '', unit: 'mmol/L', referenceRange: '<5.2', category: '血脂', isAbnormal: false },
  { name: '甘油三酯', value: '', unit: 'mmol/L', referenceRange: '<1.7', category: '血脂', isAbnormal: false },
  { name: '高密度脂蛋白', value: '', unit: 'mmol/L', referenceRange: '>1.0', category: '血脂', isAbnormal: false },
  { name: '低密度脂蛋白', value: '', unit: 'mmol/L', referenceRange: '<3.4', category: '血脂', isAbnormal: false },
  { name: '空腹血糖', value: '', unit: 'mmol/L', referenceRange: '3.9-6.1', category: '血糖', isAbnormal: false },
  { name: '心电图', value: '', category: '辅助检查', isAbnormal: false },
  { name: '胸部检查', value: '', category: '辅助检查', isAbnormal: false },
  { name: '腹部B超', value: '', category: '辅助检查', isAbnormal: false },
];

export const useReportStore = create<ReportState>((set, get) => ({
  reports: [],
  currentReport: null,
  loading: false,
  draftReport: null,
  validationErrors: [],

  loadUserReports: (userId: string) => {
    set({ loading: true });
    const mockReports = getReportsByUserId(userId);
    const stateReports = get().reports;
    const userStateReports = stateReports.filter(r => r.userId === userId);
    
    const idSet = new Set<string>();
    const merged: Report[] = [];
    
    for (const r of userStateReports) {
      if (!idSet.has(r.id)) {
        idSet.add(r.id);
        merged.push(r);
      }
    }
    for (const r of mockReports) {
      if (!idSet.has(r.id)) {
        idSet.add(r.id);
        merged.push(r);
      }
    }
    
    merged.sort((a, b) => (b.createdAt || b.verifiedAt).localeCompare(a.createdAt || a.verifiedAt));
    
    set({ reports: merged, loading: false });
  },

  loadDoctorReports: (doctorId: string) => {
    set({ loading: true });
    const mockReports = getReportsByDoctorId(doctorId);
    const stateReports = get().reports;
    const doctorStateReports = stateReports.filter(r => r.doctorId === doctorId);
    
    const idSet = new Set<string>();
    const merged: Report[] = [];
    
    for (const r of doctorStateReports) {
      if (!idSet.has(r.id)) {
        idSet.add(r.id);
        merged.push(r);
      }
    }
    for (const r of mockReports) {
      if (!idSet.has(r.id)) {
        idSet.add(r.id);
        merged.push(r);
      }
    }
    
    merged.sort((a, b) => (b.createdAt || b.verifiedAt).localeCompare(a.createdAt || a.verifiedAt));
    
    set({ reports: merged, loading: false });
  },

  loadAllReports: () => {
    set({ loading: true });
    const stateReports = get().reports;
    
    const idSet = new Set<string>();
    const merged: Report[] = [];
    
    for (const r of stateReports) {
      if (!idSet.has(r.id)) {
        idSet.add(r.id);
        merged.push(r);
      }
    }
    for (const r of reports) {
      if (!idSet.has(r.id)) {
        idSet.add(r.id);
        merged.push(r);
      }
    }
    
    merged.sort((a, b) => (b.createdAt || b.verifiedAt).localeCompare(a.createdAt || a.verifiedAt));
    
    set({ reports: merged, loading: false });
  },

  selectReport: (id: string) => {
    const report = getReportById(id);
    set({ currentReport: report || null });
  },

  createDraft: (appointment: Appointment, user: User) => {
    const items: ReportItem[] = defaultExamItems.map((item, index) => ({
      ...item,
      id: `draft-item-${index}`
    }));
    
    const draft: Report = {
      id: `draft-${Date.now()}`,
      appointmentId: appointment.id,
      userId: user.id,
      userName: user.name,
      patientName: user.name,
      reportNo: '',
      packageName: appointment.packageName,
      totalAmount: appointment.totalPrice || 0,
      doctorAdvice: '',
      verifiedAt: '',
      userGender: user.gender,
      userAge: user.age,
      doctorId: '',
      doctorName: '',
      examDate: dayjs().format('YYYY-MM-DD'),
      status: 'draft',
      items,
      abnormalItems: [],
      suggestion: '',
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };
    
    set({
      draftReport: draft,
      currentReport: draft,
    });
  },

  updateReportItem: (itemId: string, field: keyof ReportItem, value: any) => {
    const { draftReport } = get();
    if (!draftReport?.items) return;
    
    const updatedItems = draftReport.items.map(item => {
      if (item.id === itemId) {
        const updated = { ...item, [field]: value };
        if (field === 'isAbnormal' && !value) {
          updated.abnormalType = undefined;
        }
        return updated;
      }
      return item;
    });
    
    const abnormalItems = updatedItems
      .filter(item => item.isAbnormal)
      .map(item => item.name);
    
    const updatedDraft = {
      ...draftReport,
      items: updatedItems,
      abnormalItems,
    };
    
    set({
      draftReport: updatedDraft,
      currentReport: updatedDraft as Report,
    });
  },

  updateDoctorAdvice: (advice: string) => {
    const { draftReport } = get();
    if (!draftReport) return;
    const updated = { ...draftReport, doctorAdvice: advice, suggestion: advice };
    set({ draftReport: updated, currentReport: updated as Report });
  },

  updateDraftItem: (itemId: string, value: string, isAbnormal: boolean, abnormalType?: 'high' | 'low') => {
    const { draftReport } = get();
    if (!draftReport?.items) return;
    
    const updatedItems = draftReport.items.map(item =>
      item.id === itemId ? { ...item, value, isAbnormal, abnormalType } : item
    );
    
    const abnormalItems = updatedItems
      .filter(item => item.isAbnormal)
      .map(item => item.name);
    
    const updated = {
      ...draftReport,
      items: updatedItems,
      abnormalItems,
    };
    
    set({
      draftReport: updated,
      currentReport: updated as Report,
    });
  },

  updateDraftSuggestion: (suggestion: string) => {
    const { draftReport } = get();
    if (!draftReport) return;
    const updated = { ...draftReport, suggestion };
    set({ draftReport: updated, currentReport: updated as Report });
  },

  validateReport: () => {
    const { draftReport } = get();
    const errors: string[] = [];
    
    if (!draftReport) {
      const result = { valid: false, errors: ['报告未初始化'], abnormalCount: 0 };
      set({ validationErrors: result.errors });
      return result;
    }
    
    const emptyItems = draftReport.items?.filter(item => !item.value.trim()) || [];
    if (emptyItems.length > 0) {
      errors.push(`以下项目未填写: ${emptyItems.slice(0, 5).map(i => i.name).join('、')}${emptyItems.length > 5 ? '等' : ''}`);
    }
    
    const abnormalCount = draftReport.items?.filter(item => item.isAbnormal).length || 0;
    if (abnormalCount > 0 && !draftReport.suggestion?.trim()) {
      errors.push('存在异常指标时必须填写医生建议');
    }
    
    const result = {
      valid: errors.length === 0,
      errors,
      abnormalCount
    };
    set({ validationErrors: result.errors });
    return result;
  },

  submitReport: async (doctorId?: string, doctorName?: string) => {
    const { draftReport, validateReport } = get();
    const validation = validateReport();
    
    if (!validation.valid) {
      return { success: false, message: validation.errors[0] };
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const status: ReportStatus = validation.abnormalCount > 0 ? 'recheck_required' : 'normal';
    const finalDoctorId = doctorId || 'default-doctor';
    const finalDoctorName = doctorName || '系统医生';
    
    const newReport: Report = {
      id: `report-${Date.now()}`,
      appointmentId: draftReport!.appointmentId!,
      userId: draftReport!.userId!,
      userName: draftReport!.userName!,
      patientName: draftReport!.patientName || draftReport!.userName!,
      reportNo: `RPT-${Date.now()}`,
      packageName: draftReport!.packageName || '',
      totalAmount: 0,
      doctorAdvice: draftReport!.doctorAdvice || draftReport!.suggestion || '',
      verifiedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      userGender: draftReport!.userGender!,
      userAge: draftReport!.userAge!,
      doctorId: finalDoctorId,
      doctorName: finalDoctorName,
      examDate: dayjs().format('YYYY-MM-DD'),
      status,
      items: draftReport!.items!,
      abnormalItems: draftReport!.abnormalItems!,
      suggestion: draftReport!.suggestion!,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };
    
    set(state => ({
      reports: [newReport, ...state.reports],
      currentReport: newReport,
      draftReport: null,
    }));
    
    return { 
      success: true, 
      message: status === 'abnormal' ? '报告已提交，已触发复检通知' : '报告已提交，已推送至员工端' 
    };
  },

  markAsRecheck: async (reportId: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    set(state => ({
      reports: state.reports.map(r => 
        r.id === reportId ? { ...r, status: 'recheck_required' as ReportStatus, updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss') } : r
      ),
      currentReport: state.currentReport?.id === reportId 
        ? { ...state.currentReport, status: 'recheck_required' as ReportStatus, updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss') }
        : state.currentReport
    }));
    
    return { success: true, message: '已通知员工进行复检' };
  },

  clearDraft: () => {
    set({ draftReport: null });
  },
}));
