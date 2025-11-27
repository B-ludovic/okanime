import React from 'react';
import '../styles/AnimeCard.css';

function AnimeCard({ anime, onDelete, onEdit }) {
  const handleDelete = async () => {
    if (window.confirm(`Voulez-vous vraiment supprimer "${anime.titre}" ?`)) {
      onDelete(anime.id);
    }
  };

  return (
    <div className="anime-card">
      {anime.imageUrl && (
        <div className="anime-image">
          <img src={anime.imageUrl} alt={anime.titre} />
        </div>
      )}
      
      <div className="anime-content">
        <h3>{anime.titre}</h3>
        
        {anime.resume && (
          <div className="anime-resume">
            <p>{anime.resume}</p>
          </div>
        )}
        
        <div className="anime-info">
          <p><strong>Studio:</strong> {anime.studio}</p>
          <p><strong>Pays:</strong> {anime.paysOrigine}</p>
          <p><strong>Saisons:</strong> {anime.nbSaisons}</p>
          <p><strong>Épisodes:</strong> {anime.nbEpisodes}</p>
          <p><strong>Durée:</strong> {anime.dureeEpisode} min</p>
          {anime.note && <p><strong>Note:</strong> {anime.note}/10</p>}
        </div>

        {anime.avis && (
          <div className="anime-avis">
            <strong>Avis:</strong>
            <p>{anime.avis}</p>
          </div>
        )}

        <div className="anime-footer">
          <span className={`statut-badge ${anime.statut}`}>
            {anime.statut === 'a_voir' ? 'À voir' : 'Déjà vu'}
          </span>
          
          <div className="anime-actions">
            <button className="btn-edit" onClick={() => onEdit(anime)}>
              <img src="/icons/modify.png" alt="Modifier" className="action-icon" />
            </button>
            <button className="btn-delete" onClick={handleDelete}>
              <img src="/icons/delete.png" alt="Supprimer" className="action-icon" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnimeCard;