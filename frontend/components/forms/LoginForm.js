'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import api from '@/lib/api';

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Met à jour les champs du formulaire
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Efface l'erreur quand l'utilisateur tape
    if (error) setError('');
  };

  // Soumet le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Appel à l'API de connexion
      const response = await api.post('/auth/login', formData);

      // Stocke le token et les infos utilisateur
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirige vers la page d'accueil
      router.push('/');
      router.refresh(); // Force le refresh pour mettre à jour le header
    } catch (err) {
      setError(err.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Message d'erreur */}
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Email */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          name="email"
          placeholder="votre@email.com"
          className="input input-bordered w-full"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      {/* Mot de passe */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Mot de passe</span>
        </label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          className="input input-bordered w-full"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      {/* Bouton de connexion */}
      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <>
            <LogIn size={18} />
            Se connecter
          </>
        )}
      </button>

      {/* Lien vers inscription */}
      <div className="text-center mt-4">
        <p className="text-sm">
          Pas encore de compte ?{' '}
          <Link href="/register" className="link link-primary">
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </form>
  );
}