'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '../../lib/api';
import { isAuthenticated, getCurrentUser } from '../../lib/utils';
import { useModal } from '../../context/ModalContext';
import { CheckCircle, XCircle, Eye, Calendar, User, Clock } from 'lucide-react';
import '../../../styles/Admin.css';

function AdminAnimesPage() {
  const router = useRouter();
  const { showSuccess, showError, showConfirm } = useModal();
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    const user = getCurrentUser();
    if (user.role !== 'ADMIN') {
      router.push('/');
      return;
    }
  }, [router]);

  const fetchPendingAnimes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/animes/pending');
      setAnimes(response.data.animes);
    } catch (err) {
      setError('Erreur lors du chargement des animés en attente');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingAnimes();
  }, []);

  const handleValidate = (animeId) => {
    showConfirm(
      'Valider cet animé',
      "L'animé sera publié et visible par tous les utilisateurs.",
      async () => {
        try {
          await api.put(`/admin/animes/${animeId}/moderation`, { statut: 'VALIDE' });
          fetchPendingAnimes();
          showSuccess('Animé validé', "L'animé est maintenant publié.");
        } catch (err) {
          showError('Erreur', 'Impossible de valider cet animé.');
          console.error(err);
        }
      }
    );
  };

  const handleRefuse = (animeId) => {
    showConfirm(
      'Refuser cet animé',
      "L'animé sera rejeté et ne sera pas publié.",
      async () => {
        try {
          await api.put(`/admin/animes/${animeId}/moderation`, { statut: 'REFUSE' });
          fetchPendingAnimes();
          showSuccess('Animé refusé', "L'animé a été rejeté.");
        } catch (err) {
          showError('Erreur', 'Impossible de refuser cet animé.');
          console.error(err);
        }
      }
    );
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <span className="loading"></span>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Modération des animés</h1>
          <p className="admin-subtitle">
            {animes.length === 0
              ? 'Aucun animé en attente de validation'
              : `${animes.length} animé${animes.length > 1 ? 's' : ''} en attente de validation`}
          </p>
        </div>
        {animes.length > 0 && (
          <span className="admin-badge admin-badge-pending">
            <Clock size={14} />
            {animes.length} en attente
          </span>
        )}
      </div>

      {/* Erreur */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Liste des animés */}
      {animes.length > 0 ? (
        <div className="admin-animes-list">
          {animes.map((anime) => (
            <div key={anime.id} className="admin-anime-card card-pending">
              <div className="admin-anime-content">
                {/* Poster */}
                <Image
                  src={anime.posterUrl || '/placeholder-anime.jpg'}
                  alt={anime.titreVf}
                  width={150}
                  height={210}
                  className="admin-anime-poster"
                />

                {/* Informations */}
                <div className="admin-anime-info">
                  <div className="admin-anime-title-row">
                    <h3 className="admin-anime-title">{anime.titreVf}</h3>
                    <span className="admin-badge admin-badge-pending">
                      <Clock size={12} />
                      En attente
                    </span>
                  </div>

                  <div className="admin-anime-meta">
                    <span className="admin-anime-meta-item">
                      <User size={14} />
                      Proposé par <strong>{anime.userAjout?.username || 'Inconnu'}</strong>
                    </span>
                    <span className="admin-anime-meta-item">
                      <Calendar size={14} />
                      {anime.studio} • {anime.anneeDebut}
                    </span>
                    {anime.createdAt && (
                      <span className="admin-anime-meta-item">
                        <Clock size={14} />
                        Soumis le {new Date(anime.createdAt).toLocaleDateString('fr-FR')}
                      </span>
                    )}
                  </div>

                  <p className="admin-anime-synopsis">{anime.synopsis}</p>

                  <div className="admin-anime-genres">
                    {anime.genres?.map((genreRelation) => (
                      <span key={genreRelation.genre.id} className="admin-anime-genre">
                        {genreRelation.genre.nom}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="admin-anime-actions">
                  <button
                    className="admin-btn admin-btn-success"
                    onClick={() => handleValidate(anime.id)}
                  >
                    <CheckCircle size={18} />
                    Valider
                  </button>
                  <button
                    className="admin-btn admin-btn-danger"
                    onClick={() => handleRefuse(anime.id)}
                  >
                    <XCircle size={18} />
                    Refuser
                  </button>
                  <button
                    className="admin-btn admin-btn-ghost admin-btn-small"
                    onClick={() => router.push(`/anime/${anime.id}`)}
                  >
                    <Eye size={16} />
                    Voir la fiche
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-empty">
          <div className="admin-empty-icon">
            <Image src="/icons/television.png" alt="Aucun anime en attente" width={64} height={64} />
          </div>
          <h3 className="admin-empty-title">File de modération vide</h3>
          <p className="admin-empty-text">
            Tous les animés proposés ont été traités. Revenez plus tard !
          </p>
        </div>
      )}
    </>
  );
}

export default AdminAnimesPage;
