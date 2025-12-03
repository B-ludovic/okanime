'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AdminLayout from '../../../components/admin/AdminLayout';
import api from '../../lib/api';
import { isAuthenticated, getCurrentUser } from '../../lib/utils';
import { Edit, Trash2, Eye, Calendar, User, Plus, X, ChevronRight, ChevronLeft } from 'lucide-react';
import styles from '../../../styles/modules/ModalAdmin.module.css';
import '../../../styles/Admin.css';

function TousLesAnimesPage() {
  const router = useRouter();
  const [animes, setAnimes] = useState([]);
  const [allAnimes, setAllAnimes] = useState([]); // Stocke tous les animés
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAnime, setEditingAnime] = useState(null);
  const [genres, setGenres] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalAnimes, setTotalAnimes] = useState(0);
  const animesPerPage = 20;

  // Vérifie l'authentification et le rôle admin
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const user = getCurrentUser();
    if (user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
  }, [router]);

  // Récupère tous les animés (une seule fois)
  const fetchAllAnimes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/animes?limit=1000'); // Récupère jusqu'à 1000 animés
      console.log('Response:', response); // Debug
      const allAnimesData = response.data?.animes || [];
      console.log('Total animés récupérés:', allAnimesData.length); // DEBUG
      setAllAnimes(allAnimesData);
      setTotalAnimes(allAnimesData.length);
      console.log('Pages totales:', Math.ceil(allAnimesData.length / 20)); // DEBUG
    } catch (err) {
      setError('Erreur lors du chargement des animés');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Paginer les animés affichés
  useEffect(() => {
    const startIndex = (currentPage - 1) * animesPerPage;
    const endIndex = startIndex + animesPerPage;
    setAnimes(allAnimes.slice(startIndex, endIndex));
  }, [currentPage, allAnimes]);

  useEffect(() => {
    fetchGenres();
    fetchAllAnimes();
  }, []);

  // Récupère les genres
  const fetchGenres = async () => {
    try {
      const response = await api.get('/genres');
      setGenres(response.data.genres || []);
    } catch (err) {
      console.error('Erreur genres:', err);
    }
  };

  // Ouvrir le modal pour modifier
  const handleEdit = (anime) => {
    setEditingAnime(anime);
    setShowModal(true);
  };

  // Fermer le modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAnime(null);
  };

  // Sauvegarder les modifications
  const handleSaveAnime = async (updatedData) => {
    try {
      await api.put(`/admin/animes/${editingAnime.id}`, updatedData);
      await fetchAllAnimes();
      handleCloseModal();
    } catch (err) {
      alert('Erreur lors de la modification');
      console.error(err);
    }
  };

  // Supprimer un anime
  const handleDelete = async (animeId) => {
    if (!confirm('Voulez-vous vraiment supprimer cet anime ?')) return;

    try {
      await api.delete(`/admin/animes/${animeId}`);
      await fetchAllAnimes();
    } catch (err) {
      alert('Erreur lors de la suppression');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <span className="loading"></span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Tous les animés</h1>
          <p className="admin-subtitle">
            {totalAnimes} animé{totalAnimes > 1 ? 's' : ''} dans la base de données • Page {currentPage} sur {Math.ceil(totalAnimes / animesPerPage)}
          </p>
        </div>
        <div className="admin-header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => router.push('/anime/ajouter')}
          >
            <Plus size={18} />
            Ajouter un animé
          </button>
          <button 
            className="btn btn-bleu-gradient admin-pagination-btn"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={18} />
          </button>
          <button 
            className="btn btn-bleu-gradient admin-pagination-btn"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={totalAnimes === 0 || currentPage >= Math.ceil(totalAnimes / animesPerPage)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Liste des animés */}
      {animes.length > 0 ? (
        <div className="admin-animes-list">
          {animes.map((anime) => (
            <div key={anime.id} className="admin-anime-card">
              <div className="admin-anime-content">
                {/* Poster */}
                <Image
                  src={anime.posterUrl || '/placeholder-anime.jpg'}
                  alt={anime.titreVf}
                  width={150}
                  height={210}
                  className="admin-anime-poster"
                />

                {/* Informations */}
                <div className="admin-anime-info">
                  <h3 className="admin-anime-title">{anime.titreVf}</h3>

                  <div className="admin-anime-meta">
                    <span className="admin-anime-meta-item">
                      <User size={14} />
                      Ajouté par : {anime.userAjout?.username || 'Inconnu'}
                    </span>
                    <span className="admin-anime-meta-item">
                      <Calendar size={14} />
                      {anime.studio} • {anime.anneeDebut}
                    </span>
                  </div>

                  <p className="admin-anime-synopsis">{anime.synopsis}</p>

                  <div className="admin-anime-genres">
                    {anime.genres?.map((genreRelation) => (
                      <span key={genreRelation.genre.id} className="admin-anime-genre">
                        {genreRelation.genre.nom}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="admin-anime-actions">
                  <button
                    className="admin-btn admin-btn-primary"
                    onClick={() => handleEdit(anime)}
                  >
                    <Edit size={18} />
                    Modifier
                  </button>
                  <button
                    className="admin-btn admin-btn-danger"
                    onClick={() => handleDelete(anime.id)}
                  >
                    <Trash2 size={18} />
                    Supprimer
                  </button>
                  <button
                    className="admin-btn btn-ghost admin-btn-small"
                    onClick={() => router.push(`/anime/${anime.id}`)}
                  >
                    <Eye size={16} />
                    Voir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-empty">
          <div className="admin-empty-icon">
            <Image src="/icons/television.png" alt="Aucun anime" width={64} height={64} />
          </div>
          <h3 className="admin-empty-title">Aucun anime</h3>
          <p className="admin-empty-text">
            Commencez par ajouter votre premier anime !
          </p>
        </div>
      )}

      {/* Modal de modification */}
      {showModal && editingAnime && (
        <AnimeEditModal
          anime={editingAnime}
          genres={genres}
          onClose={handleCloseModal}
          onSave={handleSaveAnime}
        />
      )}
    </AdminLayout>
  );
}

// Composant Modal d'édition
function AnimeEditModal({ anime, genres, onClose, onSave }) {
  const [formData, setFormData] = useState({
    titreVf: anime.titreVf || '',
    synopsis: anime.synopsis || '',
    anneeDebut: anime.anneeDebut || new Date().getFullYear(),
    studio: anime.studio || '',
    genreIds: anime.genres?.map(g => g.genre.id) || [],
    bannerGradient: anime.banniereUrl?.replace('gradient-', '') || '1',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('titreVf', formData.titreVf);
    formDataToSend.append('synopsis', formData.synopsis);
    formDataToSend.append('anneeDebut', formData.anneeDebut);
    formDataToSend.append('studio', formData.studio);
    formDataToSend.append('genreIds', JSON.stringify(formData.genreIds));
    formDataToSend.append('bannerGradient', formData.bannerGradient);

    onSave(formDataToSend);
  };

  const handleGenreToggle = (genreId) => {
    setFormData(prev => ({
      ...prev,
      genreIds: prev.genreIds.includes(genreId)
        ? prev.genreIds.filter(id => id !== genreId)
        : [...prev.genreIds, genreId]
    }));
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Modifier l&apos;animé</h2>
          <button className={styles.modalClose} onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Titre */}
            <div className="form-group">
              <label>Titre VF *</label>
              <input
                type="text"
                value={formData.titreVf}
                onChange={(e) => setFormData({ ...formData, titreVf: e.target.value })}
                required
              />
            </div>

            {/* Synopsis */}
            <div className="form-group">
              <label>Synopsis *</label>
              <textarea
                value={formData.synopsis}
                onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                rows={5}
                required
              />
            </div>

            {/* Année et Studio */}
            <div className={styles.formRow}>
              <div className="form-group">
                <label>Année de début *</label>
                <input
                  type="number"
                  value={formData.anneeDebut}
                  onChange={(e) => setFormData({ ...formData, anneeDebut: parseInt(e.target.value) })}
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  required
                />
              </div>
              <div className="form-group">
                <label>Studio</label>
                <input
                  type="text"
                  value={formData.studio}
                  onChange={(e) => setFormData({ ...formData, studio: e.target.value })}
                />
              </div>
            </div>

            {/* Genres */}
            <div className="form-group">
              <label>Genres *</label>
              <div className={styles.genresGrid}>
                {genres.map((genre) => (
                  <label key={genre.id} className={styles.genreCheckbox}>
                    <input
                      type="checkbox"
                      checked={formData.genreIds.includes(genre.id)}
                      onChange={() => handleGenreToggle(genre.id)}
                    />
                    <span>{genre.nom}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Bannière gradient */}
            <div className="form-group">
              <label>Bannière (gradient) *</label>
              <div className={styles.bannersGrid}>
                {[...Array(20)].map((_, index) => (
                  <div
                    key={index + 1}
                    className={`banner-gradient banner-${index + 1} ${styles.bannerOption} ${formData.bannerGradient === String(index + 1) ? styles.selected : ''}`}
                    onClick={() => setFormData({ ...formData, bannerGradient: String(index + 1) })}
                  >
                    <div className="banner-label">Bannière {index + 1}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Boutons */}
            <div className={styles.modalActions}>
              <button type="button" className="btn btn-ghost" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TousLesAnimesPage;