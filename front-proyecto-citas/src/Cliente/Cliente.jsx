import React, { useState } from 'react';
import ClienteHeader from './ClienteHeader';
import { Stethoscope, Calendar } from 'lucide-react';
import ClienteServicios from './ClienteServicios';
import Turnos from './Turnos';

const Cliente = () => {
  const [currentView, setCurrentView] = useState('services');

  return (
    <div className="min-h-screen bg-gray-50">
      <ClienteHeader />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navegación */}
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm">
            <button
              onClick={() => setCurrentView('services')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                currentView === 'services'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Servicios</span>
            </button>

            <button
              onClick={() => setCurrentView('appointments')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                currentView === 'appointments'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Mis Citas</span>
            </button>
          </nav>
        </div>

        {/* Contenido dinámico */}
        {currentView === 'services' && <ClienteServicios />}
        {currentView === 'appointments' && <Turnos />}
      </div>
    </div>
  );
};

export default Cliente;
