import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Search, UserPlus, Shield, Users, Activity, Filter } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { users, departments } from '@/mock/data/users';
import { User } from '@/types';
import { cn, getRoleText } from '@/utils';

export function UserManagementPage() {
  const { user: currentUser } = useAuthStore();
  const [userList, setUserList] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [deptFilter, setDeptFilter] = useState<string>('all');
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    username: '',
    email: '',
    phone: '',
    role: 'employee',
    departmentId: '',
    gender: 'male',
    age: 30,
  });

  useEffect(() => {
    setUserList(users);
  }, []);

  const filteredUsers = userList.filter(u => {
    const matchSearch = u.name.includes(searchTerm) || u.username.includes(searchTerm) || u.email.includes(searchTerm);
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    const matchDept = deptFilter === 'all' || u.departmentId === deptFilter;
    return matchSearch && matchRole && matchDept;
  });

  const handleAdd = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      username: '',
      email: '',
      phone: '',
      role: 'employee',
      departmentId: departments[0]?.id || '',
      gender: 'male',
      age: 30,
    });
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({ ...user });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除该用户吗？')) {
      setUserList(prev => prev.filter(u => u.id !== id));
    }
  };

  const handleSubmit = () => {
    if (editingUser) {
      setUserList(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...formData } as User : u));
    } else {
      const newUser: User = {
        ...formData,
        id: `user-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as User;
      setUserList(prev => [...prev, newUser]);
    }
    setShowModal(false);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'hr': return 'primary';
      case 'doctor': return 'success';
      default: return 'secondary';
    }
  };

  const getDepartmentName = (deptId: string) => {
    return departments.find(d => d.id === deptId)?.name || '未知部门';
  };

  const stats = {
    total: userList.length,
    employees: userList.filter(u => u.role === 'employee').length,
    doctors: userList.filter(u => u.role === 'doctor').length,
    hr: userList.filter(u => u.role === 'hr').length,
    admins: userList.filter(u => u.role === 'admin').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">用户管理</h1>
          <p className="text-slate-500 mt-1">管理系统用户和权限配置</p>
        </div>
        <Button onClick={handleAdd}>
          <UserPlus className="w-4 h-4 mr-2" />
          新增用户
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">总用户</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
                </div>
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-slate-500" />
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
                  <p className="text-sm text-slate-500">员工</p>
                  <p className="text-2xl font-bold text-secondary-600 mt-1">{stats.employees}</p>
                </div>
                <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-secondary-500" />
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
                  <p className="text-sm text-slate-500">医生</p>
                  <p className="text-2xl font-bold text-success-600 mt-1">{stats.doctors}</p>
                </div>
                <div className="w-10 h-10 bg-success-100 rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-success-500" />
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
                  <p className="text-sm text-slate-500">HR</p>
                  <p className="text-2xl font-bold text-primary-600 mt-1">{stats.hr}</p>
                </div>
                <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">管理员</p>
                  <p className="text-2xl font-bold text-danger-600 mt-1">{stats.admins}</p>
                </div>
                <div className="w-10 h-10 bg-danger-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-danger-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <CardTitle>用户列表</CardTitle>
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-slate-400" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">全部角色</option>
                  <option value="employee">员工</option>
                  <option value="doctor">医生</option>
                  <option value="hr">HR</option>
                  <option value="admin">管理员</option>
                </select>
                <select
                  value={deptFilter}
                  onChange={(e) => setDeptFilter(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="all">全部部门</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
              </div>
              <Input
                placeholder="搜索用户..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                className="w-64"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">用户信息</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">账号</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">部门</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">角色</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">年龄</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">状态</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredUsers.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600">
                      {user.username}
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600">
                      {getDepartmentName(user.departmentId)}
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant={getRoleColor(user.role) as any} size="sm">
                        {getRoleText(user.role)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600">
                      {user.age}岁 ({user.gender === 'male' ? '男' : '女'})
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="success" size="sm">正常</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-primary-500"
                          onClick={() => handleEdit(user)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-danger-500"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingUser ? '编辑用户' : '新增用户'}
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowModal(false)}>取消</Button>
            <Button onClick={handleSubmit}>{editingUser ? '保存' : '创建'}</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="姓名"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="请输入姓名"
            />
            <Input
              label="用户名"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              placeholder="请输入用户名"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="邮箱"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="请输入邮箱"
            />
            <Input
              label="手机号"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="请输入手机号"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">角色</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="employee">员工</option>
                <option value="doctor">医生</option>
                <option value="hr">HR</option>
                <option value="admin">管理员</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">部门</label>
              <select
                value={formData.departmentId}
                onChange={(e) => setFormData(prev => ({ ...prev, departmentId: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">性别</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value as any }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="male">男</option>
                <option value="female">女</option>
              </select>
            </div>
          </div>
          <Input
            label="年龄"
            type="number"
            value={formData.age}
            onChange={(e) => setFormData(prev => ({ ...prev, age: Number(e.target.value) }))}
            placeholder="请输入年龄"
          />
        </div>
      </Modal>
    </div>
  );
}
