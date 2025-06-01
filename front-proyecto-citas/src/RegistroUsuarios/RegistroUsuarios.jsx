import React from 'react'
import { User, Mail, RectangleEllipsis, BookUser, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { ApiUsuarios } from '../common/server'
import Swal from 'sweetalert2'

// Recibe la funcion obtener datos desde los props
const RegistroUsuarios = ({obtenerDatos}) => {
// Variable de estado para el redireccionamiento
const navigate = useNavigate();

// Creacion de las variables de estado
const [nombre, setNombre] = React.useState("");
const [apellidop, setApellidop] = React.useState("");  
const [apellidom, setApellidom] = React.useState("");
const [correo, setCorreo] = React.useState("");
const [contrasenia, setContrasenia] = React.useState("");
const [rol,setRol] = React.useState("");
const [telefono,setTelefono] = React.useState("");

  // Funcion para poder hacer las diferentes solicitudes
const cargarDatos = async (usuarios)=> {
    //Conexion con la api perteneciente al back
    const response = await fetch(ApiUsuarios, {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
        },
        // Convierte el cuerpo del body a json
        body: JSON.stringify(usuarios)
    });

    // Verificar que si el usuario se creo correctamente con Sweetalert
    if (response.status === 201){
        Swal.fire({
            position: "top-end",
            icon: "success",
            title: "Registro exitoso",
            text: "Tu usuario se ha sido registrado correctamente",
            showConfirmButton: false,
            timer: 1500
        });
        // Redireccionamiento al componente principal
        navigate('/');
      
        // Llamada a la funcion para refrescar datos actualizados
        // Solo llamamos obtenerDatos si existe y es función
        if (typeof obtenerDatos === 'function') {
            obtenerDatos();
        }
    }
}

// Funcion para cargar los datos del formulario hacia el backend
const eventoFormulario = (evt)=>{
    evt.preventDefault();
    // Objeto para el nuevo usuario
    const nuevoUsuario = {
        nombre : nombre,
        apellido1 : apellidop,
        apellido2 : apellidom,
        correo : correo,
        contrasenia : contrasenia,
        rol : rol,
        telefono : telefono 
    }

    // Enviar la solicitud al backend
    cargarDatos(nuevoUsuario);

    // Limpiar los campos del formulario
    setNombre("");
    setApellidop("");
    setApellidom("");
    setCorreo("");
    setContrasenia("");
    setRol("");
    setTelefono("");
}

  return (
    <div className="flex items-center justify-center">
        <form onSubmit={eventoFormulario} className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Registro</h2>

            <div className="mb-3 flex items-center border rounded-xl px-3 
                py-1.5 focus-within:ring-2 focus-within:ring-blue-400">
                <User className="text-gray-400 w-5 h-5 mr-2.5" />
                <input
                    type="text"
                    placeholder="Nombre"
                    required
                    className="w-full outline-none text-sm"
                    onChange={(evt)=>setNombre(evt.target.value)}
                    value={nombre}
                />
            </div>
            <div className="mb-3 flex items-center border rounded-xl px-3 
                py-1.5 focus-within:ring-2 focus-within:ring-blue-400">
                <User className="text-gray-400 w-5 h-5 mr-2.5" />
                <input
                    type="text"
                    placeholder="Apellido paterno"
                    required
                    className="w-full outline-none text-sm"
                    onChange={(evt)=>setApellidop(evt.target.value)}
                    value={apellidop}
                />
            </div>
            <div className="mb-3 flex items-center border rounded-xl px-3 
                py-1.5 focus-within:ring-2 focus-within:ring-blue-400">
                <User className="text-gray-400 w-5 h-5 mr-2.5" />
                <input
                    type="text"
                    placeholder="Apellido materno"
                    required
                    className="w-full outline-none text-sm"
                    onChange={(evt)=>setApellidom(evt.target.value)}
                    value={apellidom}
                />
            </div>
            <div className="mb-3 flex items-center border rounded-xl px-3 
                py-1.5 focus-within:ring-2 focus-within:ring-blue-400">
                <Mail className="text-gray-400 w-5 h-5 mr-2.5" />
                <input
                    type="text"
                    placeholder="Correo eletronico"
                    required
                    className="w-full outline-none text-sm"
                    onChange={(evt)=>setCorreo(evt.target.value)}
                    value={correo}
                />
            </div>
            <div className="mb-3 flex items-center border rounded-xl px-3 
                py-1.5 focus-within:ring-2 focus-within:ring-blue-400">
                <RectangleEllipsis className="text-gray-400 w-5 h-5 mr-2.5" />
                <input
                    type="text"
                    placeholder="Contraseña"
                    required
                    className="w-full outline-none text-sm"
                    onChange={(evt)=>setContrasenia(evt.target.value)}
                    value={contrasenia}
                />
            </div>
            <div className="mb-3 flex items-center border rounded-xl px-3 
                py-1.5 focus-within:ring-2 focus-within:ring-blue-400">
                <BookUser className="text-gray-400 w-5 h-5 mr-2.5" />
                <select
                    required
                    className="w-full outline-none text-sm bg-transparent"
                    onChange={(evt)=>setRol(evt.target.value)}
                    value={rol}
                >
                    <option value="" disabled>
                        Selecciona un rol
                    </option>
                    <option value="Administrador">Administrador</option>
                    <option value="Cliente">Cliente</option>
                </select>
            </div>
            <div className="mb-3 flex items-center border rounded-xl px-3 
                py-1.5 focus-within:ring-2 focus-within:ring-blue-400">
                <Phone className="text-gray-400 w-5 h-5 mr-2.5" />
                <input
                    type="tel"
                    placeholder="Telefono"
                    required
                    className="w-full outline-none text-sm"
                    onChange={(evt)=>setTelefono(evt.target.value)}
                    value={telefono}
                />
            </div>
            <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 rounded-xl text-sm transition duration-200"
            >
                Registrarse
            </button>
      
            <div className="mt-4 text-center text-sm">
                <span className="text-gray-600">¿Ya tienes cuenta? </span>
                <Link to="/" className="text-blue-500 hover:underline font-medium">
                    Inicia Sesion
                </Link>
            </div>

        </form>
    </div>
  )
}

export default RegistroUsuarios; 
