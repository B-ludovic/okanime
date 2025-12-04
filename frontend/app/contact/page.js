'use client';

import { useState } from 'react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import { Mail, MessageSquare, Send, CheckCircle } from 'lucide-react';
import '../../styles/Contact.css';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // Validation basique
    if (!formData.nom || !formData.email || !formData.sujet || !formData.message) {
      setError('Tous les champs sont requis');
      setLoading(false);
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email invalide');
      setLoading(false);
      return;
    }

    try {
      // On envoie les données du formulaire à notre API backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      // On récupère la réponse du serveur
      const data = await response.json();

      // Si le serveur renvoie une erreur
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de l\'envoi du message');
      }

      // Si tout s'est bien passé
      setSuccess(true);
      setFormData({
        nom: '',
        email: '',
        sujet: '',
        message: '',
      });
      
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi du message. Veuillez réessayer.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <Header />
      
      <main className="contact-main">
        <div className="contact-container">
          {/* En-tête */}
          <div className="contact-header">
            <h1 className="contact-title">Contactez-nous</h1>
            <p className="contact-subtitle">
              Une question, une suggestion ou besoin d&apos;aide ? N&apos;hésitez pas à nous contacter.
            </p>
          </div>

          <div className="contact-grid">
            {/* Formulaire */}
            <div className="contact-form-section">
              <div className="contact-card">
                <div className="contact-card-header">
                  <MessageSquare size={24} />
                  <h2>Envoyez-nous un message</h2>
                </div>

                {success && (
                  <div className="alert alert-success">
                    <CheckCircle size={20} />
                    <span>Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.</span>
                  </div>
                )}

                {error && (
                  <div className="alert alert-error">
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="contact-form">
                  <div className="form-group">
                    <label htmlFor="nom">Nom complet</label>
                    <input
                      type="text"
                      id="nom"
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre.email@exemple.com"
                      className="form-input"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="sujet">Sujet</label>
                    <select
                      id="sujet"
                      name="sujet"
                      value={formData.sujet}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Sélectionnez un sujet</option>
                      <option value="question">Question générale</option>
                      <option value="suggestion">Suggestion d&apos;amélioration</option>
                      <option value="bug">Signaler un bug</option>
                      <option value="anime">Demande d&apos;ajout d&apos;animé</option>
                      <option value="compte">Problème de compte</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Décrivez votre demande en détail..."
                      rows={6}
                      className="form-textarea"
                      required
                    />
                    <span className="form-help">
                      {formData.message.length}/1000 caractères
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="loading"></span>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send size={20} />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Informations de contact */}
            <div className="contact-info-section">
              <div className="contact-card">
                <div className="contact-card-header">
                  <Mail size={24} />
                  <h2>Autres moyens de contact</h2>
                </div>

                <div className="contact-info-list">
                  <div className="contact-info-item">
                    <div className="contact-info-icon">
                      <Mail size={20} />
                    </div>
                    <div className="contact-info-content">
                      <h3>Email</h3>
                      <a href="mailto:contact@okanime.live" className="contact-link">
                        contact@okanime.live
                      </a>
                      <p className="contact-info-desc">
                        Réponse sous 24-48h
                      </p>
                    </div>
                  </div>

                  <div className="contact-info-item">
                    <div className="contact-info-icon">
                      <MessageSquare size={20} />
                    </div>
                    <div className="contact-info-content">
                      <h3>Support</h3>
                      <p className="contact-info-desc">
                        Pour toute question technique ou problème de compte
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* FAQ rapide */}
              <div className="contact-card">
                <h3 className="contact-faq-title">Questions fréquentes</h3>
                <div className="contact-faq-list">
                  <details className="contact-faq-item">
                    <summary>Comment ajouter un animé à ma bibliothèque ?</summary>
                    <p>
                      Rendez-vous sur la page de l&apos;animé et cliquez sur &quot;Ajouter à ma bibliothèque&quot;. 
                      Vous pourrez ensuite gérer son statut (À voir, En cours, Terminé, Favori).
                    </p>
                  </details>
                  
                  <details className="contact-faq-item">
                    <summary>Comment proposer un nouvel animé ?</summary>
                    <p>
                      Si vous êtes connecté, vous pouvez ajouter un animé via la page &quot;Animés&quot;. 
                      Les ajouts sont soumis à modération avant publication.
                    </p>
                  </details>
                  
                  <details className="contact-faq-item">
                    <summary>Puis-je modifier mon profil ?</summary>
                    <p>
                      Oui ! Rendez-vous sur votre page profil pour changer votre avatar. 
                      La modification du mot de passe sera bientôt disponible.
                    </p>
                  </details>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
