'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import api from '../lib/api';
import { isAuthenticated, getCurrentUser } from '../lib/utils';
import '../../styles/Profil.css';
import {
  User,
  Mail,
  Calendar,
  Shield,
  BarChart3,
  BookOpen,
  Lock,
  Trash2,
  Camera,
  ChevronRight,
} from 'lucide-react';

export default function ProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    enCours: 0,
    vu: 0,
    favori: 0,
  });
  const [recentAnimes, setRecentAnimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Vérifie l'authentification
  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }

    const currentUser = getCurrentUser();
    setUser(currentUser);
  }, [router]);

  // Récupère les données de la bibliothèque
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/bibliotheque');
        const bibliotheque = response.data.bibliotheque;

        // Calcule les statistiques
        const statsData = {
          total: bibliotheque.length,
          enCours: bibliotheque.filter((entry) => entry.statut === 'EN_COURS').length,
          vu: bibliotheque.filter((entry) => entry.statut === 'VU').length,
          favori: bibliotheque.filter((entry) => entry.statut === 'FAVORI').length,
        };
        setStats(statsData);

        // Récupère les 6 derniers animés
        const recent = bibliotheque.slice(0, 6);
        setRecentAnimes(recent);
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  // Upload d'avatar
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      await api.putFormData('/auth/avatar', formData);

      // Recharge les données utilisateur
      const response = await api.get('/auth/me');
      localStorage.setItem('user', JSON.stringify(response.data.user));
      setUser(response.data.user);

      alert('Avatar mis à jour avec succès !');
      window.location.reload();
    } catch (err) {
      alert('Erreur lors de l\'upload de l\'avatar');
      console.error(err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Supprimer le compte
  const handleDeleteAccount = () => {
    if (
      confirm(
        'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.'
      )
    ) {
      // TODO: Implémenter la suppression de compte
      alert('Fonctionnalité à venir');
    }
  };

  if (loading || !user) {
    return (
      <div className="profil-page">
        <Header />
        <main className="profil-main">
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
            <span className="loading"></span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Récupère les initiales pour l'avatar placeholder
  const getInitials = (username) => {
    return username
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="profil-page">
      <Header />

      <main className="profil-main">
        <div className="profil-container">
          {/* En-tête du profil */}
          <div className="profil-header-card">
            <div className="profil-header-content">
              {/* Avatar */}
              <div className="profil-avatar-section">
                {user.avatar ? (
                  <Image 
                    src={user.avatar} 
                    alt={user.username} 
                    width={120} 
                    height={120}
                    className="profil-avatar" 
                  />
                ) : (
                  <div className="profil-avatar-placeholder">{getInitials(user.username)}</div>
                )}

                <div className="profil-avatar-upload">
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarUpload}
                    className="profil-avatar-input"
                  />
                  <button
                    className="profil-avatar-btn"
                    onClick={() => document.getElementById('avatar-upload').click()}
                    disabled={uploadingAvatar}
                  >
                    {uploadingAvatar ? (
                      <span className="loading"></span>
                    ) : (
                      <>
                        <Camera size={16} />
                        Changer
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Informations */}
              <div className="profil-info">
                <h1 className="profil-username">{user.username}</h1>

                <div className="profil-email">
                  <Mail size={18} />
                  {user.email}
                </div>

                <div className="profil-meta">
                  <div className="profil-meta-item">
                    <Calendar size={16} />
                    Membre depuis {new Date(user.dateInscription).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                  </div>
                  {user.role === 'ADMIN' && (
                    <span className="profil-badge">
                      <Shield size={12} />
                      Administrateur
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Statistiques */}
          <div className="profil-stats-section">
            <h2 className="profil-section-title">
              <BarChart3 size={24} />
              Mes statistiques
            </h2>

            <div className="profil-stats-grid">
              <div className="profil-stat-card">
                <div className="profil-stat-value">{stats.total}</div>
                <div className="profil-stat-label">Animés</div>
              </div>

              <div className="profil-stat-card en-cours">
                <div className="profil-stat-value">{stats.enCours}</div>
                <div className="profil-stat-label">En cours</div>
              </div>

              <div className="profil-stat-card vu">
                <div className="profil-stat-value">{stats.vu}</div>
                <div className="profil-stat-label">Terminés</div>
              </div>

              <div className="profil-stat-card favori">
                <div className="profil-stat-value">{stats.favori}</div>
                <div className="profil-stat-label">Favoris</div>
              </div>
            </div>
          </div>

          {/* Ma bibliothèque (aperçu) */}
          <div className="profil-library-section">
            <h2 className="profil-section-title">
              <BookOpen size={24} />
              Ma bibliothèque
            </h2>

            {recentAnimes.length > 0 ? (
              <>
                <div className="profil-library-grid">
                  {recentAnimes.map((entry) => (
                    <Link
                      key={entry.id}
                      href={`/anime/${entry.saison.anime.id}`}
                      className="profil-anime-mini"
                    >
                      <Image
                        src={entry.saison.anime.posterUrl || '/placeholder-anime.jpg'}
                        alt={entry.saison.anime.titreVf}
                        width={150}
                        height={210}
                        className="profil-anime-mini-image"
                      />
                      <div className="profil-anime-mini-title">
                        {entry.saison.anime.titreVf}
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="profil-view-all">
                  <Link href="/bibliotheque" className="btn btn-ghost">
                    Voir ma bibliothèque complète
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </>
            ) : (
              <div className="profil-empty">
                <div className="profil-empty-icon">📚</div>
                <p>Votre bibliothèque est vide</p>
                <Link href="/anime" className="btn btn-primary" style={{ marginTop: 'var(--espace-md)' }}>
                  Découvrir des animés
                </Link>
              </div>
            )}
          </div>

          {/* Paramètres du compte */}
          <div className="profil-settings-section">
            <h2 className="profil-section-title">
              Paramètres du compte
            </h2>

            <div className="profil-settings-grid">
              <button className="profil-setting-btn" onClick={() => alert('Fonctionnalité à venir')}>
                <div className="profil-setting-btn-left">
                  <Lock size={20} />
                  <span>Changer le mot de passe</span>
                </div>
                <ChevronRight size={20} />
              </button>

              <button className="profil-setting-btn danger" onClick={handleDeleteAccount}>
                <div className="profil-setting-btn-left">
                  <Trash2 size={20} />
                  <span>Supprimer mon compte</span>
                </div>
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}