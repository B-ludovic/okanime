'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, CheckCircle } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import api from '../lib/api';
import '../../styles/ForgotPassword.css';

// Page pour demander un lien de réinitialisation de mot de passe
function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Envoie la demande de reset
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccess(true);
      setEmail('');
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi de l\'email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Header />
      
      <main className="main">
        <div className="forgot-password-container">
          
          {success ? (
            // Message de succès
            <div className="forgot-password-content">
              <div className="forgot-password-icon success">
                <CheckCircle size={40} />
              </div>
              <h1>Email envoyé !</h1>
              <p>
                Si un compte existe avec cet email, vous recevrez un lien de réinitialisation dans quelques minutes.
              </p>
              <p className="forgot-password-note">
                Vérifiez vos spams si vous ne voyez rien. Le lien est valide pendant 1 heure.
              </p>
              <Link href="/login" className="btn btn-primary">
                Retour à la connexion
              </Link>
            </div>
          ) : (
            // Formulaire
            <div className="forgot-password-content">
              <div className="forgot-password-icon">
                <Lock size={40} />
              </div>
              <h1>Mot de passe oublié ?</h1>
              <p>
                Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
              </p>

              {error && (
                <div className="alert alert-error">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="forgot-password-form">
                <div className="forgot-password-input-group">
                  <input
                    type="email"
                    placeholder="Votre adresse email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="forgot-password-input"
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-large forgot-password-submit"
                  disabled={loading}
                >
                  {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
                </button>
              </form>

              <div className="forgot-password-back">
                <Link href="/login">
                  ← Retour à la connexion
                </Link>
              </div>
            </div>
          )}
          
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default ForgotPasswordPage;
