import { Appointment, TimeSlot } from '@/types';
import dayjs from 'dayjs';

const generateTimeSlots = (date: string): TimeSlot[] => {
  const times = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
  const doctors = [
    { id: 'doc-001', name: '陈医生' },
    { id: 'doc-002', name: '刘医生' },
    { id: 'doc-003', name: '王医生' },
  ];
  
  return times.map((time, index) => {
    const capacity = 10;
    const booked = Math.floor(Math.random() * 8);
    const available = capacity - booked;
    const hour = parseInt(time.split(':')[0]);
    const isRecommended = available > capacity * 0.5 && hour >= 8 && hour <= 10;
    
    return {
      id: `slot-${date}-${index}`,
      time,
      capacity,
      booked,
      available,
      doctorId: doctors[index % doctors.length].id,
      doctorName: doctors[index % doctors.length].name,
      isRecommended,
      isLocked: false,
    };
  });
};

export const getTimeSlots = (date: string): TimeSlot[] => {
  return generateTimeSlots(date);
};

export const appointments: Appointment[] = [
  {
    id: 'appt-001',
    userId: 'user-001',
    userName: '张三',
    packageId: 'pkg-001',
    packageName: '基础体检套餐A',
    appointmentNo: 'APT202401001',
    appointmentDate: dayjs().format('YYYY-MM-DD'),
    appointmentTime: '09:00',
    timeSlot: '09:00',
    items: [
      { id: 'item-001', name: '身高', price: 20 },
      { id: 'item-002', name: '体重', price: 20 },
    ],
    status: 'confirmed',
    totalPrice: 880,
    selectedItems: ['item-001', 'item-002', 'item-003', 'item-004', 'item-005', 'item-006', 'item-007', 'item-008', 'item-009', 'item-010'],
    isWaived: false,
    createdAt: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
    departmentId: 'dept-001',
    departmentName: '技术研发部',
  },
  {
    id: 'appt-002',
    userId: 'user-008',
    userName: '李四',
    packageId: 'pkg-001',
    packageName: '基础体检套餐A',
    appointmentNo: 'APT202401002',
    appointmentDate: dayjs().format('YYYY-MM-DD'),
    appointmentTime: '09:30',
    timeSlot: '09:30',
    items: [
      { id: 'item-001', name: '身高', price: 20 },
      { id: 'item-002', name: '体重', price: 20 },
    ],
    status: 'confirmed',
    totalPrice: 880,
    selectedItems: ['item-001', 'item-002', 'item-003', 'item-004', 'item-005', 'item-006', 'item-007', 'item-008', 'item-009', 'item-010'],
    isWaived: false,
    createdAt: dayjs().subtract(2, 'day').format('YYYY-MM-DD HH:mm:ss'),
    departmentId: 'dept-001',
    departmentName: '技术研发部',
  },
  {
    id: 'appt-003',
    userId: 'user-009',
    userName: '王五',
    packageId: 'pkg-002',
    packageName: '标准体检套餐B',
    appointmentNo: 'APT202401003',
    appointmentDate: dayjs().format('YYYY-MM-DD'),
    appointmentTime: '10:00',
    timeSlot: '10:00',
    items: [
      { id: 'item-101', name: '身高', price: 20 },
      { id: 'item-102', name: '体重', price: 20 },
    ],
    status: 'completed',
    totalPrice: 1960,
    selectedItems: ['item-101', 'item-102', 'item-103', 'item-104', 'item-105', 'item-106', 'item-107', 'item-108', 'item-109', 'item-110', 'item-111', 'item-112', 'item-114'],
    isWaived: false,
    createdAt: dayjs().subtract(5, 'day').format('YYYY-MM-DD HH:mm:ss'),
    departmentId: 'dept-001',
    departmentName: '技术研发部',
  },
  {
    id: 'appt-004',
    userId: 'user-010',
    userName: '赵六',
    packageId: 'pkg-004',
    packageName: '女性专属套餐',
    appointmentNo: 'APT202401004',
    appointmentDate: dayjs().format('YYYY-MM-DD'),
    appointmentTime: '14:00',
    timeSlot: '14:00',
    items: [
      { id: 'item-301', name: '身高', price: 20 },
      { id: 'item-302', name: '体重', price: 20 },
    ],
    status: 'pending',
    totalPrice: 1980,
    selectedItems: ['item-301', 'item-302', 'item-303', 'item-304', 'item-305', 'item-306', 'item-307', 'item-308', 'item-309', 'item-310', 'item-311', 'item-312', 'item-313', 'item-314', 'item-315', 'item-316', 'item-317', 'item-318', 'item-319'],
    isWaived: false,
    createdAt: dayjs().subtract(1, 'day').format('YYYY-MM-DD HH:mm:ss'),
    departmentId: 'dept-002',
    departmentName: '市场营销部',
  },
  {
    id: 'appt-005',
    userId: 'user-002',
    userName: '张经理',
    packageId: 'pkg-003',
    packageName: '精英体检套餐C',
    appointmentNo: 'APT202401005',
    appointmentDate: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    appointmentTime: '08:30',
    timeSlot: '08:30',
    items: [
      { id: 'item-201', name: '身高', price: 20 },
      { id: 'item-202', name: '体重', price: 20 },
    ],
    status: 'confirmed',
    totalPrice: 3880,
    selectedItems: ['item-201', 'item-202', 'item-203', 'item-204', 'item-205', 'item-206', 'item-207', 'item-208', 'item-209', 'item-210', 'item-211', 'item-212', 'item-214', 'item-215', 'item-216'],
    isWaived: false,
    createdAt: dayjs().subtract(4, 'day').format('YYYY-MM-DD HH:mm:ss'),
    departmentId: 'dept-001',
    departmentName: '技术研发部',
  },
  {
    id: 'appt-006',
    userId: 'user-003',
    userName: '李经理',
    packageId: 'pkg-004',
    packageName: '女性专属套餐',
    appointmentNo: 'APT202401006',
    appointmentDate: dayjs().add(2, 'day').format('YYYY-MM-DD'),
    appointmentTime: '09:00',
    timeSlot: '09:00',
    items: [
      { id: 'item-301', name: '身高', price: 20 },
      { id: 'item-302', name: '体重', price: 20 },
    ],
    status: 'confirmed',
    totalPrice: 1980,
    selectedItems: ['item-301', 'item-302', 'item-303', 'item-304', 'item-305', 'item-306', 'item-307', 'item-308', 'item-309', 'item-310', 'item-311', 'item-312', 'item-313', 'item-314', 'item-315', 'item-316', 'item-317', 'item-318', 'item-319'],
    isWaived: false,
    createdAt: dayjs().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
    departmentId: 'dept-002',
    departmentName: '市场营销部',
  },
];

export const getAppointmentsByUserId = (userId: string): Appointment[] => {
  return appointments.filter(a => a.userId === userId);
};

export const getAppointmentById = (id: string): Appointment | undefined => {
  return appointments.find(a => a.id === id);
};

export const getTodayAppointments = (): Appointment[] => {
  const today = dayjs().format('YYYY-MM-DD');
  return appointments.filter(a => a.appointmentDate === today);
};

export const getAppointmentsByDepartment = (departmentId: string): Appointment[] => {
  return appointments.filter(a => a.departmentId === departmentId);
};

export const getAppointmentsByStatus = (status: Appointment['status']): Appointment[] => {
  return appointments.filter(a => a.status === status);
};

export const getWaitlist = (date: string, time: string): string[] => {
  return ['user-004', 'user-005'];
};
