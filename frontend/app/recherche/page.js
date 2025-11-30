'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import AnimeCard from '../../components/anime/AnimeCard';
import { Search, X, Plus } from 'lucide-react';
import api from '../../app/lib/api';
import { isAuthenticated } from '../../app/lib/utils';
import styles from '../../styles/Recherche.module.css';
import '../../styles/Anime.css';


function RechercheContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [animes, setAnimes] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');
  const [hasSearched, setHasSearched] = useState(false);

  // Récupère la liste des genres au chargement
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await api.get('/genres');
        console.log('Genres reçus:', response);
        setGenres(response.data.genres);
      } catch (err) {
        console.error('Erreur lors du chargement des genres:', err);
      }
    };

    fetchGenres();
  }, []);

  // Recherche automatique si params dans l'URL
  useEffect(() => {
    const query = searchParams.get('q');
    const genre = searchParams.get('genre');

    if (query || genre) {
      setSearchQuery(query || '');
      setSelectedGenre(genre || '');
      handleSearch(query, genre);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Fonction de recherche
  const handleSearch = async (query = searchQuery, genre = selectedGenre) => {
    if (!query && !genre) {
      alert('Veuillez entrer un titre ou sélectionner un genre');
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      // Construction de la query string
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (genre) params.append('genre', genre);

      const response = await api.get(`/animes?${params.toString()}`);
      setAnimes(response.data.animes);
    } catch (err) {
      console.error('Erreur lors de la recherche:', err);
      setAnimes([]);
    } finally {
      setLoading(false);
    }
  };

  // Soumet le formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
  };

  // Réinitialise la recherche
  const handleReset = () => {
    setSearchQuery('');
    setSelectedGenre('');
    setAnimes([]);
    setHasSearched(false);
  };

  return (
    <div className="anime-list-page">
      <Header />

      <main className="anime-list-main">
        <div className="anime-list-container">
          {/* Header de la page */}
          <div className="anime-list-header">
            <h1 className="anime-list-title">Rechercher un animé</h1>
            <p className="anime-list-subtitle">
              Recherchez par titre ou par genre
            </p>
          </div>

          {/* Formulaire de recherche */}
          <div className={`card ${styles.searchCard}`}>
            <form onSubmit={handleSubmit} className="form">
              <div className={styles.searchGrid}>
                {/* Recherche par titre */}
                <div className="form-group">
                  <label className="form-label">Titre de l&apos;animé</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Ex: Naruto, One Piece..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Recherche par genre */}
                <div className="form-group">
                  <label className="form-label">Genre</label>
                  <select
                    className="form-input"
                    value={selectedGenre}
                    onChange={(e) => setSelectedGenre(e.target.value)}
                  >
                    <option value="">Tous les genres</option>
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.nom}>
                        {genre.nom}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Boutons */}
              <div className={styles.searchButtons}>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <span className="loading"></span>
                  ) : (
                    <>
                      <Search size={18} />
                      Rechercher
                    </>
                  )}
                </button>
                {(searchQuery || selectedGenre || hasSearched) && (
                  <button type="button" className="btn btn-ghost" onClick={handleReset}>
                    <X size={18} />
                    Réinitialiser
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Résultats */}
          {loading ? (
            <div className={styles.loadingContainer}>
              <span className="loading"></span>
            </div>
          ) : hasSearched ? (
            <>
              {/* Nombre de résultats */}
              <div className={styles.resultsCount}>
                <p>
                  {animes.length} résultat{animes.length > 1 ? 's' : ''} trouvé{animes.length > 1 ? 's' : ''}
                  {searchQuery && ` pour "${searchQuery}"`}
                  {selectedGenre && ` dans le genre "${selectedGenre}"`}
                </p>
              </div>

              {/* Grille d'animés */}
              {animes.length > 0 ? (
                <div className="anime-grid">
                  {animes.map((anime) => (
                    <AnimeCard key={anime.id} anime={anime} />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>
                  <div className={`${styles.emptyIcon} ${styles.emptyIconSearch}`}>
                    <Search size={64} strokeWidth={1.5} />
                  </div>
                  <h3 className={styles.emptyTitle}>
                    Aucun résultat
                  </h3>
                  <p className={styles.emptyText}>
                    Essayez avec d&apos;autres mots-clés ou un autre genre
                  </p>
                  {/* BOUTON AJOUTER UN ANIME */}
                  {isAuthenticated() && (
                    <div className={styles.emptyAddSection}>
                      <p className={styles.emptyAddText}>
                        L&apos;animé que vous cherchez n&apos;existe pas dans notre base ?
                      </p>
                      <button
                        className="btn btn-primary btn-large"
                        onClick={() => router.push('/anime/ajouter')}
                      >
                        <Plus size={18} />
                        Ajouter un animé
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className={styles.emptyState}>
              <div className={`${styles.emptyIcon} ${styles.emptyIconFlag}`}>
                <Image src="/icons/japan-flag.png" alt="O'Kanime" width={64} height={64} />
              </div>
              <p className={styles.emptyTextLarge}>
                Utilisez le formulaire ci-dessus pour rechercher des animés
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function RecherchePage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <span className="loading"></span>
      </div>
    }>
      <RechercheContent />
    </Suspense>
  );
}
