import React from 'react'

const Login = () => {
  
  
  
  
  
  
  
    return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">Inicio de Sesion</h2>
            <div className="mb-4 flex items-center border 
                rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400">
                <input
                    type="text"
                    placeholder="correo"
                    required  
                    className="w-full outline-none"
                />
            </div>
            <div className="mb-4 flex items-center border 
                rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-blue-400">
                <input
                    type="password"
                    placeholder="contraseña"
                    required  
                    className="w-full outline-none"
                />
            </div>
    
      </form>
    </div>
  )
}

export default Login
