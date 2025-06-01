import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Login/Login'
import RegistroUsuarios from './RegistroUsuarios/RegistroUsuarios'
import {administrador} from " ./";


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/registro" element={<RegistroUsuarios/>}/>
        <Route path="/administrador" element={<administrador/>}/>


      </Routes>
    </Router>
  )
}

export default App
