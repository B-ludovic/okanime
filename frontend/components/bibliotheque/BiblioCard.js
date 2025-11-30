'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit2, Trash2 } from 'lucide-react';
import { STATUTS_BIBLIOTHEQUE } from '@/lib/constants';

export default function BiblioCard({ entry, onUpdate, onDelete }) {
  const [showActions, setShowActions] = useState(false);

  // Calcule le pourcentage de progression
  const getProgressPercentage = () => {
    if (!entry.saison || entry.saison.nombreEpisodes === 0) return 0;
    return Math.min((entry.progressionEpisodes / entry.saison.nombreEpisodes) * 100, 100);
  };

  // Classe CSS selon le statut
  const getStatusClass = () => {
    return entry.statut.toLowerCase().replace('_', '-');
  };

  return (
    <div 
      className="biblio-card"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Badge de statut */}
      <div className={`biblio-status-badge ${getStatusClass()}`}>
        {STATUTS_BIBLIOTHEQUE[entry.statut]}
      </div>

      {/* Image */}
      <Link href={`/anime/${entry.saison.anime.id}`}>
        <div className="biblio-card-image-container">
          <Image
            src={entry.saison.anime.posterUrl || '/placeholder-anime.jpg'}
            alt={entry.saison.anime.titreVf}
            fill
            className="biblio-card-image"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      </Link>

      <div className="biblio-card-body">
        {/* Titre */}
        <Link href={`/anime/${entry.saison.anime.id}`}>
          <h3 className="biblio-card-title">
            {entry.saison.anime.titreVf}
            {entry.saison.numeroSaison > 1 && ` - S${entry.saison.numeroSaison}`}
          </h3>
        </Link>

        {/* Progression */}
        {entry.statut === 'EN_COURS' && (
          <div className="biblio-progress">
            <span className="biblio-progress-label">Progression</span>
            <div className="biblio-progress-bar">
              <div 
                className="biblio-progress-fill" 
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <span className="biblio-progress-text">
              {entry.progressionEpisodes} / {entry.saison.nombreEpisodes} épisodes
            </span>
          </div>
        )}

        {/* Actions */}
        {showActions && (
          <div className="biblio-actions">
            <button
              className="biblio-action-button"
              onClick={() => onUpdate(entry)}
            >
              <Edit2 size={14} />
              Modifier
            </button>
            <button
              className="biblio-action-button danger"
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