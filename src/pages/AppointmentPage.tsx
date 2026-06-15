import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Minus, 
  Info,
  Heart,
  Stethoscope,
  Activity,
  Sparkles,
  Lock,
  Timer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppointmentStore } from '@/store/useAppointmentStore';
import { departments } from '@/mock/data/users';
import { useCountdown } from '@/hooks/useCountdown';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Progress } from '@/components/ui/Progress';
import { Package, PackageItem, TimeSlot } from '@/types';
import { cn, formatCurrency, formatCountdown, getStatusText } from '@/utils';
import dayjs from 'dayjs';

export function AppointmentPage() {
  const { user } = useAuthStore();
  const { 
    packages, 
    selectedPackage, 
    selectedItems,
    timeSlots, 
    lockedSlot, 
    selectedDate,
    totalPrice,
    loading,
    loadPackages, 
    loadTimeSlots, 
    selectPackage, 
    toggleItem,
    setSelectedDate,
    lockSlot, 
    confirmAppointment,
    cancelLock,
    clearSelection,
    validateBudget
  } = useAppointmentStore();
  const navigate = useNavigate();

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedDateInput, setSelectedDateInput] = useState(dayjs().add(1, 'day').format('YYYY-MM-DD'));

  const { seconds, formatted, isRunning, isUrgent, start, reset } = useCountdown(900, {
    onComplete: () => {
      cancelLock();
    },
    autoStart: false,
  });

  const recommendedPackages = useMemo(() => {
    if (!user) return [];
    return packages.filter(pkg => {
      if (pkg.targetGender !== 'all' && pkg.targetGender !== user.gender) return false;
      if ((pkg.targetMinAge || pkg.minAge) && user.age < (pkg.targetMinAge || pkg.minAge)!) return false;
      if ((pkg.targetMaxAge || pkg.maxAge) && user.age > (pkg.targetMaxAge || pkg.maxAge)!) return false;
      return true;
    });
  }, [packages, user]);

  useEffect(() => {
    loadPackages();
  }, [loadPackages]);

  useEffect(() => {
    if (selectedDate) {
      loadTimeSlots(selectedDate);
    }
  }, [selectedDate, loadTimeSlots]);

  useEffect(() => {
    if (lockedSlot) {
      start();
    } else {
      reset();
    }
  }, [lockedSlot, start, reset]);

  const handleDateChange = (date: string) => {
    setSelectedDateInput(date);
    setSelectedDate(date);
    clearSelection();
  };

  const handleSelectPackage = (pkg: Package) => {
    selectPackage(pkg);
  };

  const handleSelectSlot = (slot: TimeSlot) => {
    if (slot.available <= 0) return;
    lockSlot(slot);
  };

  const handleConfirm = async () => {
    if (!user || !lockedSlot || !selectedPackage) return;

    const budgetCheck = validateBudget(user.departmentId);
    
    if (budgetCheck.requiresApproval) {
      setShowConfirmModal(true);
      return;
    }

    setSubmitting(true);
    try {
      const result = await confirmAppointment(user, selectedItems, budgetCheck);
      if (result.success) {
        setShowConfirmModal(false);
        navigate('/appointment/history');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const budgetCheck = user ? validateBudget(user.departmentId) : { withinBudget: true, exceedAmount: 0, requiresApproval: false };

  const dept = user ? departments.find(d => d.id === user.departmentId) : null;
  const budgetProgress = dept ? Math.min(100, Math.round((dept.usedBudget + totalPrice) / dept.budget * 100)) : 0;

  const handleSubmitApproval = async () => {
    if (!user || !lockedSlot || !selectedPackage) return;

    const currentBudgetCheck = validateBudget(user.departmentId);
    setSubmitting(true);
    try {
      const result = await confirmAppointment(user, selectedItems, currentBudgetCheck);
      if (result.success) {
        setShowConfirmModal(false);
        navigate('/appointment/history');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">体检预约</h1>
          <p className="text-slate-500 mt-1">选择套餐和时段，智能推荐最适合您的健康方案</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="primary" className="gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            智能推荐已为您匹配 {recommendedPackages.length} 个套餐
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-6 text-white shadow-xl shadow-primary-500/20"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium">智能推荐</span>
                </div>
                <h3 className="text-xl font-bold mb-1">为您定制的健康方案</h3>
                <p className="text-white/80 text-sm">
                  根据您的年龄({user?.age}岁)、性别({user?.gender === 'male' ? '男' : '女'})和健康档案智能匹配
                </p>
              </div>
              <Heart className="w-16 h-16 text-white/20" />
            </div>
            {recommendedPackages.length > 0 && (
              <div className="mt-4 flex gap-2">
                {recommendedPackages.map(pkg => (
                  <Badge key={pkg.id} className="bg-white/20 text-white border-0">
                    {pkg.name}
                  </Badge>
                ))}
              </div>
            )}
          </motion.div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary-500" />
              选择体检套餐
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {packages.map((pkg, index) => {
                const isRecommended = recommendedPackages.some(r => r.id === pkg.id);
                const isSelected = selectedPackage?.id === pkg.id;
                
                return (
                  <motion.div
                    key={pkg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card 
                      hover
                      className={cn(
                        'relative overflow-hidden transition-all duration-300',
                        isSelected && 'ring-2 ring-primary-500 border-primary-500'
                      )}
                      onClick={() => handleSelectPackage(pkg)}
                    >
                      {isRecommended && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="primary" className="gap-1">
                            <Sparkles className="w-3 h-3" />
                            推荐
                          </Badge>
                        </div>
                      )}
                      <CardContent className="p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-slate-900">{pkg.name}</h3>
                            <p className="text-sm text-slate-500 mt-0.5">{pkg.description}</p>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-4 h-4 text-white" />
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Activity className="w-4 h-4 text-primary-500" />
                            <span>包含 {pkg.items.filter(i => !i.isOptional).length} 项基础检查</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Users className="w-4 h-4 text-success-500" />
                            <span>{pkg.targetGender === 'all' ? '男女通用' : pkg.targetGender === 'male' ? '男性专属' : '女性专属'}</span>
                          </div>
                          {pkg.targetMinAge && (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                              <Info className="w-4 h-4 text-warning-500" />
                              <span>适用年龄: {pkg.targetMinAge}-{pkg.targetMaxAge || '不限'}岁</span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-end justify-between">
                          <div>
                            <span className="text-2xl font-bold text-primary-600">
                              {formatCurrency(pkg.basePrice)}
                            </span>
                            <span className="text-sm text-slate-400 ml-1">起</span>
                          </div>
                          <Button 
                            size="sm" 
                            variant={isSelected ? 'primary' : 'secondary'}
                            onClick={(e) => { e.stopPropagation(); handleSelectPackage(pkg); }}
                          >
                            {isSelected ? '已选择' : '选择套餐'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {selectedPackage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="overflow-hidden"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary-500" />
                    定制体检项目
                  </CardTitle>
                  <CardDescription>您可以根据需要添加或减少可选项目</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedPackage.items.map((item: PackageItem) => (
                      <div 
                        key={item.id}
                        className={cn(
                          'flex items-center justify-between p-3 rounded-lg border transition-all',
                          selectedItems.some(si => si.id === item.id)
                            ? 'border-primary-300 bg-primary-50'
                            : 'border-slate-200 bg-white',
                          !item.isOptional && 'cursor-not-allowed'
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {!item.isOptional ? (
                            <Lock className="w-4 h-4 text-slate-400" />
                          ) : (
                            <button
                              onClick={() => toggleItem(item)}
                              className={cn(
                                'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                                selectedItems.some(si => si.id === item.id)
                                  ? 'bg-primary-500 border-primary-500 text-white'
                                  : 'border-slate-300 hover:border-primary-400'
                              )}
                            >
                              {selectedItems.some(si => si.id === item.id) && (
                                <CheckCircle className="w-3 h-3" />
                              )}
                            </button>
                          )}
                          <div>
                            <p className="text-sm font-medium text-slate-900">{item.name}</p>
                            <p className="text-xs text-slate-500">{item.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold text-slate-900">{formatCurrency(item.price)}</p>
                          {!item.isOptional && (
                            <Badge variant="secondary" size="sm" className="mt-1">必选</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {selectedPackage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary-500" />
                    选择预约日期
                  </CardTitle>
                  <CardDescription>系统将根据体检中心容量和医生排班智能推荐可选时段</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Input
                        type="date"
                        label="预约日期"
                        value={selectedDateInput}
                        onChange={(e) => handleDateChange(e.target.value)}
                        min={dayjs().add(1, 'day').format('YYYY-MM-DD')}
                        max={dayjs().add(30, 'day').format('YYYY-MM-DD')}
                      />
                    </div>
                    <div className="col-span-3">
                      <p className="text-sm font-medium text-slate-700 mb-2">快速选择</p>
                      <div className="flex gap-2 flex-wrap">
                        {[1, 3, 7, 14].map(days => (
                          <Button
                            key={days}
                            variant={selectedDateInput === dayjs().add(days, 'day').format('YYYY-MM-DD') ? 'primary' : 'secondary'}
                            size="sm"
                            onClick={() => handleDateChange(dayjs().add(days, 'day').format('YYYY-MM-DD'))}
                          >
                            {days === 1 ? '明天' : `${days}天后`}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-primary-500" />
                      选择预约时段
                    </CardTitle>
                    <CardDescription>绿色为推荐时段，灰色为已满时段</CardDescription>
                  </div>
                  {lockedSlot && (
                    <div className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg',
                      isUrgent ? 'bg-danger-100 text-danger-700' : 'bg-warning-100 text-warning-700'
                    )}>
                      <Timer className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        锁定中: <span className="font-mono font-bold">{formatted}</span>
                      </span>
                    </div>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {timeSlots.map((slot) => {
                      const isLocked = lockedSlot?.id === slot.id;
                      const isFull = slot.available <= 0;
                      const isRecommended = !isFull && slot.isRecommended;
                      const remaining = slot.available;
                      
                      return (
                        <motion.button
                          key={slot.id}
                          whileHover={{ scale: isFull ? 1 : 1.02 }}
                          whileTap={{ scale: isFull ? 1 : 0.98 }}
                          onClick={() => handleSelectSlot(slot)}
                          disabled={isFull}
                          className={cn(
                            'p-3 rounded-xl border-2 text-center transition-all relative overflow-hidden',
                            isLocked && 'border-primary-500 bg-primary-50',
                            !isLocked && !isFull && isRecommended && 'border-success-300 bg-success-50 hover:border-success-400',
                            !isLocked && !isFull && !isRecommended && 'border-slate-200 bg-white hover:border-primary-300 hover:bg-primary-50',
                            isFull && 'border-slate-200 bg-slate-100 cursor-not-allowed opacity-60'
                          )}
                        >
                          <p className={cn(
                            'text-sm font-semibold',
                            isLocked && 'text-primary-700',
                            !isLocked && isRecommended && 'text-success-700',
                            !isLocked && !isRecommended && !isFull && 'text-slate-900',
                            isFull && 'text-slate-400 line-through'
                          )}>
                            {slot.time}
                          </p>
                          <div className="mt-1.5">
                            <span className={cn(
                              'text-xs font-medium',
                              remaining <= 2 ? 'text-danger-500' : remaining <= 5 ? 'text-warning-500' : 'text-success-500'
                            )}>
                              余{remaining}位
                            </span>
                          </div>
                          {isLocked && (
                            <div className="absolute top-1 right-1">
                              <Lock className="w-3 h-3 text-primary-500" />
                            </div>
                          )}
                          {isRecommended && !isLocked && (
                            <div className="absolute top-1 right-1">
                              <Sparkles className="w-3 h-3 text-success-500" />
                            </div>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>预约确认</CardTitle>
                <CardDescription>请核对您的预约信息</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedPackage ? (
                  <>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">体检套餐</span>
                        <span className="font-medium text-slate-900">{selectedPackage.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">预约日期</span>
                        <span className="font-medium text-slate-900">
                          {selectedDate ? dayjs(selectedDate).format('YYYY-MM-DD') : '未选择'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">预约时段</span>
                        <span className="font-medium text-slate-900">
                          {lockedSlot ? lockedSlot.time : '未选择'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-500">体检项目</span>
                        <span className="font-medium text-slate-900">{selectedItems.length} 项</span>
                      </div>
                    </div>

                    <div className="border-t border-slate-200 pt-4">
                      <div className="space-y-2 mb-4">
                        {selectedItems.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm">
                              <span className="text-slate-600">{item.name}</span>
                              <span className="text-slate-900">{formatCurrency(item.price)}</span>
                            </div>
                          ))}
                      </div>
                      <div className="border-t border-slate-200 pt-4">
                        <div className="flex justify-between">
                          <span className="font-semibold text-slate-900">总计</span>
                          <span className="text-2xl font-bold text-primary-600">{formatCurrency(totalPrice)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="text-slate-600">部门预算使用</span>
                          <span className={cn(
                            'font-medium',
                            budgetCheck.withinBudget ? 'text-success-600' : 'text-danger-600'
                          )}>
                            {budgetCheck.withinBudget ? '在预算内' : `超出 ${formatCurrency(budgetCheck.exceedAmount)}`}
                          </span>
                        </div>
                        <Progress 
                          value={budgetProgress} 
                          max={100} 
                          variant={budgetCheck.withinBudget ? 'success' : 'danger'}
                        />
                      </div>

                      {budgetCheck.requiresApproval && (
                        <div className="p-3 bg-warning-50 border border-warning-200 rounded-lg">
                          <div className="flex items-start gap-2">
                            <AlertCircle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-warning-800">需要审批</p>
                              <p className="text-xs text-warning-600 mt-0.5">
                                费用超出部门预算，将自动提交主管和HR经理两级审批
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">请先选择体检套餐</p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex-col gap-3">
                <Button
                  fullWidth
                  size="lg"
                  disabled={!selectedPackage || !lockedSlot}
                  loading={submitting}
                  onClick={handleConfirm}
                  className="h-12 text-base"
                >
                  {lockedSlot ? '确认预约' : '请选择时段'}
                </Button>
                {lockedSlot && (
                  <Button
                    variant="secondary"
                    fullWidth
                    onClick={() => cancelLock()}
                  >
                    取消锁定
                  </Button>
                )}
              </CardFooter>
            </Card>

            <Card className="mt-4 bg-primary-50 border-primary-100">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-primary-800">温馨提示</p>
                    <ul className="text-xs text-primary-700 mt-1 space-y-1">
                      <li>• 体检前一天请清淡饮食，避免剧烈运动</li>
                      <li>• 体检前8小时请禁食禁水</li>
                      <li>• 请携带身份证原件到场</li>
                      <li>• 女性请避开生理期</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="确认提交审批"
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
              取消
            </Button>
            <Button loading={submitting} onClick={handleSubmitApproval}>
              确认并提交审批
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-warning-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-warning-800">费用超出部门预算</p>
                <p className="text-sm text-warning-600 mt-1">
                  超出金额: <span className="font-semibold">{formatCurrency(budgetCheck.exceedAmount)}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <p className="text-slate-600">提交后将触发以下审批流程：</p>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">1</div>
              <div>
                <p className="font-medium text-slate-900">部门主管审批</p>
                <p className="text-xs text-slate-500">48小时内未处理将自动越级</p>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="w-px h-4 bg-slate-300" />
            </div>
            <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold text-sm">2</div>
              <div>
                <p className="font-medium text-slate-900">HR经理复核</p>
                <p className="text-xs text-slate-500">最终审批确认</p>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
