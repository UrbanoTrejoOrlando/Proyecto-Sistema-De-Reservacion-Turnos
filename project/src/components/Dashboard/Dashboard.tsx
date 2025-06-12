import React, { useState } from 'react';
import { Header } from './Header';
import { ServiceCard } from './ServiceCard';
import { ServiceBooking } from './ServiceBooking';
import { AppointmentList } from './AppointmentList';
import { useAppointments, MedicalService } from '../../contexts/AppointmentContext';
import { Calendar, Stethoscope, Search, Filter } from 'lucide-react';

type View = 'services' | 'booking' | 'appointments';

export const Dashboard: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('services');
  const [selectedService, setSelectedService] = useState<MedicalService | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { services } = useAppointments();

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch && service.available;
  });

  const handleServiceSelect = (service: MedicalService) => {
    setSelectedService(service);
    setCurrentView('booking');
  };

  const handleBackToServices = () => {
    setCurrentView('services');
    setSelectedService(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation */}
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

        {/* Content */}
        {currentView === 'services' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Servicios Médicos</h1>
              <p className="text-gray-600">Reserva una cita para nuestros servicios médicos especializados</p>
            </div>

            {/* Search */}
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

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map(service => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onSelect={handleServiceSelect}
                />
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <Stethoscope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron servicios</h3>
                <p className="text-gray-600">Intenta con otros términos de búsqueda</p>
              </div>
            )}
          </div>
        )}

        {currentView === 'booking' && selectedService && (
          <ServiceBooking
            service={selectedService}
            onBack={handleBackToServices}
          />
        )}

        {currentView === 'appointments' && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Mis Citas Médicas</h1>
              <p className="text-gray-600">Gestiona y revisa tus citas programadas</p>
            </div>
            <AppointmentList />
          </div>
        )}
      </div>
    </div>
  );
};