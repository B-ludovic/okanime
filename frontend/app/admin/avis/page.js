'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../../components/admin/AdminLayout';
import api from '../../lib/api';
import { isAuthenticated, getCurrentUser } from '../../lib/utils';
import { Trash2, Star, User, Calendar } from 'lucide-react';
import StarRating from '../../../components/avis/StarRating';

function AdminAvisPage() {
  const router = useRouter();
  const [avis, setAvis] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'recent', 'highRated', 'lowRated'

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

  // Récupère tous les avis
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

  // Supprimer un avis
  const handleDelete = async (avisId) => {
    if (!confirm('Voulez-vous vraiment supprimer cet avis ?')) return;

    try {
      await api.delete(`/admin/avis/${avisId}`);
      fetchAvis();
    } catch (err) {
      alert('Erreur lors de la suppression');
      console.error(err);
    }
  };

  // Filtrer les avis
  const getFilteredAvis = () => {
    let filtered = [...avis];

    switch (filter) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation));
        break;
      case 'highRated':
        filtered.sort((a, b) => b.note - a.note);
        break;
      case 'lowRated':
        filtered.sort((a, b) => a.note - b.note);
        break;
      default:
        // 'all' - ordre par défaut
        break;
    }

    return filtered;
  };

  const filteredAvis = getFilteredAvis();

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
        <h1 className="admin-title">Gestion des avis</h1>
        <p className="admin-subtitle">
          {avis.length} avis au total
        </p>
      </div>

      {/* Erreur */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Filtres */}
      <div className="admin-filters">
        <button
          className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setFilter('all')}
        >
          Tous
        </button>
        <button
          className={`btn ${filter === 'recent' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setFilter('recent')}
        >
          Plus récents
        </button>
        <button
          className={`btn ${filter === 'highRated' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setFilter('highRated')}
        >
          Meilleures notes
        </button>
        <button
          className={`btn ${filter === 'lowRated' ? 'btn-primary' : 'btn-ghost'}`}
          onClick={() => setFilter('lowRated')}
        >
          Moins bien notés
        </button>
      </div>

      {/* Liste des avis */}
      {filteredAvis.length === 0 ? (
        <div className="admin-empty">
          <p>Aucun avis pour le moment</p>
        </div>
      ) : (
        <div className="admin-avis-list">
          {filteredAvis.map((a) => (
            <div key={a.id} className="admin-avis-card">
              <div className="admin-avis-header">
                <div className="admin-avis-info">
                  <div className="admin-avis-user">
                    <User size={18} />
                    <span className="admin-avis-username">{a.user.username}</span>
                  </div>
                  <div className="admin-avis-anime">
                    <span>Sur : </span>
                    <strong>{a.anime.titreVf}</strong>
                  </div>
                  <div className="admin-avis-date">
                    <Calendar size={16} />
                    <span>{new Date(a.dateCreation).toLocaleDateString('fr-FR')}</span>
                  </div>
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(a.id)}
                  title="Supprimer"
                >
                  <Trash2 size={18} />
                  Supprimer
                </button>
              </div>

              <div className="admin-avis-rating">
                <StarRating rating={a.note} readonly size={20} />
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
    </AdminLayout>
  );
}

export default AdminAvisPage;
