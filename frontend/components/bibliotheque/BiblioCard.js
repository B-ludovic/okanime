'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit2, Trash2 } from 'lucide-react';
import { STATUTS_BIBLIOTHEQUE } from '@/lib/constants';
import styles from '../../styles/BiblioCard.module.css';

export default function BiblioCard({ entry, onUpdate, onDelete }) {
  const [showActions, setShowActions] = useState(false);

  // Calcule le pourcentage de progression
  const getProgressPercentage = () => {
    if (!entry.saison || entry.saison.nombreEpisodes === 0) return 0;
    return Math.min((entry.progressionEpisodes / entry.saison.nombreEpisodes) * 100, 100);
  };

  // Classe CSS selon le statut
  const getStatusClass = () => {
    const statusMap = {
      'EN_COURS': 'enCours',
      'VU': 'vu',
      'A_VOIR': 'aVoir',
      'FAVORI': 'favori',
      'EN_PAUSE': 'enPause',
      'ABANDONNE': 'abandonne'
    };
    return statusMap[entry.statut] || '';
  };

  return (
    <div 
      className={styles.card}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Badge de statut */}
      <div className={`${styles.statusBadge} ${styles[getStatusClass()]}`}>
        {STATUTS_BIBLIOTHEQUE[entry.statut]}
      </div>

      {/* Image */}
      <Link href={`/anime/${entry.saison.anime.id}`}>
        <div className={styles.imageContainer}>
          <Image
            src={entry.saison.anime.posterUrl || '/placeholder-anime.jpg'}
            alt={entry.saison.anime.titreVf}
            fill
            className={styles.image}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      </Link>

      <div className={styles.body}>
        {/* Titre */}
        <Link href={`/anime/${entry.saison.anime.id}`}>
          <h3 className={styles.title}>
            {entry.saison.anime.titreVf}
            {entry.saison.numeroSaison > 1 && ` - S${entry.saison.numeroSaison}`}
          </h3>
        </Link>

        {/* Progression */}
        {entry.statut === 'EN_COURS' && (
          <div className={styles.progress}>
            <span className={styles.progressLabel}>Progression</span>
            <div className={styles.progressBar}>
              <div 
                className={styles.progressFill} 
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <span className={styles.progressText}>
              {entry.progressionEpisodes} / {entry.saison.nombreEpisodes} épisodes
            </span>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className={styles.actions}>
            <button
              className={styles.actionButton}
              onClick={() => onUpdate(entry)}
            >
              <Edit2 size={14} />
              Modifier
            </button>
            <button
              className={`${styles.actionButton} ${styles.danger}`}
              onClick={() => onDelete(entry)}
            >
              <Trash2 size={14} />
              Retirer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}