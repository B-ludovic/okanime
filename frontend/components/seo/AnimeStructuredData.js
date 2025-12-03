// Composant pour ajouter des données structurées (JSON-LD) à la page
// JSON-LD = format que Google comprend pour afficher des rich snippets
// Rich snippets = résultats Google enrichis avec étoiles, durée, genres, etc.

export default function AnimeStructuredData({ anime }) {
  // Si pas d'anime, on n'affiche rien
  if (!anime) return null;

  // Construction de l'objet JSON-LD selon le format Schema.org
  // Schema.org = vocabulaire standard compris par Google, Bing, etc.
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'TVSeries', // Type = Série TV
    
    // Informations de base
    name: anime.titreVf,
    description: anime.synopsis,
    image: anime.posterUrl,
    
    // Studio de production
    productionCompany: {
      '@type': 'Organization',
      name: anime.studio,
    },
    
    // Année de début
    startDate: anime.anneeDebut?.toString(),
    
    // Genres (liste des catégories)
    genre: anime.genres?.map(g => g.genre.nom) || [],
    
    // Note moyenne (si disponible)
    ...(anime.noteMoyenne > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: anime.noteMoyenne.toFixed(1),
        ratingCount: anime._count?.avis || 0, // Nombre d'avis
        bestRating: '5',
        worstRating: '1',
      },
    }),
    
    // Nombre de saisons
    ...(anime.saisons?.length > 0 && {
      numberOfSeasons: anime.saisons.length,
    }),
    
    // URL de la page
    url: `https://okanime.live/anime/${anime.id}`,
    
    // Langue
    inLanguage: 'fr-FR',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
