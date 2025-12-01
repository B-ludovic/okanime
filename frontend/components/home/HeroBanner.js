'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Star, Heart } from "lucide-react";
import styles from "../../styles/modules/HeroBanner.module.css";
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
                const animesData = response?.data?.animes || [];
                setAnimes(animesData);
            } catch (err) {
                console.error('Erreur lors du chargement des animés en vedette:', err);
                setAnimes([]);
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

    if (loading) {
        return (
            <div className={styles.heroBannerLoading}>
                <span className="loading"></span>
            </div>
        );
    }

    if (animes.length === 0) {
        return null;
    }

    const currentAnime = animes[currentIndex];

    // Utiliser le poster si la bannière est un gradient
    const imageUrl = currentAnime.banniereUrl?.startsWith('gradient-') 
        ? currentAnime.posterUrl 
        : (currentAnime.banniereUrl || currentAnime.posterUrl);

    return (
        <div className={styles.heroBanner}>
            {/* Background avec bannière */}
            <div className={styles.heroBannerBackground}>
                <Image
                    src={imageUrl}
                    alt={currentAnime.titreVf}
                    fill
                    className={styles.heroBannerImage}
                    priority
                />
                <div className={styles.heroBannerOverlay}></div>
            </div>

            {/* Contenu */}
            <div className={styles.heroBannerContent}>
                {/* Navigation précédent */}
                <button className={`${styles.heroBannerNav} ${styles.heroBannerNavLeft}`} onClick={goToPrevious}>
                    <ChevronLeft size={32} />
                </button>

                {/* Informations de l'anime */}
                <div className={styles.heroBannerInfo}>
                    <h1 className={styles.heroBannerTitle}>{currentAnime.titreVf}</h1>

                    <div className={styles.heroBannerMeta}>
                        {currentAnime.noteMoyenne > 0 && (
                            <span className={styles.heroBannerMetaItem}>
                                <Star size={16} fill="gold" /> {currentAnime.noteMoyenne.toFixed(1)}/10
                            </span>
                        )}
                        {currentAnime.genres && currentAnime.genres.length > 0 && (
                            <span className={styles.heroBannerMetaItem}>
                                {currentAnime.genres.slice(0, 2).map((g) => g.genre.nom).join(', ')}
                            </span>
                        )}
                        {currentAnime.anneeDebut && (
                            <span className={styles.heroBannerMetaItem}>{currentAnime.anneeDebut}</span>
                        )}
                    </div>

                    <p className={styles.heroBannerSynopsis}>
                        {currentAnime.synopsis.length > 200
                            ? currentAnime.synopsis.slice(0, 200) + '...'
                            : currentAnime.synopsis}
                    </p>

                    <div className={styles.heroBannerActions}>
                        <button
                            className="btn btn-primary btn-large"
                            onClick={() => router.push(`/anime/${currentAnime.id}`)}
                        >
                            Découvrir l&apos;anime
                        </button>
                        {isAuthenticated() && (
                            <button
                                className="btn btn-ghost btn-large"
                                style={{ color: 'white' }}
                                onClick={() => router.push(`/anime/${currentAnime.id}`)}
                            >
                                <Heart size={20} />
                                Ajouter
                            </button>
                        )}
                    </div>
                </div>

                {/* Navigation suivant */}
                <button className={`${styles.heroBannerNav} ${styles.heroBannerNavRight}`} onClick={goToNext}>
                    <ChevronRight size={32} />
                </button>

                {/* Pagination dots */}
                <div className={styles.heroBannerPagination}>
                    {animes.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.heroBannerDot} ${index === currentIndex ? styles.active : ''}`}
                            onClick={() => setCurrentIndex(index)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HeroBanner;