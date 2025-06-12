import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, Bell, Shield } from 'lucide-react';

export const Header: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();

  const getFullName = () => {
    if (!user) return '';
    return `${user.nombre} ${user.apellido1} ${user.apellido2}`.trim();
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">MediReserva</h1>
            </div>
            {isAdmin && (
              <div className="ml-4 px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                Modo Administrador
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isAdmin ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  {isAdmin ? (
                    <Shield className="w-4 h-4 text-red-600" />
                  ) : (
                    <User className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{getFullName()}</p>
                  <p className="text-xs text-gray-500">{user?.correo}</p>
                </div>
              </div>
              
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};