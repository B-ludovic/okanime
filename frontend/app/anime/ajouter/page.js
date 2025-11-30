'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Upload, X, AlertCircle } from 'lucide-react';
import api from '@/lib/api';
import { isAuthenticated } from '@/lib/utils';
import '../../styles/AddAnime.css';

export default function AjouterAnimePage() {
  const router = useRouter();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    titreVf: '',
    synopsis: '',
    anneeDebut: new Date().getFullYear(),
    studio: '',
    genreIds: [],
  });

  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [banniereFile, setBanniereFile] = useState(null);
  const [bannierePreview, setBannierePreview] = useState(null);

  // Vérifie l'authentification
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
    }
  }, [router]);

  // Récupère les genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get('/genres');
        setGenres(response.data.genres);
      } catch (err) {
        console.error('Erreur lors du chargement des genres:', err);
      }
    };

    fetchGenres();
  }, []);

  // Gestion des champs texte
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Gestion des genres (checkboxes)
  const handleGenreToggle = (genreId) => {
    setFormData((prev) => ({
      ...prev,
      genreIds: prev.genreIds.includes(genreId)
        ? prev.genreIds.filter((id) => id !== genreId)
        : [...prev.genreIds, genreId],
    }));
  };

  // Gestion du poster
  const handlePosterChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPosterFile(file);
      setPosterPreview(URL.createObjectURL(file));
    }
  };

  const removePoster = () => {
    setPosterFile(null);
    setPosterPreview(null);
  };

  // Gestion de la bannière
  const handleBanniereChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBanniereFile(file);
      setBannierePreview(URL.createObjectURL(file));
    }
  };

  const removeBanniere = () => {
    setBanniereFile(null);
    setBannierePreview(null);
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!posterFile) {
      setError('Le poster est obligatoire');
      setLoading(false);
      return;
    }

    if (formData.genreIds.length === 0) {
      setError('Veuillez sélectionner au moins un genre');
      setLoading(false);
      return;
    }

    try {
      // Prépare les données en FormData
      const data = new FormData();
      data.append('titreVf', formData.titreVf);
      data.append('synopsis', formData.synopsis);
      data.append('anneeDebut', formData.anneeDebut);
      data.append('studio', formData.studio);
      data.append('genreIds', JSON.stringify(formData.genreIds));
      data.append('poster', posterFile);
      if (banniereFile) {
        data.append('banniere', banniereFile);
      }

      // Envoie à l'API
      await api.postFormData('/admin/animes', data);

      alert('Anime ajouté avec succès ! Il sera visible après validation par un administrateur.');
      router.push('/anime');
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'ajout de l\'anime');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ajout-anime-page">
      <Header />

      <main className="ajout-anime-main">
        <div className="ajout-anime-container">
          {/* Header */}
          <div className="ajout-anime-header">
            <h1 className="ajout-anime-title">Ajouter un animé</h1>
            <p className="ajout-anime-subtitle">
              Proposez un nouvel animé à la communauté
            </p>
          </div>

          <div className="ajout-anime-card">
            {/* Message d'info */}
            <div className="ajout-anime-info">
              <div className="ajout-anime-info-title">
                <AlertCircle size={18} />
                Information importante
              </div>
              <p className="ajout-anime-info-text">
                Votre proposition sera soumise à validation par un administrateur avant d'être visible
                publiquement. Vous pourrez modifier votre anime tant qu'il n'est pas validé.
              </p>
            </div>

            {/* Erreur */}
            {error && (
              <div className="alert alert-error">
                <span>{error}</span>
              </div>
            )}

            {/* Formulaire */}
            <form onSubmit={handleSubmit} className="ajout-anime-form">
              {/* Titre et Studio */}
              <div className="ajout-anime-form-row">
                <div className="form-group">
                  <label className="form-label">Titre (VF) *</label>
                  <input
                    type="text"
                    name="titreVf"
                    className="form-input"
                    placeholder="Ex: One Piece"
                    value={formData.titreVf}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Studio *</label>
                  <input
                    type="text"
                    name="studio"
                    className="form-input"
                    placeholder="Ex: Toei Animation"
                    value={formData.studio}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Année */}
              <div className="form-group">
                <label className="form-label">Année de début *</label>
                <input
                  type="number"
                  name="anneeDebut"
                  className="form-input"
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  value={formData.anneeDebut}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Synopsis */}
              <div className="form-group">
                <label className="form-label">Synopsis *</label>
                <textarea
                  name="synopsis"
                  className="form-input ajout-anime-textarea"
                  placeholder="Décrivez brièvement l'histoire de cet animé..."
                  value={formData.synopsis}
                  onChange={handleChange}
                  required
                  minLength={10}
                ></textarea>
              </div>

              {/* Genres */}
              <div className="form-group">
                <label className="form-label">Genres * (au moins 1)</label>
                <div className="ajout-anime-genres-grid">
                  {genres.map((genre) => (
                    <div
                      key={genre.id}
                      className={`ajout-anime-genre-checkbox ${
                        formData.genreIds.includes(genre.id) ? 'checked' : ''
                      }`}
                    >
                      <input
                        type="checkbox"
                        id={`genre-${genre.id}`}
                        checked={formData.genreIds.includes(genre.id)}
                        onChange={() => handleGenreToggle(genre.id)}
                      />
                      <label htmlFor={`genre-${genre.id}`}>{genre.nom}</label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Poster */}
              <div className="ajout-anime-upload-section">
                <label className="ajout-anime-upload-label">Poster * (Image verticale)</label>
                {!posterPreview ? (
                  <div
                    className="ajout-anime-upload-container"
                    onClick={() => document.getElementById('poster-input').click()}
                  >
                    <div className="ajout-anime-upload-icon">
                      <Upload size={48} />
                    </div>
                    <p className="ajout-anime-upload-text">Cliquez pour choisir une image</p>
                    <p className="ajout-anime-upload-subtext">PNG, JPG, WebP (max 5MB)</p>
                    <input
                      id="poster-input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handlePosterChange}
                      className="ajout-anime-upload-input"
                    />
                  </div>
                ) : (
                  <div className="ajout-anime-preview">
                    <img src={posterPreview} alt="Preview" className="ajout-anime-preview-image" />
                    <button
                      type="button"
                      onClick={removePoster}
                      className="ajout-anime-preview-remove"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Bannière (optionnelle) */}
              <div className="ajout-anime-upload-section">
                <label className="ajout-anime-upload-label">Bannière (optionnel)</label>
                {!bannierePreview ? (
                  <div
                    className="ajout-anime-upload-container"
                    onClick={() => document.getElementById('banniere-input').click()}
                  >
                    <div className="ajout-anime-upload-icon">
                      <Upload size={48} />
                    </div>
                    <p className="ajout-anime-upload-text">Cliquez pour choisir une image</p>
                    <p className="ajout-anime-upload-subtext">PNG, JPG, WebP (max 5MB)</p>
                    <input
                      id="banniere-input"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleBanniereChange}
                      className="ajout-anime-upload-input"
                    />
                  </div>
                ) : (
                  <div className="ajout-anime-preview">
                    <img
                      src={bannierePreview}
                      alt="Preview"
                      className="ajout-anime-preview-image"
                    />
                    <button
                      type="button"
                      onClick={removeBanniere}
                      className="ajout-anime-preview-remove"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="ajout-anime-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="loading"></span> : 'Proposer cet animé'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}