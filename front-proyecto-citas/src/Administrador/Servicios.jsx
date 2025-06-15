import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Stethoscope, Clock, Eye, EyeOff } from 'lucide-react';
import { ApiServices } from '../common/server';
import Swal from 'sweetalert2';

const Servicios = () => {
  const [services, setServices] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    duracion: 30,
    estado: 'Disponible',
  });

  // Obtener todos los servicios al cargar el componente
  const fetchServices = async () => {
    try {
      const response = await fetch(ApiServices);
      const data = await response.json();
      // Mapear _id a id y normalizar estado
      const formattedData = data.map(({ _id, ...service }) => ({
        id: _id,
        ...service,
        estado: service.estado || 'Disponible', // Asegurar valor por defecto
      }));
      setServices(formattedData);
    } catch (error) {
      console.error('Error al obtener servicios:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudieron cargar los servicios. Inténtalo de nuevo.',
      });
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingService) {
        // Actualizar servicio
        const response = await fetch(`${ApiServices}/${editingService}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const updatedService = await response.json();
          setServices(
            services.map((service) =>
              service.id === editingService
                ? { ...updatedService, id: updatedService._id }
                : service
            )
          );
          setEditingService(null);
          Swal.fire({
            icon: 'success',
            title: 'Servicio Actualizado',
            text: 'El servicio ha sido actualizado correctamente.',
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          throw new Error('Error al actualizar el servicio');
        }
      } else {
        // Crear nuevo servicio
        const response = await fetch(ApiServices, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          const newService = await response.json();
          setServices([...services, { ...newService, id: newService._id }]);
          setIsCreating(false);
          Swal.fire({
            icon: 'success',
            title: 'Servicio Creado',
            text: 'El servicio ha sido creado correctamente.',
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          throw new Error('Error al crear el servicio');
        }
      }

      resetForm();
    } catch (error) {
      console.error('Error en la operación:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al procesar la solicitud. Inténtalo de nuevo.',
      });
    }
  };

  const handleEdit = (service) => {
    setFormData({
      nombre: service.nombre,
      descripcion: service.descripcion,
      duracion: service.duracion,
      estado: service.estado,
    });
    setEditingService(service.id);
    setIsCreating(false);
  };

  const handleDelete = async (serviceId) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Estás seguro?',
      text: '¿Deseas eliminar este servicio? Esta acción no se puede deshacer.',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(`${ApiServices}/${serviceId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setServices(services.filter((service) => service.id !== serviceId));
          Swal.fire({
            icon: 'success',
            title: 'Servicio Eliminado',
            text: 'El servicio ha sido eliminado correctamente.',
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          throw new Error('Error al eliminar el servicio');
        }
      } catch (error) {
        console.error('Error al eliminar el servicio:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar el servicio. Inténtalo de nuevo.',
        });
      }
    }
  };

  const handleToggleAvailability = async (service) => {
    const newEstado = service.estado === 'Disponible' ? 'No disponible' : 'Disponible';
    try {
      const response = await fetch(`${ApiServices}/${service.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...service, estado: newEstado }),
      });

      if (response.ok) {
        const updatedService = await response.json();
        setServices(
          services.map((s) =>
            s.id === service.id ? { ...updatedService, id: updatedService._id } : s
          )
        );
        Swal.fire({
          icon: 'success',
          title: 'Estado Actualizado',
          text: `El servicio ahora está ${newEstado.toLowerCase()}.`,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        throw new Error('Error al actualizar el estado');
      }
    } catch (error) {
      console.error('Error al actualizar el estado:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo actualizar el estado del servicio.',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      duracion: 30,
      estado: 'Disponible',
    });
  };

  const cancelEdit = () => {
    setEditingService(null);
    setIsCreating(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Servicios</h1>
          <p className="text-gray-600">Administra los servicios médicos disponibles</p>
        </div>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Servicio
        </button>
      </div>

      {/* Formulario de Creación/Edición */}
      {(isCreating || editingService) && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingService ? 'Editar Servicio' : 'Crear Nuevo Servicio'}
            </h2>
            <button
              onClick={cancelEdit}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Servicio
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración (minutos)
                </label>
                <input
                  type="number"
                  value={formData.duracion}
                  onChange={(e) =>
                    setFormData({ ...formData, duracion: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="15"
                  max="180"
                  step="15"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Disponible">Disponible</option>
                <option value="No disponible">No disponible</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={cancelEdit}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {editingService ? 'Actualizar' : 'Crear'} Servicio
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de Servicios */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900">
            Servicios ({services.length})
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          {services.length === 0 ? (
            <div className="p-8 text-center">
              <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay servicios</h3>
              <p className="text-gray-600">Crea tu primer servicio médico</p>
            </div>
          ) : (
            services.map((service) => (
              <div key={service.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          service.estado === 'Disponible' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}
                      >
                        <Stethoscope
                          className={`w-6 h-6 ${
                            service.estado === 'Disponible' ? 'text-blue-600' : 'text-gray-400'
                          }`}
                        />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{service.nombre}</h3>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            service.estado === 'Disponible'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {service.estado}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{service.descripcion}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{service.duracion} minutos</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleAvailability(service)}
                      className={`p-2 rounded-full transition-colors ${
                        service.estado === 'Disponible'
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={
                        service.estado === 'Disponible'
                          ? 'Desactivar servicio'
                          : 'Activar servicio'
                      }
                    >
                      {service.estado === 'Disponible' ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEdit(service)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                      title="Editar servicio"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(service.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Eliminar servicio"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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

export default Servicios;
