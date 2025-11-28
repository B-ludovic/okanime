import React, { useState, useEffect } from 'react';
import api from '../api';
import '../styles/AnimeForm.css';

function AnimeForm({ onClose, onAnimeAdded, animeToEdit }) {
  const [formData, setFormData] = useState({
    titre: '',
    resume: '',
    nbSaisons: '',
    nbEpisodes: '',
    dureeEpisode: '',
    studio: '',
    paysOrigine: '',
    note: '',
    avis: '',
    imageUrl: '',
    statut: 'a_voir'
  });
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Pré-remplir le formulaire si on est en mode édition
  useEffect(() => {
    if (animeToEdit) {
      setFormData({
        titre: animeToEdit.titre || '',
        resume: animeToEdit.resume || '',
        nbSaisons: animeToEdit.nbSaisons || '',
        nbEpisodes: animeToEdit.nbEpisodes || '',
        dureeEpisode: animeToEdit.dureeEpisode || '',
        studio: animeToEdit.studio || '',
        paysOrigine: animeToEdit.paysOrigine || '',
        note: animeToEdit.note || '',
        avis: animeToEdit.avis || '',
        imageUrl: animeToEdit.imageUrl || '',
        statut: animeToEdit.statut || 'a_voir'
      });
    }
  }, [animeToEdit]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Fonction pour chercher des animes via Jikan API
  const searchAnime = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(searchQuery)}&limit=5`);
      const data = await response.json();
      setSearchResults(data.data || []);
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
      setSearchResults([]);
    }
    setIsSearching(false);
  };

  // Fonction pour sélectionner un anime depuis les résultats
  const selectAnime = (anime) => {
    // Utiliser l'image large, ou image standard si large n'existe pas
    let imageUrl = anime.images.jpg.large_image_url || anime.images.jpg.image_url;
    
    // Si l'URL se termine par 'l.jpg', la remplacer par '.jpg' pour éviter les 404
    if (imageUrl && imageUrl.endsWith('l.jpg')) {
      imageUrl = imageUrl.replace('l.jpg', '.jpg');
    }
    
    console.log('🖼️ Image sélectionnée:', imageUrl);
    
    setFormData({
      ...formData,
      imageUrl: imageUrl
    });
    setSearchResults([]);
    setSearchQuery('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    console.log('📤 Envoi des données:', formData);
    console.log('🖼️ imageUrl à envoyer:', formData.imageUrl);

    try {
      let data;
      
      if (animeToEdit) {
        // Mode édition
        console.log('✏️ Mode édition pour anime ID:', animeToEdit.id);
        data = await api.put(`/animes/${animeToEdit.id}`, formData);
      } else {
        // Mode création
        console.log('➕ Mode création');
        data = await api.post('/animes', formData);
      }

      if (data.error) {
        setError(data.error);
      } else {
        onAnimeAdded();
        onClose();
      }
    } catch (err) {
      setError('Erreur lors de l\'enregistrement de l\'anime');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{animeToEdit ? 'Modifier l\'anime' : 'Ajouter un anime'}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Titre *</label>
            <input
              type="text"
              name="titre"
              value={formData.titre}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Résumé général</label>
            <textarea
              name="resume"
              value={formData.resume}
              onChange={handleChange}
              rows="3"
              placeholder="De quoi parle cet anime..."
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nombre de saisons *</label>
              <input
                type="number"
                name="nbSaisons"
                value={formData.nbSaisons}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Nombre d'épisodes *</label>
              <input
                type="number"
                name="nbEpisodes"
                value={formData.nbEpisodes}
                onChange={handleChange}
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Durée d'un épisode (min) *</label>
              <input
                type="number"
                name="dureeEpisode"
                value={formData.dureeEpisode}
                onChange={handleChange}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Note (/10)</label>
              <input
                type="number"
                name="note"
                value={formData.note}
                onChange={handleChange}
                min="0"
                max="10"
                step="0.1"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Studio *</label>
            <input
              type="text"
              name="studio"
              value={formData.studio}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Pays d'origine *</label>
            <input
              type="text"
              name="paysOrigine"
              value={formData.paysOrigine}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>URL de l'image *</label>
            
            {/* Barre de recherche d'image */}
            <div className="image-search">
              <input
                type="text"
                placeholder="Rechercher un anime pour l'image..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), searchAnime())}
              />
              <button type="button" onClick={searchAnime} className="btn-search">
                <img src="/icons/search.png" alt="Rechercher" className="search-icon" />
                Rechercher
              </button>
            </div>

            {/* Résultats de recherche */}
            {isSearching && <p className="search-loading">Recherche en cours...</p>}
            
            {searchResults.length > 0 && (
              <div className="search-results">
                {searchResults.map((anime) => (
                  <div key={anime.mal_id} className="search-result-item" onClick={() => selectAnime(anime)}>
                    <img src={anime.images.jpg.small_image_url} alt={anime.title} />
                    <div className="result-info">
                      <strong>{anime.title}</strong>
                      <small>{anime.title_japanese}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Champ URL (rempli automatiquement ou manuellement) */}
            <input
              type="url"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div className="form-group">
            <label>Statut *</label>
            <select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              required
            >
              <option value="a_voir">À voir</option>
              <option value="deja_vu">Déjà vu</option>
            </select>
          </div>

          <div className="form-group">
            <label>Avis personnel</label>
            <textarea
              name="avis"
              value={formData.avis}
              onChange={handleChange}
              rows="4"
              placeholder="Votre avis sur cet anime..."
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Annuler
            </button>
            <button type="submit">
              {animeToEdit ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AnimeForm;