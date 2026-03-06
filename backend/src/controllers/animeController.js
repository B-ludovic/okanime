import prisma from '../config/prisma.js';
import { HttpNotFoundError, httpStatusCodes } from '../utils/httpErrors.js';
import { getAnimeVideosFromJikan, getAnimeEpisodesFromJikan } from '../services/jikanService.js';

// Récupérer tous les animes (avec recherche et filtres)
const getAllAnimes = async (req, res, next) => {
  try {
    const { query, genre, page = '1', limit = '20', sort } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Filtres de recherche
    // Ne montrer que les animes validés ET vérifiés (publiés)
    const where = {
      statutModeration: 'VALIDE',
      verifie: true,
    };

    // Si recherche par titre
    if (query) {
      where.titreVf = {
        contains: query,
        mode: 'insensitive',
      };
    }

    // Si filtre par genre
    if (genre) {
      where.genres = {
        some: {
          genre: {
            nom: {
              contains: genre,
              mode: 'insensitive',
            },
          },
        },
      };
    }

    // Gestion du tri
    let orderBy = { dateAjout: 'desc' }; // Par défaut: les plus récents ajoutés
    
    if (sort === 'recent') {
      orderBy = { dateAjout: 'desc' }; // Les plus récents ajoutés
    } else if (sort === 'rating') {
      orderBy = { noteMoyenne: 'desc' }; // Les mieux notés
    }

    // Compter le total d'animes
    const total = await prisma.anime.count({ where });

    // Récupérer les animes
    const animes = await prisma.anime.findMany({
      where,
      skip,
      take: limitNumber,
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        saisons: {
          select: {
            id: true,
            numeroSaison: true,
            nombreEpisodes: true,
          },
        },
        _count: {
          select: {
            avis: true,
          },
        },
      },
      orderBy,
    });

    res.status(httpStatusCodes.OK).json({
      success: true,
      data: {
        animes,
        pagination: {
          page: pageNumber,
          limit: limitNumber,
          total,
          totalPages: Math.ceil(total / limitNumber),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer un anime par slug
const getAnimeById = async (req, res, next) => {
  try {
    const { id: slug } = req.params;

    const anime = await prisma.anime.findUnique({
      where: { slug },
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        saisons: {
          orderBy: {
            numeroSaison: 'asc',
          },
        },
        avis: {
          include: {
            user: {
              select: {
                id: true,
                username: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            dateCreation: 'desc',
          },
        },
      },
    });

    if (!anime || anime.statutModeration !== 'VALIDE') {
      throw new HttpNotFoundError('Anime introuvable');
    }

    // Récupérer les vidéos depuis Jikan si malId existe
    let videos = null;
    if (anime.malId) {
      try {
        videos = await getAnimeVideosFromJikan(anime.malId);
      } catch (error) {
        console.warn(`Impossible de récupérer les vidéos pour ${anime.titreVf}:`, error.message);
      }
    }

    res.status(httpStatusCodes.OK).json({
      success: true,
      data: { 
        anime,
        videos // Ajoute les vidéos à la réponse
      },
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer tous les genres
const getAllGenres = async (req, res, next) => {
  try {
    const genres = await prisma.genre.findMany({
      orderBy: {
        nom: 'asc',
      },
    });

    // Compter manuellement les animés pour chaque genre
    const genresWithCount = await Promise.all(
      genres.map(async (genre) => {
        const animeCount = await prisma.animeGenre.count({
          where: { genreId: genre.id },
        });
        return {
          ...genre,
          _count: { animes: animeCount },
        };
      })
    );

    res.status(httpStatusCodes.OK).json({
      success: true,
      data: { genres: genresWithCount },
    });
  } catch (error) {
    next(error);
  }
};

// Animes en vedette (mieux notés)
const getFeaturedAnimes = async (req, res, next) => {
  try {
    const animes = await prisma.anime.findMany({
      where: {
        statutModeration: 'VALIDE',
        noteMoyenne: {
          gte: 7,
        },
      },
      take: 10,
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
        _count: {
          select: {
            avis: true,
          },
        },
      },
      orderBy: {
        noteMoyenne: 'desc',
      },
    });

    res.status(httpStatusCodes.OK).json({
      success: true,
      data: { animes },
    });
  } catch (error) {
    next(error);
  }
};

// Derniers animes ajoutés
const getRecentAnimes = async (req, res, next) => {
  try {
    const animes = await prisma.anime.findMany({
      where: {
        statutModeration: 'VALIDE',
      },
      take: 10,
      include: {
        genres: {
          include: {
            genre: true,
          },
        },
      },
      orderBy: {
        dateAjout: 'desc',
      },
    });

    res.status(httpStatusCodes.OK).json({
      success: true,
      data: { animes },
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer les épisodes d'un anime depuis Jikan
// On mappe les épisodes sur les saisons grâce au nombre d'épisodes par saison
const getAnimeEpisodes = async (req, res, next) => {
  try {
    const { id: slug } = req.params;

    // 1. On récupère l'anime pour avoir son malId et ses saisons
    const anime = await prisma.anime.findUnique({
      where: { slug },
      select: {
        malId: true,
        titreVf: true,
        saisons: {
          orderBy: { numeroSaison: 'asc' },
          select: { numeroSaison: true, nombreEpisodes: true },
        },
      },
    });

    if (!anime) throw new HttpNotFoundError('Anime introuvable');

    // 2. Si pas de malId, on ne peut pas aller chercher chez Jikan
    if (!anime.malId) {
      return res.status(httpStatusCodes.OK).json({
        success: true,
        data: { saisons: [], message: "Cet anime n'a pas d'identifiant Jikan" },
      });
    }

    // 3. On récupère tous les épisodes depuis Jikan via le service partagé
    const tousLesEpisodes = await getAnimeEpisodesFromJikan(anime.malId);

    // 4. On distribue les épisodes dans chaque saison
    // Exemple : saison 1 = 13 épisodes → épisodes 1 à 13
    //           saison 2 = 12 épisodes → épisodes 14 à 25
    let episodeOffset = 0;
    const saisons = anime.saisons.map((saison) => {
      const debut = episodeOffset;
      const fin = episodeOffset + saison.nombreEpisodes;

      const episodes = tousLesEpisodes
        .slice(debut, fin)
        .map((ep) => ({
          numero: ep.mal_id,
          titre: ep.title || `Épisode ${ep.mal_id}`,
          titreFr: ep.title_romanji || null,
        }));

      episodeOffset = fin;

      return {
        numeroSaison: saison.numeroSaison,
        episodes,
      };
    });

    res.status(httpStatusCodes.OK).json({
      success: true,
      data: { saisons },
    });
  } catch (error) {
    next(error);
  }
};

export {
  getAllAnimes,
  getAnimeById,
  getAllGenres,
  getFeaturedAnimes,
  getRecentAnimes,
  getAnimeEpisodes,
};