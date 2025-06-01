import React from 'react'
import {Mail,RectangleEllipsis} from 'lucide-react'
import { Link } from 'react-router-dom'

const Login = () => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-5">Inicio de Sesión</h2>
      
          <div className="mb-3 flex items-center border rounded-xl px-3 
                py-1.5 focus-within:ring-2 focus-within:ring-blue-400">
            <Mail className="text-gray-400 w-5 h-5 mr-2.5" />
            <input
              type="text"
              placeholder="Ingresa el correo"
              required
              className="w-full outline-none text-sm"
            />
          </div>
      
          <div className="mb-3 flex items-center border rounded-xl px-3 
                py-1.5 focus-within:ring-2 focus-within:ring-blue-400">
            <RectangleEllipsis className="text-gray-400 w-5 h-5 mr-2.5" />
            <input
              type="password"
              placeholder="Ingresa la contraseña"
              required
              className="w-full outline-none text-sm"
            />
          </div>
      
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 rounded-xl text-sm transition duration-200"
          >
            Iniciar Sesión
          </button>
      
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">¿No tienes cuenta? </span>
            <Link to="/registro" className="text-blue-500 hover:underline font-medium">
              Regístrate
            </Link>
          </div>
        </form>
      </div>
      
  )
}

export default Login
