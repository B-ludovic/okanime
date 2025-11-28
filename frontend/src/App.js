import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AnimeDetail from './pages/AnimeDetail';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/App.css';

function App() {
  // Vérifier si l'utilisateur est connecté
  const isAuthenticated = localStorage.getItem('token');

  return (
    <Router>
      <Routes>
        {/* Redirection intelligente de la page d'accueil */}
        <Route 
          path="/" 
          element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />} 
        />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Routes protégées */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/anime/:id" 
          element={
            <ProtectedRoute>
              <AnimeDetail />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;