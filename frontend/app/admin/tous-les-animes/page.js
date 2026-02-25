'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '../../lib/api';
import { isAuthenticated, getCurrentUser } from '../../lib/utils';
import { useModal } from '../../context/ModalContext';
import { Edit, Trash2, Eye, User, Plus, X, ChevronRight, ChevronLeft, Search, Calendar } from 'lucide-react';
import styles from '../../../styles/modules/ModalAdmin.module.css';
import '../../../styles/Admin.css';

const STATUT_LABELS = {
  VALIDE: 'Validé',
  EN_ATTENTE: 'En attente',
  REFUSE: 'Refusé',
};

const STATUT_CLASSES = {
  VALIDE: 'admin-badge-success',
  EN_ATTENTE: 'admin-badge-warning',
  REFUSE: 'admin-badge-danger',
};

function TousLesAnimesPage() {
  const router = useRouter();
  const { showSuccess, showError, showConfirm } = useModal();

  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingAnime, setEditingAnime] = useState(null);
  const [genres, setGenres] = useState([]);

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statutFilter, setStatutFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

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

  const fetchAnimes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: currentPage, limit: 20 });
      if (search) params.append('query', search);
      if (statutFilter) params.append('statut', statutFilter);
      const response = await api.get(`/admin/animes?${params.toString()}`);
      setAnimes(response.data?.animes || []);
      setPagination(response.data?.pagination || { total: 0, totalPages: 1 });
    } catch (err) {
      setError('Erreur lors du chargement des animés');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentPage, search, statutFilter]);

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchAnimes();
  }, [fetchAnimes]);

  const fetchGenres = async () => {
    try {
      const response = await api.get('/genres');
      setGenres(response.data.genres || []);
    } catch (err) {
      console.error('Erreur genres:', err);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setCurrentPage(1);
  };

  const handleStatutFilter = (statut) => {
    setStatutFilter(statut);
    setCurrentPage(1);
  };

  const handleEdit = (anime) => {
    setEditingAnime(anime);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAnime(null);
  };

  const handleSaveAnime = async (updatedData) => {
    try {
      await api.put(`/admin/animes/${editingAnime.id}`, updatedData);
      await fetchAnimes();
      handleCloseModal();
      showSuccess('Animé modifié', 'Les modifications ont été enregistrées.');
    } catch (err) {
      showError('Erreur', 'Erreur lors de la modification.');
      console.error(err);
    }
  };

  const handleDelete = (animeId, animeTitre) => {
    showConfirm(
      'Supprimer cet animé',
      `Voulez-vous vraiment supprimer "${animeTitre}" ? Cette action est irréversible.`,
      async () => {
        try {
          await api.delete(`/admin/animes/${animeId}`);
          await fetchAnimes();
          showSuccess('Animé supprimé', `"${animeTitre}" a été supprimé.`);
        } catch (err) {
          showError('Erreur', 'Erreur lors de la suppression.');
          console.error(err);
        }
      }
    );
  };

  const { total, totalPages } = pagination;

  return (
    <>
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Tous les animés</h1>
          <p className="admin-subtitle">
            {total} animé{total !== 1 ? 's' : ''} • Page {currentPage} sur {totalPages || 1}
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
        </div>
      </div>

      {/* Filtres */}
      <div className="admin-filters">
        <form onSubmit={handleSearchSubmit} className="admin-search-form">
          <div className="admin-search-bar">
            <Search size={16} className="admin-search-icon" />
            <input
              type="text"
              className="admin-search-input"
              placeholder="Rechercher un animé..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                type="button"
                className="admin-search-clear"
                onClick={() => { setSearchInput(''); setSearch(''); setCurrentPage(1); }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        </form>

        <div className="admin-filter-tabs">
          {[
            { label: 'Tous', value: '' },
            { label: 'Validés', value: 'VALIDE' },
            { label: 'En attente', value: 'EN_ATTENTE' },
            { label: 'Refusés', value: 'REFUSE' },
          ].map(({ label, value }) => (
            <button
              key={value}
              className={`admin-filter-tab${statutFilter === value ? ' active' : ''}`}
              onClick={() => handleStatutFilter(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Liste */}
      {loading ? (
        <div className="admin-loading">
          <span className="loading"></span>
        </div>
      ) : animes.length > 0 ? (
        <div className="admin-animes-list">
          {animes.map((anime) => (
            <div key={anime.id} className="admin-anime-card">
              <div className="admin-anime-content-compact">
                {/* Poster */}
                <Image
                  src={anime.posterUrl || '/placeholder-anime.jpg'}
                  alt={anime.titreVf}
                  width={80}
                  height={112}
                  className="admin-anime-poster-sm"
                />

                {/* Infos */}
                <div className="admin-anime-info">
                  <div className="admin-anime-title-row">
                    <h3 className="admin-anime-title">{anime.titreVf}</h3>
                    <span className={`admin-badge ${STATUT_CLASSES[anime.statutModeration]}`}>
                      {STATUT_LABELS[anime.statutModeration]}
                    </span>
                  </div>

                  <div className="admin-anime-meta">
                    <span className="admin-anime-meta-item">
                      <Calendar size={13} />
                      {anime.studio ? `${anime.studio} • ` : ''}{anime.anneeDebut}
                    </span>
                    {anime.userAjout && (
                      <span className="admin-anime-meta-item">
                        <User size={13} />
                        {anime.userAjout.username}
                      </span>
                    )}
                  </div>

                  <div className="admin-anime-genres">
                    {anime.genres?.slice(0, 4).map((genreRelation) => (
                      <span key={genreRelation.genre.id} className="admin-anime-genre">
                        {genreRelation.genre.nom}
                      </span>
                    ))}
                    {anime.genres?.length > 4 && (
                      <span className="admin-anime-genre admin-anime-genre-more">
                        +{anime.genres.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="admin-anime-actions">
                  <button
                    className="admin-btn admin-btn-small admin-btn-ghost"
                    onClick={() => handleEdit(anime)}
                    title="Modifier"
                  >
                    <Edit size={14} />
                    Modifier
                  </button>
                  <button
                    className="admin-btn admin-btn-small admin-btn-ghost"
                    onClick={() => router.push(`/anime/${anime.slug}`)}
                    title="Voir"
                  >
                    <Eye size={14} />
                    Voir
                  </button>
                  <button
                    className="admin-btn admin-btn-small admin-btn-danger"
                    onClick={() => handleDelete(anime.id, anime.titreVf)}
                    title="Supprimer"
                  >
                    <Trash2 size={14} />
                    Supprimer
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
          <h3 className="admin-empty-title">Aucun animé trouvé</h3>
          <p className="admin-empty-text">
            {search || statutFilter
              ? 'Aucun animé ne correspond à vos filtres.'
              : 'Commencez par ajouter votre premier animé !'}
          </p>
        </div>
      )}

      {/* Pagination bas de page */}
      {!loading && totalPages > 1 && (
        <div className="admin-pagination">
          <button
            className="admin-btn admin-btn-ghost admin-btn-small"
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
            Précédent
          </button>
          <span className="admin-pagination-info">
            Page {currentPage} sur {totalPages}
          </span>
          <button
            className="admin-btn admin-btn-ghost admin-btn-small"
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage >= totalPages}
          >
            Suivant
            <ChevronRight size={16} />
          </button>
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
    </>
  );
}

function AnimeEditModal({ anime, genres, onClose, onSave }) {
  const [formData, setFormData] = useState({
    titreVf: anime.titreVf || '',
    synopsis: anime.synopsis || '',
    anneeDebut: anime.anneeDebut || new Date().getFullYear(),
    studio: anime.studio || '',
    genreIds: anime.genres?.map(g => g.genre.id) || [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('titreVf', formData.titreVf);
    formDataToSend.append('synopsis', formData.synopsis);
    formDataToSend.append('anneeDebut', formData.anneeDebut);
    formDataToSend.append('studio', formData.studio);
    formDataToSend.append('genreIds', JSON.stringify(formData.genreIds));
    onSave(formDataToSend);
  };

  const handleGenreToggle = (genreId) => {
    setFormData(prev => ({
      ...prev,
      genreIds: prev.genreIds.includes(genreId)
        ? prev.genreIds.filter(id => id !== genreId)
        : [...prev.genreIds, genreId],
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
            <div className="form-group">
              <label>Titre VF *</label>
              <input
                type="text"
                value={formData.titreVf}
                onChange={(e) => setFormData({ ...formData, titreVf: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Synopsis *</label>
              <textarea
                value={formData.synopsis}
                onChange={(e) => setFormData({ ...formData, synopsis: e.target.value })}
                rows={5}
                required
              />
            </div>

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
