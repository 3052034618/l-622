import { Report } from '@/types';
import dayjs from 'dayjs';

export const reports: Report[] = [
  {
    id: 'report-001',
    appointmentId: 'appt-003',
    userId: 'user-009',
    userName: '王五',
    patientName: '王五',
    reportNo: 'RPT202401001',
    packageName: '标准体检套餐B',
    totalAmount: 1960,
    doctorAdvice: '1. 血压偏高，建议定期监测，必要时心内科就诊；\n2. 血脂异常，建议低脂饮食，增加运动，3个月后复查；\n3. 肝功能异常，建议戒酒，避免熬夜，1个月后复查肝功能；\n4. 轻度脂肪肝，建议控制体重，增加有氧运动。',
    verifiedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    userGender: 'male',
    userAge: 32,
    doctorId: 'user-101',
    doctorName: '陈医生',
    examDate: dayjs().format('YYYY-MM-DD'),
    status: 'abnormal',
    items: [
      { id: 'r-item-001', name: '身高', value: '175', unit: 'cm', isAbnormal: false, category: '一般检查' },
      { id: 'r-item-002', name: '体重', value: '85', unit: 'kg', isAbnormal: true, abnormalType: 'high', referenceRange: '60-78', category: '一般检查' },
      { id: 'r-item-003', name: '血压', value: '145/95', unit: 'mmHg', isAbnormal: true, abnormalType: 'high', referenceRange: '90-140/60-90', category: '一般检查' },
      { id: 'r-item-004', name: '白细胞计数', value: '6.5', unit: '10^9/L', referenceRange: '4-10', isAbnormal: false, category: '血常规' },
      { id: 'r-item-005', name: '红细胞计数', value: '5.2', unit: '10^12/L', referenceRange: '4-5.5', isAbnormal: false, category: '血常规' },
      { id: 'r-item-006', name: '血红蛋白', value: '165', unit: 'g/L', referenceRange: '120-160', isAbnormal: true, abnormalType: 'high', category: '血常规' },
      { id: 'r-item-007', name: '谷丙转氨酶', value: '68', unit: 'U/L', referenceRange: '0-40', isAbnormal: true, abnormalType: 'high', category: '肝功能' },
      { id: 'r-item-008', name: '谷草转氨酶', value: '45', unit: 'U/L', referenceRange: '0-40', isAbnormal: true, abnormalType: 'high', category: '肝功能' },
      { id: 'r-item-009', name: '总胆固醇', value: '6.2', unit: 'mmol/L', referenceRange: '<5.2', isAbnormal: true, abnormalType: 'high', category: '血脂' },
      { id: 'r-item-010', name: '甘油三酯', value: '2.8', unit: 'mmol/L', referenceRange: '<1.7', isAbnormal: true, abnormalType: 'high', category: '血脂' },
      { id: 'r-item-011', name: '空腹血糖', value: '5.8', unit: 'mmol/L', referenceRange: '3.9-6.1', isAbnormal: false, category: '血糖' },
      { id: 'r-item-012', name: '心电图', value: '窦性心律，正常心电图', isAbnormal: false, category: '辅助检查' },
      { id: 'r-item-013', name: '胸部CT', value: '双肺未见明显异常', isAbnormal: false, category: '辅助检查' },
      { id: 'r-item-014', name: '腹部B超', value: '脂肪肝（轻度）', isAbnormal: true, abnormalType: 'high', category: '辅助检查' },
      { id: 'r-item-015', name: '甲状腺B超', value: '甲状腺大小形态正常', isAbnormal: false, category: '辅助检查' },
      { id: 'r-item-016', name: 'AFP', value: '3.2', unit: 'ng/mL', referenceRange: '<8.78', isAbnormal: false, category: '肿瘤标志物' },
      { id: 'r-item-017', name: 'CEA', value: '2.1', unit: 'ng/mL', referenceRange: '<5', isAbnormal: false, category: '肿瘤标志物' },
    ],
    abnormalItems: ['体重', '血压', '血红蛋白', '谷丙转氨酶', '谷草转氨酶', '总胆固醇', '甘油三酯', '腹部B超'],
    suggestion: '1. 血压偏高，建议定期监测，必要时心内科就诊；\n2. 血脂异常，建议低脂饮食，增加运动，3个月后复查；\n3. 肝功能异常，建议戒酒，避免熬夜，1个月后复查肝功能；\n4. 轻度脂肪肝，建议控制体重，增加有氧运动。',
    createdAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  },
  {
    id: 'report-002',
    appointmentId: 'appt-007',
    userId: 'user-001',
    userName: '张三',
    patientName: '张三',
    reportNo: 'RPT202401002',
    packageName: '基础体检套餐A',
    totalAmount: 880,
    doctorAdvice: '体检结果基本正常，建议保持良好的生活习惯，定期体检。',
    verifiedAt: dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
    userGender: 'male',
    userAge: 28,
    doctorId: 'user-102',
    doctorName: '刘医生',
    examDate: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
    status: 'normal',
    items: [
      { id: 'r-item-101', name: '身高', value: '172', unit: 'cm', isAbnormal: false, category: '一般检查' },
      { id: 'r-item-102', name: '体重', value: '68', unit: 'kg', referenceRange: '58-72', isAbnormal: false, category: '一般检查' },
      { id: 'r-item-103', name: '血压', value: '120/80', unit: 'mmHg', referenceRange: '90-140/60-90', isAbnormal: false, category: '一般检查' },
      { id: 'r-item-104', name: '白细胞计数', value: '5.8', unit: '10^9/L', referenceRange: '4-10', isAbnormal: false, category: '血常规' },
      { id: 'r-item-105', name: '红细胞计数', value: '4.8', unit: '10^12/L', referenceRange: '4-5.5', isAbnormal: false, category: '血常规' },
      { id: 'r-item-106', name: '血红蛋白', value: '148', unit: 'g/L', referenceRange: '120-160', isAbnormal: false, category: '血常规' },
      { id: 'r-item-107', name: '谷丙转氨酶', value: '28', unit: 'U/L', referenceRange: '0-40', isAbnormal: false, category: '肝功能' },
      { id: 'r-item-108', name: '总胆固醇', value: '4.2', unit: 'mmol/L', referenceRange: '<5.2', isAbnormal: false, category: '血脂' },
      { id: 'r-item-109', name: '甘油三酯', value: '1.2', unit: 'mmol/L', referenceRange: '<1.7', isAbnormal: false, category: '血脂' },
      { id: 'r-item-110', name: '空腹血糖', value: '5.2', unit: 'mmol/L', referenceRange: '3.9-6.1', isAbnormal: false, category: '血糖' },
      { id: 'r-item-111', name: '心电图', value: '窦性心律，正常心电图', isAbnormal: false, category: '辅助检查' },
      { id: 'r-item-112', name: '胸部X线', value: '心肺未见明显异常', isAbnormal: false, category: '辅助检查' },
      { id: 'r-item-113', name: '腹部B超', value: '肝、胆、胰、脾、双肾未见明显异常', isAbnormal: false, category: '辅助检查' },
    ],
    abnormalItems: [],
    suggestion: '体检结果基本正常，建议保持良好的生活习惯，定期体检。',
    createdAt: dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
    updatedAt: dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
  },
];

export const getReportsByUserId = (userId: string): Report[] => {
  return reports.filter(r => r.userId === userId);
};

export const getReportById = (id: string): Report | undefined => {
  return reports.find(r => r.id === id);
};

export const getReportsByDoctorId = (doctorId: string): Report[] => {
  return reports.filter(r => r.doctorId === doctorId);
};

export const getReportsByStatus = (status: Report['status']): Report[] => {
  return reports.filter(r => r.status === status);
};

export const getPendingReports = (): Report[] => {
  return reports.filter(r => r.status === 'draft' || r.status === 'submitted');
};

export const getAbnormalReportsCount = (): number => {
  return reports.filter(r => r.status === 'abnormal').length;
};
