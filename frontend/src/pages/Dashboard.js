import React, { useState, useEffect } from 'react';
import api from '../api';
import AnimeForm from '../components/AnimeForm';
import AnimeCard from '../components/AnimeCard';
import '../styles/Dashboard.css';

function Dashboard() {
    const [animes, setAnimes] = useState([]);
    const [filter, setFilter] = useState('all');
    const [user, setUser] = useState(null);
    const [showForm, setShowForm] = useState(false);

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

    const handleDelete = async (id) => {
        try {
            await api.delete(`/animes/${id}`);
            loadAnimes();
        } catch (error) {
            console.error('Erreur lors de la suppression de l\'anime:', error);
        }
    };

    const handleEdit = (anime) => {
        // Logique pour éditer un anime (à implémenter)
        console.log('Éditer l\'anime:', anime);
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
                <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                    <img src="/icons/ajouter.png" alt="Ajouter un anime" className="add-icon" /> Ajouter un anime
                </button>
            </div>

            {/* Liste des animes */}
            <div className="anime-grid">
                {filteredAnimes.length === 0 ? (
                    <p className="no-anime">Aucun anime pour le moment.</p>
                ) : (
                    filteredAnimes.map(anime => (
                        <AnimeCard
                            key={anime.id}
                            anime={anime}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                        />
                    ))
                )}
            </div>
            {/* Formulaire d'ajout d'anime */}
            {showForm && (
                <AnimeForm
                    onClose={() => setShowForm(false)}
                    onAnimeAdded={loadAnimes}
                />
            )}
        </div>
    );
}

export default Dashboard;