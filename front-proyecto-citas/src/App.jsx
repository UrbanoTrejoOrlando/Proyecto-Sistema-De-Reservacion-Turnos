import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './Login/Login'


const App = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<Login/>}/>
      </Routes>
    </Router>
  )
}

export default App
