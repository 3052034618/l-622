import { create } from 'zustand';
import { Package, PackageItem, TimeSlot, Appointment, User, Approval } from '@/types';
import { packages, getRecommendedPackages } from '@/mock/data/packages';
import { getTimeSlots, appointments as mockAppointments, getAppointmentsByUserId } from '@/mock/data/appointments';
import { departments } from '@/mock/data/users';
import dayjs from 'dayjs';

interface AppointmentState {
  packages: Package[];
  recommendedPackages: Package[];
  selectedPackage: Package | null;
  selectedItems: PackageItem[];
  timeSlots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  lockedSlot: TimeSlot | null;
  countdown: number;
  totalPrice: number;
  appointments: Appointment[];
  currentAppointment: Appointment | null;
  loading: boolean;
  selectedDate: string | null;

  loadPackages: () => void;
  loadRecommendedPackages: (user: User) => void;
  selectPackage: (pkg: Package) => void;
  toggleItem: (item: PackageItem) => void;
  setSelectedDate: (date: string) => void;
  calculateTotalPrice: () => number;
  validateBudget: (departmentId: string) => { withinBudget: boolean; exceedAmount: number; requiresApproval: boolean };
  loadTimeSlots: (date: string) => Promise<void>;
  selectSlot: (slot: TimeSlot) => void;
  lockSlot: (slot: TimeSlot) => void;
  releaseSlot: () => void;
  cancelLock: () => void;
  clearSelection: () => void;
  confirmAppointment: (user: User, selectedItems: PackageItem[], budgetCheck: { withinBudget: boolean; exceedAmount: number; requiresApproval: boolean }) => Promise<{ success: boolean; message: string }>;
  loadUserAppointments: (userId: string) => void;
  setCountdown: (value: number) => void;
  resetSelection: () => void;
}

