import React from 'react';
import { LogOut, Shield, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminHeader = () => {
    // Variable para manejar las rutas 
    const navigate = useNavigate();

    // Obtener los datos desde localStorage
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    const nombreCompleto = usuario 
    ? `${usuario.nombre} ${usuario.apellido1} ${usuario.apellido2}`
    : 'Administrador';

    // Funcion para cerrar sesion   
    const cerrarSesion = () => {
        localStorage.clear();
        navigate('/login');
    };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">
                MediReserva Admin
              </h1>
            </div>
            <div className="ml-4 px-3 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
              Panel de Administración
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
              <Bell className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-red-600" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{nombreCompleto}</p>
                  <p className="text-xs text-red-600 font-medium">Administrador</p>
                </div>
              </div>

              <button
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                title="Cerrar sesión"
                onClick={cerrarSesion}
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

export default AdminHeader;
