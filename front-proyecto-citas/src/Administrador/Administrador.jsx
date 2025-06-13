import React, { useState } from 'react';
import AdminHeader from './AdminHeader';
import { BarChart3,Users,Stethoscope } from 'lucide-react'; 
import Usuarios from './Usuarios'; 

const Administrador = () => {
  // Variable de estado para ir cambiando las diferentes secciones
  const [currentView, setCurrentView] = useState('stats');

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader/>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <nav className="flex space-x-1 bg-white rounded-lg p-1 shadow-sm overflow-x-auto">
            <button 
              onClick={() => setCurrentView('stats')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                currentView === 'stats' ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}>
              <BarChart3 className="w-4 h-4" />
              <span>Estadísticas</span>
            </button>
            <button
              onClick={() => setCurrentView('users')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                currentView === 'users'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Usuarios</span>
            </button>
            <button
              onClick={() => setCurrentView('services')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors whitespace-nowrap ${
                currentView === 'services'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Stethoscope className="w-4 h-4" />
              <span>Servicios</span>
            </button>
          </nav>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          {currentView === 'users' && <Usuarios />}
        </div>
      </div>
    </div>
  );
};

export default Administrador;
