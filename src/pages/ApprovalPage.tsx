import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ArrowUpCircle,
  User,
  Calendar,
  FileText,
  DollarSign,
  ChevronRight,
  MessageSquare,
  Clock as ClockIcon
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useApprovalStore } from '@/store/useApprovalStore';
import { usePermission } from '@/hooks/usePermission';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn, formatCurrency, getStatusText } from '@/utils';
import { Approval } from '@/types';
import dayjs from 'dayjs';

export function ApprovalPage() {
  const { user } = useAuthStore();
  const { isHR, isAdmin } = usePermission();
  const { 
    approvals, 
    loadApprovals, 
    loadAllApprovals,
    pendingCount,
    approveApproval, 
    rejectApproval, 
    checkAndEscalate 
  } = useApprovalStore();
  
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [comment, setComment] = useState('');
  const [processing, setProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'escalated'>('pending');

  useEffect(() => {
    if (user) {
      if (isAdmin) {
        loadAllApprovals();
      } else {
        loadApprovals(user.id);
      }
      checkAndEscalate();
    }
  }, [user, isAdmin, loadApprovals, loadAllApprovals, checkAndEscalate]);

  const filteredApprovals = approvals.filter(a => {
    if (activeTab === 'all') return true;
    if (activeTab === 'pending') return a.status === 'pending';
    if (activeTab === 'approved') return a.status === 'approved';
    if (activeTab === 'rejected') return a.status === 'rejected';
    if (activeTab === 'escalated') return a.escalated;
    return true;
  });

  const handleAction = (approval: Approval, action: 'approve' | 'reject') => {
    setSelectedApproval(approval);
    setActionType(action);
    setShowModal(true);
    setComment('');
  };

  const handleConfirmAction = async () => {
    if (!selectedApproval || !actionType) return;
    
    setProcessing(true);
    try {
      if (actionType === 'approve') {
        await approveApproval(selectedApproval.id, user!.id, comment);
      } else {
        await rejectApproval(selectedApproval.id, user!.id, comment);
      }
      setShowModal(false);
      setSelectedApproval(null);
    } finally {
      setProcessing(false);
    }
  };

  const getStatusColor = (status: Approval['status']) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  };

  const getTimeRemaining = (approval: Approval) => {
    const now = dayjs();
    const createdAt = dayjs(approval.createdAt);
    const hoursPassed = now.diff(createdAt, 'hour');
    const remaining = 48 - hoursPassed;
    
    if (remaining <= 0) return { text: '已超时', urgent: true };
    if (remaining <= 12) return { text: `剩余 ${remaining} 小时`, urgent: true };
    return { text: `剩余 ${remaining} 小时`, urgent: false };
  };

  const stats = [
    { label: '待审批', value: approvals.filter(a => a.status === 'pending').length, color: 'warning', icon: Clock },
    { label: '已通过', value: approvals.filter(a => a.status === 'approved').length, color: 'success', icon: CheckCircle },
    { label: '已驳回', value: approvals.filter(a => a.status === 'rejected').length, color: 'danger', icon: XCircle },
    { label: '已越级', value: approvals.filter(a => a.escalated).length, color: 'primary', icon: ArrowUpCircle },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">费用审批</h1>
          <p className="text-slate-500 mt-1">处理超出部门预算的体检费用审批</p>
        </div>
        <Badge variant="warning" className="gap-1">
          <Clock className="w-3.5 h-3.5" />
          {pendingCount} 条待处理
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">{stat.label}</p>
                    <p className={cn(
                      'text-2xl font-bold mt-1',
                      stat.color === 'warning' && 'text-warning-600',
                      stat.color === 'success' && 'text-success-600',
                      stat.color === 'danger' && 'text-danger-600',
                      stat.color === 'primary' && 'text-primary-600'
                    )}>
                      {stat.value}
                    </p>
                  </div>
                  <div className={cn(
                    'w-12 h-12 rounded-xl flex items-center justify-center',
                    stat.color === 'warning' && 'bg-warning-100',
                    stat.color === 'success' && 'bg-success-100',
                    stat.color === 'danger' && 'bg-danger-100',
                    stat.color === 'primary' && 'bg-primary-100'
                  )}>
                    <stat.icon className={cn(
                      'w-6 h-6',
                      stat.color === 'warning' && 'text-warning-500',
                      stat.color === 'success' && 'text-success-500',
                      stat.color === 'danger' && 'text-danger-500',
                      stat.color === 'primary' && 'text-primary-500'
                    )} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="flex gap-2 border-b border-slate-200">
        {(['all', 'pending', 'approved', 'rejected', 'escalated'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors',
              activeTab === tab
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            )}
          >
            {tab === 'all' && '所有'}
            {tab === 'pending' && '待我审批'}
            {tab === 'approved' && '已通过'}
            {tab === 'rejected' && '已驳回'}
            {tab === 'escalated' && '已越级'}
          </button>
        ))}
      </div>

      <Card>
        <CardContent className="p-0">
          {filteredApprovals.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">暂无{activeTab === 'all' ? '' : activeTab === 'pending' ? '待处理' : activeTab === 'approved' ? '已通过' : activeTab === 'rejected' ? '已驳回' : '已越级'}的审批</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredApprovals.map((approval, index) => {
                const timeInfo = getTimeRemaining(approval);
                
                return (
                  <motion.div
                    key={approval.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        'w-12 h-12 rounded-full flex items-center justify-center',
                        approval.status === 'pending' ? 'bg-warning-100' : 
                        approval.status === 'approved' ? 'bg-success-100' : 'bg-danger-100'
                      )}>
                        <User className={cn(
                          'w-6 h-6',
                          approval.status === 'pending' ? 'text-warning-500' : 
                          approval.status === 'approved' ? 'text-success-500' : 'text-danger-500'
                        )} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-slate-900">{approval.applicantName}</h3>
                          <Badge variant={getStatusColor(approval.status) as any} size="sm">
                            {getStatusText(approval.status)}
                          </Badge>
                          {approval.escalated && (
                            <Badge variant="danger" size="sm" className="gap-1 bg-danger-50 text-danger-700 border-danger-200">
                              <ArrowUpCircle className="w-3 h-3" />
                              已越级
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-slate-500 mt-0.5">
                          {approval.packageName} · {approval.itemCount} 项检查
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-600 flex-wrap">
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5" />
                            申请金额: <span className="font-medium text-danger-600">{formatCurrency(approval.amount)}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <DollarSign className="w-3.5 h-3.5" />
                            超出预算: <span className="font-medium text-warning-600">{formatCurrency(approval.exceedAmount)}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {dayjs(approval.createdAt).format('YYYY-MM-DD HH:mm')}
                          </span>
                          <span className="flex items-center gap-1">
                            <User className="w-3.5 h-3.5" />
                            {approval.escalated
                              ? `${approval.approverName}（${approval.level === 'hr_manager' ? 'HR经理复核' : '主管审批'}）`
                              : `${approval.approverName}（${approval.level === 'hr_manager' ? 'HR经理' : '主管'}）`
                            }
                          </span>
                        </div>
                        {approval.status === 'pending' && (
                          <div className="mt-2">
                            <span className={cn(
                              'text-xs font-medium flex items-center gap-1',
                              timeInfo.urgent ? 'text-danger-600' : 'text-slate-500'
                            )}>
                              <ClockIcon className="w-3 h-3" />
                              {timeInfo.text}
                            </span>
                          </div>
                        )}
                        {approval.escalated && approval.escalationReason && (
                          <div className="mt-2 p-2 bg-danger-50 border border-danger-200 rounded-lg">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-danger-500 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-danger-700">{approval.escalationReason}</p>
                            </div>
                          </div>
                        )}
                        {(approval.status === 'approved' || approval.status === 'rejected') && approval.comment && (
                          <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-lg">
                            <div className="flex items-start gap-2">
                              <MessageSquare className={cn(
                                'w-4 h-4 flex-shrink-0 mt-0.5',
                                approval.status === 'approved' ? 'text-success-500' : 'text-danger-500'
                              )} />
                              <div>
                                <p className={cn(
                                  'text-xs font-medium',
                                  approval.status === 'approved' ? 'text-success-700' : 'text-danger-700'
                                )}>
                                  {approval.status === 'approved' ? '通过意见' : '驳回原因'}
                                </p>
                                <p className="text-xs text-slate-600 mt-0.5">{approval.comment}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {approval.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={() => handleAction(approval, 'reject')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              驳回
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleAction(approval, 'approve')}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              通过
                            </Button>
                          </>
                        )}
                        <ChevronRight className="w-5 h-5 text-slate-400" />
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="p-4 bg-primary-50 border border-primary-200 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-primary-800">审批规则说明</p>
            <ul className="text-sm text-primary-700 mt-1 space-y-1">
              <li>• 套餐费用超出部门预算时，自动触发主管和HR经理两级审批</li>
              <li>• 每级审批有48小时处理时间，超时未处理自动越级至下一级</li>
              <li>• 审批通过后，预约自动生效并通知员工</li>
              <li>• 审批驳回后，需通知员工重新选择套餐</li>
            </ul>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setSelectedApproval(null); setActionType(null); }}
        title={actionType === 'approve' ? '确认通过审批' : '确认驳回审批'}
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => { setShowModal(false); setSelectedApproval(null); setActionType(null); }}>
              取消
            </Button>
            <Button
              variant={actionType === 'approve' ? 'primary' : 'danger'}
              loading={processing}
              onClick={handleConfirmAction}
            >
              {actionType === 'approve' ? '确认通过' : '确认驳回'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {selectedApproval && (
            <>
              <div className={cn(
                'p-4 rounded-lg',
                actionType === 'approve' ? 'bg-success-50 border border-success-200' : 'bg-danger-50 border border-danger-200'
              )}>
                <div className="flex items-start gap-3">
                  {actionType === 'approve' ? (
                    <CheckCircle className="w-6 h-6 text-success-500 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-danger-500 flex-shrink-0" />
                  )}
                  <div>
                    <p className={cn(
                      'font-medium',
                      actionType === 'approve' ? 'text-success-800' : 'text-danger-800'
                    )}>
                      {actionType === 'approve' 
                        ? `确认通过 ${selectedApproval.applicantName} 的审批申请？`
                        : `确认驳回 ${selectedApproval.applicantName} 的审批申请？`
                      }
                    </p>
                    <p className={cn(
                      'text-sm mt-1',
                      actionType === 'approve' ? 'text-success-600' : 'text-danger-600'
                    )}>
                      申请金额: {formatCurrency(selectedApproval.amount)}，
                      超出预算: {formatCurrency(selectedApproval.exceedAmount)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  审批意见 {actionType === 'reject' && <span className="text-danger-500">*</span>}
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={actionType === 'approve' ? '请输入审批意见（可选）' : '请输入驳回原因（必填）'}
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">申请人</span>
                  <span className="font-medium text-slate-900">{selectedApproval.applicantName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">部门</span>
                  <span className="font-medium text-slate-900">{selectedApproval.departmentName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">体检套餐</span>
                  <span className="font-medium text-slate-900">{selectedApproval.packageName}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">申请时间</span>
                  <span className="font-medium text-slate-900">
                    {dayjs(selectedApproval.createdAt).format('YYYY-MM-DD HH:mm')}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
}
