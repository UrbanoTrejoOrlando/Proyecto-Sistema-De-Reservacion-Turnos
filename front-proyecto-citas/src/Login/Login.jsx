import React from 'react'
import {Mail,RectangleEllipsis} from 'lucide-react'
import { Link } from 'react-router-dom'
import { ApiAuth } from '../common/server'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const Login = () => {

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
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form  onSubmit={registroLogin} className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-5">Inicio de Sesión</h2>
      
          <div className="mb-3 flex items-center border rounded-xl px-3 
                py-1.5 focus-within:ring-2 focus-within:ring-blue-400">
            <Mail className="text-gray-400 w-5 h-5 mr-2.5" />
            <input
              type="text"
              placeholder="Ingresa el correo"
              required
              className="w-full outline-none text-sm"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}

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
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}

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
