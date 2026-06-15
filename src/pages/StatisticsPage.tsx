import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  DollarSign,
  Filter
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { useAuthStore } from '@/store/useAuthStore';
import { useDashboardStore } from '@/store/useDashboardStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Progress } from '@/components/ui/Progress';
import { exportMonthlyReport, exportNotStartedList } from '@/utils/excel';
import { cn, formatCurrency } from '@/utils';
import dayjs from 'dayjs';

const CHART_COLORS = ['#0EA5E9', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const defaultStats = {
  totalEmployees: 0,
  completedReports: 0,
  completionRate: 0,
  totalSpent: 0,
  budgetUsed: 0,
  budgetTotal: 0,
  notStartedCount: 0,
  abnormalCount: 0,
  todayAppointments: 0,
  todayCompleted: 0,
  abnormalReports: 0,
  budgetProgress: 0,
  pendingApprovals: 0,
  completedToday: 0,
  inProgress: 0,
  pending: 0,
  budgetSpent: 0,
};

export function StatisticsPage() {
  const { user } = useAuthStore();
  const {
    stats: rawStats,
    departmentStats,
    packageStats,
    timeSeriesData,
    notStartedList,
    loadData,
    departments
  } = useDashboardStore();

  const stats = rawStats || defaultStats;

  const [selectedMonth, setSelectedMonth] = useState(dayjs().format('YYYY-MM'));
  const [selectedDept, setSelectedDept] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleExportMonthly = () => {
    exportMonthlyReport(departmentStats, packageStats, selectedMonth);
  };

  const handleExportNotStarted = () => {
    exportNotStartedList(notStartedList);
  };

  const filteredDeptStats = selectedDept === 'all' 
    ? departmentStats 
    : departmentStats.filter(d => d.departmentId === selectedDept);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">统计报表</h1>
          <p className="text-slate-500 mt-1">查看部门体检完成率、费用统计和趋势分析</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">全部部门</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
          <Button variant="secondary" onClick={handleExportNotStarted}>
            <FileText className="w-4 h-4 mr-2" />
            导出未检名单
          </Button>
          <Button onClick={handleExportMonthly}>
            <Download className="w-4 h-4 mr-2" />
            导出月度报表
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">总体检人数</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.totalEmployees || 0}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary-500" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-success-600">
                <TrendingUp className="w-3 h-3" />
                <span>较上月增长 12.5%</span>
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
                  <p className="text-sm text-slate-500">已完成体检</p>
                  <p className="text-2xl font-bold text-success-600 mt-1">{stats.completedReports || 0}</p>
                </div>
                <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-success-500" />
                </div>
              </div>
              <div className="mt-3">
                <Progress value={stats.completionRate || 0} max={100} variant="success" />
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
                  <p className="text-sm text-slate-500">未体检人数</p>
                  <p className="text-2xl font-bold text-danger-600 mt-1">{notStartedList.length}</p>
                </div>
                <div className="w-12 h-12 bg-danger-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-danger-500" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs text-danger-600">
                <TrendingDown className="w-3 h-3" />
                <span>需尽快完成体检</span>
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
                  <p className="text-sm text-slate-500">体检总费用</p>
                  <p className="text-2xl font-bold text-primary-600 mt-1">{formatCurrency(stats.totalSpent || 0)}</p>
                </div>
                <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-warning-500" />
                </div>
              </div>
              <div className="mt-3 text-xs text-slate-500">
                预算执行率: {stats.budgetUsed || 0}%
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary-500" />
                各部门体检完成率
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredDeptStats.map((dept, index) => (
                  <motion.div
                    key={dept.departmentId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700">{dept.departmentName}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500">
                          {dept.completedCount} / {dept.totalCount} 人
                        </span>
                        <span className={cn(
                          'text-sm font-semibold',
                          dept.completionRate >= 90 ? 'text-success-600' :
                          dept.completionRate >= 70 ? 'text-warning-600' : 'text-danger-600'
                        )}>
                          {dept.completionRate}%
                        </span>
                      </div>
                    </div>
                    <Progress
                      value={dept.completionRate}
                      max={100}
                      variant={
                        dept.completionRate >= 90 ? 'success' :
                        dept.completionRate >= 70 ? 'warning' : 'danger'
                      }
                      size="lg"
                    />
                  </motion.div>
                ))}
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary-500" />
                套餐使用分布
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={packageStats}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="count"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
                    <span className="text-xs font-semibold text-slate-900 ml-auto">{pkg.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-500" />
              月度体检趋势
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={timeSeriesData}>
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
                  <Bar dataKey="appointments" fill="#0EA5E9" name="预约人数" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="completed" fill="#10B981" name="完成体检" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary-500" />
                未体检人员名单
              </div>
              <Badge variant="warning">{notStartedList.length} 人</Badge>
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
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">套餐费用</th>
                    <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">状态</th>
                  </tr>
                </thead>
                <tbody>
                  {notStartedList.map((employee, index) => (
                    <motion.tr
                      key={employee.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.03 }}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
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
                      <td className="py-3 px-4 text-sm font-medium text-primary-600">{formatCurrency(employee.estimatedCost)}</td>
                      <td className="py-3 px-4">
                        <Badge variant="warning" size="sm">未体检</Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-warning-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-slate-800">统计说明</p>
            <ul className="text-sm text-slate-600 mt-1 space-y-1">
              <li>• 数据每日凌晨自动更新，也可手动点击刷新获取最新数据</li>
              <li>• 完成率 = 已完成体检人数 / 部门总人数 × 100%</li>
              <li>• 未体检人员包含从未预约和预约后取消的员工</li>
              <li>• 月度报表包含各部门完成率、套餐分布、费用明细等详细数据</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
