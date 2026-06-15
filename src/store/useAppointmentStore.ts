import { create } from 'zustand';
import { Package, TimeSlot, Appointment, User } from '@/types';
import { packages, getRecommendedPackages } from '@/mock/data/packages';
import { getTimeSlots, appointments, getAppointmentsByUserId } from '@/mock/data/appointments';
import { departments } from '@/mock/data/users';
import dayjs from 'dayjs';

interface AppointmentState {
  packages: Package[];
  recommendedPackages: Package[];
  selectedPackage: Package | null;
  selectedItems: string[];
  timeSlots: TimeSlot[];
  selectedSlot: TimeSlot | null;
  lockedSlot: TimeSlot | null;
  countdown: number;
  appointments: Appointment[];
  currentAppointment: Appointment | null;
  loading: boolean;
  
  loadRecommendedPackages: (user: User) => void;
  selectPackage: (pkg: Package) => void;
  toggleItem: (itemId: string) => void;
  calculateTotalPrice: () => number;
  validateBudget: (departmentId: string) => { withinBudget: boolean; exceedAmount: number; requiresApproval: boolean };
  loadTimeSlots: (date: string) => Promise<void>;
  selectSlot: (slot: TimeSlot) => void;
  lockSlot: (slot: TimeSlot) => void;
  releaseSlot: () => void;
  confirmAppointment: (user: User) => Promise<{ success: boolean; message: string; requiresApproval: boolean }>;
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
  appointments: [],
  currentAppointment: null,
  loading: false,

  loadRecommendedPackages: (user: User) => {
    const recommended = getRecommendedPackages(user.age, user.gender);
    set({ recommendedPackages: recommended, packages });
  },

  selectPackage: (pkg: Package) => {
    const defaultSelected = pkg.items.filter(item => !item.isOptional).map(item => item.id);
    set({ selectedPackage: pkg, selectedItems: defaultSelected });
  },

  toggleItem: (itemId: string) => {
    const { selectedItems, selectedPackage } = get();
    if (!selectedPackage) return;
    
    const item = selectedPackage.items.find(i => i.id === itemId);
    if (!item || !item.isOptional) return;
    
    set({
      selectedItems: selectedItems.includes(itemId)
        ? selectedItems.filter(id => id !== itemId)
        : [...selectedItems, itemId]
    });
  },

  calculateTotalPrice: () => {
    const { selectedPackage, selectedItems } = get();
    if (!selectedPackage) return 0;
    
    return selectedPackage.items
      .filter(item => !item.isOptional || selectedItems.includes(item.id))
      .reduce((sum, item) => sum + item.price, 0);
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
    const lockedAt = dayjs().toISOString();
    const lockedExpireAt = dayjs().add(15, 'minute').toISOString();
    
    set({
      lockedSlot: { ...slot, isLocked: true },
      selectedSlot: slot,
      countdown: 900,
      timeSlots: get().timeSlots.map(s => 
        s.id === slot.id ? { ...s, isLocked: true } : s
      )
    });
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

  confirmAppointment: async (user: User) => {
    const { selectedPackage, selectedItems, selectedSlot, calculateTotalPrice } = get();
    if (!selectedPackage || !selectedSlot) {
      return { success: false, message: '请选择套餐和时段', requiresApproval: false };
    }
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const totalPrice = calculateTotalPrice();
    const budgetCheck = get().validateBudget(user.departmentId);
    
    const newAppointment: Appointment = {
      id: `appt-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      packageId: selectedPackage.id,
      packageName: selectedPackage.name,
      appointmentNo: `APT-${Date.now()}`,
      appointmentDate: dayjs().format('YYYY-MM-DD'),
      appointmentTime: selectedSlot.time,
      timeSlot: selectedSlot.time,
      items: selectedPackage.items
        .filter(item => !item.isOptional || selectedItems.includes(item.id))
        .map(item => ({ id: item.id, name: item.name, price: item.price })),
      status: budgetCheck.requiresApproval ? 'pending' : 'confirmed',
      totalPrice,
      selectedItems,
      isWaived: false,
      createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      departmentId: user.departmentId,
      departmentName: user.departmentName,
    };
    
    set(state => ({
      appointments: [newAppointment, ...state.appointments],
      currentAppointment: newAppointment,
    }));
    
    get().releaseSlot();
    get().resetSelection();
    
    return { 
      success: true, 
      message: budgetCheck.requiresApproval ? '预约已提交，等待审批' : '预约成功',
      requiresApproval: budgetCheck.requiresApproval 
    };
  },

  loadUserAppointments: (userId: string) => {
    const userAppts = getAppointmentsByUserId(userId);
    set({ appointments: userAppts });
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
    });
  },
}));
