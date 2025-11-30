'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import api from '@/lib/api';
import styles from '../../../styles/AnimeDetail.module.css';
import { Star } from 'lucide-react';

export default function AnimeDetailPage() {
  const params = useParams();
  const [anime, setAnime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Récupère les détails de l'anime
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await api.get(`/animes/${params.id}`);
        setAnime(response.data.anime);
      } catch (err) {
        setError('Anime introuvable');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchAnime();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.loadingContainer}>
            <span className="loading"></span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !anime) {
    return (
      <div className={styles.page}>
        <Header />
        <main className={styles.main}>
          <div className={styles.container}>
            <div className="alert alert-error">
              <span>{error || 'Anime introuvable'}</span>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.card}>
            <div className={styles.content}>
              {/* Poster à gauche */}
              <div className={styles.poster}>
                <Image
                  src={anime.posterUrl || '/placeholder-anime.jpg'}
                  alt={anime.titreVf}
                  width={300}
                  height={420}
                  className={styles.posterImage}
                  priority
                />
                {anime.noteMoyenne > 0 && (
                  <div className={styles.posterBadge}>
                    <Star size={16} fill="white" /> {anime.noteMoyenne.toFixed(1)}
                  </div>
                )}
              </div>

              {/* Informations à droite */}
              <div className={styles.info}>
                <h1 className={styles.title}>{anime.titreVf}</h1>
                
                {anime.studio && (
                  <p className={styles.author}>de {anime.studio}</p>
                )}

                {/* Genres */}
                {anime.genres && anime.genres.length > 0 && (
                  <div className={styles.genresSection}>
                    <span className={styles.genresLabel}>Genres :</span>
                    <div className={styles.genres}>
                      {anime.genres.map((genreRelation) => (
                        <span key={genreRelation.genre.id} className={styles.genreTag}>
                          {genreRelation.genre.nom}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Résumé */}
                <div className={styles.resumeSection}>
                  <h2 className={styles.resumeTitle}>Résumé</h2>
                  <p className={styles.resumeText}>{anime.synopsis}</p>
                </div>

                {/* Saisons */}
                {anime.saisons && anime.saisons.length > 0 && (
                  <div className={styles.seasonsSection}>
                    <h3 className={styles.seasonsTitle}>
                      {anime.saisons.length} saison{anime.saisons.length > 1 ? 's' : ''}
                    </h3>
                    <div className={styles.seasonsList}>
                      {anime.saisons.map((saison) => (
                        <div key={saison.id} className={styles.seasonItem}>
                          <span className={styles.seasonName}>
                            Saison {saison.numeroSaison}
                            {saison.titreSaison && ` - ${saison.titreSaison}`}
                          </span>
                          <span className={styles.seasonEpisodes}>
                            {saison.nombreEpisodes} épisodes
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}