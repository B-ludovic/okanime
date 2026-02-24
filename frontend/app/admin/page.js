'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '../lib/api';
import { isAuthenticated, getCurrentUser } from '../lib/utils';
import '../../styles/Admin.css';
import {
  Users,
  Film,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  Tag,
  Shield,
  ArrowRight,
} from 'lucide-react';

const NAV_SHORTCUTS = [
  {
    href: '/admin/animes',
    label: 'Modération',
    desc: 'Valider ou refuser les propositions',
    icon: Shield,
    color: 'warning',
  },
  {
    href: '/admin/tous-les-animes',
    label: 'Tous les animés',
    desc: 'CRUD complet de la base de données',
    icon: Film,
    color: 'success',
  },
  {
    href: '/admin/avis',
    label: 'Avis',
    desc: 'Consulter et modérer les avis',
    icon: Star,
    color: '',
  },
  {
    href: '/admin/messages',
    label: 'Messages',
    desc: 'Messages du formulaire de contact',
    icon: MessageSquare,
    color: '',
  },
  {
    href: '/admin/users',
    label: 'Utilisateurs',
    desc: 'Gérer les comptes et les rôles',
    icon: Users,
    color: '',
  },
  {
    href: '/admin/genres',
    label: 'Genres',
    desc: 'Ajouter, modifier, supprimer des genres',
    icon: Tag,
    color: '',
  },
];

function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');

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
    setUsername(user.username || 'Admin');
  }, [router]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStats(response.data.stats);
      } catch (err) {
        setError('Erreur lors du chargement des statistiques');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const today = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  if (loading) {
    return (
      <div className="admin-loading">
        <span className="loading"></span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        <span>{error}</span>
      </div>
    );
  }

  return (
    <>
      {/* Header de bienvenue */}
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Bonjour, {username} !</h1>
          <p className="admin-subtitle">
            {today} — Vue d&apos;ensemble de la plateforme
          </p>
        </div>
        {stats.animesEnAttente > 0 && (
          <span
            className="admin-badge admin-badge-pending"
            style={{ cursor: 'pointer' }}
            onClick={() => router.push('/admin/animes')}
          >
            <Clock size={14} />
            {stats.animesEnAttente} à modérer
          </span>
        )}
      </div>

      {/* Grille de statistiques */}
      <div className="admin-stats-grid">
        <div
          className="admin-stat-card"
          style={{ cursor: 'pointer' }}
          onClick={() => router.push('/admin/users')}
        >
          <div className="admin-stat-header">
            <span className="admin-stat-label">Utilisateurs</span>
            <div className="admin-stat-icon"><Users size={24} /></div>
          </div>
          <div className="admin-stat-value">{stats.totalUsers}</div>
          <div className="admin-stat-label">membres inscrits</div>
        </div>

        <div
          className="admin-stat-card success"
          style={{ cursor: 'pointer' }}
          onClick={() => router.push('/admin/tous-les-animes')}
        >
          <div className="admin-stat-header">
            <span className="admin-stat-label">Animés</span>
            <div className="admin-stat-icon"><Film size={24} /></div>
          </div>
          <div className="admin-stat-value">{stats.totalAnimes}</div>
          <div className="admin-stat-label">dans la base de données</div>
        </div>

        <div
          className="admin-stat-card"
          style={{ cursor: 'pointer' }}
          onClick={() => router.push('/admin/avis')}
        >
          <div className="admin-stat-header">
            <span className="admin-stat-label">Avis</span>
            <div className="admin-stat-icon"><Star size={24} /></div>
          </div>
          <div className="admin-stat-value">{stats.totalAvis}</div>
          <div className="admin-stat-label">avis publiés</div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Validés</span>
            <div className="admin-stat-icon"><CheckCircle size={24} /></div>
          </div>
          <div className="admin-stat-value">{stats.animesValides}</div>
          <div className="admin-stat-label">animés publiés</div>
        </div>

        <div
          className="admin-stat-card warning"
          style={{ cursor: stats.animesEnAttente > 0 ? 'pointer' : 'default' }}
          onClick={() => stats.animesEnAttente > 0 && router.push('/admin/animes')}
        >
          <div className="admin-stat-header">
            <span className="admin-stat-label">En attente</span>
            <div className="admin-stat-icon"><Clock size={24} /></div>
          </div>
          <div className="admin-stat-value">{stats.animesEnAttente}</div>
          <div className="admin-stat-label">
            {stats.animesEnAttente > 0 ? 'cliquez pour modérer' : 'à modérer'}
          </div>
        </div>

        <div className="admin-stat-card error">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Refusés</span>
            <div className="admin-stat-icon"><XCircle size={24} /></div>
          </div>
          <div className="admin-stat-value">{stats.animesRefuses}</div>
          <div className="admin-stat-label">animés rejetés</div>
        </div>
      </div>

      {/* Navigation rapide */}
      <div className="admin-quick-actions">
        <h3 className="admin-quick-actions-title">Navigation rapide</h3>
        <div className="admin-shortcuts-grid">
          {NAV_SHORTCUTS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.href}
                className={`admin-shortcut-card${s.color ? ` admin-shortcut-${s.color}` : ''}`}
                onClick={() => router.push(s.href)}
              >
                <div className="admin-shortcut-icon">
                  <Icon size={22} />
                </div>
                <div className="admin-shortcut-body">
                  <span className="admin-shortcut-label">{s.label}</span>
                  <span className="admin-shortcut-desc">{s.desc}</span>
                </div>
                <ArrowRight size={16} className="admin-shortcut-arrow" />
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default AdminDashboardPage;
