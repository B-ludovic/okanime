'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '../../lib/api';
import { isAuthenticated, getCurrentUser } from '../../lib/utils';
import { useModal } from '../../context/ModalContext';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import '../../../styles/Admin.css';

function AdminGenresPage() {
  const router = useRouter();
  const { showSuccess, showError, showConfirm } = useModal();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingGenre, setEditingGenre] = useState(null);
  const [genreName, setGenreName] = useState('');

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

  const fetchGenres = async () => {
    setLoading(true);
    try {
      const response = await api.get('/genres');
      setGenres(response.data.genres || []);
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

  const handleAdd = () => {
    setEditingGenre(null);
    setGenreName('');
    setShowModal(true);
  };

  const handleEdit = (genre) => {
    setEditingGenre(genre);
    setGenreName(genre.nom);
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!genreName.trim()) {
      showError('Validation', 'Le nom du genre ne peut pas être vide.');
      return;
    }

    try {
      if (editingGenre) {
        await api.put(`/admin/genres/${editingGenre.id}`, { nom: genreName.trim() });
        showSuccess('Genre modifié', `"${genreName.trim()}" a été mis à jour.`);
      } else {
        await api.post('/admin/genres', { nom: genreName.trim() });
        showSuccess('Genre ajouté', `"${genreName.trim()}" a été ajouté.`);
      }
      setShowModal(false);
      fetchGenres();
    } catch (err) {
      showError('Erreur', err.message || 'Erreur lors de la sauvegarde.');
      console.error(err);
    }
  };

  const handleDelete = (genreId, genreName) => {
    showConfirm(
      `Supprimer "${genreName}"`,
      'Ce genre sera retiré de tous les animés associés. Cette action est irréversible.',
      async () => {
        try {
          await api.delete(`/admin/genres/${genreId}`);
          fetchGenres();
          showSuccess('Genre supprimé', `"${genreName}" a été supprimé.`);
        } catch (err) {
          showError('Erreur', 'Impossible de supprimer ce genre.');
          console.error(err);
        }
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') setShowModal(false);
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
          <h1 className="admin-title">Gestion des genres</h1>
          <p className="admin-subtitle">
            {genres.length} genre{genres.length !== 1 ? 's' : ''} disponible{genres.length !== 1 ? 's' : ''}
          </p>
          <button className="admin-btn admin-btn-primary admin-header-btn" onClick={handleAdd}>
            <Plus size={18} />
            Ajouter un genre
          </button>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Contenu */}
      {genres.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">
            <Image src="/icons/television.png" alt="Aucun genre" width={64} height={64} />
          </div>
          <h3 className="admin-empty-title">Aucun genre</h3>
          <p className="admin-empty-text">Ajoutez des genres pour les associer aux animés.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Genre</th>
                <th>Nombre d&apos;animés</th>
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
                      {genre._count?.animes || 0} animé{(genre._count?.animes || 0) !== 1 ? 's' : ''}
                    </span>
                  </td>
                  <td>
                    <div className="admin-actions-cell">
                      <button
                        className="admin-btn admin-btn-small admin-btn-ghost"
                        onClick={() => handleEdit(genre)}
                        title="Modifier"
                      >
                        <Edit2 size={14} />
                        Modifier
                      </button>
                      <button
                        className="admin-btn admin-btn-small admin-btn-danger"
                        onClick={() => handleDelete(genre.id, genre.nom)}
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
      )}

      {/* Modal ajout / modification */}
      {showModal && (
        <div className="admin-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {editingGenre ? 'Modifier le genre' : 'Ajouter un genre'}
              </h2>
            </div>

            <div className="admin-modal-body">
              <div className="admin-modal-field">
                <label className="admin-modal-label">Nom du genre</label>
                <input
                  type="text"
                  className="admin-modal-input"
                  placeholder="Ex: Action, Aventure..."
                  value={genreName}
                  onChange={(e) => setGenreName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  autoFocus
                />
              </div>
            </div>

            <div className="admin-modal-actions">
              <button className="admin-btn admin-btn-ghost" onClick={() => setShowModal(false)}>
                Annuler
              </button>
              <button className="admin-btn admin-btn-primary" onClick={handleSave}>
                {editingGenre ? 'Modifier' : 'Ajouter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminGenresPage;
