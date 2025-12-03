'use client';

import { useState } from 'react';
import StarRating from './StarRating';
import api from '../../app/lib/api';
import { isAuthenticated } from '../../app/lib/utils';
import { useRouter } from 'next/navigation';
import styles from '../../styles/modules/AvisForm.module.css';

export default function AvisForm({ animeId, existingAvis, onAvisSubmitted }) {
  const router = useRouter();
  const [note, setNote] = useState(existingAvis?.note || 0);
  const [commentaire, setCommentaire] = useState(existingAvis?.commentaire || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);

  // Vérifie auth
  if (!isAuthenticated()) {
    return (
      <div className={styles.avisFormAuth}>
        <p>Vous devez être connecté pour laisser un avis.</p>
        <button className="btn btn-primary" onClick={() => router.push('/login')}>
          Se connecter
        </button>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (note === 0) {
      setError('Veuillez sélectionner une note');
      return;
    }

    setLoading(true);

    try {
      if (existingAvis) {
        // Modifier l'avis existant
        await api.put(`/avis/${existingAvis.id}`, {
          note,
          commentaire: commentaire.trim() || null,
        });
      } else {
        // Créer un nouvel avis
        await api.post('/avis', {
          animeId,
          note,
          commentaire: commentaire.trim() || null,
        });
      }

      // Reset form
      if (!existingAvis) {
        setNote(0);
        setCommentaire('');
        setShowForm(false);
      }

      // Callback pour rafraîchir la liste
      if (onAvisSubmitted) {
        onAvisSubmitted();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de l\'envoi de l\'avis');
    } finally {
      setLoading(false);
    }
  };

  // Si pas d'avis existant et form masqué, affiche le bouton
  if (!existingAvis && !showForm) {
    return (
      <div className={styles.avisFormTrigger}>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          ⭐ Laisser un avis
        </button>
      </div>
    );
  }

  return (
    <div className={styles.avisFormContainer}>
      <h3 className={styles.avisFormTitle}>
        {existingAvis ? 'Modifier mon avis' : 'Laisser un avis'}
      </h3>

      <form onSubmit={handleSubmit} className={styles.avisForm}>
        {error && <div className={styles.errorMessage}>{error}</div>}

        <div className={styles.formGroup}>
          <label>Votre note</label>
          <StarRating rating={note} onRatingChange={setNote} size={32} />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="commentaire">Votre avis (optionnel)</label>
          <textarea
            id="commentaire"
            className={styles.formTextarea}
            rows="5"
            placeholder="Partagez votre avis sur cet anime..."
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            maxLength={1000}
          />
          <span className={styles.textareaCounter}>{commentaire.length}/1000</span>
        </div>

        <div className={styles.formActions}>
          {!existingAvis && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setShowForm(false);
                setNote(0);
                setCommentaire('');
                setError('');
              }}
            >
              Annuler
            </button>
          )}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Envoi...' : existingAvis ? 'Modifier' : 'Publier'}
          </button>
        </div>
      </form>
    </div>
  );
}