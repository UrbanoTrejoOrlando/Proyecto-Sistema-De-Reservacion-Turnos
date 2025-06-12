import React, { useState, useEffect } from 'react';
import { useAppointments, MedicalService, TimeSlot } from '../../contexts/AppointmentContext';
import { ArrowLeft, Calendar, Clock, Check, Info, RefreshCw, AlertCircle } from 'lucide-react';

interface ServiceBookingProps {
  service: MedicalService;
  onBack: () => void;
}

export const ServiceBooking: React.FC<ServiceBookingProps> = ({ service, onBack }) => {
  const { selectedDate, setSelectedDate, getAvailableSlots, bookAppointment, refreshData } = useAppointments();
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isBooking, setIsBooking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string>('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const updateAvailableSlots = () => {
    const slots = getAvailableSlots(service.id, selectedDate);
    setAvailableSlots(slots);
    setSelectedTime('');
    setError('');
  };

  useEffect(() => {
    updateAvailableSlots();
  }, [service.id, selectedDate, getAvailableSlots]);

  // Auto-refresh slots every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      updateAvailableSlots();
    }, 30000);

    return () => clearInterval(interval);
  }, [service.id, selectedDate]);

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    setError('');
  };

  const handleRefreshSlots = async () => {
    setIsRefreshing(true);
    refreshData();
    
    // Small delay to show refresh animation
    setTimeout(() => {
      updateAvailableSlots();
      setIsRefreshing(false);
    }, 500);
  };

  const handleBookAppointment = async () => {
    if (!selectedTime) return;

    setIsBooking(true);
    setError('');
    
    try {
      const success = await bookAppointment(service.id, selectedDate, selectedTime);
      
      if (success) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          onBack();
        }, 2000);
      } else {
        setError('Este horario ya no está disponible. Por favor, selecciona otro horario.');
        updateAvailableSlots(); // Refresh to show current availability
      }
    } catch (error) {
      console.error('Error booking appointment:', error);
      setError('Error al reservar la cita. Por favor, intenta nuevamente.');
    } finally {
      setIsBooking(false);
    }
  };

  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  // Fix timezone issue - format date correctly for display
  const formatSelectedDate = () => {
    // Create date object and ensure it's in local timezone
    const [year, month, day] = selectedDate.split('-').map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed
    
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const availableSlotsCount = availableSlots.filter(slot => slot.available).length;

  if (showSuccess) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">¡Cita Reservada!</h3>
        <p className="text-gray-600">Tu cita ha sido confirmada exitosamente.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-3"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-900">{service.name}</h2>
            <p className="text-gray-600">{service.description}</p>
          </div>
          <button
            onClick={handleRefreshSlots}
            disabled={isRefreshing}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="Actualizar horarios disponibles"
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* Service Info */}
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
          <div className="flex items-center mb-2">
            <Info className="w-5 h-5 text-blue-600 mr-2" />
            <h4 className="font-semibold text-gray-900">Información del Servicio</h4>
          </div>
          <div className="flex items-center text-sm">
            <Clock className="w-4 h-4 text-blue-600 mr-2" />
            <span className="text-gray-700">Duración: {service.duration} minutos</span>
          </div>
        </div>

        <div className="space-y-6">
          {/* Date Selection */}
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
            {/* Show selected date for verification */}
            <div className="mt-2 text-sm text-gray-600">
              <strong>Fecha seleccionada:</strong> {formatSelectedDate()}
            </div>
          </div>

          {/* Time Selection */}
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
            
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {availableSlots.map(({ time, available }) => (
                <button
                  key={time}
                  onClick={() => available && setSelectedTime(time)}
                  disabled={!available}
                  className={`
                    p-3 rounded-lg text-sm font-medium transition-all duration-200 relative
                    ${available
                      ? selectedTime === time
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-50 text-gray-700 hover:bg-blue-50 hover:text-blue-600 hover:shadow-sm'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }
                  `}
                >
                  {time}
                  {available && (
                    <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
                  )}
                </button>
              ))}
            </div>
            
            {availableSlotsCount === 0 && (
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

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Book Button */}
          {selectedTime && (
            <div className="pt-4 border-t border-gray-100">
              <div className="bg-green-50 rounded-xl p-4 mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Resumen de la cita:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Servicio:</strong> {service.name}</p>
                  <p><strong>Duración:</strong> {service.duration} minutos</p>
                  <p><strong>Fecha:</strong> {formatSelectedDate()}</p>
                  <p><strong>Hora:</strong> {selectedTime}</p>
                </div>
              </div>
              
              <button
                onClick={handleBookAppointment}
                disabled={isBooking}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center"
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
  );
};