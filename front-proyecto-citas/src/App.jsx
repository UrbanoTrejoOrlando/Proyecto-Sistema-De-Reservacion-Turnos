import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AuthPage from './Login/AuthPage';
import Administrador from './Administrador/Administrador';
import Cliente from './Cliente/Cliente';
import Servicios from './Administrador/Servicios';
import Estadisticas from './Administrador/Estadisticas';
import ReservarCita from './Cliente/ReservarCita';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} /> 
        <Route path="/login" element={<AuthPage />} /> 
        <Route path="/registro" element={<AuthPage />} /> 
        <Route path="/administrador" element={<Administrador />} />
        <Route path="/servicios" element={<Servicios />} />
        <Route path="/estadisticas" element={<Estadisticas />} />
        <Route path="/cliente" element={<Cliente />} />
        <Route path="/reservar/:serviceId" element={<ReservarCita />} />
      
      </Routes>
    </Router>
  );
};

export default App;
