'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { Trash2, Edit2 } from 'lucide-react';
import StarRating from './StarRating';
import AvisForm from './AvisForm';
import api from '../../app/lib/api';
import { getCurrentUser } from '../../app/lib/utils';
import { useModal } from '../../app/context/ModalContext';
import styles from '../../styles/modules/AvisSection.module.css';

export default function AvisSection({ animeId }) {
  const { showConfirm, showError } = useModal();
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userAvis, setUserAvis] = useState(null);
  const [editingAvis, setEditingAvis] = useState(false);
  const [sortBy, setSortBy] = useState('recent'); // 'recent' ou 'rating'

  const currentUser = getCurrentUser();

  // Récupère les avis
  const fetchAvis = useCallback(async () => {
    try {
      const response = await api.get(`/avis/anime/${animeId}`);
      const allAvis = response.data?.data?.avis || response.data?.avis || [];

      // Sépare l'avis de l'utilisateur des autres
      if (currentUser) {
        const myAvis = allAvis.find((a) => a.userId === currentUser.id);
        const otherAvis = allAvis.filter((a) => a.userId !== currentUser.id);
        setUserAvis(myAvis || null);
        setAvis(otherAvis);
      } else {
        setAvis(allAvis);
      }
    } catch (err) {
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  }, [animeId, currentUser]);

  useEffect(() => {
    fetchAvis();
  }, [fetchAvis]);

  // Supprime un avis
  const handleDelete = async (avisId) => {
    showConfirm(
      'Supprimer l\'avis',
      'Êtes-vous sûr de vouloir supprimer cet avis ?',
      async () => {
        try {
          // Admin utilise la route admin, utilisateur normal utilise sa route
          const endpoint = currentUser?.role === 'ADMIN' 
            ? `/admin/avis/${avisId}` 
            : `/avis/${avisId}`;
          
          await api.delete(endpoint);
          fetchAvis();
        } catch (err) {
          showError('Erreur', 'Erreur lors de la suppression');
        }
      }
    );
  };

  // Tri des avis
  const sortedAvis = [...avis].sort((a, b) => {
    if (sortBy === 'rating') {
      return b.note - a.note; // Meilleures notes en premier
    }
    return new Date(b.dateCreation) - new Date(a.dateCreation); // Plus récents
  });

  if (loading) {
    return (
      <div>
        <h2 className={styles.sectionTitle}>Avis</h2>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <span className="loading"></span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className={styles.avisHeader}>
        <h2 className={styles.sectionTitle}>
          Avis ({avis.length + (userAvis ? 1 : 0)})
        </h2>

        {avis.length + (userAvis ? 1 : 0) > 0 && (
          <div className={styles.avisSort}>
            <label>Trier par :</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="recent">Plus récents</option>
              <option value="rating">Meilleures notes</option>
            </select>
          </div>
        )}
      </div>

      {/* Formulaire pour l'utilisateur connecté */}
      {currentUser && (
        <div className={styles.userAvisContainer}>
          {userAvis && !editingAvis ? (
            <div className={`${styles.avisCard} ${styles.userAvis}`}>
              <div className={styles.avisCardHeader}>
                <div className={styles.avisUser}>
                  {userAvis.user.avatar ? (
                    <Image
                      src={userAvis.user.avatar}
                      alt={userAvis.user.username}
                      width={48}
                      height={48}
                      className={styles.avisAvatar}
                    />
                  ) : (
                    <div className={styles.avisAvatarPlaceholder}>
                      {userAvis.user.username.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <span className={styles.avisUsername}>Votre avis</span>
                    <span className={styles.avisDate}>
                      {new Date(userAvis.dateCreation).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                </div>
                <div className={styles.avisActions}>
                  <button
                    className={styles.btnIcon}
                    onClick={() => setEditingAvis(true)}
                    title="Modifier"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    className={`${styles.btnIcon} ${styles.btnDanger}`}
                    onClick={() => handleDelete(userAvis.id)}
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <StarRating rating={userAvis.note} readonly />
              {userAvis.commentaire && (
                <p className={styles.avisCommentaire}>{userAvis.commentaire}</p>
              )}
            </div>
          ) : (
            <AvisForm
              animeId={animeId}
              existingAvis={editingAvis ? userAvis : null}
              onAvisSubmitted={() => {
                fetchAvis();
                setEditingAvis(false);
              }}
            />
          )}
        </div>
      )}

      {/* Liste des autres avis */}
      {sortedAvis.length === 0 && !userAvis && (
        <div className={styles.avisEmpty}>
          <p>Aucun avis pour le moment. Soyez le premier à donner votre avis !</p>
        </div>
      )}

      <div className={styles.avisList}>
        {sortedAvis.map((a) => (
          <div key={a.id} className={styles.avisCard}>
            <div className={styles.avisCardHeader}>
              <div className={styles.avisUser}>
                {a.user.avatar ? (
                  <Image
                    src={a.user.avatar}
                    alt={a.user.username}
                    width={48}
                    height={48}
                    className={styles.avisAvatar}
                  />
                ) : (
                  <div className={styles.avisAvatarPlaceholder}>
                    {a.user.username.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <span className={styles.avisUsername}>{a.user.username}</span>
                  <span className={styles.avisDate}>
                    {new Date(a.dateCreation).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
              {currentUser?.role === 'ADMIN' && (
                <button
                  className={`${styles.btnIcon} ${styles.btnDanger}`}
                  onClick={() => handleDelete(a.id)}
                  title="Supprimer (Admin)"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
            <StarRating rating={a.note} readonly />
            {a.commentaire && <p className={styles.avisCommentaire}>{a.commentaire}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}