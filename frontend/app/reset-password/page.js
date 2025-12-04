'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Key, CheckCircle, XCircle } from 'lucide-react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import api from '../lib/api';
import '../../styles/ResetPassword.css';

// Composant qui utilise useSearchParams (doit être dans Suspense)
function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Vérification du token au chargement
  useEffect(() => {
    if (!token) {
      setError('Token manquant ou invalide');
    }
  }, [token]);

  // Réinitialise le mot de passe
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation côté client
    if (newPassword.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setLoading(false);
      return;
    }

    try {
      await api.post('/auth/reset-password', {
        token,
        newPassword,
      });
      setSuccess(true);

      // Redirection vers login après 3 secondes
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (err) {
      setError(err.message || 'Erreur lors de la réinitialisation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <Header />
      
      <main className="main">
        <div className="reset-password-container">
          
          {success ? (
            // Message de succès
            <div className="reset-password-content">
              <div className="reset-password-icon success">
                <CheckCircle size={40} />
              </div>
              <h1>Mot de passe réinitialisé !</h1>
              <p>
                Votre mot de passe a été changé avec succès. Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
              </p>
              <p className="reset-password-note">
                Redirection vers la page de connexion...
              </p>
            </div>
          ) : error ? (
            // Message d'erreur
            <div className="reset-password-content">
              <div className="reset-password-icon error">
                <XCircle size={40} />
              </div>
              <h1>Erreur</h1>
              <p>{error}</p>
              <Link href="/forgot-password" className="btn btn-primary">
                Demander un nouveau lien
              </Link>
            </div>
          ) : (
            // Formulaire
            <div className="reset-password-content">
              <div className="reset-password-icon">
                <Key size={40} />
              </div>
              <h1>Nouveau mot de passe</h1>
              <p>
                Choisissez un nouveau mot de passe sécurisé pour votre compte.
              </p>

              <form onSubmit={handleSubmit} className="reset-password-form">
                <div className="reset-password-input-group">
                  <input
                    type="password"
                    placeholder="Nouveau mot de passe (8 caractères min)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="reset-password-input"
                  />
                </div>

                <div className="reset-password-input-group">
                  <input
                    type="password"
                    placeholder="Confirmer le mot de passe"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    className="reset-password-input"
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-large reset-password-submit"
                  disabled={loading}
                >
                  {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
                </button>
              </form>

              <div className="reset-password-back">
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

// Page principale avec Suspense (obligatoire pour useSearchParams)
function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="page">
        <Header />
        <main className="main">
          <div className="reset-password-container">
            <div className="reset-password-content">
              <div className="spinner"></div>
              <p>Chargement...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

export default ResetPasswordPage;
