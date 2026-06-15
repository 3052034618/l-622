import { Package } from '@/types';

export const packages: Package[] = [
  {
    id: 'pkg-001',
    name: '基础体检套餐A',
    description: '适合20-35岁年轻员工，包含常规检查项目，全面了解身体基本状况。',
    basePrice: 880,
    targetGender: 'all',
    minAge: 18,
    maxAge: 35,
    isRecommended: true,
    isPopular: true,
    items: [
      { id: 'item-001', name: '一般检查', description: '身高、体重、血压、脉搏', price: 50, isOptional: false, selected: true, category: '基础检查' },
      { id: 'item-002', name: '血常规', description: '红细胞、白细胞、血小板等24项', price: 80, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-003', name: '尿常规', description: '尿蛋白、尿糖、尿潜血等12项', price: 40, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-004', name: '肝功能', description: '谷丙转氨酶、谷草转氨酶等8项', price: 120, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-005', name: '肾功能', description: '肌酐、尿素氮、尿酸等3项', price: 60, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-006', name: '血脂', description: '总胆固醇、甘油三酯等4项', price: 80, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-007', name: '血糖', description: '空腹血糖', price: 30, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-008', name: '心电图', description: '12导联心电图', price: 60, isOptional: false, selected: true, category: '辅助检查' },
      { id: 'item-009', name: '胸部X线', description: '胸部正位片', price: 120, isOptional: false, selected: true, category: '辅助检查' },
      { id: 'item-010', name: '腹部B超', description: '肝、胆、胰、脾、双肾', price: 120, isOptional: false, selected: true, category: '辅助检查' },
      { id: 'item-011', name: '甲状腺B超', description: '甲状腺形态及结构检查', price: 120, isOptional: true, selected: false, category: '辅助检查' },
      { id: 'item-012', name: '肿瘤标志物', description: 'AFP、CEA两项', price: 150, isOptional: true, selected: false, category: '实验室检查' },
    ],
  },
  {
    id: 'pkg-002',
    name: '标准体检套餐B',
    description: '适合35-50岁中年员工，增加肿瘤筛查和心血管检查，关注慢性病预防。',
    basePrice: 1680,
    targetGender: 'all',
    minAge: 35,
    maxAge: 50,
    targetMinAge: 35,
    targetMaxAge: 50,
    isRecommended: true,
    isPopular: true,
    items: [
      { id: 'item-101', name: '一般检查', description: '身高、体重、血压、脉搏、体脂率', price: 80, isOptional: false, selected: true, category: '基础检查' },
      { id: 'item-102', name: '血常规', description: '红细胞、白细胞、血小板等24项', price: 80, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-103', name: '尿常规', description: '尿蛋白、尿糖、尿潜血等12项', price: 40, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-104', name: '肝功能全套', description: '谷丙转氨酶、谷草转氨酶等12项', price: 180, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-105', name: '肾功能', description: '肌酐、尿素氮、尿酸等3项', price: 60, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-106', name: '血脂全套', description: '总胆固醇、甘油三酯等6项', price: 120, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-107', name: '血糖', description: '空腹血糖、糖化血红蛋白', price: 80, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-108', name: '心电图', description: '12导联心电图', price: 60, isOptional: false, selected: true, category: '辅助检查' },
      { id: 'item-109', name: '胸部CT', description: '胸部低剂量CT平扫', price: 380, isOptional: false, selected: true, category: '辅助检查' },
      { id: 'item-110', name: '腹部B超', description: '肝、胆、胰、脾、双肾', price: 120, isOptional: false, selected: true, category: '辅助检查' },
      { id: 'item-111', name: '甲状腺B超', description: '甲状腺形态及结构检查', price: 120, isOptional: false, selected: true, category: '辅助检查' },
      { id: 'item-112', name: '前列腺B超', description: '前列腺形态及结构检查（男）', price: 80, isOptional: true, selected: false, category: '辅助检查' },
      { id: 'item-113', name: '妇科B超', description: '子宫附件检查（女）', price: 100, isOptional: true, selected: false, category: '辅助检查' },
      { id: 'item-114', name: '肿瘤标志物筛查', description: 'AFP、CEA、CA199、CA125等6项', price: 380, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-115', name: '心脏彩超', description: '心脏结构及功能检查', price: 280, isOptional: true, selected: false, category: '辅助检查' },
      { id: 'item-116', name: '骨密度检测', description: '双能X线骨密度测定', price: 180, isOptional: true, selected: false, category: '辅助检查' },
    ],
  },
  {
    id: 'pkg-003',
    name: '精英体检套餐C',
    description: '适合50岁以上员工及管理层，深度健康检查，包含心脑血管和肿瘤深度筛查。',
    basePrice: 3280,
    targetGender: 'all',
    minAge: 45,
    maxAge: 80,
    isRecommended: false,
    isPopular: false,
    items: [
      { id: 'item-201', name: '一般检查', description: '身高、体重、血压、脉搏、体脂率、动脉硬化检测', price: 150, isOptional: false, selected: true, category: '基础检查' },
      { id: 'item-202', name: '血常规', description: '红细胞、白细胞、血小板等24项', price: 80, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-203', name: '尿常规', description: '尿蛋白、尿糖、尿潜血等12项', price: 40, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-204', name: '肝功能全套', description: '谷丙转氨酶、谷草转氨酶等15项', price: 220, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-205', name: '肾功能全套', description: '肌酐、尿素氮、尿酸等6项', price: 120, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-206', name: '血脂全套', description: '总胆固醇、甘油三酯等8项', price: 150, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-207', name: '血糖全套', description: '空腹血糖、糖化血红蛋白、胰岛素释放', price: 180, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-208', name: '甲状腺功能', description: 'TSH、FT3、FT4等5项', price: 200, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-209', name: '心电图', description: '12导联心电图', price: 60, isOptional: false, selected: true, category: '辅助检查' },
      { id: 'item-210', name: '胸部CT', description: '胸部低剂量CT平扫', price: 380, isOptional: false, selected: true, category: '辅助检查' },
      { id: 'item-211', name: '腹部彩超', description: '肝、胆、胰、脾、双肾、甲状腺、颈动脉', price: 380, isOptional: false, selected: true, category: '辅助检查' },
      { id: 'item-212', name: '心脏彩超', description: '心脏结构及功能检查', price: 280, isOptional: false, selected: true, category: '辅助检查' },
      { id: 'item-213', name: '头颅CT', description: '头颅CT平扫', price: 480, isOptional: true, selected: false, category: '辅助检查' },
      { id: 'item-214', name: '肿瘤标志物全套', description: 'AFP、CEA、CA199、CA125、CA153、PSA等12项', price: 680, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-215', name: '骨密度检测', description: '双能X线骨密度测定', price: 180, isOptional: false, selected: true, category: '辅助检查' },
      { id: 'item-216', name: 'C14呼气试验', description: '幽门螺杆菌检测', price: 120, isOptional: true, selected: true, category: '实验室检查' },
    ],
  },
  {
    id: 'pkg-004',
    name: '女性专属套餐',
    description: '专为女性设计，包含妇科检查、乳腺筛查、HPV检测等女性专属项目。',
    basePrice: 1980,
    targetGender: 'female',
    minAge: 25,
    maxAge: 65,
    targetMinAge: 25,
    targetMaxAge: 65,
    isRecommended: true,
    isPopular: true,
    items: [
      { id: 'item-301', name: '一般检查', description: '身高、体重、血压、脉搏、体脂率', price: 80, isOptional: false, selected: true, category: '基础检查' },
      { id: 'item-302', name: '血常规', description: '红细胞、白细胞、血小板等24项', price: 80, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-303', name: '尿常规', description: '尿蛋白、尿糖、尿潜血等12项', price: 40, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-304', name: '肝功能', description: '谷丙转氨酶、谷草转氨酶等8项', price: 120, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-305', name: '肾功能', description: '肌酐、尿素氮、尿酸等3项', price: 60, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-306', name: '血脂', description: '总胆固醇、甘油三酯等4项', price: 80, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-307', name: '血糖', description: '空腹血糖', price: 30, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-308', name: '甲状腺功能', description: 'TSH、FT3、FT4等3项', price: 150, isOptional: false, selected: true, category: '实验室检查' },
      { id: 'item-309', name: '心电图', description: '12导联心电图', price: 60, isOptional: false, selected: true, category: '辅助检查' },
      { id: 'item-310', name: '胸部X线', description: '胸部正位片', price: 120, isOptional: false, selected: true, category: '辅助检查' },
      { id: 'item-311', name: '腹部B超', description: '肝、胆、胰、脾、双肾', price: 120, isOptional: false, selected: true, category: '辅助检查' },
      { id: 'item-312', name: '甲状腺B超', description: '甲状腺形态及结构检查', price: 120, isOptional: false, selected: true, category: '辅助检查' },
      { id: 'item-313', name: '妇科检查', description: '外阴、阴道、宫颈、子宫附件检查', price: 80, isOptional: false, selected: true, category: '妇科检查' },
      { id: 'item-314', name: '白带常规', description: '阴道清洁度、霉菌、滴虫检查', price: 40, isOptional: false, selected: true, category: '妇科检查' },
      { id: 'item-315', name: 'TCT检查', description: '液基薄层细胞学检测', price: 180, isOptional: false, selected: true, category: '妇科检查' },
      { id: 'item-316', name: 'HPV检测', description: '人乳头瘤病毒分型检测', price: 280, isOptional: false, selected: true, category: '妇科检查' },
      { id: 'item-317', name: '乳腺彩超', description: '乳腺形态及结构检查', price: 180, isOptional: false, selected: true, category: '妇科检查' },
      { id: 'item-318', name: '妇科彩超', description: '子宫附件检查', price: 100, isOptional: false, selected: true, category: '妇科检查' },
      { id: 'item-319', name: '肿瘤标志物（女性）', description: 'AFP、CEA、CA125、CA153等5项', price: 280, isOptional: false, selected: true, category: '实验室检查' },
    ],
  },
];

export const getRecommendedPackages = (age: number, gender: 'male' | 'female'): Package[] => {
  return packages.filter(pkg => {
    const genderMatch = !pkg.targetGender || pkg.targetGender === 'all' || pkg.targetGender === gender;
    const ageMatch = (!pkg.minAge || age >= pkg.minAge) && (!pkg.maxAge || age <= pkg.maxAge);
    return genderMatch && ageMatch;
  }).sort((a, b) => {
    if (b.isRecommended !== a.isRecommended) return b.isRecommended ? 1 : -1;
    if (b.isPopular !== a.isPopular) return b.isPopular ? 1 : -1;
    return 0;
  });
};

export const getPackageById = (id: string): Package | undefined => {
  return packages.find(pkg => pkg.id === id);
};
