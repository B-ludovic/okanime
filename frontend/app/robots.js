// robots.js - Configure les règles pour les robots des moteurs de recherche
// Ce fichier dit à Google quelles pages il peut explorer

const SITE_URL = 'https://okanime.live';

function robots() {
    return {
        rules: [
            {
                // Règles pour tous les robots (Google, Bing, etc.)
                userAgent: '*',
                allow: '/', // Autoriser toutes les pages par défaut
                disallow: [
                    '/api/', // Bloquer l'accès aux routes API internes
                    '/admin/', // Bloquer les pages admin (privées)
                    '/profil/', // Bloquer les profils utilisateurs (privés)
                    '/bibliotheque/', // Bloquer les bibliothèques (privées)
                ],
            },
        ],
        // URL du sitemap pour que Google le trouve facilement
        sitemap: `${SITE_URL}/sitemap.xml`,
    };
}

export default robots;