import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useAppointments, Appointment } from '../../contexts/AppointmentContext';
import { Calendar, Clock, Stethoscope, X, Check } from 'lucide-react';

export const AppointmentList: React.FC = () => {
  const { user } = useAuth();
  const { getUserAppointments, cancelAppointment } = useAppointments();
  
  const appointments = user ? getUserAppointments(user.id) : [];
  const upcomingAppointments = appointments.filter(app => app.status === 'confirmed');
  const pastAppointments = appointments.filter(app => app.status === 'cancelled');

  const handleCancelAppointment = async (appointmentId: string) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      await cancelAppointment(appointmentId);
    }
  };

  const formatDate = (dateString: string) => {
    // Dividir la fecha en año, mes y día, y crear un objeto Date respetando la zona horaria local
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isPastDate = (date: string, time: string) => {
    // Dividir la fecha en año, mes y día, y combinar con la hora para crear un objeto Date
    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const appointmentDate = new Date(year, month - 1, day, hours, minutes);
    return appointmentDate < new Date();
  };

  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes citas programadas</h3>
        <p className="text-gray-600">Reserva tu primera cita médica para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Próximas Citas
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onCancel={handleCancelAppointment}
                isPast={isPastDate(appointment.date, appointment.time)}
                formatDate={formatDate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Past/Cancelled Appointments */}
      {pastAppointments.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-600" />
              Historial de Citas
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {pastAppointments.map((appointment) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onCancel={handleCancelAppointment}
                isPast={true}
                formatDate={formatDate}
                showCancel={false}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface AppointmentCardProps {
  appointment: Appointment;
  onCancel: (id: string) => void;
  isPast: boolean;
  formatDate: (date: string) => string;
  showCancel?: boolean;
}

const AppointmentCard: React.FC<AppointmentCardProps> = ({ 
  appointment, 
  onCancel, 
  isPast, 
  formatDate,
  showCancel = true 
}) => {
  const getStatusColor = () => {
    if (appointment.status === 'cancelled') return 'text-red-600 bg-red-50';
    if (isPast) return 'text-gray-600 bg-gray-50';
    return 'text-green-600 bg-green-50';
  };

  const getStatusText = () => {
    if (appointment.status === 'cancelled') return 'Cancelada';
    if (isPast) return 'Completada';
    return 'Confirmada';
  };

  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Stethoscope className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900">{appointment.serviceName}</h3>
            <div className="mt-2 space-y-1">
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-2" />
                {formatDate(appointment.date)}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                {appointment.time}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
            {getStatusText()}
          </span>
          {showCancel && appointment.status === 'confirmed' && !isPast && (
            <button
              onClick={() => onCancel(appointment.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
              title="Cancelar cita"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};