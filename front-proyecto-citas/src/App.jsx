import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Login/Login'
import RegistroUsuarios from './RegistroUsuarios/RegistroUsuarios'
import Administrador from './Administrador/Administrador'
import Cliente from './Cliente/Cliente'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/registro" element={<RegistroUsuarios/>}/>
        <Route path="/administrador" element={<Administrador/>}/>
        <Route path="/cliente" element={<Cliente/>}/>


      </Routes>
    </Router>
  )
}

export default App
