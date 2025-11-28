import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AnimeDetail from './pages/AnimeDetail';
import './styles/App.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Page d'accueil = Dashboard */}
        <Route path="/" element={<Dashboard />} />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Notre Collection = Dashboard public */}
        <Route path="/collection" element={<Dashboard />} />
        
        {/* Ma Vidéothèque = Dashboard personnel (pour plus tard) */}
        <Route path="/ma-bibliotheque" element={<Dashboard />} />
        
        {/* Détail d'anime accessible à tous */}
        <Route path="/anime/:id" element={<AnimeDetail />} />
      </Routes>
    </Router>
  );
}

export default App;