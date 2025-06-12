import React, { useState } from 'react';
import { useAppointments, MedicalService } from '../../contexts/AppointmentContext';
import { Plus, Edit, Trash2, Save, X, Stethoscope, Clock, Eye, EyeOff } from 'lucide-react';

export const ServiceManagement: React.FC = () => {
  const { services, createService, updateService, deleteService } = useAppointments();
  const [isCreating, setIsCreating] = useState(false);
  const [editingService, setEditingService] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    available: true,
    icon: 'stethoscope'
  });

  const iconOptions = [
    { value: 'stethoscope', label: 'Estetoscopio', icon: '🩺' },
    { value: 'baby', label: 'Bebé', icon: '👶' },
    { value: 'shield-check', label: 'Escudo', icon: '🛡️' },
    { value: 'test-tube', label: 'Tubo de ensayo', icon: '🧪' },
    { value: 'smile', label: 'Sonrisa', icon: '😊' },
    { value: 'apple', label: 'Manzana', icon: '🍎' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingService) {
      await updateService(editingService, formData);
      setEditingService(null);
    } else {
      await createService(formData);
      setIsCreating(false);
    }
    
    resetForm();
  };

  const handleEdit = (service: MedicalService) => {
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration,
      available: service.available,
      icon: service.icon
    });
    setEditingService(service.id);
    setIsCreating(false);
  };

  const handleDelete = async (serviceId: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este servicio?')) {
      await deleteService(serviceId);
    }
  };

  const handleToggleAvailability = async (service: MedicalService) => {
    await updateService(service.id, { available: !service.available });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: 30,
      available: true,
      icon: 'stethoscope'
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

      {/* Create/Edit Form */}
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
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icono
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {iconOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.icon} {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración (minutos)
                </label>
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
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
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="available"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
                Servicio disponible
              </label>
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

      {/* Services List */}
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
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        service.available ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        <Stethoscope className={`w-6 h-6 ${
                          service.available ? 'text-blue-600' : 'text-gray-400'
                        }`} />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          service.available 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {service.available ? 'Disponible' : 'No disponible'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{service.description}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{service.duration} minutos</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleAvailability(service)}
                      className={`p-2 rounded-full transition-colors ${
                        service.available 
                          ? 'text-green-600 hover:bg-green-50' 
                          : 'text-gray-400 hover:bg-gray-50'
                      }`}
                      title={service.available ? 'Desactivar servicio' : 'Activar servicio'}
                    >
                      {service.available ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
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