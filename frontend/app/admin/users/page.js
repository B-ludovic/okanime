'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../../components/admin/AdminLayout';
import api from '../../lib/api';
import { isAuthenticated, getCurrentUser } from '../../lib/utils';
import { Shield, User, Mail, Calendar, Trash2 } from 'lucide-react';

function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
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

  // Récupère tous les utilisateurs
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/users');
      console.log('Response:', response); // Debug
      setUsers(response.users || []);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
      console.error('Erreur complète:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Changer le rôle d'un utilisateur
  const handleChangeRole = async (userId, newRole) => {
    if (!confirm(`Voulez-vous vraiment changer le rôle de cet utilisateur en ${newRole} ?`)) {
      return;
    }

    try {
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Erreur lors du changement de rôle');
      console.error(err);
    }
  };

  // Supprimer un utilisateur
  const handleDeleteUser = async (userId) => {
    if (!confirm('ATTENTION : Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible !')) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error?.message || 'Erreur lors de la suppression de l\'utilisateur');
      console.error(err);
    }
  };

  // Supprimer l'avatar d'un utilisateur
  const handleDeleteAvatar = async (userId) => {
    if (!confirm('Voulez-vous vraiment supprimer l\'avatar de cet utilisateur ?')) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}/avatar`);
      fetchUsers();
    } catch (err) {
      alert('Erreur lors de la suppression de l\'avatar');
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
        <h1 className="admin-title">Gestion des utilisateurs</h1>
        <p className="admin-subtitle">
          {users.length} utilisateur{users.length > 1 ? 's' : ''} inscrit{users.length > 1 ? 's' : ''}
        </p>
      </div>

      {/* Erreur */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Table des utilisateurs */}
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
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="admin-user-cell">
                    <User size={18} />
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
                    {user.role}
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
                    {/* Boutons de rôle - masqués pour super admin */}
                    {!user.isSuperAdmin && (
                      user.role === 'USER' ? (
                        <button
                          className="admin-btn admin-btn-small admin-btn-success"
                          onClick={() => handleChangeRole(user.id, 'ADMIN')}
                        >
                          <Shield size={14} />
                          Promouvoir
                        </button>
                      ) : (
                        <button
                          className="admin-btn admin-btn-small btn-ghost"
                          onClick={() => handleChangeRole(user.id, 'USER')}
                        >
                          <User size={14} />
                          Rétrograder
                        </button>
                      )
                    )}
                    
                    {/* Badge super admin */}
                    {user.isSuperAdmin && (
                      <span className="admin-badge admin-badge-admin" style={{ fontSize: '0.75rem' }}>
                        <Shield size={12} />
                        SUPER ADMIN
                      </span>
                    )}
                    
                    {/* Suppression avatar */}
                    {user.avatar && !user.isSuperAdmin && (
                      <button
                        className="admin-btn admin-btn-small admin-btn-warning"
                        onClick={() => handleDeleteAvatar(user.id)}
                        title="Supprimer l'avatar"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                    
                    {/* Suppression utilisateur - masquée pour super admin */}
                    {!user.isSuperAdmin && (
                      <button
                        className="admin-btn admin-btn-small admin-btn-danger"
                        onClick={() => handleDeleteUser(user.id)}
                        title="Supprimer l'utilisateur"
                      >
                        <Trash2 size={14} />
                        Supprimer
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

export default AdminUsersPage;