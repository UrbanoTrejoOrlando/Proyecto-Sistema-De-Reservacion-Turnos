import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface User {
  id: string;
  nombre: string;
  apellido1: string;
  apellido2: string;
  correo: string;
  telefono: string;
  rol: 'cliente' | 'admin';
  status: 'activo' | 'inactivo';
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  login: (correo: string, contrasenia: string) => Promise<boolean>;
  register: (userData: {
    nombre: string;
    apellido1: string;
    apellido2: string;
    correo: string;
    contrasenia: string;
    telefono: string;
    rol: 'cliente' | 'admin';
    status: 'activo' | 'inactivo';
  }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isAdmin: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Create default admin user
const createDefaultAdmin = () => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const adminExists = users.find((u: any) => u.correo === 'admin@medireserva.com');
  
  if (!adminExists) {
    const adminUser = {
      id: 'admin-1',
      nombre: 'Administrador',
      apellido1: 'Sistema',
      apellido2: 'MediReserva',
      correo: 'admin@medireserva.com',
      contrasenia: 'admin123',
      telefono: '+1 (555) 000-0000',
      rol: 'admin',
      status: 'activo',
      createdAt: new Date().toISOString()
    };
    users.push(adminUser);
    localStorage.setItem('users', JSON.stringify(users));
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Create default admin
    createDefaultAdmin();
    
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const clearError = () => setError(null);

  const login = async (correo: string, contrasenia: string): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find((u: any) => 
        u.correo === correo && 
        u.contrasenia === contrasenia && 
        u.status === 'activo'
      );
      
      if (user) {
        const { contrasenia: _, ...userWithoutPassword } = user;
        setUser(userWithoutPassword);
        localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
        setIsLoading(false);
        return true;
      } else {
        setError('Credenciales inválidas o cuenta inactiva.');
        setIsLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Error en login:', error);
      setError('Error al acceder a los datos.');
      setIsLoading(false);
      return false;
    }
  };

  const register = async (userData: {
    nombre: string;
    apellido1: string;
    apellido2: string;
    correo: string;
    contrasenia: string;
    telefono: string;
    rol: 'cliente' | 'admin';
    status: 'activo' | 'inactivo';
  }): Promise<boolean> => {
    setError(null);
    setIsLoading(true);

    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if email already exists
      if (users.find((u: any) => u.correo === userData.correo)) {
        setError('El correo ya está registrado.');
        setIsLoading(false);
        return false;
      }

      const newUser = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...userData,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      const { contrasenia: _, ...userWithoutPassword } = newUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Error en registro:', error);
      setError('Error al crear la cuenta.');
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('currentUser');
  };

  const isAdmin = user?.rol === 'admin';

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoading, 
      isAdmin, 
      error, 
      clearError 
    }}>
      {children}
    </AuthContext.Provider>
  );
};