export const useAppointmentStore = create<AppointmentState>((set, get) => ({
  packages,
  recommendedPackages: [],
  selectedPackage: null,
  selectedItems: [],
  timeSlots: [],
  selectedSlot: null,
  lockedSlot: null,
  countdown: 900,
  totalPrice: 0,
  appointments: [],
  currentAppointment: null,
  loading: false,
  selectedDate: null,

  loadPackages: () => {
    set({ packages });
  },

  loadRecommendedPackages: (user: User) => {
    const recommended = getRecommendedPackages(user.age, user.gender);
    set({ recommendedPackages: recommended, packages });
  },

  selectPackage: (pkg: Package) => {
    const defaultSelected = pkg.items.filter(item => !item.isOptional);
    const total = defaultSelected.reduce((sum, item) => sum + item.price, 0);
    set({ selectedPackage: pkg, selectedItems: defaultSelected, totalPrice: total });
  },

  toggleItem: (item: PackageItem) => {
    const { selectedItems, selectedPackage } = get();
    if (!selectedPackage) return;
    if (!item.isOptional) return;

    let newItems: PackageItem[];
    if (selectedItems.some(si => si.id === item.id)) {
      newItems = selectedItems.filter(si => si.id !== item.id);
    } else {
      newItems = [...selectedItems, item];
    }
    const total = newItems.reduce((sum, i) => sum + i.price, 0);
    set({ selectedItems: newItems, totalPrice: total });
  },

  setSelectedDate: (date: string) => {
    set({ selectedDate: date });
  },

  calculateTotalPrice: () => {
    const { selectedItems } = get();
    return selectedItems.reduce((sum, item) => sum + item.price, 0);
  },

  validateBudget: (departmentId: string) => {
    const totalPrice = get().calculateTotalPrice();
    const dept = departments.find(d => d.id === departmentId);
    if (!dept) return { withinBudget: true, exceedAmount: 0, requiresApproval: false };

    const remaining = dept.budget - dept.usedBudget;
    const exceedAmount = Math.max(0, totalPrice - remaining);

    return {
      withinBudget: exceedAmount <= 0,
      exceedAmount,
      requiresApproval: exceedAmount > 0
    };
  },

  loadTimeSlots: async (date: string) => {
    set({ loading: true });
    await new Promise(resolve => setTimeout(resolve, 500));
    const slots = getTimeSlots(date);
    set({ timeSlots: slots, loading: false });
  },

  selectSlot: (slot: TimeSlot) => {
    set({ selectedSlot: slot });
  },

  lockSlot: (slot: TimeSlot) => {
    const { lockedSlot, timeSlots } = get();
    if (lockedSlot) {
      const resetSlots = timeSlots.map(s =>
        s.id === lockedSlot.id ? { ...s, isLocked: false } : s
      );
      set({
        lockedSlot: { ...slot, isLocked: true },
        selectedSlot: slot,
        countdown: 900,
        timeSlots: resetSlots.map(s =>
          s.id === slot.id ? { ...s, isLocked: true } : s
        )
      });
    } else {
      set({
        lockedSlot: { ...slot, isLocked: true },
        selectedSlot: slot,
        countdown: 900,
        timeSlots: timeSlots.map(s =>
          s.id === slot.id ? { ...s, isLocked: true } : s
        )
      });
    }
  },

  releaseSlot: () => {
    const { lockedSlot, timeSlots } = get();
    set({
      lockedSlot: null,
      selectedSlot: null,
      countdown: 900,
      timeSlots: timeSlots.map(s =>
        s.id === lockedSlot?.id ? { ...s, isLocked: false } : s
      )
    });
  },

  cancelLock: () => {
    get().releaseSlot();
  },

  clearSelection: () => {
    const { lockedSlot, timeSlots } = get();
    if (lockedSlot) {
      set({
        timeSlots: timeSlots.map(s =>
          s.id === lockedSlot.id ? { ...s, isLocked: false } : s
        )
      });
    }
    set({
      lockedSlot: null,
      selectedSlot: null,
      countdown: 900,
    });
  },

  confirmAppointment: async (user: User, selectedItems: PackageItem[], budgetCheck: { withinBudget: boolean; exceedAmount: number; requiresApproval: boolean }) => {
    const { selectedPackage, selectedSlot } = get();
    if (!selectedPackage || !selectedSlot) {
      return { success: false, message: '请选择套餐和时段' };
    }

    await new Promise(resolve => setTimeout(resolve, 1000));

    const totalPrice = selectedItems.reduce((sum, item) => sum + item.price, 0);

    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      appointmentNo: `APT${Date.now()}`,
      appointmentDate: get().selectedDate || dayjs().format('YYYY-MM-DD'),
      appointmentTime: selectedSlot.time,
      timeSlot: selectedSlot.time,
      items: selectedItems.map(item => ({ id: item.id, name: item.name, price: item.price })),
      status: budgetCheck.requiresApproval ? 'pending' : 'confirmed',
      totalPrice,
      selectedItems: selectedItems.map(item => item.id),
      isWaived: false,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      departmentId: user.departmentId,
      departmentName: user.departmentName,
    };

    if (budgetCheck.requiresApproval) {
      const dept = departments.find(d => d.id === user.departmentId);
      const newApproval: Approval = {
        id: `approval-${Date.now()}`,
        appointmentId: newAppointment.id,
        applicantId: user.id,
        applicantName: user.name,
        applicantDepartment: user.departmentName,
        approverId: dept?.managerId || '',
        approverName: dept?.managerName || '',
        packageName: selectedPackage.name,
        itemCount: selectedItems.length,
        exceedAmount: budgetCheck.exceedAmount,
        departmentName: user.departmentName,
        level: 'supervisor',
        status: 'pending',
        amount: totalPrice,
        budgetExceed: budgetCheck.exceedAmount,
        departmentBudget: dept?.budget || 0,
        departmentUsed: dept?.usedBudget || 0,
        createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        escalated: false,
      };

      set(state => ({
        appointments: [newAppointment, ...state.appointments],
        currentAppointment: newAppointment,
      }));

      try {
        const { useApprovalStore } = await import('@/store/useApprovalStore');
        const approvalStore = useApprovalStore.getState();
        approvalStore.approvals.push(newApproval);
        set(state => ({}));
        useApprovalStore.setState(state => ({
          approvals: [...state.approvals, newApproval],
          pendingCount: state.pendingCount + 1,
        }));
      } catch (e) {
        console.error('Failed to create approval record:', e);
      }
    } else {
      set(state => ({
        appointments: [newAppointment, ...state.appointments],
        currentAppointment: newAppointment,
      }));
    }

    get().releaseSlot();
    get().resetSelection();

    return {
      success: true,
      message: budgetCheck.requiresApproval ? '预约已提交，等待审批' : '预约成功'
    };
  },

  loadUserAppointments: (userId: string) => {
    const mockAppts = getAppointmentsByUserId(userId);
    const stateAppts = get().appointments.filter(a => a.userId === userId);
    const mergedMap = new Map<string, Appointment>();
    [...stateAppts, ...mockAppts].forEach(apt => {
      if (!mergedMap.has(apt.id)) {
        mergedMap.set(apt.id, apt);
      }
    });
    const merged = Array.from(mergedMap.values());
    set({ appointments: merged });
  },

  setCountdown: (value: number) => {
    set({ countdown: value });
  },

  resetSelection: () => {
    set({
      selectedPackage: null,
      selectedItems: [],
      selectedSlot: null,
      lockedSlot: null,
      countdown: 900,
      totalPrice: 0,
      selectedDate: null,
      timeSlots: [],
    });
  },
}));
