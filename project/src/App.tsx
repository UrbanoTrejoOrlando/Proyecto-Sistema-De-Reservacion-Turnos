import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppointmentProvider } from './contexts/AppointmentContext';
import { AuthPage } from './components/Auth/AuthPage';
import { Dashboard } from './components/Dashboard/Dashboard';
import { AdminDashboard } from './components/Admin/AdminDashboard';

const AppContent: React.FC = () => {
  const { user, isLoading, isAdmin } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return isAdmin ? <AdminDashboard /> : <Dashboard />;
};

function App() {
  return (
    <AuthProvider>
      <AppointmentProvider>
        <AppContent />
      </AppointmentProvider>
    </AuthProvider>
  );
}

export default App;