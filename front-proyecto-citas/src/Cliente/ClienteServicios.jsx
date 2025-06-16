import React, { useEffect, useState } from 'react';
import { Search, Calendar, Clock, Stethoscope } from 'lucide-react';
import { ApiServices } from '../common/server';

const ClienteServicios = () => {
  const [services, setServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // Función para obtener los servicios de la API
  const obtenerServicios = async () => {
    try {
      const response = await fetch(ApiServices);
      const data = await response.json();
      // Filtrar solo los servicios con estado "Disponible"
      const disponibles = data.filter(servicio => servicio.estado === 'Disponible');
      setServices(disponibles);
    } catch (error) {
      console.error('Error al obtener los servicios:', error);
    }
  };

  useEffect(() => {
    obtenerServicios();
  }, []);

  // Filtrado por término de búsqueda
  const serviciosFiltrados = services.filter(service =>
    service.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
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

      {/* Lista de Servicios */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {serviciosFiltrados.map((service) => (
          <div
            key={service._id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
            onClick={() => console.log('Reservar servicio:', service.nombre)} // Aquí puedes abrir modal o ir a booking
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
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Reservar Cita
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje si no hay resultados */}
      {serviciosFiltrados.length === 0 && (
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
