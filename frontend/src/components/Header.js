import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Header.css';

function Header() {
    const navigate = useNavigate();
    const isAuthenticated = !!localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload(); // Force le rechargement pour mettre à jour l'état
    };

    return (
        <header className="main-header">
            <div className="header-container">
                {/* Logo */}
                <Link to="/" className="logo">
                    <img src="/icons/japan-flag.png" alt="Japan flag" className="logo-icon" />
                    <h1>O'Kanime</h1>
                </Link>

                {/* Navigation */}
                <nav className="main-nav">
                    <Link to="/" className="nav-link">Accueil</Link>
                    <Link to="/collection" className="nav-link">Notre Collection</Link>
                    {isAuthenticated && (
                        <Link to="/ma-bibliotheque" className="nav-link">Ma Vidéothèque</Link>
                    )}
                </nav>

                {/* Connexion / Profil */}
                <div className="header-actions">
                    {isAuthenticated ? (
                        <>
                            <span className="user-name">Bonjour, {user?.username}</span>
                            <button onClick={handleLogout} className="btn-logout">
                                Déconnexion
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="btn-login">Connexion</Link>
                            <Link to="/register" className="btn-register">Inscription</Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Header;
