import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/Dashboard.css';

function Dashboard() {
    const [animes, setAnimes] = useState([]);
    const [filter, setFilter] = useState('all');
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Récupérer les informations de l'utilisateur depuis le localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Charger les animes de l'utilisateur
        loadAnimes();
    }, []);

    const loadAnimes = async () => {
        try {
            const data = await api.get('/animes');
            setAnimes(data);
        } catch (error) {
            console.error('Erreur lors du chargement des animes:', error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    // Filtrer les animes selon le statut sélectionné
    const filteredAnimes = filter === 'all' 
        ? animes 
        : animes.filter(anime => anime.statut === filter);

    return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1><img src="/icons/japan-flag.png" alt="Japan flag" className="flag-icon" /> O'Kanime</h1>
        <div className="user-info">
          <span>Bienvenue, {user?.username}</span>
          <button onClick={handleLogout} className="btn-logout">
            Déconnexion
          </button>
        </div>
      </header>

      {/* Filtres */}
      <div className="filters">
        <button 
          className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('all')}
        >
          Tous ({animes.length})
        </button>
        <button 
          className={filter === 'a_voir' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('a_voir')}
        >
          À voir ({animes.filter(a => a.statut === 'a_voir').length})
        </button>
        <button 
          className={filter === 'deja_vu' ? 'filter-btn active' : 'filter-btn'}
          onClick={() => setFilter('deja_vu')}
        >
          Déjà vu ({animes.filter(a => a.statut === 'deja_vu').length})
        </button>
      </div>

      {/* Bouton ajouter */}
      <div className="add-anime-section">
        <button className="btn btn-primary">
          <img src="/icons/ajouter.png" alt="Ajouter un anime" className="add-icon" /> Ajouter un anime
        </button>
      </div>

      {/* Liste des animes */}
      <div className="anime-grid">
        {filteredAnimes.length === 0 ? (
          <p className="no-anime">Aucun anime pour le moment.</p>
        ) : (
          filteredAnimes.map(anime => (
            <div key={anime.id} className="anime-card">
              <h3>{anime.titre}</h3>
              <p><strong>Studio:</strong> {anime.studio}</p>
              <p><strong>Épisodes:</strong> {anime.nbEpisodes}</p>
              <p><strong>Note:</strong> {anime.note ? `${anime.note}/10` : 'Non noté'}</p>
              <span className={`statut-badge ${anime.statut}`}>
                {anime.statut === 'a_voir' ? 'À voir' : 'Déjà vu'}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;