'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import api from '@/lib/api';

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Met à jour les champs du formulaire
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Efface l'erreur du champ modifié
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  // Validation côté client
  const validate = () => {
    const newErrors = {};

    // Username
    if (formData.username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    }

    // Email
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    // Password
    if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    // Confirm password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumet le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Valide avant d'envoyer
    if (!validate()) return;

    setLoading(true);

    try {
      // Prépare les données (sans confirmPassword)
      const { confirmPassword, ...dataToSend } = formData;

      // Appel à l'API d'inscription
      const response = await api.post('/auth/register', dataToSend);

      // Stocke le token et les infos utilisateur
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirige vers la page d'accueil
      router.push('/');
      router.refresh();
    } catch (err) {
      setErrors({ general: err.message || 'Erreur lors de l\'inscription' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Message d'erreur général */}
      {errors.general && (
        <div className="alert alert-error">
          <span>{errors.general}</span>
        </div>
      )}

      {/* Username */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Nom d&apos;utilisateur</span>
        </label>
        <input
          type="text"
          name="username"
          placeholder="john_doe"
          className={`input input-bordered w-full ${errors.username ? 'input-error' : ''}`}
          value={formData.username}
          onChange={handleChange}
          required
        />
        {errors.username && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.username}</span>
          </label>
        )}
      </div>

      {/* Email */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Email</span>
        </label>
        <input
          type="email"
          name="email"
          placeholder="votre@email.com"
          className={`input input-bordered w-full ${errors.email ? 'input-error' : ''}`}
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.email}</span>
          </label>
        )}
      </div>

      {/* Password */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Mot de passe</span>
        </label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          className={`input input-bordered w-full ${errors.password ? 'input-error' : ''}`}
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.password && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.password}</span>
          </label>
        )}
      </div>

      {/* Confirm Password */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Confirmer le mot de passe</span>
        </label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          className={`input input-bordered w-full ${errors.confirmPassword ? 'input-error' : ''}`}
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        {errors.confirmPassword && (
          <label className="label">
            <span className="label-text-alt text-error">{errors.confirmPassword}</span>
          </label>
        )}
      </div>

      {/* Bouton d'inscription */}
      <button
        type="submit"
        className="btn btn-primary w-full"
        disabled={loading}
      >
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <>
            <UserPlus size={18} />
            S&apos;inscrire
          </>
        )}
      </button>

      {/* Lien vers connexion */}
      <div className="text-center mt-4">
        <p className="text-sm">
          Déjà un compte ?{' '}
          <Link href="/login" className="link link-primary">
            Connectez-vous
          </Link>
        </p>
      </div>
    </form>
  );
}