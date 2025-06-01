import React from 'react';

const Administrador = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-4">
        <h2 className="text-2xl font-bold text-green-600 mb-6">Admin Panel</h2>
        <nav className="space-y-4">
          <a href="#" className="block text-gray-700 hover:text-green-600 font-medium">
            Dashboard
          </a>
          <a href="#" className="block text-gray-700 hover:text-green-600 font-medium">
            Usuarios
          </a>
          <a href="#" className="block text-gray-700 hover:text-green-600 font-medium">
            Crear Usuario
          </a>
          <a href="#" className="block text-gray-700 hover:text-green-600 font-medium">
            Configuración
          </a>
          <a href="#" className="block text-red-500 hover:text-red-700 font-medium">
            Cerrar Sesión
          </a>
        </nav>
      </aside>

      {/* Contenido principal */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Bienvenido, Administrador</h1>

        {/* Tarjetas resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white shadow-md p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Usuarios activos</h3>
            <p className="text-3xl font-bold text-green-600">42</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Nuevos registros</h3>
            <p className="text-3xl font-bold text-blue-600">8</p>
          </div>
          <div className="bg-white shadow-md p-6 rounded-xl">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Usuarios inactivos</h3>
            <p className="text-3xl font-bold text-red-500">5</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Administrador;
