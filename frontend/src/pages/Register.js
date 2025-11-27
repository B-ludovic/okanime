import React, { useState } from 'react';
import api from '../api';
import '../styles/Auth.css';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const data = await api.post('/auth/register', { email, username, password });

      if (data.error) {
        setError(data.error);
      } else {
        setSuccess('Compte créé avec succès ! Redirection...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
    } catch (err) {
      setError('Erreur lors de l\'inscription');
    }
  };

  return (
    <div className="auth-container">
      <h2>Inscription - O'Kanime <img src="/icons/japan-flag.png" alt="Japan flag" className="flag-icon" /></h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Nom d'utilisateur</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          S'inscrire
        </button>
      </form>

      <p className="auth-link">
        Déjà un compte ? <a href="/login">Se connecter</a>
      </p>
    </div>
  );
}

export default Register;