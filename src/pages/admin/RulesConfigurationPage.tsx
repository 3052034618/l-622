import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Save, Clock, DollarSign, Users, AlertTriangle, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/utils';

interface Rule {
  id: string;
  name: string;
  description: string;
  value: number;
  unit: string;
  category: 'time' | 'budget' | 'notification';
}

export function RulesConfigurationPage() {
  const [rules, setRules] = useState<Rule[]>([
    { id: '1', name: '预约锁定时长', description: '预约后锁定时段的时长，超时自动释放', value: 15, unit: '分钟', category: 'time' },
    { id: '2', name: '审批超时时间', description: '各级审批的最长处理时间，超时自动越级', value: 48, unit: '小时', category: 'time' },
    { id: '3', name: '预算预警阈值', description: '部门预算使用达到此比例时触发预警', value: 80, unit: '%', category: 'budget' },
    { id: '4', name: '审批越级阈值', description: '超出预算此金额时需要两级审批', value: 500, unit: '元', category: 'budget' },
    { id: '5', name: '体检中心日容量', description: '体检中心每日最大接待量', value: 200, unit: '人', category: 'time' },
    { id: '6', name: '异常报告通知', description: '发现异常指标时是否自动通知员工', value: 1, unit: '是/否', category: 'notification' },
    { id: '7', name: '未体检提醒', description: '提前多少天提醒未体检员工', value: 7, unit: '天', category: 'notification' },
    { id: '8', name: '数据刷新间隔', description: '首页大屏数据自动刷新间隔', value: 10, unit: '秒', category: 'time' },
  ]);

  const [editingRule, setEditingRule] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleEdit = (rule: Rule) => {
    setEditingRule(rule.id);
    setEditValue(String(rule.value));
  };

  const handleSave = (ruleId: string) => {
    setRules(prev => prev.map(r => 
      r.id === ruleId ? { ...r, value: Number(editValue) } : r
    ));
    setEditingRule(null);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleCancel = () => {
    setEditingRule(null);
    setEditValue('');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'time': return <Clock className="w-5 h-5 text-primary-500" />;
      case 'budget': return <DollarSign className="w-5 h-5 text-warning-500" />;
      case 'notification': return <AlertTriangle className="w-5 h-5 text-danger-500" />;
      default: return <Settings className="w-5 h-5 text-slate-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'time': return 'bg-primary-100 border-primary-200';
      case 'budget': return 'bg-warning-100 border-warning-200';
      case 'notification': return 'bg-danger-100 border-danger-200';
      default: return 'bg-slate-100 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">规则配置</h1>
          <p className="text-slate-500 mt-1">配置系统业务规则和参数阈值</p>
        </div>
        {saveSuccess && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center gap-2 px-4 py-2 bg-success-100 text-success-700 rounded-lg"
          >
            <Save className="w-4 h-4" />
            <span className="text-sm font-medium">保存成功</span>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">时间规则</p>
                  <p className="text-lg font-bold text-slate-900">{rules.filter(r => r.category === 'time').length} 项</p>
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
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-warning-100 rounded-xl flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-warning-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">预算规则</p>
                  <p className="text-lg font-bold text-slate-900">{rules.filter(r => r.category === 'budget').length} 项</p>
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
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-danger-100 rounded-xl flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-danger-500" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">通知规则</p>
                  <p className="text-lg font-bold text-slate-900">{rules.filter(r => r.category === 'notification').length} 项</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {['time', 'budget', 'notification'].map((category, categoryIndex) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: categoryIndex * 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {getCategoryIcon(category)}
                {category === 'time' && '时间规则'}
                {category === 'budget' && '预算规则'}
                {category === 'notification' && '通知规则'}
              </CardTitle>
              <CardDescription>
                {category === 'time' && '配置系统时间相关参数'}
                {category === 'budget' && '配置预算控制和审批阈值'}
                {category === 'notification' && '配置通知和提醒相关规则'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-200">
                {rules.filter(r => r.category === category).map((rule, index) => (
                  <motion.div
                    key={rule.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-slate-900">{rule.name}</h4>
                          <Badge variant="secondary" size="sm">
                            {rule.id}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-500 mt-1">{rule.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {editingRule === rule.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-24 h-9"
                              autoFocus
                            />
                            <span className="text-sm text-slate-500">{rule.unit}</span>
                            <Button size="sm" onClick={() => handleSave(rule.id)}>
                              <Save className="w-4 h-4 mr-1" />
                              保存
                            </Button>
                            <Button size="sm" variant="secondary" onClick={handleCancel}>
                              取消
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className={cn(
                              'px-4 py-2 rounded-lg border text-right min-w-[120px]',
                              getCategoryColor(category)
                            )}>
                              <span className="text-lg font-bold text-slate-900">{rule.value}</span>
                              <span className="text-sm text-slate-600 ml-1">{rule.unit}</span>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(rule)}
                            >
                              <Settings className="w-4 h-4 mr-1" />
                              编辑
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      <div className="p-4 bg-primary-50 border border-primary-200 rounded-xl">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-primary-800">规则说明</p>
            <ul className="text-sm text-primary-700 mt-1 space-y-1">
              <li>• 修改规则后将立即生效，请谨慎操作</li>
              <li>• 预约锁定时长建议设置在10-30分钟之间</li>
              <li>• 审批超时时间过短可能导致频繁越级，过长可能影响效率</li>
              <li>• 预算预警阈值建议设置在70%-90%之间</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
