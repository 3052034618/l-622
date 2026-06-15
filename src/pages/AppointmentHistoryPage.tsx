import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, FileText, MapPin, QrCode, CheckCircle, XCircle, AlertCircle, Clock as ClockIcon } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';
import { useAppointmentStore } from '@/store/useAppointmentStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { getStatusColor, getStatusText, formatCurrency } from '@/utils';
import { Appointment } from '@/types';
import dayjs from 'dayjs';

export function AppointmentHistoryPage() {
  const { user } = useAuthStore();
  const { appointments, loadUserAppointments } = useAppointmentStore();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showQrModal, setShowQrModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserAppointments(user.id);
    }
  }, [user, loadUserAppointments]);

  const userAppointments = appointments.filter(a => a.userId === user?.id);

  const getStatusIcon = (status: Appointment['status']) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-5 h-5 text-success-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-danger-500" />;
      case 'pending': return <ClockIcon className="w-5 h-5 text-warning-500" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-primary-500" />;
      default: return <AlertCircle className="w-5 h-5 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">预约记录</h1>
        <p className="text-slate-500 mt-1">查看您的所有体检预约记录</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userAppointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="col-span-full"
          >
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">暂无预约记录</h3>
                <p className="text-slate-500 mb-6">您还没有任何体检预约记录</p>
                <Button>立即预约</Button>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          userAppointments.map((apt, index) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{apt.packageName}</h3>
                      <p className="text-sm text-slate-500">预约号: {apt.appointmentNo}</p>
                    </div>
                    <Badge variant={getStatusColor(apt.status)} className="gap-1">
                      {getStatusIcon(apt.status)}
                      {getStatusText(apt.status)}
                    </Badge>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>{dayjs(apt.appointmentDate).format('YYYY-MM-DD')}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="w-4 h-4 text-slate-400" />
                      <span>{apt.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>体检中心A区</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span>共 {apt.items.length} 项检查</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-lg font-bold text-primary-600">{formatCurrency(apt.totalPrice)}</span>
                    <div className="flex gap-2">
                      {apt.status === 'confirmed' && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => { setSelectedAppointment(apt); setShowQrModal(true); }}
                        >
                          <QrCode className="w-4 h-4 mr-1" />
                          签到码
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => setSelectedAppointment(apt)}
                      >
                        查看详情
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      <Modal
        isOpen={!!selectedAppointment && !showQrModal}
        onClose={() => setSelectedAppointment(null)}
        title="预约详情"
        size="lg"
      >
        {selectedAppointment && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">预约号</p>
                <p className="font-semibold text-slate-900">{selectedAppointment.appointmentNo}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">状态</p>
                <Badge variant={getStatusColor(selectedAppointment.status)}>
                  {getStatusText(selectedAppointment.status)}
                </Badge>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">体检套餐</p>
                <p className="font-semibold text-slate-900">{selectedAppointment.packageName}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">费用</p>
                <p className="font-semibold text-primary-600">{formatCurrency(selectedAppointment.totalPrice)}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">体检项目</p>
              <div className="grid grid-cols-2 gap-2">
                {selectedAppointment.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                    <span className="text-sm text-slate-600">{item.name}</span>
                    <span className="text-sm text-slate-900">{formatCurrency(item.price)}</span>
                  </div>
                ))}
              </div>
            </div>

            {selectedAppointment.status === 'confirmed' && (
              <div className="p-4 bg-primary-50 border border-primary-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-primary-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-primary-800">体检须知</p>
                    <ul className="text-sm text-primary-700 mt-1 space-y-1">
                      <li>• 请携带身份证原件，提前15分钟到达</li>
                      <li>• 体检前8小时禁食禁水</li>
                      <li>• 女性请避开生理期</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showQrModal}
        onClose={() => { setShowQrModal(false); setSelectedAppointment(null); }}
        title="体检签到码"
        size="sm"
      >
        <div className="text-center">
          <div className="w-48 h-48 mx-auto bg-white border-2 border-dashed border-slate-300 rounded-xl flex items-center justify-center mb-4">
            <div className="text-center">
              <QrCode className="w-24 h-24 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-500">签到二维码</p>
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-2">请在体检时出示此二维码签到</p>
          <p className="text-xs text-slate-400">预约号: {selectedAppointment?.appointmentNo}</p>
        </div>
      </Modal>
    </div>
  );
}
