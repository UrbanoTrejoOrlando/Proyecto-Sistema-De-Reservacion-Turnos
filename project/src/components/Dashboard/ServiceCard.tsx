import React from 'react';
import { MedicalService } from '../../contexts/AppointmentContext';
import { Calendar, Clock, Stethoscope, Baby, ShieldCheck, TestTube, Smile, Apple } from 'lucide-react';

interface ServiceCardProps {
  service: MedicalService;
  onSelect: (service: MedicalService) => void;
}

const getServiceIcon = (iconName: string) => {
  const icons = {
    stethoscope: Stethoscope,
    baby: Baby,
    'shield-check': ShieldCheck,
    'test-tube': TestTube,
    smile: Smile,
    apple: Apple
  };
  
  const IconComponent = icons[iconName as keyof typeof icons] || Stethoscope;
  return IconComponent;
};

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  const IconComponent = getServiceIcon(service.icon);

  if (!service.available) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer transform hover:scale-[1.02]"
         onClick={() => onSelect(service)}>
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <IconComponent className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{service.description}</p>
            
            <div className="flex items-center text-sm text-gray-500 mb-4">
              <Clock className="w-4 h-4 mr-1" />
              <span>{service.duration} minutos</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center">
            <Calendar className="w-4 h-4 mr-2" />
            Reservar Cita
          </button>
        </div>
      </div>
    </div>
  );
};