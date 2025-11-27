import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import '../styles/AnimeDetail.css';

function AnimeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnime();
  }, [id]);

  const loadAnime = async () => {
    try {
      const animes = await api.get('/animes');
      const foundAnime = animes.find(a => a.id === parseInt(id));
      setAnime(foundAnime);
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement de l\'anime', error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Voulez-vous vraiment supprimer "${anime.titre}" ?`)) {
      try {
        await api.delete(`/animes/${id}`);
        navigate('/dashboard');
      } catch (error) {
        console.error('Erreur lors de la suppression', error);
      }
    }
  };

  const handleEdit = () => {
    // TODO: On va gérer l'édition plus tard
    console.log('Éditer', anime);
  };

  if (loading) {
    return <div className="detail-container">Chargement...</div>;
  }

  if (!anime) {
    return <div className="detail-container">Anime non trouvé</div>;
  }

  return (
    <div className="detail-container">
      <button className="btn-back" onClick={() => navigate('/dashboard')}>
        ← Retour
      </button>

      <div className="detail-content">
        {anime.imageUrl && (
          <div className="detail-image">
            <img src={anime.imageUrl} alt={anime.titre} />
          </div>
        )}

        <div className="detail-info">
          <h1>{anime.titre}</h1>

          <span className={`statut-badge ${anime.statut}`}>
            {anime.statut === 'a_voir' ? 'À VOIR' : 'DÉJÀ VU'}
          </span>

          {anime.resume && (
            <div className="detail-section">
              <h3>Résumé</h3>
              <p>{anime.resume}</p>
            </div>
          )}

          <div className="detail-section">
            <h3>Informations</h3>
            <div className="info-grid">
              <div className="info-item">
                <strong>Studio:</strong>
                <span>{anime.studio}</span>
              </div>
              <div className="info-item">
                <strong>Pays:</strong>
                <span>{anime.paysOrigine}</span>
              </div>
              <div className="info-item">
                <strong>Saisons:</strong>
                <span>{anime.nbSaisons}</span>
              </div>
              <div className="info-item">
                <strong>Épisodes:</strong>
                <span>{anime.nbEpisodes}</span>
              </div>
              <div className="info-item">
                <strong>Durée:</strong>
                <span>{anime.dureeEpisode} min</span>
              </div>
              {anime.note && (
                <div className="info-item">
                  <strong>Note:</strong>
                  <span>{anime.note}/10</span>
                </div>
              )}
            </div>
          </div>

          {anime.avis && (
            <div className="detail-section">
              <h3>Mon avis</h3>
              <p>{anime.avis}</p>
            </div>
          )}

          <div className="detail-actions">
            <button className="btn-edit-detail" onClick={handleEdit}>
              <img src="/icons/modify.png" alt="Modifier" />
              Modifier
            </button>
            <button className="btn-delete-detail" onClick={handleDelete}>
              <img src="/icons/delete.png" alt="Supprimer" />
              Supprimer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimeDetail;