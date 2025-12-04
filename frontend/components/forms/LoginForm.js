'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LogIn } from 'lucide-react';
import api from '../../app/lib/api';
import styles from '../../styles/modules/LoginForm.module.css';

function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', formData);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      router.push('/');
      router.refresh();
    } catch (err) {
      setError(err.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Message d'erreur */}
      {error && (
        <div className={`${styles.alert} ${styles.alertError}`}>
          <span>{error}</span>
        </div>
      )}

      {/* Email */}
      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Email</label>
        <input
          type="email"
          name="email"
          placeholder="votre@email.com"
          className={styles.formInput}
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      {/* Mot de passe */}
      <div className={styles.formGroup}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label className={styles.formLabel}>Mot de passe</label>
          <Link href="/forgot-password" className={styles.textLink} style={{ fontSize: '14px' }}>
            Mot de passe oublié ?
          </Link>
        </div>
        <input
          type="password"
          name="password"
          placeholder="••••••••"
          className={styles.formInput}
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      {/* Bouton */}
      <button type="submit" className="btn btn-primary w-full" disabled={loading}>
        {loading ? (
          <span className={styles.loading}></span>
        ) : (
          <>
            <LogIn size={18} />
            Se connecter
          </>
        )}
      </button>

      {/* Lien inscription */}
      <div className={styles.textCenter}>
        <p className={styles.textSmall}>
          Pas encore de compte ?{' '}
          <Link href="/register" className={styles.textLink}>
            Inscrivez-vous
          </Link>
        </p>
      </div>
    </form>
  );
}

export default LoginForm;