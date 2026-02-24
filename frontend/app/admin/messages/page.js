'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { isAuthenticated, getCurrentUser } from '../../lib/utils';
import { useModal } from '../../context/ModalContext';
import api from '../../lib/api';
import { MessageSquare, Mail, User, Calendar, Trash2, Eye, EyeOff } from 'lucide-react';
import '../../../styles/AdminMessages.css';
import '../../../styles/Admin.css';

function AdminMessagesPage() {
  const router = useRouter();
  const { showSuccess, showError, showConfirm } = useModal();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);

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

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/messages');
      setMessages(response.messages || []);
    } catch (err) {
      console.error('Erreur lors du chargement des messages:', err);
      showError('Erreur', 'Impossible de charger les messages.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const toggleRead = async (messageId) => {
    try {
      await api.put(`/admin/messages/${messageId}/toggle-read`);
      setMessages(prev =>
        prev.map(msg => msg.id === messageId ? { ...msg, lu: !msg.lu } : msg)
      );
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(prev => ({ ...prev, lu: !prev.lu }));
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      showError('Erreur', 'Impossible de modifier le statut.');
    }
  };

  const handleDelete = (messageId) => {
    showConfirm(
      'Supprimer ce message',
      'Cette action est irréversible. Le message sera définitivement supprimé.',
      async () => {
        try {
          await api.delete(`/admin/messages/${messageId}`);
          setMessages(prev => prev.filter(msg => msg.id !== messageId));
          if (selectedMessage?.id === messageId) setSelectedMessage(null);
          showSuccess('Message supprimé', 'Le message a été supprimé avec succès.');
        } catch (err) {
          showError('Erreur', 'Impossible de supprimer ce message.');
          console.error(err);
        }
      }
    );
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.lu;
    if (filter === 'read') return msg.lu;
    return true;
  });

  const unreadCount = messages.filter(m => !m.lu).length;

  const getSubjectLabel = (sujet) => {
    const labels = {
      question: 'Question',
      suggestion: 'Suggestion',
      bug: 'Bug',
      anime: "Demande d'animé",
      compte: 'Problème de compte',
      autre: 'Autre',
    };
    return labels[sujet] || sujet;
  };

  const getSubjectColor = (sujet) => {
    const colors = {
      question: 'blue',
      suggestion: 'green',
      bug: 'red',
      anime: 'purple',
      compte: 'orange',
      autre: 'gray',
    };
    return colors[sujet] || 'gray';
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
          <h1 className="admin-title">Messages de contact</h1>
          <p className="admin-subtitle">
            {messages.length} message{messages.length !== 1 ? 's' : ''} au total
            {unreadCount > 0 && (
              <> • <strong>{unreadCount} non lu{unreadCount !== 1 ? 's' : ''}</strong></>
            )}
          </p>
        </div>
        {unreadCount > 0 && (
          <span className="admin-badge admin-badge-pending">
            <EyeOff size={14} />
            {unreadCount} non lu{unreadCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Filtres */}
      <div className="admin-filters">
        {[
          { key: 'all', label: 'Tous', count: messages.length },
          { key: 'unread', label: 'Non lus', count: unreadCount, icon: EyeOff },
          { key: 'read', label: 'Lus', count: messages.filter(m => m.lu).length, icon: Eye },
        ].map(({ key, label, count, icon: Icon }) => (
          <button
            key={key}
            className={`admin-filter-btn ${filter === key ? 'active' : ''}`}
            onClick={() => setFilter(key)}
          >
            {Icon && <Icon size={15} />}
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Contenu */}
      {filteredMessages.length === 0 ? (
        <div className="admin-empty">
          <div className="admin-empty-icon">
            <Image src="/icons/television.png" alt="Aucun message" width={64} height={64} />
          </div>
          <h3 className="admin-empty-title">Aucun message</h3>
          <p className="admin-empty-text">
            {filter === 'unread'
              ? 'Tous les messages ont été lus.'
              : filter === 'read'
              ? 'Aucun message lu pour le moment.'
              : 'Aucun message de contact pour le moment.'}
          </p>
        </div>
      ) : (
        <div className="messages-container">
          {/* Liste */}
          <div className="messages-list">
            {filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`message-item ${!message.lu ? 'unread' : ''} ${selectedMessage?.id === message.id ? 'selected' : ''}`}
                onClick={() => setSelectedMessage(message)}
              >
                <div className="message-item-header">
                  <div className="message-item-sender">
                    <User size={16} />
                    <strong>{message.nom}</strong>
                  </div>
                  <span className={`message-subject-badge ${getSubjectColor(message.sujet)}`}>
                    {getSubjectLabel(message.sujet)}
                  </span>
                </div>
                <div className="message-item-preview">
                  {message.message.substring(0, 100)}
                  {message.message.length > 100 ? '...' : ''}
                </div>
                <div className="message-item-footer">
                  <span className="message-item-date">
                    <Calendar size={14} />
                    {new Date(message.dateCreation).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                  {!message.lu && <span className="unread-dot"></span>}
                </div>
              </div>
            ))}
          </div>

          {/* Détail */}
          <div className="message-detail">
            {selectedMessage ? (
              <>
                <div className="message-detail-header">
                  <h2 className="message-detail-title">
                    <MessageSquare size={24} />
                    Détails du message
                  </h2>
                  <div className="message-detail-actions">
                    <button
                      className="admin-btn admin-btn-ghost admin-btn-small"
                      onClick={() => toggleRead(selectedMessage.id)}
                      title={selectedMessage.lu ? 'Marquer comme non lu' : 'Marquer comme lu'}
                    >
                      {selectedMessage.lu ? <EyeOff size={16} /> : <Eye size={16} />}
                      {selectedMessage.lu ? 'Non lu' : 'Lu'}
                    </button>
                    <button
                      className="admin-btn admin-btn-danger admin-btn-small"
                      onClick={() => handleDelete(selectedMessage.id)}
                    >
                      <Trash2 size={16} />
                      Supprimer
                    </button>
                  </div>
                </div>

                <div className="message-detail-content">
                  <div className="message-detail-info">
                    <div className="message-detail-info-item">
                      <User size={18} />
                      <div>
                        <label>Nom</label>
                        <p>{selectedMessage.nom}</p>
                      </div>
                    </div>
                    <div className="message-detail-info-item">
                      <Mail size={18} />
                      <div>
                        <label>Email</label>
                        <a
                          href={`mailto:${selectedMessage.email}`}
                          className="message-email-link"
                        >
                          {selectedMessage.email}
                        </a>
                      </div>
                    </div>
                    <div className="message-detail-info-item">
                      <MessageSquare size={18} />
                      <div>
                        <label>Sujet</label>
                        <p>
                          <span className={`message-subject-badge ${getSubjectColor(selectedMessage.sujet)}`}>
                            {getSubjectLabel(selectedMessage.sujet)}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="message-detail-info-item">
                      <Calendar size={18} />
                      <div>
                        <label>Date</label>
                        <p>
                          {new Date(selectedMessage.dateCreation).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="message-detail-message">
                    <label>Message</label>
                    <div className="message-detail-text">
                      {selectedMessage.message}
                    </div>
                  </div>

                  <div className="message-detail-reply">
                    <a
                      href={`mailto:${selectedMessage.email}?subject=Re: ${getSubjectLabel(selectedMessage.sujet)}`}
                      className="admin-btn admin-btn-primary"
                    >
                      <Mail size={18} />
                      Répondre par email
                    </a>
                  </div>
                </div>
              </>
            ) : (
              <div className="message-detail-empty">
                <MessageSquare size={64} />
                <p>Sélectionnez un message pour voir les détails</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default AdminMessagesPage;
