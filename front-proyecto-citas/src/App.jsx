import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import AuthPage from './Login/AuthPage';
import Administrador from './Administrador/Administrador';
import Cliente from './Cliente/Cliente';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} /> 
        <Route path="/login" element={<AuthPage />} /> 
        <Route path="/registro" element={<AuthPage />} /> 
        <Route path="/administrador" element={<Administrador />} />
        <Route path="/cliente" element={<Cliente />} />
      </Routes>
    </Router>
  );
};

export default App;
