import React, { useEffect, useState } from 'react';
import { Search, Calendar, Clock, Stethoscope, AlertCircle } from 'lucide-react';
import { ApiServices } from '../common/server';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

const ClienteServicios = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Usar la misma URL base que tu API para WebSocket
  const socket = io('https://api-3-services-production.up.railway.app', { 
    autoConnect: false,
    path: '/socket.io' // Asegúrate de que este sea el path correcto en tu backend
  });

  // Función para obtener los servicios de la API
  const obtenerServicios = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(ApiServices);
      if (!response.ok) {
        throw new Error(`Error al cargar servicios: ${response.status}`);
      }
      const data = await response.json();
      console.log('Datos recibidos:', data); // Para depuración
      
      // Eliminado el filtro por estado ya que los datos no incluyen ese campo
      setServices(data);
      setError(null);
    } catch (error) {
      console.error('Error al obtener los servicios:', error);
      setError('No se pudieron cargar los servicios. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Configurar WebSocket
  useEffect(() => {
    // Conectar al servidor WebSocket
    socket.connect();

    // Escuchar evento de nuevo servicio
    socket.on('nuevoServicio', (nuevoServicio) => {
      console.log('Nuevo servicio recibido via WebSocket:', nuevoServicio);
      setServices((prevServices) => {
        // Evitar duplicados verificando _id
        if (!prevServices.some((s) => s._id === nuevoServicio._id)) {
          return [...prevServices, nuevoServicio];
        }
        return prevServices;
      });
    });

    // Cargar servicios iniciales
    obtenerServicios();

    // Limpiar al desmontar el componente
    return () => {
      socket.off('nuevoServicio');
      socket.disconnect();
    };
  }, []);

  // Filtrado por término de búsqueda
  const serviciosFiltrados = services.filter((service) =>
    service.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Título y descripción */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Servicios Médicos</h1>
        <p className="text-gray-600">Reserva una cita para nuestros servicios médicos especializados</p>
      </div>

      {/* Buscador */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar servicios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Mensaje de carga */}
      {isLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando servicios...</p>
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Lista de Servicios */}
      {!isLoading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviciosFiltrados.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
            >
              <div className="p-6">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                      <Stethoscope className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.nombre}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.descripcion}</p>
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{service.duracion} minutos</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    onClick={() => navigate(`/reservar/${service._id}`, { state: { service } })}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Reservar Cita
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mensaje si no hay resultados */}
      {!isLoading && !error && serviciosFiltrados.length === 0 && (
        <div className="text-center py-12">
          <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron servicios</h3>
          <p className="text-gray-600">Intenta con otros términos de búsqueda</p>
        </div>
      )}
    </div>
  );
};

export default ClienteServicios;