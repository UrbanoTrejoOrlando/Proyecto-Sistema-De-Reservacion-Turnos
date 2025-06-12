import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface MedicalService {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  available: boolean;
  icon: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  userId: string;
  serviceId: string;
  serviceName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
}

interface AppointmentContextType {
  services: MedicalService[];
  appointments: Appointment[];
  timeSlots: TimeSlot[];
  selectedDate: string;
  selectedService: MedicalService | null;
  bookAppointment: (serviceId: string, date: string, time: string) => Promise<boolean>;
  cancelAppointment: (appointmentId: string) => Promise<boolean>;
  getAvailableSlots: (serviceId: string, date: string) => TimeSlot[];
  setSelectedDate: (date: string) => void;
  setSelectedService: (service: MedicalService | null) => void;
  getUserAppointments: (userId: string) => Appointment[];
  createService: (service: Omit<MedicalService, 'id'>) => Promise<boolean>;
  updateService: (id: string, service: Partial<MedicalService>) => Promise<boolean>;
  deleteService: (id: string) => Promise<boolean>;
  getAppointmentStats: () => {
    totalAppointments: number;
    confirmedAppointments: number;
    cancelledAppointments: number;
    appointmentsByDay: { [key: string]: number };
    appointmentsByService: { [key: string]: number };
    cancellationRate: number;
  };
  refreshData: () => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export const useAppointments = () => {
  const context = useContext(AppointmentContext);
  if (context === undefined) {
    throw new Error('useAppointments must be used within an AppointmentProvider');
  }
  return context;
};

const DEFAULT_SERVICES: MedicalService[] = [
  {
    id: '1',
    name: 'Consulta General',
    description: 'Consulta médica general para diagnóstico y tratamiento de enfermedades comunes',
    duration: 30,
    available: true,
    icon: 'stethoscope'
  },
  {
    id: '2',
    name: 'Pediatría',
    description: 'Atención médica especializada para niños y adolescentes',
    duration: 45,
    available: true,
    icon: 'baby'
  },
  {
    id: '3',
    name: 'Medicina Preventiva',
    description: 'Consultas enfocadas en la prevención de enfermedades y promoción de la salud',
    duration: 40,
    available: true,
    icon: 'shield-check'
  },
  {
    id: '4',
    name: 'Laboratorio Clínico',
    description: 'Exámenes de laboratorio y análisis clínicos',
    duration: 15,
    available: true,
    icon: 'test-tube'
  },
  {
    id: '5',
    name: 'Odontología',
    description: 'Atención dental y tratamientos odontológicos',
    duration: 60,
    available: true,
    icon: 'smile'
  },
  {
    id: '6',
    name: 'Nutrición',
    description: 'Consulta nutricional y planes alimentarios personalizados',
    duration: 45,
    available: true,
    icon: 'apple'
  }
];

const DEFAULT_TIME_SLOTS: string[] = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
];

interface AppointmentProviderProps {
  children: ReactNode;
}

