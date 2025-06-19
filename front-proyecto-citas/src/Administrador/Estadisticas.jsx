
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, CheckCircle, XCircle, TrendingUp, Clock } from 'lucide-react';
import { ApiServices, ApiTurnos } from '../common/server'; // Adjust the import path as needed

const Estadisticas = () => {
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Retrieve token from localStorage (matches key used in LoginForm)
  const token = localStorage.getItem('token');

  // Debug token
  useEffect(() => {
    console.log('Token retrieved from localStorage:', token); // Check if token exists
  }, [token]);

  // Fetch data from APIs with authentication
  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setError('No se encontró el token de autenticación. Por favor, inicia sesión nuevamente.');
        setLoading(false);
        navigate('/login'); // Matches LoginForm's redirect path
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch appointments (turnos)
        const turnosResponse = await fetch(ApiTurnos, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!turnosResponse.ok) {
          throw new Error(`Error al obtener citas: ${turnosResponse.statusText}`);
        }
        const turnosData = await turnosResponse.json(); // Fixed typo: turnosDiorResponse → turnosResponse
        if (!Array.isArray(turnosData)) {
          throw new Error('Los datos de citas no son un arreglo');
        }

        // Fetch services
        const servicesResponse = await fetch(ApiServices, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (!servicesResponse.ok) {
          throw new Error(`Error al obtener servicios: ${servicesResponse.statusText}`);
        }
        const servicesData = await servicesResponse.json();
        if (!Array.isArray(servicesData)) {
          throw new Error('Los datos de servicios no son un arreglo');
        }

        setAppointments(turnosData);
        setServices(servicesData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate]);

  // Calculate appointment stats
  const getAppointmentStats = () => {
    const totalAppointments = appointments.length;
    const confirmedAppointments = appointments.filter(app => app.estado === 'reservado').length;
    const cancelledAppointments = appointments.filter(app => app.estado === 'cancelado').length; // Adjust if cancellation status is different
    const cancellationRate = totalAppointments > 0 ? (cancelledAppointments / totalAppointments) * 100 : 0;

    // Calculate appointments by day (last 7 days)
    const appointmentsByDay = {};
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      appointmentsByDay[dateStr] = appointments.filter(
        app => app.fecha && app.fecha.split('T')[0] === dateStr && app.estado === 'reservado'
      ).length;
    }

    return {
      totalAppointments,
      confirmedAppointments,
      cancelledAppointments,
      cancellationRate,
      appointmentsByDay,
    };
  };

  if (loading) return <div className="text-center p-6">Cargando...</div>;
  if (error) return <div className="text-center p-6 text-red-600">{error}</div>;

  const stats = getAppointmentStats();

  // Get unique users count
  const uniqueUsers = new Set(appointments.map(app => app.metadata?.creadoPor).filter(id => id != null)).size;

  // Today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(
    app => app.fecha && app.fecha.split('T')[0] === today && app.estado === 'reservado'
  ).length;

  // This week's appointments
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const thisWeekAppointments = appointments.filter(app => {
    if (!app.fecha) return false;
    const appDate = new Date(app.fecha);
    return appDate >= weekStart && appDate <= weekEnd && app.estado === 'reservado';
  }).length;

  const mainStats = [
    {
      title: 'Total de Citas',
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Citas Confirmadas',
      value: stats.confirmedAppointments,
      icon: CheckCircle,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Citas Canceladas',
      value: stats.cancelledAppointments,
      icon: XCircle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-600',
    },
    {
      title: 'Pacientes Únicos',
      value: uniqueUsers,
      icon: Users,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Citas Hoy',
      value: todayAppointments,
      icon: Clock,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      title: 'Citas Esta Semana',
      value: thisWeekAppointments,
      icon: TrendingUp,
      color: 'bg-teal-500',
      bgColor: 'bg-teal-50',
      textColor: 'text-teal-600',
    },
  ];

  // Appointments by service
  const appointmentsByService = services.map(service => {
    const serviceAppointments = appointments.filter(
      app => app.servicio?.nombre === service.nombre
    );
    return {
      service: service.nombre || 'Servicio Desconocido',
      total: serviceAppointments.length,
      confirmed: serviceAppointments.filter(app => app.estado === 'reservado').length,
      cancelled: serviceAppointments.filter(app => app.estado === 'cancelado').length,
    };
  }).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Estadísticas</h1>
        <p className="text-gray-600">Resumen general del sistema de citas médicas</p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mainStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-6 h-6 ${stat.textColor}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cancellation Rate */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Tasa de Cancelación</h3>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              stats.cancellationRate > 20 ? 'bg-red-100 text-red-800' :
              stats.cancellationRate > 10 ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}
          >
            {stats.cancellationRate.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              stats.cancellationRate > 20 ? 'bg-red-500' :
              stats.cancellationRate > 10 ? 'bg-yellow-500' :
              'bg-green-500'
            }`}
            style={{ width: `${Math.min(stats.cancellationRate, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Appointments by Service */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Citas por Servicio</h2>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Servicio</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Total</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Confirmadas</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Canceladas</th>
                </tr>
              </thead>
              <tbody>
                {appointmentsByService.map((item, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{item.service}</td>
                    <td className="py-3 px-4 text-center font-semibold">{item.total}</td>
                    <td className="py-3 px-4 text-center text-green-600 font-medium">{item.confirmed}</td>
                    <td className="py-3 px-4 text-center text-red-600 font-medium">{item.cancelled}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Appointments by Day Chart */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">Citas por Día (Últimos 7 días)</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {Object.entries(stats.appointmentsByDay).map(([date, count]) => (
              <div key={date} className="flex items-center">
                <div className="w-24 text-sm text-gray-600">
                  {new Date(date).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${Math.max((count / Math.max(...Object.values(stats.appointmentsByDay), 1)) * 100, 5)}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-8 text-sm font-medium text-gray-900">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estadisticas;
