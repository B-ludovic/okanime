'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Film, Star, Clock } from 'lucide-react';
import api from '../../lib/api';
import { isAuthenticated, getCurrentUser } from '../../lib/utils';
import { useModal } from '../../context/ModalContext';
import '../../../styles/Admin.css';

const STATUT_LABELS = {
  VALIDE: 'Validé',
  EN_ATTENTE: 'En attente',
  REFUSE: 'Refusé',
};

const STATUT_CLASSES = {
  VALIDE: 'admin-badge-success',
  EN_ATTENTE: 'admin-badge-warning',
  REFUSE: 'admin-badge-danger',
};

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function LogEntry({ log }) {
  const isAnime = log.type === 'ANIME_AJOUTE';

  return (
    <div className="admin-log-entry">
      <div className={`admin-log-icon ${isAnime ? 'admin-log-icon-anime' : 'admin-log-icon-avis'}`}>
        {isAnime ? <Film size={16} /> : <Star size={16} />}
      </div>

      <div className="admin-log-body">
        <p className="admin-log-text">
          <strong>{log.user?.username || 'Utilisateur inconnu'}</strong>
          {isAnime ? (
            <> a ajouté l&apos;anime </>
          ) : (
            <> a posté un avis ({log.meta.note}/10) sur </>
          )}
          {log.anime?.slug ? (
            <Link href={`/anime/${log.anime.slug}`} className="admin-log-link">
              {log.anime.titreVf}
            </Link>
          ) : (
            <span>{log.anime?.titreVf || 'anime supprimé'}</span>
          )}
          {isAnime && log.meta?.statut && (
            <span className={`admin-badge ${STATUT_CLASSES[log.meta.statut]}`} style={{ marginLeft: '0.5rem' }}>
              {STATUT_LABELS[log.meta.statut]}
            </span>
          )}
        </p>
        <span className="admin-log-date">
          <Clock size={12} />
          {formatDate(log.date)}
        </span>
      </div>
    </div>
  );
}

function AdminLogsPage() {
  const router = useRouter();
  const { showError } = useModal();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/admin/logs');
        setLogs(response.data.logs);
      } catch (err) {
        showError('Erreur', 'Impossible de charger les logs');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, [showError]);

  if (loading) {
    return (
      <div className="admin-loading">
        <span className="loading"></span>
      </div>
    );
  }

  return (
    <>
      <div className="admin-header">
        <div>
          <h1 className="admin-title">Logs d&apos;activité</h1>
          <p className="admin-subtitle">
            {logs.length} événement{logs.length !== 1 ? 's' : ''} récent{logs.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {logs.length > 0 ? (
        <div className="admin-log-list">
          {logs.map((log, index) => (
            <LogEntry key={index} log={log} />
          ))}
        </div>
      ) : (
        <div className="admin-empty">
          <h3 className="admin-empty-title">Aucune activité</h3>
          <p className="admin-empty-text">Les événements apparaîtront ici au fur et à mesure.</p>
        </div>
      )}
    </>
  );
}

export default AdminLogsPage;
