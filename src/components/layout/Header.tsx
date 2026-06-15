import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, RefreshCw, Users, Filter, ChevronDown, Calendar } from 'lucide-react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useAuthStore } from '@/store/useAuthStore';
import { usePermission } from '@/hooks/usePermission';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import dayjs from 'dayjs';
import { cn } from '@/utils';

export function Header() {
  const { filters, setFilters, refreshData, isLoading, departments, packages } = useDashboardStore();
  const { user } = useAuthStore();
  const { isHR, isAdmin } = usePermission();
  const [showFilters, setShowFilters] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, type: 'info', message: '您有3个预约即将到期', time: '5分钟前' },
    { id: 2, type: 'success', message: '体检报告已审核通过', time: '1小时前' },
    { id: 3, type: 'warning', message: '2条审批待处理', time: '2小时前' },
  ];

  const handleRefresh = () => {
    refreshData();
  };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            {user?.role === 'employee' && '员工自助中心'}
            {user?.role === 'doctor' && '医生工作站'}
            {user?.role === 'hr' && 'HR管理中心'}
            {user?.role === 'admin' && '系统管理中心'}
          </h2>
          <div className="flex items-center gap-2 mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-sm text-slate-500">{dayjs().format('YYYY年MM月DD日 dddd')}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {(isHR || isAdmin) && (
          <div className="relative">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
            >
              <Filter className="w-4 h-4" />
              筛选
              <ChevronDown className={cn('w-4 h-4 transition-transform', showFilters && 'rotate-180')} />
            </Button>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-4 z-40"
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">部门</label>
                      <select
                        value={filters.departmentId || ''}
                        onChange={(e) => setFilters({ ...filters, departmentId: e.target.value || undefined })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">全部部门</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">体检套餐</label>
                      <select
                        value={filters.packageId || ''}
                        onChange={(e) => setFilters({ ...filters, packageId: e.target.value || undefined })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">全部套餐</option>
                        {packages.map(pkg => (
                          <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">日期范围</label>
                      <input
                        type="date"
                        value={filters.startDate || ''}
                        onChange={(e) => setFilters({ ...filters, startDate: e.target.value || undefined })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 mb-2"
                      />
                      <input
                        type="date"
                        value={filters.endDate || ''}
                        onChange={(e) => setFilters({ ...filters, endDate: e.target.value || undefined })}
                        className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                        onClick={() => setFilters({})}
                      >
                        重置
                      </Button>
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => { refreshData(); setShowFilters(false); }}
                      >
                        应用
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          loading={isLoading}
          className="gap-2"
        >
          <RefreshCw className={cn('w-4 h-4', isLoading && 'animate-spin')} />
          刷新
        </Button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-40"
              >
                <div className="px-4 py-3 border-b border-slate-200 bg-slate-50">
                  <h4 className="font-semibold text-slate-900">通知消息</h4>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div key={notif.id} className="px-4 py-3 border-b border-slate-100 hover:bg-slate-50 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'w-2 h-2 mt-2 rounded-full',
                          notif.type === 'info' && 'bg-primary-500',
                          notif.type === 'success' && 'bg-success-500',
                          notif.type === 'warning' && 'bg-warning-500',
                          notif.type === 'danger' && 'bg-danger-500'
                        )} />
                        <div className="flex-1">
                          <p className="text-sm text-slate-700">{notif.message}</p>
                          <p className="text-xs text-slate-400 mt-1">{notif.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-8 w-px bg-slate-200" />

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">在线用户</p>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Users className="w-3 h-3" />
              <span>128人</span>
            </div>
          </div>
          <Badge variant="success" dot size="sm">
            实时同步中
          </Badge>
        </div>
      </div>
    </header>
  );
}
