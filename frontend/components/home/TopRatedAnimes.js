'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AnimeCard from '../../components/anime/AnimeCard';
import api from '../../app/lib/api';
import { ChevronRight, Star } from 'lucide-react';
import styles from '../../styles/modules/HeroBanner.module.css';

function TopRatedAnimes() {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopRatedAnimes = async () => {
      try {
        const response = await api.get('/animes?limit=5&sort=rating');
        // Filtre uniquement ceux qui ont une note
        const animesData = response?.data?.animes || [];
        const withRating = animesData.filter((a) => a.noteMoyenne > 0);
        setAnimes(withRating);
      } catch (err) {
        console.error('Erreur:', err);
        setAnimes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRatedAnimes();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <span className="loading"></span>
      </div>
    );
  }

  // Ne rien afficher si aucun anime n'a de note
  if (animes.length === 0) {
    return null;
  }

  return (
    <section className={styles.homeSection}>
      <div className={styles.homeSectionHeader}>
        <h2 className={styles.homeSectionTitle}>
          <Star size={20} fill="gold" />
          Les mieux notés
        </h2>
        <Link href="/anime?sort=rating" className={styles.homeSectionLink}>
          Voir tout
          <ChevronRight size={18} />
        </Link>
      </div>

      <div className={styles.animeGrid}>
        {animes.map((anime) => (
          <AnimeCard key={anime.id} anime={anime} />
        ))}
      </div>
    </section>
  );
}

export default TopRatedAnimes;