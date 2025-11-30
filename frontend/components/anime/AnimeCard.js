'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import styles from '../../styles/AnimeCard.module.css';

export default function AnimeCard({ anime }) {
  if (!anime) {
    return null;
  }

  // Fonction pour attribuer une couleur à chaque genre
  const getGenreColor = (genreName) => {
    if (!genreName) {
      return '#93C5FD'; // Bleu pastel par défaut
    }

    const colors = {
      'Action': '#EF4444',        // Rouge - énergie et combat
      'Adventure': '#F59E0B',     // Orange - exploration
      'Comedy': '#FCD34D',        // Jaune - joie et humour
      'Drama': '#8B5CF6',         // Violet - émotions
      'Fantasy': '#EC4899',       // Rose - magie et rêves
      'Horror': '#1F2937',        // Gris foncé - peur
      'Mystery': '#6366F1',       // Indigo - énigmes
      'Romance': '#F472B6',       // Rose clair - amour
      'Sci-Fi': '#3B82F6',        // Bleu - technologie
      'Slice of Life': '#10B981', // Vert - quotidien
      'Sports': '#14B8A6',        // Turquoise - compétition
      'Supernatural': '#7C3AED',  // Violet foncé - surnaturel
      'Thriller': '#DC2626',      // Rouge foncé - suspense
      'Mecha': '#6B7280',         // Gris - robots
      'School': '#F97316',        // Orange clair - jeunesse
      'Music': '#A855F7',         // Violet clair - harmonie
    };

    // Recherche insensible à la casse
    const normalizedName = genreName.trim();
    if (colors[normalizedName]) {
      return colors[normalizedName];
    }

    // Recherche partielle
    for (const [key, color] of Object.entries(colors)) {
      if (key.toLowerCase().includes(normalizedName.toLowerCase()) || 
          normalizedName.toLowerCase().includes(key.toLowerCase())) {
        return color;
      }
    }

    return '#93C5FD'; // Bleu pastel par défaut
  };

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
              <span 
                key={genreRelation.genre.id} 
                className={styles.genreTag}
                style={{ backgroundColor: getGenreColor(genreRelation.genre.nom) }}
              >
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