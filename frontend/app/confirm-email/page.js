'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';
import api from '../lib/api';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import '../../styles/ConfirmEmail.css';

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de confirmation manquant');
      return;
    }

    const confirmEmail = async () => {
      try {
        const response = await api.get(`/auth/confirm-email/${token}`);
        setStatus('success');
        setMessage(response.message || 'Email confirmé avec succès !');

        // Redirige vers la page de connexion après 3 secondes
        setTimeout(() => {
          router.push('/login?confirmed=true');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(
          error.message || 'Erreur lors de la confirmation de votre email'
        );
      }
    };

    confirmEmail();
  }, [token, router]);

  return (
    <div className="page">
      <Header />

      <main className="main">
        <div className="confirmation-container">
          <div className="confirmation-card">
            {status === 'loading' && (
              <div className="confirmation-loading">
                <Loader2 size={64} className="spinner" />
                <h2>Confirmation en cours...</h2>
                <p>Veuillez patienter</p>
              </div>
            )}

            {status === 'success' && (
              <div className="confirmation-success">
                <CheckCircle size={64} className="icon-success" />
                <h2>Email confirmé avec succès !</h2>
                <p>{message}</p>
                <p>Redirection vers la page de connexion...</p>
                <Link href="/login" className="btn btn-primary">
                  Se connecter maintenant
                </Link>
              </div>
            )}

            {status === 'error' && (
              <div className="confirmation-error">
                <XCircle size={64} className="icon-error" />
                <h2>Erreur de confirmation</h2>
                <p>{message}</p>
                <div className="confirmation-actions">
                  <Link href="/resend-confirmation" className="btn btn-primary">
                    Renvoyer l&apos;email
                  </Link>
                  <Link href="/register" className="btn btn-ghost">
                    S&apos;inscrire à nouveau
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}