'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { STATUTS_BIBLIOTHEQUE } from '@/lib/constants';
import styles from '../../styles/BiblioModal.module.css';

export default function BiblioModal({ entry, onClose, onSave }) {
  const [formData, setFormData] = useState({
    statut: entry.statut,
    progressionEpisodes: entry.progressionEpisodes,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSave(formData);
    setLoading(false);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <h2 className={styles.title}>Modifier la progression</h2>
          <p className={styles.subtitle}>{entry.saison.anime.titreVf}</p>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className={styles.body}>
          {/* Statut */}
          <div className="form-group">
            <label className="form-label">Statut</label>
            <select
              className="form-input"
              value={formData.statut}
              onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
            >
              {Object.keys(STATUTS_BIBLIOTHEQUE).map((key) => (
                <option key={key} value={key}>
                  {STATUTS_BIBLIOTHEQUE[key]}
                </option>
              ))}
            </select>
          </div>

          {/* Progression (seulement si en cours ou vu) */}
          {(formData.statut === 'EN_COURS' || formData.statut === 'VU') && (
            <div className="form-group">
              <label className="form-label">
                Épisodes vus ({formData.progressionEpisodes} / {entry.saison.nombreEpisodes})
              </label>
              <input
                type="range"
                min="0"
                max={entry.saison.nombreEpisodes}
                value={formData.progressionEpisodes}
                onChange={(e) =>
                  setFormData({ ...formData, progressionEpisodes: parseInt(e.target.value) })
                }
                className={styles.rangeInput}
              />
              <div className={styles.rangeLabels}>
                <span>0</span>
                <span>{entry.saison.nombreEpisodes}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className={styles.actions}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={loading}
            >
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? <span className="loading"></span> : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}