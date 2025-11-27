import React, { useState } from 'react';
import api from '../api';
import '../styles/Auth.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const data = await api.post('/auth/login', { email, password });
            if (data.error) {
                setError(data.error);
            } else {
                // Sauvegarder le token dans le localStorage
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                // Rediriger vers le tableau de bord ou la page d'accueil
                window.location.href = '/dashboard';
            }
        } catch (error) {
            setError('Une erreur est survenue. Veuillez réessayer.');
        }
    };

    return (
        <div className="auth-container">
            <h2>Connexion - O'Kanime <img src="/icons/japan-flag.png" alt="Japan flag" className="flag-icon" /></h2>

            {error && <div className="error-message">{error}</div>}

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
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn btn-primary">
                    Se connecter
                </button>
            </form>

            <p className="auth-link">
                Pas encore de compte ? <a href="/register">S'inscrire</a>
            </p>
        </div>
    );
}

export default Login;