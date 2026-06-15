import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Save, 
  CheckCircle, 
  AlertTriangle,
  User,
  Calendar,
  ClipboardList,
  Send,
  X
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useReportStore } from '@/store/useReportStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { cn, getStatusColor, formatCurrency } from '@/utils';
import { ReportItem } from '@/types';
import { appointments } from '@/mock/data/appointments';
import dayjs from 'dayjs';

export function ReportEntryPage() {
  const { user } = useAuthStore();
  const { 
    currentReport, 
    createDraft, 
    updateReportItem, 
    updateDoctorAdvice,
    validateReport,
    submitReport,
    clearDraft,
    validationErrors
  } = useReportStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const todayAppointments = appointments.filter(a => 
    a.status === 'confirmed' && 
    dayjs(a.appointmentDate).format('YYYY-MM-DD') === dayjs().format('YYYY-MM-DD')
  );

  const filteredAppointments = todayAppointments.filter(apt =>
    apt.userName.includes(searchTerm) || apt.appointmentNo.includes(searchTerm)
  );

  const handleSelectAppointment = (apt: any) => {
    setSelectedAppointment(apt);
    createDraft(apt, user!);
  };

  const handleItemChange = (itemId: string, field: keyof ReportItem, value: any) => {
    updateReportItem(itemId, field, value);
  };

  const handleSubmit = async () => {
    if (!currentReport) return;
    
    const validation = validateReport();
    if (!validation.valid) {
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmSubmit = async () => {
    if (!currentReport) return;
    
    setSubmitting(true);
    try {
      const result = await submitReport();
      if (result.success) {
        setShowConfirmModal(false);
        setSelectedAppointment(null);
        clearDraft();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getAbnormalCount = () => {
    return currentReport?.items.filter(item => item.isAbnormal).length || 0;
  };

  const getMissingCount = () => {
    return currentReport?.items.filter(item => !item.value).length || 0;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">报告录入</h1>
          <p className="text-slate-500 mt-1">录入今日体检人员的检查结果</p>
        </div>
        <Badge variant="primary">
          今日待录入: {todayAppointments.length} 人
        </Badge>
      </div>

      {!selectedAppointment ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary-500" />
                今日体检人员
              </CardTitle>
              <CardDescription>选择需要录入报告的体检人员</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Input
                  placeholder="搜索姓名或预约号"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-4 h-4" />}
                  className="w-full max-w-md"
                />
              </div>

              {filteredAppointments.length === 0 ? (
                <div className="text-center py-12">
                  <User className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500">今日暂无待录入报告的体检人员</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAppointments.map((apt, index) => (
                    <motion.div
                      key={apt.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Card hover onClick={() => handleSelectAppointment(apt)}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-lg font-semibold text-primary-600">
                                {apt.userName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900">{apt.userName}</h3>
                              <p className="text-sm text-slate-500">{apt.packageName}</p>
                            </div>
                          </div>
                          <div className="space-y-1 text-sm text-slate-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5" />
                              <span>{apt.timeSlot}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <ClipboardList className="w-3.5 h-3.5" />
                              <span>{apt.items.length} 项检查</span>
                            </div>
                          </div>
                          <Button fullWidth size="sm" className="mt-3">
                            开始录入
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary-500" />
                      体检人员信息
                    </CardTitle>
                    <CardDescription>
                      预约号: {selectedAppointment.appointmentNo}
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => { setSelectedAppointment(null); clearDraft(); }}
                  >
                    <X className="w-4 h-4 mr-1" />
                    关闭
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">姓名</p>
                      <p className="font-semibold text-slate-900">{selectedAppointment.userName}</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">性别</p>
                      <p className="font-semibold text-slate-900">
                        {selectedAppointment.userGender === 'male' ? '男' : '女'}
                      </p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">年龄</p>
                      <p className="font-semibold text-slate-900">{selectedAppointment.userAge}岁</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-xs text-slate-500">部门</p>
                      <p className="font-semibold text-slate-900">{selectedAppointment.userDept}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {currentReport && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <ClipboardList className="w-5 h-5 text-primary-500" />
                          检查项目录入
                        </CardTitle>
                        <CardDescription>
                          请逐项填写检查结果，系统将自动校验异常指标
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-3">
                        {getMissingCount() > 0 && (
                          <Badge variant="warning" className="gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {getMissingCount()} 项未填
                          </Badge>
                        )}
                        {getAbnormalCount() > 0 && (
                          <Badge variant="danger" className="gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {getAbnormalCount()} 项异常
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {validationErrors.length > 0 && (
                      <div className="mb-4 p-4 bg-danger-50 border border-danger-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium text-danger-800">请修正以下问题</p>
                            <ul className="text-sm text-danger-600 mt-1 space-y-1">
                              {validationErrors.map((error, i) => (
                                <li key={i}>• {error}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      {['一般检查', '实验室检查', '影像学检查', '专科检查'].map(category => {
                        const categoryItems = currentReport.items.filter(item => item.category === category);
                        if (categoryItems.length === 0) return null;

                        return (
                          <div key={category}>
                            <h4 className="text-sm font-semibold text-slate-700 mb-3 pb-2 border-b border-slate-200">
                              {category}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {categoryItems.map((item) => (
                                <div
                                  key={item.id}
                                  className={cn(
                                    'p-3 rounded-lg border transition-all',
                                    item.isAbnormal
                                      ? 'border-danger-200 bg-danger-50'
                                      : item.value
                                        ? 'border-success-200 bg-success-50'
                                        : 'border-slate-200 bg-white'
                                  )}
                                >
                                  <div className="flex items-start justify-between mb-2">
                                    <div>
                                      <p className="font-medium text-sm text-slate-900">{item.name}</p>
                                      <p className="text-xs text-slate-500">参考范围: {item.referenceRange} {item.unit}</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <label className="flex items-center gap-1 text-xs text-slate-600">
                                        <input
                                          type="checkbox"
                                          checked={item.isAbnormal || false}
                                          onChange={(e) => handleItemChange(item.id, 'isAbnormal', e.target.checked)}
                                          className="w-3.5 h-3.5 rounded border-slate-300 text-primary-500 focus:ring-primary-500"
                                        />
                                        异常
                                      </label>
                                    </div>
                                  </div>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      placeholder="检查结果"
                                      value={item.value || ''}
                                      onChange={(e) => handleItemChange(item.id, 'value', e.target.value)}
                                      className={cn(
                                        'flex-1 px-3 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary-500',
                                        item.isAbnormal
                                          ? 'border-danger-300 focus:ring-danger-500'
                                          : 'border-slate-300'
                                      )}
                                    />
                                    <span className="px-2 py-2 text-sm text-slate-500 bg-slate-100 rounded-lg min-w-[60px] text-center">
                                      {item.unit}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
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
              className="sticky top-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>录入进度</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600">已完成项目</span>
                      <span className="font-semibold text-slate-900">
                        {currentReport?.items.filter(i => i.value).length || 0} / {currentReport?.items.length || 0}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ 
                          width: `${((currentReport?.items.filter(i => i.value).length || 0) / (currentReport?.items.length || 1)) * 100}%` 
                        }}
                        className="h-full bg-primary-500 rounded-full"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-success-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-success-600">
                        {currentReport?.items.filter(i => i.value && !i.isAbnormal).length || 0}
                      </p>
                      <p className="text-xs text-success-600">正常</p>
                    </div>
                    <div className="p-3 bg-danger-50 rounded-lg text-center">
                      <p className="text-2xl font-bold text-danger-600">{getAbnormalCount()}</p>
                      <p className="text-xs text-danger-600">异常</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      医生建议
                    </label>
                    <textarea
                      value={currentReport?.doctorAdvice || ''}
                      onChange={(e) => updateDoctorAdvice(e.target.value)}
                      placeholder="请输入医生建议和健康指导..."
                      rows={6}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                    />
                  </div>

                  <div className="p-3 bg-primary-50 border border-primary-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-primary-800">系统提示</p>
                        <ul className="text-xs text-primary-700 mt-1 space-y-0.5">
                          <li>• 请确保所有项目均已填写</li>
                          <li>• 异常项目请勾选并标注</li>
                          <li>• 提交后将自动推送至员工端</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  <Button
                    fullWidth
                    size="lg"
                    onClick={handleSubmit}
                    disabled={getMissingCount() > 0}
                    className="h-12"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    提交报告
                  </Button>
                  <Button
                    fullWidth
                    variant="secondary"
                    onClick={() => { setSelectedAppointment(null); clearDraft(); }}
                  >
                    取消录入
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      )}

      <Modal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="确认提交报告"
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
              取消
            </Button>
            <Button loading={submitting} onClick={handleConfirmSubmit}>
              确认提交
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="p-4 bg-warning-50 border border-warning-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-warning-500 flex-shrink-0" />
              <div>
                <p className="font-medium text-warning-800">请确认报告信息</p>
                <p className="text-sm text-warning-600 mt-1">
                  提交后报告将自动推送至员工端，异常报告将触发复检通知
                </p>
              </div>
            </div>
          </div>

          {currentReport && (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">体检人员</span>
                <span className="font-medium text-slate-900">{selectedAppointment.userName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">检查项目</span>
                <span className="font-medium text-slate-900">{currentReport.items.length} 项</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">正常项目</span>
                <span className="font-medium text-success-600">
                  {currentReport.items.filter(i => !i.isAbnormal && i.value).length} 项
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">异常项目</span>
                <span className="font-medium text-danger-600">{getAbnormalCount()} 项</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">总费用</span>
                <span className="font-medium text-primary-600">
                  {formatCurrency(currentReport.totalAmount)}
                </span>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
