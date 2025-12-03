import prisma from '../config/prisma.js';
import { HttpNotFoundError, httpStatusCodes } from '../utils/httpErrors.js';
import { getAnimeVideosFromJikan } from '../services/jikanService.js';

// Récupérer tous les animes (avec recherche et filtres)
const getAllAnimes = async (req, res, next) => {
  try {
    const { query, genre, page = '1', limit = '20', sort } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Filtres de recherche
    const where = {
      statutModeration: 'VALIDE',
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

// Récupérer un anime par ID
const getAnimeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const anime = await prisma.anime.findUnique({
      where: { id },
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

export {
  getAllAnimes,
  getAnimeById,
  getAllGenres,
  getFeaturedAnimes,
  getRecentAnimes,
};