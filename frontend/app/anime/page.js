'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AnimeCard from '@/components/anime/AnimeCard';
import api from '@/lib/api';
import '@/styles/anime.css';
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
    <div className="anime-list-page">
      <Header />

      <main className="anime-list-main">
        <div className="anime-list-container">
          {/* Header de la page */}
          <div className="anime-list-header">
            <h1 className="anime-list-title">Catalogue d'animés</h1>
            <p className="anime-list-subtitle">
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
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
              <span className="loading"></span>
            </div>
          ) : (
            <>
              {/* Grille d'animés */}
              {animes.length > 0 ? (
                <div className="anime-grid">
                  {animes.map((anime) => (
                    <AnimeCard key={anime.id} anime={anime} />
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--texte-gris)' }}>
                  Aucun anime trouvé
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    className="pagination-button"
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                  >
                    <ChevronLeft size={18} />
                    Précédent
                  </button>

                  <span className="pagination-info">
                    Page {pagination.page} sur {pagination.totalPages}
                  </span>

                  <button
                    className="pagination-button"
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