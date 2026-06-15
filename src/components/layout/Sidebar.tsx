import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  CalendarCheck, 
  FileText, 
  ClipboardCheck, 
  BarChart3, 
  Settings, 
  LogOut,
  Heart,
  User
} from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { usePermission } from '@/hooks/usePermission';
import { cn, getRoleText } from '@/utils';
import { Badge } from '@/components/ui/Badge';
import { useApprovalStore } from '@/store/useApprovalStore';
import { useEffect } from 'react';

const menuItems = [
  { path: '/', label: '数据大屏', icon: LayoutDashboard, roles: ['employee', 'doctor', 'hr', 'admin'] },
  { path: '/appointment', label: '体检预约', icon: CalendarCheck, roles: ['employee'] },
  { path: '/appointment/history', label: '预约记录', icon: FileText, roles: ['employee'] },
  { path: '/report', label: '体检报告', icon: FileText, roles: ['employee', 'doctor', 'hr', 'admin'] },
  { path: '/report/entry', label: '报告录入', icon: ClipboardCheck, roles: ['doctor'] },
  { path: '/approval', label: '费用审批', icon: ClipboardCheck, roles: ['hr', 'admin'] },
  { path: '/statistics', label: '统计报表', icon: BarChart3, roles: ['hr', 'admin'] },
  { path: '/admin/packages', label: '套餐管理', icon: Settings, roles: ['admin'] },
  { path: '/admin/rules', label: '规则配置', icon: Settings, roles: ['admin'] },
  { path: '/admin/users', label: '用户管理', icon: User, roles: ['admin'] },
];

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const { canAccess } = usePermission();
  const navigate = useNavigate();
  const { loadApprovals, pendingCount } = useApprovalStore();

  useEffect(() => {
    if (user && (user.role === 'hr' || user.role === 'admin')) {
      loadApprovals(user.id);
    }
  }, [user, loadApprovals]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const visibleItems = menuItems.filter(item => canAccess(item.roles as any));

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col">
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="p-6 border-b border-slate-800"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold">健康体检平台</h1>
            <p className="text-xs text-slate-400">Health Management</p>
          </div>
        </div>
      </motion.div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {visibleItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) => cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                  isActive
                    ? 'bg-primary-500/20 text-primary-400'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                )}
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full"
                      />
                    )}
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.path === '/approval' && pendingCount > 0 && (
                      <Badge variant="danger" size="sm" className="min-w-[20px] justify-center">
                        {pendingCount}
                      </Badge>
                    )}
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="mb-4 p-3 bg-slate-800/50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-slate-400">{getRoleText(user?.role || '')}</p>
            </div>
          </div>
          {user && (
            <div className="mt-2 pt-2 border-t border-slate-700">
              <p className="text-xs text-slate-500">{user.departmentName}</p>
              <p className="text-xs text-slate-500">工号: {user.employeeNo}</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>退出登录</span>
        </button>
      </div>
    </div>
  );
}
