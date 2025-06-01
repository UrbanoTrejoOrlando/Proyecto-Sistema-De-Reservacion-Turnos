import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Login/Login'
import RegistroUsuarios from './RegistroUsuarios/RegistroUsuarios'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/registro" element={<RegistroUsuarios/>}/>
      </Routes>
    </Router>
  )
}

export default App
