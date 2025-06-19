import React, { useEffect, useState } from 'react';
import { Calendar, Clock, Stethoscope, X } from 'lucide-react';
import { ApiTurnos } from '../common/server';
import Swal from 'sweetalert2';

const Turnos = () => {
  const [turnos, setTurnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTurnos = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Debes iniciar sesión para ver tus citas');

        const response = await fetch(`${ApiTurnos}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || 'Error al obtener tus turnos');
        }

        const data = await response.json();
        setTurnos(data);
      } catch (err) {
        setError(err.message);
        Swal.fire('Error', err.message, 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchTurnos();
  }, []);

  const formatFecha = (fechaStr) => {
    const [year, month, day] = fechaStr.split('T')[0].split('-').map(Number);
    const fecha = new Date(year, month - 1, day);
    return fecha.toLocaleDateString('es-MX', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const isPastDate = (fecha, hora) => {
    const [year, month, day] = fecha.split('T')[0].split('-').map(Number);
    const [hours, minutes] = hora.split(':').map(Number);
    const appointmentDate = new Date(year, month - 1, day, hours, minutes);
    return appointmentDate < new Date();
  };

  const handleCancelTurno = async (turnoId) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta cita?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${ApiTurnos}/${turnoId}/cancelar`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || 'Error al cancelar la cita');
        }

        setTurnos(
          turnos.map((turno) =>
            turno._id === turnoId ? { ...turno, estado: 'cancelado' } : turno
          )
        );
        Swal.fire('Éxito', 'Cita cancelada correctamente', 'success');
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  };

  const upcomingTurnos = turnos.filter(
    (turno) => turno.estado === 'reservado' && !isPastDate(turno.fecha, turno.hora)
  );
  const pastTurnos = turnos.filter(
    (turno) => turno.estado !== 'reservado' || isPastDate(turno.fecha, turno.hora)
  );

  if (loading) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm text-center">
        <p className="text-gray-500">Cargando tus citas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm text-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (turnos.length === 0) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-sm text-center">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No tienes citas programadas</h3>
        <p className="text-gray-600">Reserva tu primera cita médica para comenzar.</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Citas Próximas */}
      {upcomingTurnos.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Próximas Citas
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {upcomingTurnos.map((turno) => (
              <div
                key={turno._id}
                className="p-6 hover:bg-gray-50 transition-colors flex items-start justify-between"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {turno.servicio?.nombre || 'Servicio desconocido'}
                    </h3>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatFecha(turno.fecha)}
                      </p>
                      <p className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {turno.hora}
                      </p>
                      <p>Duración: {turno.servicio?.duracion || '??'} minutos</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="px-3 py-1 rounded-full text-xs font-medium text-green-600 bg-green-50">
                    Reservada
                  </span>
                  <button
                    onClick={() => handleCancelTurno(turno._id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    title="Cancelar cita"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historial de Citas */}
      {pastTurnos.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-gray-600" />
              Historial de Citas
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            {pastTurnos.map((turno) => (
              <div
                key={turno._id}
                className="p-6 hover:bg-gray-50 transition-colors flex items-start justify-between"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Stethoscope className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {turno.servicio?.nombre || 'Servicio desconocido'}
                    </h3>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {formatFecha(turno.fecha)}
                      </p>
                      <p className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        {turno.hora}
                      </p>
                      <p>Duración: {turno.servicio?.duracion || '??'} minutos</p>
                    </div>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    turno.estado === 'cancelado'
                      ? 'text-red-600 bg-red-50'
                      : 'text-gray-600 bg-gray-50'
                  }`}
                >
                  {turno.estado === 'cancelado' ? 'Cancelada' : 'Completada'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Turnos;
  