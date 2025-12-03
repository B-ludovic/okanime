'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import { Upload, X, AlertCircle, Search } from 'lucide-react';
import api from '../../../app/lib/api';
import { isAuthenticated } from '../../../app/lib/utils';
import '../../../styles/AddAnime.css';

function AjouterAnimePage() {
  const router = useRouter();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Recherche Jikan
  const [jikanQuery, setJikanQuery] = useState('');
  const [jikanResults, setJikanResults] = useState([]);
  const [searchingJikan, setSearchingJikan] = useState(false);
  
  const [formData, setFormData] = useState({
    titreVf: '',
    synopsis: '',
    anneeDebut: new Date().getFullYear(),
    studio: '',
    genreIds: [],
    malId: null, // Ajout du MAL ID depuis Jikan
  });

  const [posterFile, setPosterFile] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [posterUrl, setPosterUrl] = useState(null); // URL du poster depuis Jikan

  // Recherche sur Jikan
  const handleJikanSearch = async () => {
    if (!jikanQuery.trim()) return;
    
    setSearchingJikan(true);
    setJikanResults([]);
    
    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(jikanQuery)}&limit=10`);
      const data = await response.json();
      
      // Filtre les doublons basés sur mal_id
      const uniqueResults = (data.data || []).filter((anime, index, self) =>
        index === self.findIndex((a) => a.mal_id === anime.mal_id)
      );
      
      setJikanResults(uniqueResults);
    } catch (err) {
      console.error('Erreur recherche Jikan:', err);
      setError('Erreur lors de la recherche sur Jikan');
    } finally {
      setSearchingJikan(false);
    }
  };

  // Pré-remplit le formulaire avec les données Jikan
  const handleSelectJikanAnime = (anime) => {
    setFormData({
      titreVf: anime.title_english || anime.title || '',
      synopsis: anime.synopsis || '',
      anneeDebut: anime.year || new Date().getFullYear(),
      studio: anime.studios?.[0]?.name || '',
      genreIds: [], // Les genres seront ajoutés manuellement
      malId: anime.mal_id, // Enregistre le MAL ID
    });
    
    // Récupère le poster depuis Jikan (pas besoin d'upload)
    const posterJikan = anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url;
    if (posterJikan) {
      setPosterUrl(posterJikan);
      setPosterPreview(posterJikan);
      setPosterFile(null); // Pas de fichier, on utilise l'URL
    }
    
    // Ferme les résultats
    setJikanResults([]);
    setJikanQuery('');
    
    // Scroll vers le formulaire
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

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

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!posterFile && !posterUrl) {
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
      
      // Ajout du MAL ID si disponible (depuis Jikan)
      if (formData.malId) {
        data.append('malId', formData.malId);
      }
      
      // Si poster depuis Jikan (URL)
      if (posterUrl && !posterFile) {
        data.append('posterUrl', posterUrl);
      } else if (posterFile) {
        data.append('poster', posterFile);
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

          {/* Section recherche Jikan */}
          <div className="ajout-anime-card jikan-search-card">
            <h2 className="jikan-search-title">
              Rechercher sur Jikan (optionnel)
            </h2>
            <p className="jikan-search-subtitle">
              Trouvez un anime sur Jikan pour pré-remplir automatiquement le formulaire
            </p>
            
            <div className="jikan-search-input-group">
              <input
                type="text"
                placeholder="Ex: Naruto, One Piece..."
                value={jikanQuery}
                onChange={(e) => setJikanQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleJikanSearch()}
                className="form-input jikan-search-input"
              />
              <button
                type="button"
                onClick={handleJikanSearch}
                disabled={searchingJikan || !jikanQuery.trim()}
                className="btn btn-primary"
              >
                {searchingJikan ? <span className="loading"></span> : <><Search size={18} /> Rechercher</>}
              </button>
            </div>

            {/* Résultats Jikan */}
            {jikanResults.length > 0 && (
              <div className="jikan-results">
                {jikanResults.map((anime) => (
                  <div
                    key={anime.mal_id}
                    onClick={() => handleSelectJikanAnime(anime)}
                    className="jikan-result-item"
                  >
                    <Image
                      src={anime.images?.jpg?.image_url || '/placeholder.png'}
                      alt={anime.title}
                      width={60}
                      height={85}
                      style={{ borderRadius: '4px', objectFit: 'cover' }}
                    />
                    <div className="jikan-result-content">
                      <h4 className="jikan-result-title">
                        {anime.title_english || anime.title}
                      </h4>
                      <p className="jikan-result-meta">
                        {anime.studios?.[0]?.name || 'Studio inconnu'} • {anime.year || 'N/A'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="ajout-anime-card">
            {/* Message d'info */}
            <div className="ajout-anime-info">
              <div className="ajout-anime-info-title">
                <AlertCircle size={18} />
                Information importante
              </div>
              <p className="ajout-anime-info-text">
                Votre proposition sera soumise à validation par un administrateur avant d&apos;être visible
                publiquement. Vous pourrez modifier votre anime tant qu&apos;il n&apos;est pas validé.
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
                    <Image 
                      src={posterPreview} 
                      alt="Preview" 
                      width={200}
                      height={300}
                      className="ajout-anime-preview-image" 
                    />
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

export default AjouterAnimePage;