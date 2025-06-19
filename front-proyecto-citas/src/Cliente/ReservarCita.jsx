import React, { useState, useEffect } from 'react';
import { ArrowLeft, RefreshCw, Info, Clock, Calendar, AlertCircle } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ApiServices, ApiTurnos } from '../common/server';
import Swal from 'sweetalert2';
import ClienteHeader from './ClienteHeader';

const ReservarCita = () => {
  const navigate = useNavigate();
  const { serviceId } = useParams();
  const location = useLocation();

  const [service, setService] = useState(location.state?.service || null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!location.state?.service);

  useEffect(() => {
    if (!service && serviceId) {
      const fetchService = async () => {
        try {
          const response = await fetch(`${ApiServices}/${serviceId}`);
          if (!response.ok) {
            throw new Error(`Servicio no encontrado: ${response.status}`);
          }
          const data = await response.json();
          setService({
            nombre: data.nombre,
            descripcion: data.descripcion || 'Sin descripción',
            duracion: data.duracion || 30,
          });
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchService();
    } else if (service) {
      setLoading(false);
    }
  }, [serviceId, service]);

  const fetchAvailableSlots = async (date) => {
    setIsRefreshing(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Debes iniciar sesión para continuar');
      }

      const response = await fetch(
        `${ApiTurnos}/disponibilidad?servicioId=${serviceId}&fecha=${date}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error al obtener horarios: ${response.status}`);
      }

      const data = await response.json();

      const now = new Date();
      const isToday = date === now.toISOString().split('T')[0];

      const slots = data
        .filter((time) => {
          if (!isToday) return true;
          const [hour, minute] = time.split(':');
          const slotTime = new Date(date + 'T' + time + ':00');
          return slotTime > now;
        })
        .map((time) => ({ time, available: true }));

      setAvailableSlots(slots);
    } catch (err) {
      console.error('Error en fetchAvailableSlots:', err);
      setError(err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (selectedDate && serviceId) {
      fetchAvailableSlots(selectedDate);
    }
  }, [selectedDate, serviceId]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime('');
    setError(null);
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      setError('Por favor, selecciona una fecha y hora');
      return;
    }

    setIsBooking(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Debes iniciar sesión para reservar');
      }

      const response = await fetch(ApiTurnos, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          servicio: serviceId,
          fecha: selectedDate,
          hora: selectedTime,
          notas: 'Cita reservada desde el frontend',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || 'Error al reservar cita');
      }

      Swal.fire({
        icon: 'success',
        title: '¡Cita reservada!',
        text: `Tu cita para ${service.nombre} el ${formatSelectedDate()} a las ${selectedTime} ha sido agendada exitosamente`,
        showConfirmButton: false,
        timer: 2000,
      });

      // Actualizar lista de horarios disponibles
      await fetchAvailableSlots(selectedDate);
      
      // Redirigir después de 2 segundos
      setTimeout(() => navigate('/cliente'), 2000);
    } catch (err) {
      setError(err.message);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.message,
      });
    } finally {
      setIsBooking(false);
    }
  };

  const getMinDate = () => new Date().toISOString().split('T')[0];
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    const [year, month, day] = selectedDate.split('-');
    const date = new Date(Number(year), Number(month) - 1, Number(day));
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const availableSlotsCount = availableSlots.filter((slot) => slot.available).length;

  if (loading) {
    return (
      <>
        <ClienteHeader />
        <div className="text-center py-12">Cargando servicio...</div>
      </>
    );
  }
  if (!service) {
    return (
      <>
        <ClienteHeader />
        <div className="text-center py-12 text-red-500">{error || 'Servicio no encontrado'}</div>
      </>
    );
  }

  return (
    <>
      <ClienteHeader />
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-gray-900">{service.nombre}</h2>
              <p className="text-gray-600">{service.descripcion}</p>
            </div>
            <button
              onClick={() => selectedDate && fetchAvailableSlots(selectedDate)}
              disabled={isRefreshing || !selectedDate}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              title="Actualizar horarios"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
        <div className="p-6">
          <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <div className="flex items-center mb-2">
              <Info className="w-5 h-5 text-blue-600 mr-2" />
              <h4 className="font-semibold text-gray-900">Información del Servicio</h4>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-gray-700">Duración: {service.duracion} minutos</span>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Calendar className="w-4 h-4 inline mr-2" />
                Selecciona una fecha
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => handleDateChange(e.target.value)}
                min={getMinDate()}
                max={getMaxDate()}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {selectedDate && (
                <div className="mt-2 text-sm text-gray-600">
                  <strong>Fecha seleccionada:</strong> {formatSelectedDate()}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-semibold text-gray-700">
                  <Clock className="w-4 h-4 inline mr-2" />
                  Horarios disponibles
                </label>
                <div className="flex items-center text-sm text-gray-600">
                  <span className="mr-2">{availableSlotsCount} disponibles</span>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </div>
              {availableSlots.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {availableSlots.map(({ time, available }) => (
                    <button
                      key={time}
                      onClick={() => available && setSelectedTime(time)}
                      disabled={!available}
                      className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 relative ${
                        available
                          ? selectedTime === time
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {time}
                      {available && (
                        <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    No hay horarios disponibles para esta fecha.
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Por favor, selecciona otra fecha o actualiza los horarios.
                  </p>
                </div>
              )}
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              </div>
            )}
            {selectedTime && (
              <div className="pt-4 border-t border-gray-100">
                <div className="bg-green-50 rounded-xl p-4 mb-4">
                  <h4 className="font-semibold text-gray-900 mb-2">Resumen de la cita:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><strong>Servicio:</strong> {service.nombre}</p>
                    <p><strong>Duración:</strong> {service.duracion} minutos</p>
                    <p><strong>Fecha:</strong> {formatSelectedDate()}</p>
                    <p><strong>Hora:</strong> {selectedTime}</p>
                  </div>
                </div>
                <button
                  onClick={handleBookAppointment}
                  disabled={isBooking}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center"
                >
                  {isBooking ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Reservando...
                    </>
                  ) : (
                    'Confirmar Reserva'
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ReservarCita;