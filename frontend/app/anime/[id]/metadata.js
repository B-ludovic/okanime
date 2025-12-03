// récupère les infos de l'anime depuis l'API et crée les balises meta appropriées

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export async function generateMetadata({ params }) {
  try {
    // Récupère les données de l'anime depuis l'API
    const response = await fetch(`${API_URL}/animes/${params.id}`, {
      cache: 'no-store', // Toujours récupérer les données fraîches
    });

    if (!response.ok) {
      // Si l'anime n'existe pas, retourne des metadata par défaut
      return {
        title: 'Anime introuvable',
        description: 'Cet anime n\'existe pas ou a été supprimé.',
      };
    }

    const data = await response.json();
    const anime = data.data.anime;

    // Tronque le synopsis pour la meta description (max 160 caractères recommandé)
    const shortSynopsis = anime.synopsis?.length > 160 
      ? anime.synopsis.substring(0, 157) + '...' 
      : anime.synopsis;

    // Liste des genres pour les keywords
    const genresNames = anime.genres?.map(g => g.genre.nom).join(', ') || '';

    return {
      // Titre de la page (apparaît dans l'onglet et Google)
      title: anime.titreVf,
      
      // Description pour Google (160 caractères max recommandé)
      description: shortSynopsis || `Découvrez ${anime.titreVf}, un anime de ${anime.studio}.`,
      
      // Mots-clés pour le référencement
      keywords: [anime.titreVf, anime.studio, genresNames, 'anime', 'streaming', 'vf'].filter(Boolean),

      // Open Graph pour partage sur réseaux sociaux (Facebook, Discord, etc.)
      openGraph: {
        title: `${anime.titreVf} - O'Kanime`,
        description: shortSynopsis,
        url: `https://okanime.live/anime/${params.id}`,
        type: 'video.tv_show', // Type spécifique pour les séries
        images: [
          {
            url: anime.posterUrl || '/placeholder-anime.jpg',
            width: 300,
            height: 420,
            alt: `Poster de ${anime.titreVf}`,
          },
        ],
        // Infos supplémentaires pour rich snippets
        siteName: 'O\'Kanime',
        locale: 'fr_FR',
      },

      // Twitter Card pour affichage sur Twitter
      twitter: {
        card: 'summary_large_image',
        title: `${anime.titreVf} - O'Kanime`,
        description: shortSynopsis,
        images: [anime.posterUrl || '/placeholder-anime.jpg'],
      },

      // Autres metadata utiles
      authors: [{ name: anime.studio }],
      category: genresNames,
    };
  } catch (error) {
    console.error('Erreur génération metadata:', error);
    // En cas d'erreur, retourne des metadata minimales
    return {
      title: 'Anime',
      description: 'Découvrez cet anime sur O\'Kanime',
    };
  }
}
