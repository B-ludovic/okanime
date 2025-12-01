'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Header from '../../../components/layout/Header';
import Footer from '../../../components/layout/Footer';
import api from '../../../app/lib/api';
import { isAuthenticated } from '../../../app/lib/utils';
import { STATUTS_BIBLIOTHEQUE } from '../../../app/lib/constants';
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
    const [biblioStatut, setBiblioStatut] = useState(null); // Statut actuel dans la biblio
    const [saving, setSaving] = useState(false);

    // Fonction pour attribuer une couleur à chaque genre
    const getGenreColor = (genreName) => {
        if (!genreName) {
            return 'linear-gradient(135deg, #DBEAFE, #93C5FD)'; // Bleu pastel par défaut
        }

        const colors = {
            'Action': 'linear-gradient(135deg, #FCA5A5, #EF4444)',        // Rouge - énergie et combat
            'Adventure': 'linear-gradient(135deg, #FCD34D, #F59E0B)',     // Orange - exploration
            'Comedy': 'linear-gradient(135deg, #FEF3C7, #FCD34D)',        // Jaune - joie et humour
            'Drama': 'linear-gradient(135deg, #C4B5FD, #8B5CF6)',         // Violet - émotions
            'Fantasy': 'linear-gradient(135deg, #F9A8D4, #EC4899)',       // Rose - magie et rêves
            'Horror': 'linear-gradient(135deg, #4B5563, #1F2937)',        // Gris foncé - peur
            'Mystery': 'linear-gradient(135deg, #A5B4FC, #6366F1)',       // Indigo - énigmes
            'Romance': 'linear-gradient(135deg, #FBCFE8, #F472B6)',       // Rose clair - amour
            'Sci-Fi': 'linear-gradient(135deg, #93C5FD, #3B82F6)',        // Bleu - technologie
            'Slice of Life': 'linear-gradient(135deg, #6EE7B7, #10B981)', // Vert - quotidien
            'Sports': 'linear-gradient(135deg, #5EEAD4, #14B8A6)',        // Turquoise - compétition
            'Supernatural': 'linear-gradient(135deg, #A78BFA, #7C3AED)',  // Violet foncé - surnaturel
            'Thriller': 'linear-gradient(135deg, #F87171, #DC2626)',      // Rouge foncé - suspense
            'Mecha': 'linear-gradient(135deg, #9CA3AF, #6B7280)',         // Gris - robots
            'School': 'linear-gradient(135deg, #FDBA74, #F97316)',        // Orange clair - jeunesse
            'Music': 'linear-gradient(135deg, #D8B4FE, #A855F7)',         // Violet clair - harmonie
        };

        // Recherche insensible à la casse
        const normalizedName = genreName.trim();
        if (colors[normalizedName]) {
            return colors[normalizedName];
        }

        // Recherche partielle
        for (const [key, color] of Object.entries(colors)) {
            if (key.toLowerCase().includes(normalizedName.toLowerCase()) || 
                normalizedName.toLowerCase().includes(key.toLowerCase())) {
                return color;
            }
        }

        return 'linear-gradient(135deg, #DBEAFE, #93C5FD)'; // Bleu pastel par défaut
    };

    // Récupère les détails de l'anime
    useEffect(() => {
        const fetchAnime = async () => {
            try {
                const response = await api.get(`/animes/${params.id}`);
                setAnime(response.data.anime);
                
                // Vérifier si l'anime est déjà dans la bibliothèque
                if (isAuthenticated() && response.data.anime.saisons?.[0]?.id) {
                    try {
                        const biblioResponse = await api.get('/bibliotheque');
                        const entry = biblioResponse.data.bibliotheque.find(
                            entry => entry.saison.id === response.data.anime.saisons[0].id
                        );
                        if (entry) {
                            setInBiblio(true);
                            setBiblioEntryId(entry.id);
                            setBiblioStatut(entry.statut);
                            if (entry.statut === 'FAVORI') {
                                setIsFavorite(true);
                            }
                        }
                    } catch (err) {
                        console.error('Erreur lors de la vérification de la bibliothèque:', err);
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

    // Fonction pour changer le statut dans la bibliothèque
    const handleStatutChange = async (newStatut) => {
        if (!biblioEntryId) return;

        try {
            setSaving(true);
            await api.put(`/bibliotheque/${biblioEntryId}`, {
                statut: newStatut,
            });
            setBiblioStatut(newStatut);
            setIsFavorite(newStatut === 'FAVORI');
        } catch (err) {
            console.error('Erreur lors du changement de statut:', err);
            alert('Impossible de modifier le statut');
        } finally {
            setSaving(false);
        }
    };

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
                const response = await api.post('/bibliotheque', {
                    saisonId: anime.saisons[0].id,
                    statut: 'A_VOIR',
                });
                const entryId = response.data.entry?.id || response.data.bibliothequeEntry?.id;
                setBiblioEntryId(entryId);
                setBiblioStatut('A_VOIR');
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
                                
                                {/* Si déjà dans la bibliothèque : afficher le select de statut */}
                                {inBiblio ? (
                                    <div className={styles.biblioStatusSection}>
                                        <label className={styles.biblioLabel}>
                                            Statut dans ma bibliothèque :
                                        </label>
                                        <select
                                            value={biblioStatut}
                                            onChange={(e) => handleStatutChange(e.target.value)}
                                            disabled={saving}
                                            className={styles.biblioSelect}
                                        >
                                            {Object.keys(STATUTS_BIBLIOTHEQUE).map((key) => (
                                                <option key={key} value={key}>
                                                    {STATUTS_BIBLIOTHEQUE[key]}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                ) : (
                                    /* Sinon : afficher le bouton "Ajouter à la bibliothèque" */
                                    <button
                                        onClick={addToBibliotheque}
                                        disabled={saving}
                                        className={`btn btn-primary ${styles.addButton}`}
                                    >
                                        <BookmarkPlus size={18} /> Ajouter à ma bibliothèque
                                    </button>
                                )}
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
                                            <span 
                                                key={genreRelation.genre.id} 
                                                className={styles.genreTag}
                                                style={{ background: getGenreColor(genreRelation.genre.nom) }}
                                            >
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