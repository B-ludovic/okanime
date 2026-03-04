'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AnimeCard from '../../components/anime/AnimeCard';
import api from '../../app/lib/api';
import styles from '../../styles/modules/AnimeList.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

function AnimePage() {
  const [animes, setAnimes] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedSort, setSelectedSort] = useState('recent');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  // Charge les genres au montage
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

  // Récupère les animés depuis l'API
  const fetchAnimes = async (page = 1, genre = selectedGenre, sort = selectedSort) => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (genre) params.append('genre', genre);
      if (sort) params.append('sort', sort);

      const response = await api.get(`/animes?${params.toString()}`);
      setAnimes(response.data.animes);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Erreur lors du chargement des animés');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Charge les animés au montage
  useEffect(() => {
    fetchAnimes(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Recharge depuis la page 1 quand les filtres changent
  const handleGenreChange = (e) => {
    const genre = e.target.value;
    setSelectedGenre(genre);
    setPagination((p) => ({ ...p, page: 1 }));
    fetchAnimes(1, genre, selectedSort);
  };

  const handleSortChange = (e) => {
    const sort = e.target.value;
    setSelectedSort(sort);
    setPagination((p) => ({ ...p, page: 1 }));
    fetchAnimes(1, selectedGenre, sort);
  };

  const handleReset = () => {
    setSelectedGenre('');
    setSelectedSort('recent');
    setPagination((p) => ({ ...p, page: 1 }));
    fetchAnimes(1, '', 'recent');
  };

  // Change de page
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchAnimes(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const hasActiveFilters = selectedGenre || selectedSort !== 'recent';

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          {/* Header de la page */}
          <div className={styles.header}>
            <h1 className={styles.title}>Catalogue d&apos;animés</h1>
            <p className={styles.subtitle}>
              Découvrez notre collection de {pagination.total} animés
            </p>
          </div>

          {/* Barre de filtres */}
          <div className={styles.filterBar}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Genre</label>
              <select
                className={styles.filterSelect}
                value={selectedGenre}
                onChange={handleGenreChange}
              >
                <option value="">Tous les genres</option>
                {genres.map((genre) => (
                  <option key={genre.id} value={genre.nom}>
                    {genre.nom}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Trier par</label>
              <select
                className={styles.filterSelect}
                value={selectedSort}
                onChange={handleSortChange}
              >
                <option value="recent">Plus récents</option>
                <option value="rating">Mieux notés</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button className={styles.filterReset} onClick={handleReset}>
                Réinitialiser
              </button>
            )}
          </div>

          {/* Message d'erreur */}
          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          {/* Chargement */}
          {loading ? (
            <div className={styles.loadingContainer}>
              <span className="loading"></span>
            </div>
          ) : (
            <>
              {/* Grille d'animés */}
              {animes.length > 0 ? (
                <div className={styles.grid}>
                  {animes.map((anime) => (
                    <AnimeCard key={anime.id} anime={anime} />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  Aucun anime trouvé
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className={styles.pagination}>
                  <button
                    className={styles.paginationButton}
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft size={18} />
                    Précédent
                  </button>

                  <span className={styles.paginationInfo}>
                    Page {pagination.page} sur {pagination.totalPages}
                  </span>

                  <button
                    className={styles.paginationButton}
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                  >
                    Suivant
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}


export default AnimePage;
