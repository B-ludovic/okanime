import { env } from '../config/env.js';
import { HttpInternalServerError } from '../utils/httpErrors.js';

const JIKAN_BASE_URL = env.JIKAN_API_URL;

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
export const searchAnimeOnJikan = async (query, page = 1) => {
  const data = await fetchFromJikan(`/anime?q=${encodeURIComponent(query)}&page=${page}&limit=20`);
  return data.data; // Retourne le tableau d'animés
};

// Récupère les détails complets d'un anime par son ID Jikan
const getAnimeDetailsFromJikan = async (jikanId) => {
  const data = await fetchFromJikan(`/anime/${jikanId}/full`);
  return data.data;
};

// Récupère les genres disponibles sur Jikan
const getGenresFromJikan = async () => {
  const data = await fetchFromJikan('/genres/anime');
  return data.data;
};

// Transforme les données Jikan en format compatible avec notre base de données
const transformJikanToOurFormat = (jikanAnime) => {
  return {
    titreVf: jikanAnime.title || jikanAnime.title_english || 'Titre non disponible',
    synopsis: jikanAnime.synopsis || 'Aucun synopsis disponible',
    anneeDebut: jikanAnime.year || new Date().getFullYear(),
    studio: jikanAnime.studios?.[0]?.name || 'Studio inconnu',
    posterUrl: jikanAnime.images?.jpg?.large_image_url || jikanAnime.images?.jpg?.image_url,
    banniereUrl: jikanAnime.images?.jpg?.large_image_url,
    noteMoyenne: jikanAnime.score || 0,
  };
};

export {
  searchAnimeOnJikan,
  getAnimeDetailsFromJikan,
  getGenresFromJikan,
  transformJikanToOurFormat,
};