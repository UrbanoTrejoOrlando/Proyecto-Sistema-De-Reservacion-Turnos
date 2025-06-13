import React from 'react';
import { UserPlus, User, Mail, Phone, Shield, UserCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { ApiUsuarios } from '../common/server'
import Swal from 'sweetalert2'

const RegisterForm = ({obtenerDatos}) => {
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
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Crear Cuenta</h2>
          <p className="text-gray-600">Únete a nuestro sistema médico</p>
        </div>

        <form onSubmit={eventoFormulario} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Nombre *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="nombre"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Nombre"
                  required
                  onChange={(evt)=>setNombre(evt.target.value)}
                  value={nombre}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Primer Apellido *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="apellido1"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="Apellido Paterno"
                  required
                  onChange={(evt)=>setApellidop(evt.target.value)}
                  value={apellidop}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Segundo Apellido *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                name="apellido2"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="Apellido Materno"
                required
                onChange={(evt)=>setApellidom(evt.target.value)}
                value={apellidom}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Correo Electrónico *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="correo"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="tu@email.com"
                  required
                  onChange={(evt)=>setCorreo(evt.target.value)}
                  value={correo}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Teléfono *
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="tel"
                  name="telefono"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  placeholder="+52 123 456 7890"
                  required
                  onChange={(evt)=>setTelefono(evt.target.value)}
                  value={telefono}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Rol *
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  name="rol"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  style={{ height: '44px', appearance: 'none', backgroundImage: 'none' }} // Ajuste para igualar al input
                  required
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
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contraseña *
              </label>
              <div className="relative">
                <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="password"
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                  required
                  placeholder="Ingrese su contraseña"
                  onChange={(evt)=>setContrasenia(evt.target.value)}
                  value={contrasenia}
                />
              </div>
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
            ¿Ya tienes una cuenta?{' '}
            <button
              onClick={() => navigate('/')}
              className="text-green-600 hover:text-green-700 font-semibold hover:underline"
              
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
        
      </div>
    </div>
  );
};

export default RegisterForm;