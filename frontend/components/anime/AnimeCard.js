'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';
import styles from '../../styles/modules/AnimeCard.module.css';

function AnimeCard({ anime }) {
  if (!anime) {
    return null;
  }

  // Fonction pour attribuer une couleur à chaque genre
  const getGenreColor = (genreName) => {
    if (!genreName) {
      return 'linear-gradient(135deg, #DBEAFE, #93C5FD)'; // Bleu pastel par défaut
    }

    const colors = {
      'Action': 'linear-gradient(135deg, #FCA5A5, #EF4444)',        // Rouge - énergie et combat
      'Adventure': 'linear-gradient(135deg, #FCD34D, #F59E0B)',     // Orange - exploration
      'Comedy': 'linear-gradient(135deg, #FEF3C7, #FCD34D)',        // Jaune - joie et humour
      'Drama': 'linear-gradient(135deg, #C4B5FD, #8B5CF6)',         // Violet - émotions
      'Fantasy': 'linear-gradient(135deg, #F9A8D4, #EC4899)',       // Rose - magie et rêves
      'Horror': 'linear-gradient(135deg, #4B5563, #1F2937)',        // Gris foncé - peur
      'Mystery': 'linear-gradient(135deg, #A5B4FC, #6366F1)',       // Indigo - énigmes
      'Romance': 'linear-gradient(135deg, #FBCFE8, #F472B6)',       // Rose clair - amour
      'Sci-Fi': 'linear-gradient(135deg, #93C5FD, #3B82F6)',        // Bleu - technologie
      'Slice of Life': 'linear-gradient(135deg, #6EE7B7, #10B981)', // Vert - quotidien
      'Sports': 'linear-gradient(135deg, #5EEAD4, #14B8A6)',        // Turquoise - compétition
      'Supernatural': 'linear-gradient(135deg, #A78BFA, #7C3AED)',  // Violet foncé - surnaturel
      'Thriller': 'linear-gradient(135deg, #F87171, #DC2626)',      // Rouge foncé - suspense
      'Mecha': 'linear-gradient(135deg, #9CA3AF, #6B7280)',         // Gris - robots
      'School': 'linear-gradient(135deg, #FDBA74, #F97316)',        // Orange clair - jeunesse
      'Music': 'linear-gradient(135deg, #D8B4FE, #A855F7)',         // Violet clair - harmonie
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

    return 'linear-gradient(135deg, #DBEAFE, #93C5FD)'; // Bleu pastel par défaut
  };

  return (
    <Link href={`/anime/${anime.id}`} className={styles.animeCard}>
      {/* Bannière gradient en arrière-plan */}
      {anime.banniereUrl && anime.banniereUrl.startsWith('gradient-') && (
        <div className={`${anime.banniereUrl} ${styles.bannerBackground}`}></div>
      )}
      
      <div className={styles.imageContainer}>
        <Image
          src={anime.posterUrl || '/placeholder-anime.jpg'}
          alt={anime.titreVf}
          fill
          className={styles.image}
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
          onError={(e) => { e.target.src = '/placeholder-anime.jpg'; }}
          unoptimized={anime.posterUrl?.includes('cloudinary')}
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
                style={{ background: getGenreColor(genreRelation.genre.nom) }}
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

export default AnimeCard;