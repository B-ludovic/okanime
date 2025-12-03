// sitemap.js - Génère automatiquement le sitemap XML pour Google
// Un sitemap aide Google à découvrir toutes les pages du site

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://okanime-api.onrender.com/api';
const SITE_URL = 'https://okanime.live';

async function sitemap() {
    // Pages statiques (toujours présentes)
    const staticPages = [
        {
            url: SITE_URL,
            lastModified: new Date(),
            changeFrequency: 'daily', // Page d'accueil change souvent
            priority: 1.0, // Priorité maximale
        },
        {
            url: `${SITE_URL}/recherche`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.8,
        },
        {
            url: `${SITE_URL}/cgu`,
            lastModified: new Date(),
            changeFrequency: 'monthly', // CGU changent rarement
            priority: 0.3,
        },
        {
            url: `${SITE_URL}/mentions-legales`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
        {
            url: `${SITE_URL}/politique-confidentialite`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.3,
        },
    ];

    try {
        // Récupérer tous les animes validés depuis l'API
        const response = await fetch(`${API_URL}/animes?verifie=true`, {
            next: { revalidate: 3600 }, // Cache 1h
        });

        if (!response.ok) {
            console.error('Erreur sitemap: impossible de récupérer les animes');
            return staticPages; // Retourner au moins les pages statiques
        }

        const animes = await response.json();

        // Créer une entrée pour chaque anime
        const animePages = animes.map((anime) => ({
            url: `${SITE_URL}/anime/${anime.id}`,
            lastModified: new Date(anime.updatedAt || anime.createdAt),
            changeFrequency: 'weekly',
            priority: 0.7,
        }));

        // Combiner pages statiques + pages d'animes
        return [...staticPages, ...animePages];
    } catch (error) {
        console.error('Erreur lors de la génération du sitemap:', error);
        // En cas d'erreur, retourner au moins les pages statiques
        return staticPages;
    }
}

export default sitemap;
