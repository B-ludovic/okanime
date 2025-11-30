'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AdminLayout from '../../../components/admin/AdminLayout';
import api from '../../lib/api';
import { isAuthenticated, getCurrentUser } from '../../lib/utils';
import { CheckCircle, XCircle, Eye, Calendar, User } from 'lucide-react';

export default function AdminAnimesPage() {
  const router = useRouter();
  const [animes, setAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Vérifie l'authentification et le rôle admin
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

  // Récupère les animés en attente
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

  // Valider un anime
  const handleValidate = async (animeId) => {
    if (!confirm('Voulez-vous vraiment valider cet anime ?')) return;

    try {
      await api.put(`/admin/animes/${animeId}/moderation`, {
        statutModeration: 'VALIDE',
      });
      fetchPendingAnimes(); // Recharge la liste
    } catch (err) {
      alert('Erreur lors de la validation');
      console.error(err);
    }
  };

  // Refuser un anime
  const handleRefuse = async (animeId) => {
    if (!confirm('Voulez-vous vraiment refuser cet anime ?')) return;

    try {
      await api.put(`/admin/animes/${animeId}/moderation`, {
        statutModeration: 'REFUSE',
      });
      fetchPendingAnimes(); // Recharge la liste
    } catch (err) {
      alert('Erreur lors du refus');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <span className="loading"></span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="admin-header">
        <h1 className="admin-title">Modération des animés</h1>
        <p className="admin-subtitle">
          {animes.length} animé{animes.length > 1 ? 's' : ''} en attente de validation
        </p>
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
            <div key={anime.id} className="admin-anime-card">
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
                  <h3 className="admin-anime-title">{anime.titreVf}</h3>

                  <div className="admin-anime-meta">
                    <span className="admin-anime-meta-item">
                      <User size={14} />
                      Ajouté par : {anime.userAjout?.username || 'Inconnu'}
                    </span>
                    <span className="admin-anime-meta-item">
                      <Calendar size={14} />
                      {anime.studio} • {anime.anneeDebut}
                    </span>
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
                    className="admin-btn btn-ghost admin-btn-small"
                    onClick={() => router.push(`/anime/${anime.id}`)}
                  >
                    <Eye size={16} />
                    Voir
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-empty">
          <div className="admin-empty-icon">✨</div>
          <h3 className="admin-empty-title">Aucun anime en attente</h3>
          <p className="admin-empty-text">
            Tous les animés ont été modérés !
          </p>
        </div>
      )}
    </AdminLayout>
  );
}