// Page serveur qui gère le SEO (metadata) et appelle le composant client
// Séparation nécessaire car generateMetadata doit être côté serveur
// et les hooks (useState, useParams) doivent être côté client

import AnimeDetailClient from './AnimeDetailClient';

// Export de la fonction generateMetadata pour le SEO dynamique
export { generateMetadata } from './metadata';

// Le composant page est un Server Component par défaut
// Il ne fait que retourner le Client Component
export default function AnimeDetailPage() {
    return <AnimeDetailClient />;
}
