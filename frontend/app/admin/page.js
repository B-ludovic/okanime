'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import AdminLayout from '../../components/admin/AdminLayout';
import api from '../lib/api';
import { isAuthenticated, getCurrentUser } from '../lib/utils';
import { 
  Users, 
  Film, 
  Star, 
  Clock,
  CheckCircle,
  XCircle,
  TrendingUp,
  MessageSquare,
  FileText,
  BarChart3
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
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

  // Récupère les statistiques
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">
          <span className="loading"></span>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="admin-header">
        <h1 className="admin-title">Tableau de bord</h1>
        <p className="admin-subtitle">Vue d&apos;ensemble de la plateforme O&apos;Kanime</p>
      </div>

      {/* Grille de statistiques */}
      <div className="admin-stats-grid">
        {/* Total utilisateurs */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Utilisateurs</span>
            <div className="admin-stat-icon">
              <Users size={24} />
            </div>
          </div>
          <div className="admin-stat-value">{stats.totalUsers}</div>
          <div className="admin-stat-label">membres inscrits</div>
        </div>

        {/* Total animés */}
        <div className="admin-stat-card success">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Animés</span>
            <div className="admin-stat-icon">
              <Film size={24} />
            </div>
          </div>
          <div className="admin-stat-value">{stats.totalAnimes}</div>
          <div className="admin-stat-label">dans la base de données</div>
        </div>

        {/* Animés validés */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Validés</span>
            <div className="admin-stat-icon">
              <CheckCircle size={24} />
            </div>
          </div>
          <div className="admin-stat-value">{stats.animesValides}</div>
          <div className="admin-stat-label">animés publiés</div>
        </div>

        {/* En attente de modération */}
        <div className="admin-stat-card warning">
          <div className="admin-stat-header">
            <span className="admin-stat-label">En attente</span>
            <div className="admin-stat-icon">
              <Clock size={24} />
            </div>
          </div>
          <div className="admin-stat-value">{stats.animesEnAttente}</div>
          <div className="admin-stat-label">à modérer</div>
        </div>

        {/* Animés refusés */}
        <div className="admin-stat-card error">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Refusés</span>
            <div className="admin-stat-icon">
              <XCircle size={24} />
            </div>
          </div>
          <div className="admin-stat-value">{stats.animesRefuses}</div>
          <div className="admin-stat-label">animés rejetés</div>
        </div>

        {/* Total avis */}
        <div className="admin-stat-card">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Avis</span>
            <div className="admin-stat-icon">
              <Star size={24} />
            </div>
          </div>
          <div className="admin-stat-value">{stats.totalAvis}</div>
          <div className="admin-stat-label">avis publiés</div>
        </div>

        {/* Saisons - Work in Progress */}
        <div className="admin-stat-card wip">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Saisons</span>
            <div className="admin-stat-icon">
              <TrendingUp size={24} />
            </div>
          </div>
          <div className="admin-stat-wip">
            <Image src="/icons/work-in-progress.png" alt="En développement" width={60} height={60} />
            <span className="admin-stat-wip-text">Bientôt disponible</span>
          </div>
        </div>

        {/* Avis - Work in Progress */}
        <div className="admin-stat-card wip">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Modération Avis</span>
            <div className="admin-stat-icon">
              <MessageSquare size={24} />
            </div>
          </div>
          <div className="admin-stat-wip">
            <Image src="/icons/work-in-progress.png" alt="En développement" width={60} height={60} />
            <span className="admin-stat-wip-text">Bientôt disponible</span>
          </div>
        </div>

        {/* Logs d'activité - Work in Progress */}
        <div className="admin-stat-card wip">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Logs d&apos;activité</span>
            <div className="admin-stat-icon">
              <FileText size={24} />
            </div>
          </div>
          <div className="admin-stat-wip">
            <Image src="/icons/work-in-progress.png" alt="En développement" width={60} height={60} />
            <span className="admin-stat-wip-text">Bientôt disponible</span>
          </div>
        </div>

        {/* Statistiques avancées - Work in Progress */}
        <div className="admin-stat-card wip">
          <div className="admin-stat-header">
            <span className="admin-stat-label">Stats avancées</span>
            <div className="admin-stat-icon">
              <BarChart3 size={24} />
            </div>
          </div>
          <div className="admin-stat-wip">
            <Image src="/icons/work-in-progress.png" alt="En développement" width={60} height={60} />
            <span className="admin-stat-wip-text">Bientôt disponible</span>
          </div>
        </div>
      </div>

      {/* Actions rapides */}
      {stats.animesEnAttente > 0 && (
        <div className="admin-quick-actions">
          <h3 className="admin-quick-actions-title">
            Actions rapides
          </h3>
          <p className="admin-quick-actions-text">
            Vous avez {stats.animesEnAttente} animé{stats.animesEnAttente > 1 ? 's' : ''} en attente de modération.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => router.push('/admin/animes')}
          >
            <Clock size={18} />
            Modérer les animés
          </button>
        </div>
      )}
    </AdminLayout>
  );
}