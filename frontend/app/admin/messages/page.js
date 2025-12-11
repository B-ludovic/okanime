'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '../../../components/admin/AdminLayout';
import { isAuthenticated, getCurrentUser } from '../../lib/utils';
import { useModal } from '../../context/ModalContext';
import api from '../../lib/api';
import { MessageSquare, Mail, User, Calendar, Trash2, Eye, EyeOff, Filter } from 'lucide-react';
import '../../../styles/AdminMessages.css';

function AdminMessagesPage() {
  const router = useRouter();
  const { showSuccess, showError, showWarning, showConfirm } = useModal();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, read
  const [selectedMessage, setSelectedMessage] = useState(null);

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

  // Récupère les messages depuis l'API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // On appelle l'API backend pour récupérer tous les messages
        const response = await api.get('/admin/messages');
        setMessages(response.messages);
      } catch (err) {
        console.error('Erreur lors du chargement des messages:', err);
        showError('Impossible de charger les messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [showError]);

  // Marquer comme lu/non lu (on bascule le statut)
  const toggleRead = async (messageId) => {
    try {
      // On appelle l'API pour basculer le statut "lu"
      await api.put(`/admin/messages/${messageId}/toggle-read`);
      
      // On met à jour l'interface localement sans recharger toute la page
      setMessages(messages.map(msg => 
        msg.id === messageId ? { ...msg, lu: !msg.lu } : msg
      ));
      
      // Si c'est le message sélectionné, on le met aussi à jour
      if (selectedMessage?.id === messageId) {
        setSelectedMessage({ ...selectedMessage, lu: !selectedMessage.lu });
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du statut:', err);
      showError('Impossible de modifier le statut');
    }
  };

  // Supprimer un message
  const deleteMessage = async (messageId) => {
    // On demande confirmation avant de supprimer
    const confirmed = await showConfirm(
      'Voulez-vous vraiment supprimer ce message ?',
      'Suppression de message'
    );
    if (!confirmed) return;

    try {
      // On appelle l'API pour supprimer le message
      await api.delete(`/admin/messages/${messageId}`);
      
      // On retire le message de la liste localement
      setMessages(messages.filter(msg => msg.id !== messageId));
      
      // Si c'était le message sélectionné, on réinitialise la sélection
      setSelectedMessage(null);
      
      showSuccess('Message supprimé avec succès');
    } catch (err) {
      showError('Erreur lors de la suppression');
      console.error(err);
    }
  };

  // Filtrer les messages
  const filteredMessages = messages.filter(msg => {
    if (filter === 'unread') return !msg.lu;
    if (filter === 'read') return msg.lu;
    return true;
  });

  // Obtenir le label du sujet
  const getSubjectLabel = (sujet) => {
    const labels = {
      question: 'Question',
      suggestion: 'Suggestion',
      bug: 'Bug',
      anime: 'Demande d\'animé',
      compte: 'Problème de compte',
      autre: 'Autre',
    };
    return labels[sujet] || sujet;
  };

  // Obtenir la couleur du badge sujet
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
        <div>
          <h1 className="admin-title">Messages de contact</h1>
          <p className="admin-subtitle">
            Gérez les messages envoyés par les utilisateurs
          </p>
        </div>
        
        {/* Filtres */}
        <div className="messages-filters">
          <button
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            <Filter size={16} />
            Tous ({messages.length})
          </button>
          <button
            className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
            onClick={() => setFilter('unread')}
          >
            <EyeOff size={16} />
            Non lus ({messages.filter(m => !m.lu).length})
          </button>
          <button
            className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
            onClick={() => setFilter('read')}
          >
            <Eye size={16} />
            Lus ({messages.filter(m => m.lu).length})
          </button>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="messages-container">
        {/* Liste des messages */}
        <div className="messages-list">
          {filteredMessages.length === 0 ? (
            <div className="messages-empty">
              <MessageSquare size={48} />
              <p>Aucun message</p>
            </div>
          ) : (
            filteredMessages.map((message) => (
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
            ))
          )}
        </div>

        {/* Détail du message */}
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
                    className="btn btn-ghost btn-sm"
                    onClick={() => toggleRead(selectedMessage.id)}
                    title={selectedMessage.lu ? 'Marquer comme non lu' : 'Marquer comme lu'}
                  >
                    {selectedMessage.lu ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteMessage(selectedMessage.id)}
                    title="Supprimer"
                  >
                    <Trash2 size={18} />
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
                      <a href={`mailto:${selectedMessage.email}`} className="message-email-link">
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
                    className="btn btn-primary"
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
    </AdminLayout>
  );
}

export default AdminMessagesPage;
