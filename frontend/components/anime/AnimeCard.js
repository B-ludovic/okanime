'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import styles from '../../styles/AnimeCard.module.css';

export default function AnimeCard({ anime }) {
  return (
    <Link href={`/anime/${anime.id}`} className={styles.animeCard}>
      <div className={styles.imageContainer}>
        <Image
          src={anime.posterUrl || '/placeholder-anime.jpg'}
          alt={anime.titreVf}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
        />
        {anime.noteMoyenne > 0 && (
          <div className={styles.badge}>
            <Star size={12} fill="white" /> {anime.noteMoyenne.toFixed(1)}
          </div>
        )}
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{anime.titreVf}</h3>

        {anime.genres && anime.genres.length > 0 && (
          <div className={styles.genres}>
            {anime.genres.slice(0, 3).map((genreRelation) => (
              <span key={genreRelation.genre.id} className={styles.genreTag}>
                {genreRelation.genre.nom}
              </span>
            ))}
          </div>
        )}

        <div className={styles.info}>
          {anime.noteMoyenne > 0 && (
            <div className={styles.rating}>
              <Star size={14} fill="currentColor" />
              {anime.noteMoyenne.toFixed(1)}/10
            </div>
          )}
          {anime.anneeDebut && (
            <span className={styles.year}>{anime.anneeDebut}</span>
          )}
        </div>
      </div>
    </Link>
  );
}