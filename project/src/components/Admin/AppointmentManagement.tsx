import React, { useState } from 'react';
import { useAppointments } from '../../contexts/AppointmentContext';
import { Calendar, Clock, User, Search, Filter, CheckCircle, XCircle, Eye, Stethoscope } from 'lucide-react';

export const AppointmentManagement: React.FC = () => {
  const { appointments, cancelAppointment } = useAppointments();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = 
      appointment.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      const today = new Date().toISOString().split('T')[0];
      matchesDate = appointment.date === today;
    } else if (dateFilter === 'week') {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      const appDate = new Date(appointment.date);
      matchesDate = appDate >= weekStart && appDate <= weekEnd;
    } else if (dateFilter === 'month') {
      const now = new Date();
      const appDate = new Date(appointment.date);
      matchesDate = appDate.getMonth() === now.getMonth() && appDate.getFullYear() === now.getFullYear();
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleCancelAppointment = async (appointmentId: string) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      await cancelAppointment(appointmentId);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Citas</h1>
        <p className="text-gray-600">Administra todas las citas del sistema</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por servicio, paciente o email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="confirmed">Confirmadas</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>
          
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Todas las fechas</option>
              <option value="today">Hoy</option>
              <option value="week">Esta semana</option>
              <option value="month">Este mes</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appointments List */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Citas ({filteredAppointments.length})
            </h2>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Confirmadas</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Canceladas</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {filteredAppointments.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron citas</h3>
              <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        appointment.status === 'confirmed' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {appointment.status === 'confirmed' ? (
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{appointment.serviceName}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {appointment.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                        </span>
                      </div>
                      <p className="text-sm text-blue-600 font-medium mb-2">Paciente: {appointment.patientName}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          {formatDate(appointment.date)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2" />
                          {appointment.time}
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          {appointment.patientEmail}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setSelectedAppointment(
                        selectedAppointment === appointment.id ? null : appointment.id
                      )}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {appointment.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelAppointment(appointment.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                        title="Cancelar cita"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
                
                {selectedAppointment === appointment.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">Detalles de la Cita</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">ID de Cita:</span>
                        <span className="ml-2 text-gray-600">{appointment.id}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">ID de Usuario:</span>
                        <span className="ml-2 text-gray-600">{appointment.userId}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Teléfono:</span>
                        <span className="ml-2 text-gray-600">{appointment.patientPhone}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Creada:</span>
                        <span className="ml-2 text-gray-600">{formatDateTime(appointment.createdAt)}</span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Estado:</span>
                        <span className={`ml-2 font-medium ${
                          appointment.status === 'confirmed' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {appointment.status === 'confirmed' ? 'Confirmada' : 'Cancelada'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};