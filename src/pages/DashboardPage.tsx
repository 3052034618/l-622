import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CalendarCheck, 
  FileText, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  Clock as ClockIcon
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useAuthStore } from '@/store/useAuthStore';
import { usePermission } from '@/hooks/usePermission';
import { useRealtime } from '@/hooks/useRealtime';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { formatCurrency, cn, getStatusText } from '@/utils';
import dayjs from 'dayjs';

const CHART_COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const defaultStats = {
  todayAppointments: 0,
  todayCompleted: 0,
  completionRate: 0,
  abnormalReports: 0,
  budgetUsed: 0,
  budgetTotal: 0,
  budgetProgress: 0,
  pendingApprovals: 0,
  notStartedCount: 0,
  completedReports: 0,
  abnormalCount: 0,
  totalSpent: 0,
  completedToday: 0,
  inProgress: 0,
  pending: 0,
  budgetSpent: 0,
  totalBudget: 0,
  totalEmployees: 0,
};

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  suffix?: string;
  loading?: boolean;
}

function StatCard({ title, value, change, icon: Icon, color, bgColor, suffix, loading }: StatCardProps) {
  return (
    <Card hover className="transition-all duration-300">
      <CardContent className="p-6">
        {loading ? (
          <div className="animate-pulse">
            <div className="h-4 bg-slate-200 rounded w-24 mb-4" />
            <div className="h-8 bg-slate-200 rounded w-32 mb-2" />
            <div className="h-4 bg-slate-200 rounded w-20" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-slate-500">{title}</p>
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center', bgColor)}>
                <Icon className={cn('w-5 h-5', color)} />
              </div>
            </div>
            <div className="flex items-end gap-2">
              <motion.span
                key={value}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold text-slate-900"
              >
                {value}{suffix}
              </motion.span>
              {change !== undefined && (
                <Badge variant={change >= 0 ? 'success' : 'danger'} size="sm" className="mb-1">
                  {change >= 0 ? <TrendingUp className="w-3 h-3 mr-0.5" /> : <TrendingDown className="w-3 h-3 mr-0.5" />}
                  {Math.abs(change)}%
                </Badge>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { user } = useAuthStore();
  const { isEmployee, isDoctor, isHR, isAdmin } = usePermission();
  const {
    stats: rawStats,
    timeSeriesData,
    departmentStats,
    packageStats,
    notStartedList,
    loadData,
    isLoading
  } = useDashboardStore();

  const stats = rawStats || defaultStats;

  const [lastUpdate, setLastUpdate] = useState(dayjs().format('HH:mm:ss'));

  useRealtime({
    interval: 10000,
    onRefresh: async () => {
      await loadData();
      setLastUpdate(dayjs().format('HH:mm:ss'));
    },
  });

  useEffect(() => {
    loadData();
  }, [loadData]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isEmployee) {
    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">欢迎回来，{user?.name}</h1>
            <p className="text-slate-500 mt-1">关注健康，定期体检，享受美好生活</p>
          </div>
          <Badge variant="success" dot>
            最后更新: {lastUpdate}
          </Badge>
        </div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="今日预约"
            value={stats.todayAppointments || 0}
            icon={CalendarCheck}
            color="text-primary-500"
            bgColor="bg-primary-100"
            loading={isLoading}
          />
          <StatCard
            title="已完成报告"
            value={stats.completedReports || 0}
            icon={CheckCircle}
            color="text-success-500"
            bgColor="bg-success-100"
            loading={isLoading}
          />
          <StatCard
            title="异常指标"
            value={stats.abnormalCount || 0}
            icon={AlertTriangle}
            color="text-danger-500"
            bgColor="bg-danger-100"
            loading={isLoading}
          />
          <StatCard
            title="累计消费"
            value={formatCurrency(stats.totalSpent || 0)}
            icon={DollarSign}
            color="text-warning-500"
            bgColor="bg-warning-100"
            loading={isLoading}
          />
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary-500" />
                  健康趋势分析
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={timeSeriesData}>
                      <defs>
                        <linearGradient id="colorAppointments" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                      <YAxis stroke="#94A3B8" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #E2E8F0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="appointments"
                        stroke="#0EA5E9"
                        strokeWidth={2}
                        fill="url(#colorAppointments)"
                        name="预约人数"
                      />
                      <Area
                        type="monotone"
                        dataKey="completed"
                        stroke="#10B981"
                        strokeWidth={2}
                        fill="transparent"
                        name="完成体检"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-500" />
                  快速操作
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button fullWidth variant="secondary" className="justify-start gap-3 h-12">
                  <CalendarCheck className="w-5 h-5 text-primary-500" />
                  预约体检
                </Button>
                <Button fullWidth variant="secondary" className="justify-start gap-3 h-12">
                  <FileText className="w-5 h-5 text-success-500" />
                  查看报告
                </Button>
                <Button fullWidth variant="secondary" className="justify-start gap-3 h-12">
                  <Clock className="w-5 h-5 text-warning-500" />
                  预约记录
                </Button>
                <Button fullWidth variant="secondary" className="justify-start gap-3 h-12">
                  <Activity className="w-5 h-5 text-danger-500" />
                  健康建议
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">实时数据大屏</h1>
          <p className="text-slate-500 mt-1">今日预约 · 完成率 · 异常报告 · 费用执行</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="success" dot>
            实时更新中
          </Badge>
          <Badge variant="primary">
            最后更新: {lastUpdate}
          </Badge>
        </div>
      </div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="今日预约人数"
          value={stats.todayAppointments || 0}
          change={8.2}
          icon={CalendarCheck}
          color="text-primary-500"
          bgColor="bg-primary-100"
          loading={isLoading}
        />
        <StatCard
          title="体检完成率"
          value={stats.completionRate || 0}
          change={5.4}
          icon={CheckCircle}
          color="text-success-500"
          bgColor="bg-success-100"
          suffix="%"
          loading={isLoading}
        />
        <StatCard
          title="异常报告数"
          value={stats.abnormalCount || 0}
          change={-3.1}
          icon={AlertTriangle}
          color="text-danger-500"
          bgColor="bg-danger-100"
          loading={isLoading}
        />
        <StatCard
          title="费用执行进度"
          value={stats.budgetUsed || 0}
          icon={DollarSign}
          color="text-warning-500"
          bgColor="bg-warning-100"
          suffix="%"
          loading={isLoading}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-slate-500 mb-2">预算执行</p>
                <Progress
                  value={stats.budgetUsed || 0}
                  max={100}
                  variant={stats.budgetUsed > 90 ? 'danger' : stats.budgetUsed > 70 ? 'warning' : 'primary'}
                  showLabel
                  label={`已使用 ${formatCurrency(stats.budgetSpent || 0)} / ${formatCurrency(stats.totalBudget || 0)}`}
                />
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-2">部门完成率</p>
                <div className="space-y-2">
                  {departmentStats.slice(0, 3).map((dept, i) => (
                    <div key={dept.departmentId}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-600">{dept.departmentName}</span>
                        <span className="text-slate-500">{dept.completionRate}%</span>
                      </div>
                      <Progress value={dept.completionRate} max={100} size="sm" variant={CHART_COLORS[i % CHART_COLORS.length] as any} />
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-2">今日时段分布</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { time: '上午', count: Math.floor((stats.todayAppointments || 0) * 0.5) },
                    { time: '下午', count: Math.floor((stats.todayAppointments || 0) * 0.35) },
                    { time: '晚间', count: Math.floor((stats.todayAppointments || 0) * 0.15) },
                  ].map((slot) => (
                    <div key={slot.time} className="text-center p-2 bg-slate-50 rounded-lg">
                      <p className="text-xl font-bold text-primary-600">{slot.count}</p>
                      <p className="text-xs text-slate-500">{slot.time}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-500 mb-2">实时状态</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-success-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-success-500" />
                      <span className="text-sm text-success-700">已完成</span>
                    </div>
                    <span className="font-semibold text-success-700">{stats.completedToday || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-warning-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-warning-500" />
                      <span className="text-sm text-warning-700">进行中</span>
                    </div>
                    <span className="font-semibold text-warning-700">{stats.inProgress || 0}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-danger-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <XCircle className="w-4 h-4 text-danger-500" />
                      <span className="text-sm text-danger-700">待处理</span>
                    </div>
                    <span className="font-semibold text-danger-700">{stats.pending || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-500" />
                近7日预约与完成趋势
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                    <XAxis dataKey="date" stroke="#94A3B8" fontSize={12} />
                    <YAxis stroke="#94A3B8" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'white',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="appointments"
                      stroke="#0EA5E9"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#0EA5E9' }}
                      activeDot={{ r: 6 }}
                      name="预约人数"
                    />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="#10B981"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#10B981' }}
                      activeDot={{ r: 6 }}
                      name="完成体检"
                    />
                    <Line
                      type="monotone"
                      dataKey="abnormal"
                      stroke="#EF4444"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      dot={{ r: 3, fill: '#EF4444' }}
                      name="异常报告"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-500" />
                套餐分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-72 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={packageStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="count"
                    >
                      {packageStats.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {packageStats.map((pkg, i) => (
                  <div key={pkg.packageId} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <span className="text-xs text-slate-600 truncate">{pkg.packageName}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {(isHR || isAdmin) && (
        <motion.div variants={itemVariants}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary-500" />
                  未体检人员提醒
                </div>
                <Badge variant="warning">{notStartedList.length}人未体检</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">姓名</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">部门</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">性别</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">年龄</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">推荐套餐</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {notStartedList.slice(0, 5).map((employee) => (
                      <tr key={employee.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm font-semibold">
                              {employee.name.charAt(0)}
                            </div>
                            <span className="text-sm font-medium text-slate-900">{employee.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-slate-600">{employee.departmentName}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{employee.gender === 'male' ? '男' : '女'}</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{employee.age}岁</td>
                        <td className="py-3 px-4 text-sm text-slate-600">{employee.recommendedPackage}</td>
                        <td className="py-3 px-4">
                          <Badge variant="warning" size="sm">未体检</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
