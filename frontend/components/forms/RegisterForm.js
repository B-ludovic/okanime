'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserPlus } from 'lucide-react';
import api from '../../app/lib/api';
import styles from '../../styles/RegisterForm.module.css';

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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: '',
      });
    }
  };

  const validate = () => {
    const newErrors = {};

    if (formData.username.length < 3) {
      newErrors.username = 'Le nom d\'utilisateur doit contenir au moins 3 caractères';
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (formData.password.length < 8) {
      newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);

    try {
      const { confirmPassword, ...dataToSend } = formData;
      const response = await api.post('/auth/register', dataToSend);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      router.push('/');
      router.refresh();
    } catch (err) {
      setErrors({ general: err.message || 'Erreur lors de l\'inscription' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Erreur générale */}
      {errors.general && (
        <div className={`${styles.alert} ${styles.alertError}`}>
          <span>{errors.general}</span>
        </div>
      )}

      {/* Username */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Nom d&apos;utilisateur</label>
        <input
          type="text"
          name="username"
          placeholder="john_doe"
          className={`${styles.formInput} ${errors.username ? styles.error : ''}`}
          value={formData.username}
          onChange={handleChange}
          required
        />
        {errors.username && <span className={styles.formError}>{errors.username}</span>}
      </div>

      {/* Email */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Email</label>
        <input
          type="email"
          name="email"
          placeholder="votre@email.com"
          className={`${styles.formInput} ${errors.email ? styles.error : ''}`}
          value={formData.email}
          onChange={handleChange}
          required
        />
        {errors.email && <span className={styles.formError}>{errors.email}</span>}
      </div>

      {/* Password */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Mot de passe</label>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          className={`${styles.formInput} ${errors.password ? styles.error : ''}`}
          value={formData.password}
          onChange={handleChange}
          required
        />
        {errors.password && <span className={styles.formError}>{errors.password}</span>}
      </div>

      {/* Confirm Password */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Confirmer le mot de passe</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="••••••••"
          className={`${styles.formInput} ${errors.confirmPassword ? styles.error : ''}`}
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        {errors.confirmPassword && <span className={styles.formError}>{errors.confirmPassword}</span>}
      </div>

      {/* Bouton */}
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? (
          <span className={styles.loading}></span>
        ) : (
          <>
            <UserPlus size={18} />
            S&apos;inscrire
          </>
        )}
      </button>

      {/* Lien connexion */}
      <div className={styles.textCenter}>
        <p className={styles.textSmall}>
          Déjà un compte ?{' '}
          <Link href="/login" className={styles.textLink}>
            Connectez-vous
          </Link>
        </p>
      </div>
    </form>
  );
}