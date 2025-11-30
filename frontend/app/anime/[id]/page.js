'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import api from '../../../app/lib/api';
import { isAuthenticated } from '../../../app/lib/utils';
import styles from '../../../styles/AnimeDetail.module.css';
import { Star, BookmarkPlus, Check } from 'lucide-react';

export default function AnimeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [anime, setAnime] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [inBiblio, setInBiblio] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [biblioEntryId, setBiblioEntryId] = useState(null);
    const [saving, setSaving] = useState(false);

    // Récupère les détails de l'anime
    useEffect(() => {
        const fetchAnime = async () => {
            try {
                const response = await api.get(`/animes/${params.id}`);
                setAnime(response.data.anime);
                
                // Vérifier si l'anime est déjà en favori dans la bibliothèque
                if (isAuthenticated() && response.data.anime.saisons?.[0]?.id) {
                    try {
                        const biblioResponse = await api.get('/bibliotheque');
                        const favoriteEntry = biblioResponse.data.bibliotheque.find(
                            entry => entry.saison.id === response.data.anime.saisons[0].id && entry.statut === 'FAVORI'
                        );
                        if (favoriteEntry) {
                            setIsFavorite(true);
                            setBiblioEntryId(favoriteEntry.id);
                        }
                    } catch (err) {
                        console.error('Erreur lors de la vérification des favoris:', err);
                    }
                }
            } catch (err) {
                setError('Anime introuvable');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchAnime();
        }
    }, [params.id]);

    // Fonction pour ajouter à la bibliothèque
    const addToBibliotheque = async () => {
        if (!isAuthenticated()) {
            alert('Vous devez être connecté pour ajouter à votre bibliothèque');
            router.push('/login');
            return;
        }

        if (!anime?.saisons || anime.saisons.length === 0) {
            alert('Cet anime n\'a pas de saisons disponibles');
            return;
        }

        try {
            setInBiblio(true);
            setSaving(true);

            // Ajoute la première saison à la bibliothèque avec statut A_VOIR
            try {
                await api.post('/bibliotheque', {
                    saisonId: anime.saisons[0].id,
                    statut: 'A_VOIR',
                });
                alert('Ajouté à votre bibliothèque avec succès !');
            } catch (err) {
                // Si déjà dans la biblio, juste informer
                if (err.message.includes('déjà dans votre bibliothèque')) {
                    alert('Cet anime est déjà dans votre bibliothèque');
                } else {
                    throw err;
                }
            }

        } catch (err) {
            setInBiblio(false);
            console.error('Erreur lors de l\'ajout:', err);
            alert(err.message || 'Impossible d\'ajouter à la bibliothèque');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.page}>
                <Header />
                <main className={styles.main}>
                    <div className={styles.loadingContainer}>
                        <span className="loading"></span>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !anime) {
        return (
            <div className={styles.page}>
                <Header />
                <main className={styles.main}>
                    <div className={styles.container}>
                        <div className="alert alert-error">
                            <span>{error || 'Anime introuvable'}</span>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <Header />

            <main className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.card}>
                        <div className={styles.content}>
                            {/* Poster à gauche */}
                            <div className={styles.posterSection}>
                                <div className={styles.poster}>
                                    <Image
                                        src={anime.posterUrl || '/placeholder-anime.jpg'}
                                        alt={anime.titreVf}
                                        width={300}
                                        height={420}
                                        className={styles.posterImage}
                                        priority
                                    />
                                    {anime.noteMoyenne > 0 && (
                                        <div className={styles.posterBadge}>
                                            <Star size={16} fill="white" /> {anime.noteMoyenne.toFixed(1)}
                                        </div>
                                    )}
                                </div>
                                
                                {/* Bouton Ajouter à la bibliothèque */}
                                <button
                                    onClick={addToBibliotheque}
                                    disabled={saving || inBiblio}
                                    className={`btn btn-primary ${styles.addButton} ${inBiblio ? styles.addButtonAdded : ''}`}
                                >
                                    {inBiblio ? (
                                        <>
                                            <Check size={18} /> Ajouté à ma bibliothèque
                                        </>
                                    ) : (
                                        <>
                                            <BookmarkPlus size={18} /> Ajouter à ma bibliothèque
                                        </>
                                    )}
                                </button>
                            </div>

                            {/* Informations à droite */}
                            <div className={styles.info}>
                            <div className={styles.titleRow}>
                                <h1 className={styles.title}>{anime.titreVf}</h1>
                                <button
                                    onClick={async () => {
                                        if (!isAuthenticated()) {
                                            alert('Vous devez être connecté');
                                            router.push('/login');
                                            return;
                                        }
                                        if (!anime?.saisons || anime.saisons.length === 0) {
                                            alert('Cet anime n\'a pas de saisons disponibles');
                                            return;
                                        }
                                        try {
                                            if (isFavorite) {
                                                // Retirer des favoris (supprimer de la bibliothèque)
                                                if (biblioEntryId) {
                                                    await api.delete(`/bibliotheque/${biblioEntryId}`);
                                                    setIsFavorite(false);
                                                    setBiblioEntryId(null);
                                                    alert('Retiré des favoris !');
                                                }
                                            } else {
                                                // Ajouter aux favoris
                                                try {
                                                    // Essayer d'abord d'ajouter
                                                    const response = await api.post('/bibliotheque', {
                                                        saisonId: anime.saisons[0].id,
                                                        statut: 'FAVORI',
                                                    });
                                                    const entryId = response.data.entry?.id || response.data.bibliothequeEntry?.id;
                                                    setBiblioEntryId(entryId);
                                                } catch (err) {
                                                    // Si déjà dans la biblio, faire un update
                                                    if (err.message.includes('déjà dans votre bibliothèque')) {
                                                        // Trouver l'ID de l'entrée existante
                                                        const biblioResponse = await api.get('/bibliotheque');
                                                        const existingEntry = biblioResponse.data.bibliotheque.find(
                                                            entry => entry.saison.id === anime.saisons[0].id
                                                        );
                                                        if (existingEntry) {
                                                            const response = await api.put(`/bibliotheque/${existingEntry.id}`, {
                                                                statut: 'FAVORI',
                                                            });
                                                            const entryId = response.data.entry?.id || response.data.bibliothequeEntry?.id || existingEntry.id;
                                                            setBiblioEntryId(entryId);
                                                        }
                                                    } else {
                                                        throw err;
                                                    }
                                                }
                                                setIsFavorite(true);
                                                alert('Ajouté aux favoris !');
                                            }
                                        } catch (err) {
                                            alert(err.message || 'Erreur');
                                        }
                                    }}
                                    className={styles.favoriteButton}
                                    title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                                >
                                    <Image 
                                        src={isFavorite ? "/icons/favori.png" : "/icons/favori-empty.png"}
                                        alt="Favori" 
                                        width={28} 
                                        height={28}
                                        className={styles.favoriteIcon}
                                    />
                                </button>
                            </div>

                            {anime.studio && (
                                <p className={styles.author}>de {anime.studio}</p>
                            )}

                            {/* Genres */}
                            {anime.genres && anime.genres.length > 0 && (
                                <div className={styles.genresSection}>
                                    <span className={styles.genresLabel}>Genres :</span>
                                    <div className={styles.genres}>
                                        {anime.genres.map((genreRelation) => (
                                            <span key={genreRelation.genre.id} className={styles.genreTag}>
                                                {genreRelation.genre.nom}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Résumé */}
                            <div className={styles.resumeSection}>
                                <h2 className={styles.resumeTitle}>Résumé</h2>
                                <p className={styles.resumeText}>{anime.synopsis}</p>
                            </div>

                            {/* Saisons */}
                            {anime.saisons && anime.saisons.length > 0 && (
                                <div className={styles.seasonsSection}>
                                    <h3 className={styles.seasonsTitle}>
                                        {anime.saisons.length} saison{anime.saisons.length > 1 ? 's' : ''}
                                    </h3>
                                    <div className={styles.seasonsList}>
                                        {anime.saisons.map((saison) => (
                                            <div key={saison.id} className={styles.seasonItem}>
                                                <span className={styles.seasonName}>
                                                    Saison {saison.numeroSaison}
                                                    {saison.titreSaison && ` - ${saison.titreSaison}`}
                                                </span>
                                                <span className={styles.seasonEpisodes}>
                                                    {saison.nombreEpisodes} épisodes
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}