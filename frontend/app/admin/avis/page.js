'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '../../lib/api';
import { isAuthenticated, getCurrentUser } from '../../lib/utils';
import { useModal } from '../../context/ModalContext';
import { Trash2, User, Calendar } from 'lucide-react';
import StarRating from '../../../components/avis/StarRating';
import '../../../styles/Admin.css';

function AdminAvisPage() {
  const router = useRouter();
  const { showSuccess, showError, showConfirm } = useModal();
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

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

  const fetchAvis = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/avis');
      setAvis(response.data.avis || []);
    } catch (err) {
      setError('Erreur lors du chargement des avis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAvis();
  }, []);

  const handleDelete = (avisId) => {
    showConfirm(
      'Supprimer cet avis',
      'Cette action est irréversible. L\'avis sera définitivement supprimé.',
      async () => {
        try {
          await api.delete(`/admin/avis/${avisId}`);
          fetchAvis();
          showSuccess('Avis supprimé', 'L\'avis a été supprimé avec succès.');
        } catch (err) {
          showError('Erreur', 'Impossible de supprimer cet avis.');
          console.error(err);
        }
      }
    );
  };

  const getFilteredAvis = () => {
    const filtered = [...avis];
    switch (filter) {
      case 'recent':
        return filtered.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));
      case 'highRated':
        return filtered.sort((a, b) => b.note - a.note);
      case 'lowRated':
        return filtered.sort((a, b) => a.note - b.note);
      default:
        return filtered;
    }
  };

  const filteredAvis = getFilteredAvis();

  const moyenneNote = avis.length > 0
    ? (avis.reduce((sum, a) => sum + a.note, 0) / avis.length).toFixed(1)
    : null;

  const getNoteBadgeClass = (note) => {
    if (note >= 7) return 'note-high';
    if (note >= 4) return 'note-mid';
    return 'note-low';
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
      {/* Header avec filtres intégrés */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Gestion des avis</h1>
          <p className="admin-subtitle">
            {avis.length} avis au total
            {moyenneNote && (
              <> • Moyenne : <strong>{moyenneNote}</strong>/10 ★</>
            )}
          </p>
        </div>

        <div className="admin-filters">
          {[
            { key: 'all', label: 'Tous' },
            { key: 'recent', label: 'Plus récents' },
            { key: 'highRated', label: 'Meilleures notes' },
            { key: 'lowRated', label: 'Moins bien notés' },
          ].map(({ key, label }) => (
            <button
              key={key}
              className={`admin-filter-btn ${filter === key ? 'active' : ''}`}
              onClick={() => setFilter(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Liste des avis */}
      {filteredAvis.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">
            <Image src="/icons/television.png" alt="Aucun avis" width={64} height={64} />
          </div>
          <h3 className="admin-empty-title">Aucun avis pour le moment</h3>
          <p className="admin-empty-text">Les avis des utilisateurs apparaîtront ici.</p>
        </div>
      ) : (
        <div className="admin-avis-list">
          {filteredAvis.map((a) => (
            <div key={a.id} className="admin-avis-card">
              <div className="admin-avis-header">
                {/* Badge note */}
                <div className={`admin-avis-note-badge ${getNoteBadgeClass(a.note)}`}>
                  {a.note}
                </div>

                {/* Infos principales */}
                <div className="admin-avis-info">
                  <div className="admin-avis-anime">
                    <strong>{a.anime.titreVf}</strong>
                  </div>
                  <div className="admin-avis-meta-row">
                    <span className="admin-avis-user">
                      <User size={13} />
                      {a.user.username}
                    </span>
                    <span className="admin-avis-date">
                      <Calendar size={13} />
                      {new Date(a.dateCreation).toLocaleDateString('fr-FR')}
                    </span>
                    <StarRating rating={a.note} readonly size={14} />
                  </div>
                </div>

                {/* Action */}
                <button
                  className="admin-btn admin-btn-danger admin-btn-small"
                  onClick={() => handleDelete(a.id)}
                  title="Supprimer cet avis"
                >
                  <Trash2 size={15} />
                  Supprimer
                </button>
              </div>

              {a.commentaire && (
                <div className="admin-avis-comment">
                  <p>{a.commentaire}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default AdminAvisPage;