export const AppointmentProvider: React.FC<AppointmentProviderProps> = ({ children }) => {
  const [services, setServices] = useState<MedicalService[]>(DEFAULT_SERVICES);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedService, setSelectedService] = useState<MedicalService | null>(null);
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Real-time data refresh
  const refreshData = () => {
    setLastRefresh(Date.now());
  };

  useEffect(() => {
    // Load services
    const savedServices = localStorage.getItem('medicalServices');
    if (savedServices) {
      setServices(JSON.parse(savedServices));
    } else {
      localStorage.setItem('medicalServices', JSON.stringify(DEFAULT_SERVICES));
    }

    // Load appointments
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }

    // Listen for storage changes (real-time updates)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'appointments' && e.newValue) {
        setAppointments(JSON.parse(e.newValue));
      }
      if (e.key === 'medicalServices' && e.newValue) {
        setServices(JSON.parse(e.newValue));
      }
    };

    // Listen for custom refresh events
    const handleRefresh = () => {
      const savedAppointments = localStorage.getItem('appointments');
      if (savedAppointments) {
        setAppointments(JSON.parse(savedAppointments));
      }
      const savedServices = localStorage.getItem('medicalServices');
      if (savedServices) {
        setServices(JSON.parse(savedServices));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('appointmentRefresh', handleRefresh);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('appointmentRefresh', handleRefresh);
    };
  }, [lastRefresh]);

  // Auto-refresh every 30 seconds for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const saveAppointments = (newAppointments: Appointment[]) => {
    setAppointments(newAppointments);
    localStorage.setItem('appointments', JSON.stringify(newAppointments));
    
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent('appointmentRefresh'));
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'appointments',
      newValue: JSON.stringify(newAppointments)
    }));
  };

  const saveServices = (newServices: MedicalService[]) => {
    setServices(newServices);
    localStorage.setItem('medicalServices', JSON.stringify(newServices));
    
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent('appointmentRefresh'));
    window.dispatchEvent(new StorageEvent('storage', {
      key: 'medicalServices',
      newValue: JSON.stringify(newServices)
    }));
  };

  const bookAppointment = async (serviceId: string, date: string, time: string): Promise<boolean> => {
    const service = services.find(s => s.id === serviceId);
    if (!service || !service.available) return false;

    // Real-time check: refresh appointments before booking
    const currentAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    
    // Check if slot is already booked (real-time check)
    const existingAppointment = currentAppointments.find(
      (app: Appointment) => app.serviceId === serviceId && app.date === date && app.time === time && app.status === 'confirmed'
    );

    if (existingAppointment) {
      // Refresh local state to show updated data
      setAppointments(currentAppointments);
      return false;
    }

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const fullName = `${currentUser.nombre} ${currentUser.apellido1} ${currentUser.apellido2}`.trim();
    
    const newAppointment: Appointment = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: currentUser.id,
      serviceId,
      serviceName: service.name,
      date,
      time,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      patientName: fullName,
      patientEmail: currentUser.correo,
      patientPhone: currentUser.telefono
    };

    const updatedAppointments = [...currentAppointments, newAppointment];
    saveAppointments(updatedAppointments);
    return true;
  };

  const cancelAppointment = async (appointmentId: string): Promise<boolean> => {
    // Real-time check: get latest appointments
    const currentAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    
    const updatedAppointments = currentAppointments.map((app: Appointment) =>
      app.id === appointmentId ? { ...app, status: 'cancelled' as const } : app
    );
    
    saveAppointments(updatedAppointments);
    return true;
  };

  const getAvailableSlots = (serviceId: string, date: string): TimeSlot[] => {
    // Real-time check: get latest appointments
    const currentAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    
    const bookedSlots = currentAppointments
      .filter((app: Appointment) => app.serviceId === serviceId && app.date === date && app.status === 'confirmed')
      .map((app: Appointment) => app.time);

    // Filter out past time slots for today
    const now = new Date();
    const selectedDateTime = new Date(date);
    const isToday = selectedDateTime.toDateString() === now.toDateString();

    return DEFAULT_TIME_SLOTS.map(time => {
      let available = !bookedSlots.includes(time);
      
      // If it's today, disable past time slots
      if (isToday && available) {
        const [hours, minutes] = time.split(':').map(Number);
        const slotTime = new Date();
        slotTime.setHours(hours, minutes, 0, 0);
        available = slotTime > now;
      }
      
      return {
        time,
        available
      };
    });
  };

  const getUserAppointments = (userId: string): Appointment[] => {
    // Real-time check: get latest appointments
    const currentAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    return currentAppointments.filter((app: Appointment) => app.userId === userId);
  };

  const createService = async (serviceData: Omit<MedicalService, 'id'>): Promise<boolean> => {
    const newService: MedicalService = {
      ...serviceData,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
    const updatedServices = [...services, newService];
    saveServices(updatedServices);
    return true;
  };

  const updateService = async (id: string, serviceData: Partial<MedicalService>): Promise<boolean> => {
    const updatedServices = services.map(service =>
      service.id === id ? { ...service, ...serviceData } : service
    );
    saveServices(updatedServices);
    return true;
  };

  const deleteService = async (id: string): Promise<boolean> => {
    const updatedServices = services.filter(service => service.id !== id);
    saveServices(updatedServices);
    return true;
  };

  const getAppointmentStats = () => {
    // Real-time check: get latest appointments
    const currentAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    
    const totalAppointments = currentAppointments.length;
    const confirmedAppointments = currentAppointments.filter((app: Appointment) => app.status === 'confirmed').length;
    const cancelledAppointments = currentAppointments.filter((app: Appointment) => app.status === 'cancelled').length;
    
    // Appointments by day (last 7 days)
    const appointmentsByDay: { [key: string]: number } = {};
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      appointmentsByDay[dateStr] = currentAppointments.filter((app: Appointment) => app.date === dateStr).length;
    }

    // Appointments by service
    const appointmentsByService: { [key: string]: number } = {};
    services.forEach(service => {
      appointmentsByService[service.name] = currentAppointments.filter((app: Appointment) => app.serviceId === service.id).length;
    });

    const cancellationRate = totalAppointments > 0 ? (cancelledAppointments / totalAppointments) * 100 : 0;

    return {
      totalAppointments,
      confirmedAppointments,
      cancelledAppointments,
      appointmentsByDay,
      appointmentsByService,
      cancellationRate
    };
  };

  return (
    <AppointmentContext.Provider value={{
      services,
      appointments,
      timeSlots: DEFAULT_TIME_SLOTS.map(time => ({ time, available: true })),
      selectedDate,
      selectedService,
      bookAppointment,
      cancelAppointment,
      getAvailableSlots,
      setSelectedDate,
      setSelectedService,
      getUserAppointments,
      createService,
      updateService,
      deleteService,
      getAppointmentStats,
      refreshData
    }}>
      {children}
    </AppointmentContext.Provider>
  );
};