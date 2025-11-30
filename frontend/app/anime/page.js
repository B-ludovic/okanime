'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AnimeCard from '../../components/anime/AnimeCard';
import api from '../../app/lib/api';
import styles from '../../styles/AnimeList.module.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function AnimePage() {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
  });

  // Récupère les animés depuis l'API
  const fetchAnimes = async (page = 1) => {
    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/animes?page=${page}&limit=12`);
      setAnimes(response.data.animes);
      setPagination(response.data.pagination);
    } catch (err) {
      setError('Erreur lors du chargement des animés');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Charge les animés au montage du composant
  useEffect(() => {
    fetchAnimes(pagination.page);
  }, []);

  // Change de page
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchAnimes(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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