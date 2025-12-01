'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../../components/admin/AdminLayout';
import api from '../../lib/api';
import { isAuthenticated, getCurrentUser } from '../../lib/utils';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';

function AdminGenresPage() {
  const router = useRouter();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [genreName, setGenreName] = useState('');

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

  // Récupère tous les genres
  const fetchGenres = async () => {
    setLoading(true);
    try {
      const response = await api.get('/genres');
      setGenres(response.data.genres);
    } catch (err) {
      setError('Erreur lors du chargement des genres');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  // Ouvre le modal pour ajouter un genre
  const handleAdd = () => {
    setEditingGenre(null);
    setGenreName('');
    setShowModal(true);
  };

  // Ouvre le modal pour modifier un genre
  const handleEdit = (genre) => {
    setEditingGenre(genre);
    setGenreName(genre.nom);
    setShowModal(true);
  };

  // Sauvegarde (ajouter ou modifier)
  const handleSave = async () => {
    if (!genreName.trim()) {
      alert('Le nom du genre ne peut pas être vide');
      return;
    }

    try {
      if (editingGenre) {
        // Modifier
        await api.put(`/admin/genres/${editingGenre.id}`, { nom: genreName });
      } else {
        // Ajouter
        await api.post('/admin/genres', { nom: genreName });
      }
      setShowModal(false);
      fetchGenres();
    } catch (err) {
      alert(err.message || 'Erreur lors de la sauvegarde');
      console.error(err);
    }
  };

  // Supprimer un genre
  const handleDelete = async (genreId) => {
    if (!confirm('Voulez-vous vraiment supprimer ce genre ? Cela affectera tous les animés associés.')) {
      return;
    }

    try {
      await api.delete(`/admin/genres/${genreId}`);
      fetchGenres();
    } catch (err) {
      alert('Erreur lors de la suppression');
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
        <h1 className="admin-title">Gestion des genres</h1>
        <p className="admin-subtitle">
          {genres.length} genre{genres.length > 1 ? 's' : ''} disponible{genres.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Bouton ajouter */}
      <div className="admin-add-button">
        <button className="btn btn-primary" onClick={handleAdd}>
          <Plus size={18} />
          Ajouter un genre
        </button>
      </div>

      {/* Erreur */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Table des genres */}
      <div className="admin-table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Genre</th>
              <th>Nombre d'animés</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {genres.map((genre) => (
              <tr key={genre.id}>
                <td>
                  <div className="admin-genre-cell">
                    <Tag size={18} />
                    <strong>{genre.nom}</strong>
                  </div>
                </td>
                <td>
                  <span className="admin-count-cell">
                    {genre._count?.animes || 0} animé{(genre._count?.animes || 0) > 1 ? 's' : ''}
                  </span>
                </td>
                <td>
                  <div className="admin-actions-cell">
                    <button
                      className="admin-btn admin-btn-small btn-ghost"
                      onClick={() => handleEdit(genre)}
                      title="Modifier"
                    >
                      <Edit2 size={14} />
                      Modifier
                    </button>
                    <button
                      className="admin-btn admin-btn-small admin-btn-danger"
                      onClick={() => handleDelete(genre.id)}
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                      Supprimer
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal d'ajout/modification */}
      {showModal && (
        <div className="biblio-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="biblio-modal" onClick={(e) => e.stopPropagation()}>
            <div className="biblio-modal-header">
              <h2 className="biblio-modal-title">
                {editingGenre ? 'Modifier le genre' : 'Ajouter un genre'}
              </h2>
            </div>

            <div className="biblio-modal-body">
              <div className="form-group">
                <label className="form-label">Nom du genre</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Action, Aventure..."
                  value={genreName}
                  onChange={(e) => setGenreName(e.target.value)}
                  autoFocus
                />
              </div>
            </div>

            <div className="biblio-modal-actions">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>
                Annuler
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editingGenre ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

export default AdminGenresPage;