import { HttpInternalServerError } from '../utils/httpErrors.js';
import { translateToFrench } from './translationService.js';

const JIKAN_BASE_URL = process.env.JIKAN_API_URL || 'https://api.jikan.moe/v4';

// Fonction helper pour faire des requêtes à Jikan
const fetchFromJikan = async (endpoint) => {
  try {
    const response = await fetch(`${JIKAN_BASE_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`Jikan API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur Jikan API:', error);
    throw new HttpInternalServerError('Erreur lors de la récupération des données depuis Jikan');
  }
};

// Recherche des animés sur Jikan
const searchAnimeOnJikan = async (query, page = 1) => {
  const data = await fetchFromJikan(`/anime?q=${encodeURIComponent(query)}&page=${page}&limit=20`);
  return data.data; // Retourne le tableau d'animés
};

// Récupère les détails complets d'un anime par son ID Jikan
const getAnimeDetailsFromJikan = async (jikanId) => {
  const data = await fetchFromJikan(`/anime/${jikanId}/full`);
  return data.data;
};

// Récupère le nombre RÉEL d'épisodes (utile pour les séries en cours)
const getEpisodesCountFromJikan = async (jikanId) => {
  try {
    // L'endpoint /full retourne déjà le nombre d'épisodes si disponible
    const animeData = await fetchFromJikan(`/anime/${jikanId}/full`);
    const anime = animeData.data;
    
    // Si episodes est disponible et non null, on le retourne
    if (anime.episodes && anime.episodes > 0) {
      return anime.episodes;
    }
    
    // Sinon, on essaie de récupérer via l'endpoint episodes
    const episodesData = await fetchFromJikan(`/anime/${jikanId}/episodes`);
    const episodes = episodesData.data;
    
    // Retourne le nombre d'épisodes dans la liste
    return episodes?.length || 12; // 12 par défaut si rien n'est trouvé
  } catch (error) {
    console.warn(`⚠️ Impossible de récupérer le nombre d'épisodes pour malId ${jikanId}:`, error.message);
    return 12; // Valeur par défaut
  }
};

// Récupère les vidéos (trailers, promos) d'un anime
const getAnimeVideosFromJikan = async (jikanId) => {
  try {
    const data = await fetchFromJikan(`/anime/${jikanId}/videos`);
    return {
      trailers: data.data?.promo || [],
      episodes: data.data?.episodes || [],
      musicVideos: data.data?.music_videos || []
    };
  } catch (error) {
    console.warn(`Impossible de récupérer les vidéos pour malId ${jikanId}:`, error.message);
    return { trailers: [], episodes: [], musicVideos: [] };
  }
};

// Récupère les genres disponibles sur Jikan
const getGenresFromJikan = async () => {
  const data = await fetchFromJikan('/genres/anime');
  return data.data;
};

// Transforme les données Jikan en format compatible avec notre base de données
const transformJikanToOurFormat = async (jikanAnime) => {
  // Récupère le synopsis original
  let synopsis = jikanAnime.synopsis || 'Aucun synopsis disponible';
  
  // Traduit le synopsis si disponible et si la clé DeepL existe
  if (synopsis !== 'Aucun synopsis disponible' && process.env.DEEPL_API_KEY) {
    console.log('Traduction du synopsis...');
    synopsis = await translateToFrench(synopsis);
  }
  
  return {
    titreVf: jikanAnime.title || jikanAnime.title_english || 'Titre non disponible',
    synopsis: synopsis,
    anneeDebut: jikanAnime.year || new Date().getFullYear(),
    studio: jikanAnime.studios?.[0]?.name || 'Studio inconnu',
    posterUrl: jikanAnime.images?.jpg?.large_image_url || jikanAnime.images?.jpg?.image_url,
    noteMoyenne: jikanAnime.score || 0,
  };
};

export {
  searchAnimeOnJikan,
  getAnimeDetailsFromJikan,
  getEpisodesCountFromJikan,
  getAnimeVideosFromJikan,
  getGenresFromJikan,
  transformJikanToOurFormat,
};