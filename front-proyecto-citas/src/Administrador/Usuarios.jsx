import React, { useState, useEffect } from 'react';
import { User, Search, Mail, Phone, Calendar, Shield, UserCheck, X } from 'lucide-react';
import { ApiUsuarios } from '../common/server';

const Usuarios = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Función para obtener los usuarios desde la API
  useEffect(() => {
    const obtenerUsuarios = async () => {
      try {
        const response = await fetch(ApiUsuarios);
        const data = await response.json();
        // Excluir la contraseña de los datos
        const usersWithoutPasswords = data.map(({ contrasenia, ...user }) => ({
          ...user,
          id: user._id, // Mapear _id a id para consistencia
          rol: user.rol.toLowerCase(), // Normalizar roles a minúsculas para los filtros
          status: user.status.toLowerCase(), // Normalizar estados a minúsculas para los filtros
        }));
        setUsers(usersWithoutPasswords);
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    };

    obtenerUsuarios();
  }, []);

  // Función para formatear la fecha
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Función para obtener el nombre completo
  const getFullName = (user) => {
    return `${user.nombre} ${user.apellido1} ${user.apellido2}`.trim();
  };

  // Filtrado de usuarios
  const filteredUsers = users
    .filter((user) => {
      const fullName = `${user.nombre} ${user.apellido1} ${user.apellido2}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchTerm.toLowerCase()) ||
        user.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.telefono.includes(searchTerm);

      const matchesRole = roleFilter === 'all' || user.rol === roleFilter;
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

      return matchesSearch && matchesRole && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Cálculos para estadísticas
  const totalUsers = users.length;
  const adminUsers = users.filter((user) => user.rol === 'administrador').length;
  const clienteUsers = users.filter((user) => user.rol === 'cliente').length;
  const activeUsers = users.filter((user) => user.status === 'activo').length;
  const inactiveUsers = users.filter((user) => user.status === 'inactivo').length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Usuarios</h1>
        <p className="text-gray-600">Administra todos los usuarios del sistema</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-50">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-50">
              <User className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{clienteUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-50">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Administradores</p>
              <p className="text-2xl font-bold text-gray-900">{adminUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-emerald-50">
              <UserCheck className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Activos</p>
              <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-50">
              <X className="w-6 h-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactivos</p>
              <p className="text-2xl font-bold text-gray-900">{inactiveUsers}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre, correo o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Todos los roles</option>
              <option value="cliente">Clientes</option>
              <option value="administrador">Administradores</option>
            </select>
          </div>

          <div className="relative">
            <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Lista de Usuarios */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Usuarios ({filteredUsers.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          {filteredUsers.length === 0 ? (
            <div className="p-8 text-center">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron usuarios</h3>
              <p className="text-gray-600">Intenta ajustar los filtros de búsqueda</p>
            </div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          user.rol === 'administrador' ? 'bg-red-100' : 'bg-blue-100'
                        }`}
                      >
                        {user.rol === 'administrador' ? (
                          <Shield className="w-6 h-6 text-red-600" />
                        ) : (
                          <User className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{getFullName(user)}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.rol === 'administrador'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {user.rol === 'administrador' ? 'Administrador' : 'Cliente'}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            user.status === 'activo'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.status === 'activo' ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2" />
                          {user.correo}
                        </div>
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2" />
                          {user.telefono}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          Registrado: {formatDate(user.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-2" />
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Usuarios;