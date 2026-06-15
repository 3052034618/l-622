import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, AlertTriangle, AlertCircle, CheckCircle, Download, Eye, Search } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { usePermission } from '@/hooks/usePermission';
import { useReportStore } from '@/store/useReportStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { cn, formatCurrency, getStatusText } from '@/utils';
import { Report } from '@/types';
import dayjs from 'dayjs';

export function ReportListPage() {
  const { user } = useAuthStore();
  const { isEmployee, isDoctor, isHR, isAdmin } = usePermission();
  const { reports, loadUserReports, loadDoctorReports, loadAllReports, loading } = useReportStore();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (user) {
      if (isEmployee) {
        loadUserReports(user.id);
      } else if (isDoctor) {
        loadDoctorReports(user.id);
      } else if (isHR || isAdmin) {
        loadAllReports();
      }
    }
  }, [user, isEmployee, isDoctor, isHR, isAdmin, loadUserReports, loadDoctorReports, loadAllReports]);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.patientName.includes(searchTerm) || report.reportNo.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'normal': return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'abnormal': return <AlertCircle className="w-5 h-5 text-danger-500" />;
      case 'pending': return <AlertTriangle className="w-5 h-5 text-warning-500" />;
      case 'recheck_required': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      default: return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusVariant = (status: Report['status']) => {
    switch (status) {
      case 'normal': return 'success';
      case 'abnormal': return 'danger';
      case 'pending': return 'warning';
      case 'recheck_required': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">体检报告</h1>
          <p className="text-slate-500 mt-1">查看和管理体检报告</p>
        </div>
        {(isHR || isAdmin) && (
          <Button variant="secondary">
            <Download className="w-4 h-4 mr-2" />
            导出报告
          </Button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Input
          placeholder="搜索姓名或报告号"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          icon={<Search className="w-4 h-4" />}
          className="w-64"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
        >
          <option value="all">全部状态</option>
          <option value="normal">正常</option>
          <option value="abnormal">异常</option>
          <option value="pending">待审核</option>
          <option value="recheck_required">需复检</option>
        </select>
      </div>

      {(isHR || isAdmin) && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">总报告数</p>
                    <p className="text-2xl font-bold text-slate-900 mt-1">{reports.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">正常</p>
                    <p className="text-2xl font-bold text-success-600 mt-1">
                      {reports.filter(r => r.status === 'normal').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-success-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">异常</p>
                    <p className="text-2xl font-bold text-danger-600 mt-1">
                      {reports.filter(r => r.status === 'abnormal').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-danger-100 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-danger-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">待审核</p>
                    <p className="text-2xl font-bold text-warning-600 mt-1">
                      {reports.filter(r => r.status === 'pending').length}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-warning-500" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredReports.map((report, index) => (
          <motion.div
            key={report.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card hover>
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{report.patientName}</h3>
                    <p className="text-sm text-slate-500">报告号: {report.reportNo}</p>
                  </div>
                  <Badge variant={getStatusVariant(report.status) as any} className="gap-1">
                    {getStatusIcon(report.status)}
                    {getStatusText(report.status)}
                  </Badge>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span>体检日期: {dayjs(report.examDate).format('YYYY-MM-DD')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <FileText className="w-4 h-4 text-slate-400" />
                    <span>套餐: {report.packageName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle className="w-4 h-4 text-slate-400" />
                    <span>检查项目: {report.items.length} 项</span>
                  </div>
                  {report.abnormalItems.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-danger-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span>异常指标: {report.abnormalItems.length} 项</span>
                    </div>
                  )}
                  {(report.status === 'abnormal' || report.status === 'recheck_required') && (
                    <div className="flex items-center gap-2 text-xs text-danger-600">
                      <AlertCircle className="w-3 h-3" />
                      <span>有异常指标，请关注复检安排</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <span className="text-sm text-slate-500">
                    医生: {report.doctorName}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => setSelectedReport(report)}
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    查看报告
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Modal
        isOpen={!!selectedReport}
        onClose={() => setSelectedReport(null)}
        title="体检报告详情"
        size="xl"
      >
        {selectedReport && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">报告号</p>
                <p className="font-semibold text-sm text-slate-900">{selectedReport.reportNo}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">体检日期</p>
                <p className="font-semibold text-sm text-slate-900">
                  {dayjs(selectedReport.examDate).format('YYYY-MM-DD')}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">总费用</p>
                <p className="font-semibold text-sm text-primary-600">
                  {formatCurrency(selectedReport.totalAmount)}
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-xs text-slate-500">状态</p>
                <Badge variant={getStatusVariant(selectedReport.status) as any} size="sm">
                  {getStatusText(selectedReport.status)}
                </Badge>
              </div>
            </div>

            {selectedReport.abnormalItems.length > 0 && (
              <div className="p-4 bg-danger-50 border border-danger-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-danger-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-danger-800">异常提醒</p>
                    <p className="text-sm text-danger-600 mt-1">
                      本次体检发现 {selectedReport.abnormalItems.length} 项异常指标，请关注医生建议
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h4 className="font-semibold text-slate-900 mb-3">检查项目详情</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedReport.items.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      'p-3 rounded-lg border',
                      item.isAbnormal
                        ? 'border-danger-200 bg-danger-50'
                        : 'border-slate-200 bg-white'
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{item.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.category}</p>
                      </div>
                      {item.isAbnormal && (
                        <Badge variant="danger" size="sm">异常</Badge>
                      )}
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">结果</span>
                        <span className={cn(
                          'font-medium',
                          item.isAbnormal ? 'text-danger-600' : 'text-slate-900'
                        )}>
                          {item.value} {item.unit}
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">参考范围</span>
                        <span className="text-slate-600">{item.referenceRange}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-lg">
              <h4 className="font-semibold text-slate-900 mb-2">医生建议</h4>
              <p className="text-sm text-slate-600">{selectedReport.doctorAdvice}</p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-200">
              <div>
                <p className="text-sm text-slate-500">主治医生</p>
                <p className="font-medium text-slate-900">{selectedReport.doctorName}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-500">审核日期</p>
                <p className="font-medium text-slate-900">
                  {dayjs(selectedReport.verifiedAt).format('YYYY-MM-DD HH:mm')}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
