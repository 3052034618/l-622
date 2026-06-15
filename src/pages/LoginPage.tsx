import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, User, Lock, Eye, EyeOff, LogIn, Users, Stethoscope, ClipboardList, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils';
import { UserRole } from '@/types';

const quickAccounts = [
  { username: 'employee', password: '123456', role: 'employee' as UserRole, name: '员工', icon: Users, color: 'bg-primary-500' },
  { username: 'doctor', password: '123456', role: 'doctor' as UserRole, name: '医生', icon: Stethoscope, color: 'bg-success-500' },
  { username: 'hr', password: '123456', role: 'hr' as UserRole, name: 'HR', icon: ClipboardList, color: 'bg-warning-500' },
  { username: 'admin', password: '123456', role: 'admin' as UserRole, name: '管理员', icon: Shield, color: 'bg-danger-500' },
];

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(username, password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (account: typeof quickAccounts[0]) => {
    setLoading(true);
    try {
      const result = await login(account.username, account.password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-primary-900 to-slate-900 flex items-center justify-center p-6 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-success-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="absolute inset-0 opacity-5">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative z-10 w-full max-w-5xl flex gap-8 items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="flex-1 hidden lg:block"
        >
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-primary-500/30">
              <Heart className="w-9 h-9 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">企业员工健康体检管理平台</h1>
              <p className="text-slate-400 mt-1">Health Examination Management System</p>
            </div>
          </div>

          <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
            智能健康<br />
            <span className="bg-gradient-to-r from-primary-400 to-success-400 bg-clip-text text-transparent">
              全面守护
            </span>
          </h2>

          <p className="text-slate-400 text-lg mb-8 max-w-md">
            整合体检预约、报告流转、费用审批与统计全链路，为企业提供一站式健康管理解决方案。
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-md">
            {[
              { label: '智能推荐', value: '个性化体检方案' },
              { label: '实时监控', value: '10秒数据刷新' },
              { label: '多级审批', value: '预算自动管控' },
              { label: '移动办公', value: '随时随地查看' },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4"
              >
                <p className="text-primary-400 font-semibold text-sm">{item.label}</p>
                <p className="text-white/80 text-xs mt-1">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <Card glass className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/30">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">欢迎登录</h2>
              <p className="text-slate-500 mt-2">请输入您的账号信息</p>
            </div>

            <div className="mb-6">
              <p className="text-xs font-medium text-slate-500 mb-3">快捷登录（体验账号）</p>
              <div className="grid grid-cols-4 gap-2">
                {quickAccounts.map((account) => (
                  <button
                    key={account.username}
                    onClick={() => handleQuickLogin(account)}
                    disabled={loading}
                    className={cn(
                      'flex flex-col items-center gap-1 p-3 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-primary-50 transition-all duration-200 disabled:opacity-50',
                      username === account.username && 'border-primary-500 bg-primary-50'
                    )}
                  >
                    <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', account.color)}>
                      <account.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xs font-medium text-slate-700">{account.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="用户名"
                placeholder="请输入用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                icon={<User className="w-5 h-5" />}
                autoComplete="username"
              />

              <Input
                label="密码"
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<Lock className="w-5 h-5" />}
                autoComplete="current-password"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-primary-600 hover:text-primary-700 -mt-3 self-end"
              >
                {showPassword ? '隐藏密码' : '显示密码'}
              </button>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-danger-50 border border-danger-200 rounded-lg text-sm text-danger-700"
                >
                  {error}
                </motion.div>
              )}

              <Button
                type="submit"
                size="lg"
                fullWidth
                loading={loading}
                className="h-12 text-base gap-2"
              >
                <LogIn className="w-5 h-5" />
                登录系统
              </Button>
            </form>

            <div className="mt-6 flex items-center gap-4 justify-center">
              <Badge variant="primary" size="sm">演示账号</Badge>
              <span className="text-xs text-slate-500">employee/doctor/hr/admin</span>
              <span className="text-xs text-slate-500">密码均为 123456</span>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
