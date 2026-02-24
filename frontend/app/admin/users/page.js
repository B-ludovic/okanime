'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import api from '../../lib/api';
import { isAuthenticated, getCurrentUser } from '../../lib/utils';
import { useModal } from '../../context/ModalContext';
import { Shield, ShieldOff, User, Mail, Calendar, Trash2, ImageOff } from 'lucide-react';
import '../../../styles/Admin.css';

function AdminUsersPage() {
  const router = useRouter();
  const { showSuccess, showError, showConfirm } = useModal();
  const [users, setUsers] = useState([]);
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

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      setUsers(response.users || []);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangeRole = (userId, newRole, username) => {
    showConfirm(
      `${newRole === 'ADMIN' ? 'Promouvoir' : 'Rétrograder'} ${username}`,
      `Voulez-vous vraiment ${newRole === 'ADMIN' ? 'promouvoir cet utilisateur en admin' : 'rétrograder cet admin en utilisateur'} ?`,
      async () => {
        try {
          await api.put(`/admin/users/${userId}/role`, { role: newRole });
          fetchUsers();
          showSuccess('Rôle modifié', `Le rôle de ${username} a été mis à jour.`);
        } catch (err) {
          showError('Erreur', 'Impossible de modifier le rôle.');
          console.error(err);
        }
      }
    );
  };

  const handleDeleteUser = (userId, username) => {
    showConfirm(
      `Supprimer ${username}`,
      "Cette action est irréversible. L'utilisateur et toutes ses données seront supprimés.",
      async () => {
        try {
          await api.delete(`/admin/users/${userId}`);
          fetchUsers();
          showSuccess('Utilisateur supprimé', `${username} a été supprimé.`);
        } catch (err) {
          showError('Erreur', "Impossible de supprimer cet utilisateur.");
          console.error(err);
        }
      }
    );
  };

  const handleDeleteAvatar = (userId, username) => {
    showConfirm(
      "Supprimer l'avatar",
      `Supprimer l'avatar de ${username} ?`,
      async () => {
        try {
          await api.delete(`/admin/users/${userId}/avatar`);
          fetchUsers();
          showSuccess("Avatar supprimé", "L'avatar a été supprimé avec succès.");
        } catch (err) {
          showError('Erreur', "Impossible de supprimer l'avatar.");
          console.error(err);
        }
      }
    );
  };

  const adminCount = users.filter(u => u.role === 'ADMIN').length;

  const filteredUsers = users.filter(user => {
    if (filter === 'admin') return user.role === 'ADMIN';
    if (filter === 'user') return user.role === 'USER';
    return true;
  });

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
          <h1 className="admin-title">Gestion des utilisateurs</h1>
          <p className="admin-subtitle">
            {users.length} utilisateur{users.length !== 1 ? 's' : ''} inscrit{users.length !== 1 ? 's' : ''}
            {adminCount > 0 && (
              <> • <strong>{adminCount} admin{adminCount !== 1 ? 's' : ''}</strong></>
            )}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="admin-filters">
        {[
          { key: 'all', label: 'Tous', count: users.length },
          { key: 'admin', label: 'Admins', count: adminCount },
          { key: 'user', label: 'Utilisateurs', count: users.length - adminCount },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            className={`admin-filter-btn ${filter === key ? 'active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Erreur */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Contenu */}
      {filteredUsers.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">
            <Image src="/icons/television.png" alt="Aucun utilisateur" width={64} height={64} />
          </div>
          <h3 className="admin-empty-title">Aucun utilisateur</h3>
          <p className="admin-empty-text">Aucun utilisateur ne correspond à ce filtre.</p>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>Inscription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="admin-user-cell">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.username}
                          width={32}
                          height={32}
                          className="admin-user-avatar"
                        />
                      ) : (
                        <User size={18} />
                      )}
                      <strong>{user.username}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="admin-email-cell">
                      <Mail size={16} />
                      {user.email}
                    </div>
                  </td>
                  <td>
                    <span className={`admin-badge ${user.role === 'ADMIN' ? 'admin-badge-admin' : 'admin-badge-user'}`}>
                      {user.role === 'ADMIN' ? <Shield size={12} /> : <User size={12} />}
                      {user.isSuperAdmin ? 'SUPER ADMIN' : user.role}
                    </span>
                  </td>
                  <td>
                    <div className="admin-date-cell">
                      <Calendar size={14} />
                      {new Date(user.dateInscription).toLocaleDateString('fr-FR')}
                    </div>
                  </td>
                  <td>
                    <div className="admin-actions-cell">
                      {!user.isSuperAdmin && (
                        user.role === 'USER' ? (
                          <button
                            className="admin-btn admin-btn-small admin-btn-icon admin-btn-success"
                            onClick={() => handleChangeRole(user.id, 'ADMIN', user.username)}
                            title="Promouvoir en admin"
                          >
                            <Shield size={15} />
                          </button>
                        ) : (
                          <button
                            className="admin-btn admin-btn-small admin-btn-icon admin-btn-ghost"
                            onClick={() => handleChangeRole(user.id, 'USER', user.username)}
                            title="Rétrograder en utilisateur"
                          >
                            <ShieldOff size={15} />
                          </button>
                        )
                      )}

                      {user.avatar && !user.isSuperAdmin && (
                        <button
                          className="admin-btn admin-btn-small admin-btn-icon admin-btn-warning"
                          onClick={() => handleDeleteAvatar(user.id, user.username)}
                          title="Supprimer l'avatar"
                        >
                          <ImageOff size={15} />
                        </button>
                      )}

                      {!user.isSuperAdmin && (
                        <button
                          className="admin-btn admin-btn-small admin-btn-icon admin-btn-danger"
                          onClick={() => handleDeleteUser(user.id, user.username)}
                          title="Supprimer l'utilisateur"
                        >
                          <Trash2 size={15} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default AdminUsersPage;
