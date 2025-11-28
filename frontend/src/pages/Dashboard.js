import React, { useState, useEffect } from 'react';
import api from '../api';
import AnimeForm from '../components/AnimeForm';
import AnimeEditForm from '../components/AnimeEditForm';
import AnimeCard from '../components/AnimeCard';
import '../styles/Dashboard.css';

function Dashboard() {
    const [animes, setAnimes] = useState([]);
    const [filter, setFilter] = useState('all');
    const [showForm, setShowForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
    const [selectedAnime, setSelectedAnime] = useState(null);
    const isAuthenticated = !!localStorage.getItem('token');

    useEffect(() => {
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
        setSelectedAnime(anime);
        setShowEditForm(true);
    };

    // Filtrer les animes selon le statut sélectionné
    const animesArray = Array.isArray(animes) ? animes : [];
    const filteredAnimes = filter === 'all'
        ? animesArray
        : animesArray.filter(anime => anime.statut === filter);

    return (
        <div className="dashboard-container">
            {/* Filtres */}
            <div className="filters">
                <button
                    className={filter === 'all' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilter('all')}
                >
                    Tous ({animesArray.length})
                </button>
                <button
                    className={filter === 'a_voir' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilter('a_voir')}
                >
                    À voir ({animesArray.filter(a => a.statut === 'a_voir').length})
                </button>
                <button
                    className={filter === 'deja_vu' ? 'filter-btn active' : 'filter-btn'}
                    onClick={() => setFilter('deja_vu')}
                >
                    Déjà vu ({animesArray.filter(a => a.statut === 'deja_vu').length})
                </button>
            </div>

            {/* Bouton ajouter */}
            {isAuthenticated && (
                <div className="add-anime-section">
                    <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                        <img src="/icons/ajouter.png" alt="Ajouter un anime" className="add-icon" /> Ajouter un anime
                    </button>
                </div>
            )}

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

            {/* Formulaire d'édition d'anime */}
            {showEditForm && selectedAnime && (
                <AnimeEditForm
                    anime={selectedAnime}
                    onClose={() => {
                        setShowEditForm(false);
                        setSelectedAnime(null);
                    }}
                    onAnimeUpdated={loadAnimes}
                />
            )}
        </div>
    );
}

export default Dashboard;