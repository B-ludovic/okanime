'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AnimeCard from '../../components/anime/AnimeCard';
import api from '../../app/lib/api';
import { ChevronRight, Sparkles } from 'lucide-react';
import styles from '../../styles/modules/HeroBanner.module.css';

function LatestAnimes() {
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestAnimes = async () => {
      try {
        const response = await api.get('/animes?limit=5&sort=recent');
        setAnimes(response?.data?.animes || []);
      } catch (err) {
        console.error('Erreur:', err);
        setAnimes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestAnimes();
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <span className="loading"></span>
      </div>
    );
  }

  if (animes.length === 0) {
    return null;
  }

  return (
    <section className={styles.homeSection}>
      <div className={styles.homeSectionHeader}>
        <h2 className={styles.homeSectionTitle}>
          <Sparkles size={20} />
          Derniers ajouts
        </h2>
        <Link href="/anime" className={styles.homeSectionLink}>
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

export default LatestAnimes;