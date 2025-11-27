import React, { useState } from 'react';
import api from '../api';
import '../styles/AnimeForm.css';

function AnimeForm({ onClose, onAnimeAdded }) {
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const data = await api.post('/animes', formData);

      if (data.error) {
        setError(data.error);
      } else {
        onAnimeAdded();
        onClose();
      }
    } catch (err) {
      setError('Erreur lors de l\'ajout de l\'anime');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Ajouter un anime</h2>
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
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AnimeForm;