import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { Heart, Activity, Shield } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl mx-auto flex items-center justify-center gap-12">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col items-center text-center max-w-lg">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 to-green-600 rounded-full mb-8">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Sistema de Reservación
            <span className="text-blue-600 block">Médica</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Reserva tus citas médicas de forma rápida y segura. 
            Conectamos pacientes con los mejores profesionales de la salud.
          </p>
          
          <div className="grid grid-cols-1 gap-6 w-full">
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Disponibilidad en Tiempo Real</h3>
                <p className="text-sm text-gray-600">Ve horarios disponibles actualizados al instante</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm">
              <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-left">
                <h3 className="font-semibold text-gray-900">Seguro y Confiable</h3>
                <p className="text-sm text-gray-600">Tus datos médicos están protegidos y seguros</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Forms */}
        <div className="w-full max-w-md">
          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleMode={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};