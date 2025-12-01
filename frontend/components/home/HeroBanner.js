import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, Heart } from "lucide-react";
import styles from "../../styles/HeroBanner.module.css";
import api from "../../app/lib/api";
import { isAuthenticated } from "../../app/lib/utils";

function HeroBanner() {
    const router = useRouter();
    const [animes, setAnimes] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    // Récupère les animes en vedette au chargement
    useEffect(() => {
        const fetchFeaturedAnimes = async () => {
            try {
                const response = await api.get('/animes?limit=5&sort=recent');
                setAnimes(response.data.data.animes || []);
            } catch (err) {
                console.error('Erreur lors du chargement des animés en vedette:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedAnimes();
    }, []);

    // Change l'anime affiché toutes les 5 secondes

    useEffect(() => {
        if (animes.length === 0) return;

        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % animes.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [animes.length]);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + animes.length) % animes.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % animes.length);
    };

    if (loading || animes.length === 0) {
        return (
            <div className="hero-banner-loading">
                <span className="loading"></span>
            </div>
        );
    }

    const currentAnime = animes[currentIndex];

    return (
        <div className="hero-banner">
            {/* Background avec bannière */}
            <div className="hero-banner-background">
                <Image
                    src={currentAnime.banniereUrl || currentAnime.posterUrl}
                    alt={currentAnime.titreVf}
                    fill
                    className="hero-banner-image"
                    priority
                />
                <div className="hero-banner-overlay"></div>
            </div>

            {/* Contenu */}
            <div className="hero-banner-content">
                {/* Navigation précédent */}
                <button className="hero-banner-nav hero-banner-nav-left" onClick={goToPrevious}>
                    <ChevronLeft size={32} />
                </button>

                {/* Informations de l'anime */}
                <div className="hero-banner-info">
                    <h1 className="hero-banner-title">{currentAnime.titreVf}</h1>

                    <div className="hero-banner-meta">
                        {currentAnime.noteMoyenne > 0 && (
                            <span className="hero-banner-meta-item">
                                <Star size={16} fill="gold" /> {currentAnime.noteMoyenne.toFixed(1)}/10
                            </span>
                        )}
                        {currentAnime.genres && currentAnime.genres.length > 0 && (
                            <span className="hero-banner-meta-item">
                                {currentAnime.genres.slice(0, 2).map((g) => g.genre.nom).join(', ')}
                            </span>
                        )}
                        {currentAnime.anneeDebut && (
                            <span className="hero-banner-meta-item">{currentAnime.anneeDebut}</span>
                        )}
                    </div>

                    <p className="hero-banner-synopsis">
                        {currentAnime.synopsis.length > 200
                            ? currentAnime.synopsis.slice(0, 200) + '...'
                            : currentAnime.synopsis}
                    </p>

                    <div className="hero-banner-actions">
                        <button
                            className="btn btn-primary btn-large"
                            onClick={() => router.push(`/anime/${currentAnime.id}`)}
                        >
                            Découvrir l&apos;anime
                        </button>
                        {isAuthenticated() && (
                            <button
                                className="btn btn-ghost btn-large"
                                onClick={() => router.push(`/anime/${currentAnime.id}`)}
                            >
                                <Heart size={20} />
                                Ajouter
                            </button>
                        )}
                    </div>
                </div>

                {/* Navigation suivant */}
                <button className="hero-banner-nav hero-banner-nav-right" onClick={goToNext}>
                    <ChevronRight size={32} />
                </button>

                {/* Pagination dots */}
                <div className="hero-banner-pagination">
                    {animes.map((_, index) => (
                        <button
                            key={index}
                            className={`hero-banner-dot ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}