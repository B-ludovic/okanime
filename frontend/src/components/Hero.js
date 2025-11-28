import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Hero.css';

function Hero() {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <section className="hero">
            <div className="hero-overlay">
                <div className="hero-content">
                    <h1 className="hero-title">
                        Votre bibliothèque d'animes partagée
                    </h1>
                    <p className="hero-subtitle">
                        Découvrez une collection soigneusement sélectionnée d'animes, 
                        suivez vos séries préférées et partagez vos coups de cœur
                    </p>
                    <div className="hero-cta">
                        <Link to="/collection" className="btn-primary-hero">
                            Découvrir la collection
                        </Link>
                        {!isAuthenticated && (
                            <Link to="/register" className="btn-secondary-hero">
                                Créer mon compte
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}

export default Hero;
