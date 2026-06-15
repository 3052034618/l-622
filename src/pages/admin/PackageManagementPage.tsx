import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Eye, Search, Settings, DollarSign, Users, Activity } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { packages } from '@/mock/data/packages';
import { Package } from '@/types';
import { cn, formatCurrency } from '@/utils';

export function PackageManagementPage() {
  const { user } = useAuthStore();
  const [packageList, setPackageList] = useState<Package[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<Package>>({
    name: '',
    description: '',
    basePrice: 0,
    targetGender: 'all',
    targetMinAge: undefined,
    targetMaxAge: undefined,
    items: [],
  });

  useEffect(() => {
    setPackageList(packages);
  }, []);

  const filteredPackages = packageList.filter(pkg =>
    pkg.name.includes(searchTerm) || pkg.description.includes(searchTerm)
  );

  const handleAdd = () => {
    setEditingPackage(null);
    setFormData({
      name: '',
      description: '',
      basePrice: 0,
      targetGender: 'all',
      targetMinAge: undefined,
      targetMaxAge: undefined,
      items: [],
    });
    setShowModal(true);
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setFormData({ ...pkg });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('确定要删除这个体检套餐吗？')) {
      setPackageList(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSubmit = () => {
    if (editingPackage) {
      setPackageList(prev => prev.map(p => p.id === editingPackage.id ? { ...p, ...formData } as Package : p));
    } else {
      const newPackage: Package = {
        ...formData,
        id: `pkg-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Package;
      setPackageList(prev => [...prev, newPackage]);
    }
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">套餐管理</h1>
          <p className="text-slate-500 mt-1">配置和管理体检套餐信息</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          新增套餐
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">套餐总数</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{packageList.length}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Activity className="w-6 h-6 text-primary-500" />
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
                  <p className="text-sm text-slate-500">本月预约</p>
                  <p className="text-2xl font-bold text-success-600 mt-1">156</p>
                </div>
                <div className="w-12 h-12 bg-success-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-success-500" />
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
                  <p className="text-sm text-slate-500">最高价格</p>
                  <p className="text-2xl font-bold text-warning-600 mt-1">
                    {formatCurrency(Math.max(...packageList.map(p => p.basePrice)))}
                  </p>
                </div>
                <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-warning-500" />
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
                  <p className="text-sm text-slate-500">平均价格</p>
                  <p className="text-2xl font-bold text-primary-600 mt-1">
                    {formatCurrency(packageList.reduce((sum, p) => sum + p.basePrice, 0) / packageList.length)}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Settings className="w-6 h-6 text-primary-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>套餐列表</CardTitle>
            <Input
              placeholder="搜索套餐..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search className="w-4 h-4" />}
              className="w-64"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">套餐名称</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">描述</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">基础价格</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">适用人群</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">项目数</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-slate-700">状态</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-slate-700">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPackages.map((pkg, index) => (
                  <motion.tr
                    key={pkg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-slate-900">{pkg.name}</div>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600 max-w-xs truncate">
                      {pkg.description}
                    </td>
                    <td className="py-4 px-4">
                      <span className="font-semibold text-primary-600">{formatCurrency(pkg.basePrice)}</span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm text-slate-600">
                        <div>{pkg.targetGender === 'all' ? '男女通用' : pkg.targetGender === 'male' ? '男性' : '女性'}</div>
                        <div className="text-xs text-slate-400">
                          {pkg.targetMinAge || 0} - {pkg.targetMaxAge || 100}岁
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-sm text-slate-600">
                      {pkg.items.length} 项
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="success" size="sm">启用中</Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-primary-500"
                          onClick={() => handleEdit(pkg)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-danger-500"
                          onClick={() => handleDelete(pkg.id)}
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
        title={editingPackage ? '编辑套餐' : '新增套餐'}
        size="lg"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setShowModal(false)}>取消</Button>
            <Button onClick={handleSubmit}>{editingPackage ? '保存' : '创建'}</Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="套餐名称"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="请输入套餐名称"
            />
            <Input
              label="基础价格"
              type="number"
              value={formData.basePrice}
              onChange={(e) => setFormData(prev => ({ ...prev, basePrice: Number(e.target.value) }))}
              placeholder="请输入基础价格"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">套餐描述</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="请输入套餐描述"
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">适用性别</label>
              <select
                value={formData.targetGender}
                onChange={(e) => setFormData(prev => ({ ...prev, targetGender: e.target.value as any }))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="all">男女通用</option>
                <option value="male">男性专属</option>
                <option value="female">女性专属</option>
              </select>
            </div>
            <Input
              label="最小年龄"
              type="number"
              value={formData.targetMinAge || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, targetMinAge: e.target.value ? Number(e.target.value) : undefined }))}
              placeholder="0"
            />
            <Input
              label="最大年龄"
              type="number"
              value={formData.targetMaxAge || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, targetMaxAge: e.target.value ? Number(e.target.value) : undefined }))}
              placeholder="100"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
