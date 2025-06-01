import React from 'react';

const Cliente = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Encabezado */}
      <header className="bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold text-green-600">Bienvenido, Cliente</h1>
      </header>

      {/* Contenido principal */}
      <main className="flex-1 p-6">
        <section className="mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Tu información</h2>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <p className="text-gray-700"><span className="font-semibold">Nombre:</span> Orlando Urbano Trejo</p>
            <p className="text-gray-700"><span className="font-semibold">Correo:</span> orlandourbanotrejo@gmail.com</p>
            <p className="text-gray-700"><span className="font-semibold">Teléfono:</span> 5614364142</p>
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Acciones disponibles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-xl shadow">
              Ver Perfil
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-xl shadow">
              Actualizar Datos
            </button>
            <button className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-xl shadow">
              Cerrar Sesión
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Cliente;
