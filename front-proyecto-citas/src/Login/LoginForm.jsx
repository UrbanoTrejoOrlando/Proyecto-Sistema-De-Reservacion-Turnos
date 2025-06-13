import React, { useState } from 'react';
import { LogIn, Mail, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {ApiAuth} from "../common/server"
import Swal from 'sweetalert2';

const LoginForm = () => {

  // Variable de estado para el redireccionamiento
  const navigate = useNavigate();

  // Creacion de las variables de estado
  const [correo, setCorreo] = React.useState("")
  const [contrasenia, setContrasenia] = React.useState("")

  // Funcion para poder hacer las diferentes solicitudes
  const registroLogin = async(e)=>{
    e.preventDefault();

  // EValuacion de errores con un try catch
  try {
    const response = await fetch(ApiAuth, {
      method: "POST",
      headers:{
          "Content-Type": "application/json",
      },
      // Convierte el cuerpo del body a json
      body: JSON.stringify({
        correo: correo,
        contrasenia: contrasenia
      })
      
      
    });

    // Guardar los datos en un json
    const data = await response.json();

    // Guardar el token en localStorage 
    localStorage.setItem('token', data.token);
    localStorage.setItem('rol', data.user.rol);
    localStorage.setItem("usuario", JSON.stringify(data.user));

    // Validar al iniciar sesion es un usuario o administrador 
    if(data.user.rol === "Administrador"){
      // Mensaje con Sweetalert
      Swal.fire({
        icon: 'success',
        title: `¡Bienvenido Administrador`,
        showConfirmButton: false,
        timer: 2000
      });
      // Redirigir al apartado de administrador
      navigate("/administrador")

    } else if (data.user.rol === "Cliente"){
      // Mensaje con Sweetalert
      Swal.fire({
        icon: 'success',
        title: `¡Bienvenido Cliente`,
        showConfirmButton: false,
        timer: 2000
      });
      // Redirigir al apartado de administrador
      navigate("/cliente")
    } else {
      throw new Error("Rol desconocido");
    }
    

  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Error de autenticación, credenciales incorrectas',
    });
  }
}

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Iniciar Sesión</h2>
          <p className="text-gray-600">Accede a tu cuenta médica</p>
        </div>
        <form onSubmit={registroLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Correo Electrónico"
                required
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="password"
                className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
                required
                value={contrasenia}
                onChange={(e) => setContrasenia(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02]"
          >
            Iniciar Sesión
          </button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            ¿No tienes una cuenta?{' '}
            <button
              onClick={() => navigate('/registro')}
              className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
