import prisma from '../config/prisma.js';
import { HttpNotFoundError, httpStatusCodes } from '../utils/httpErrors.js';

// Récupérer tous les animes (avec recherche et filtres)
export const getAllAnimes = async (req, res, next) => {
  try {
    const { q, genre, page = '1', limit = '20' } = req.query;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    // Filtres de recherche
    const where = {
      statutModeration: 'VALIDE',
    };

    // Si recherche par titre
    if (q) {
      where.titreVf = {
        contains: q,
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
      orderBy: {
        dateAjout: 'desc',
      },
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
export const getAnimeById = async (req, res, next) => {
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

    res.status(httpStatusCodes.OK).json({
      success: true,
      data: { anime },
    });
  } catch (error) {
    next(error);
  }
};

// Récupérer tous les genres
export const getAllGenres = async (req, res, next) => {
  try {
    const genres = await prisma.genre.findMany({
      orderBy: {
        nom: 'asc',
      },
    });

    res.status(httpStatusCodes.OK).json({
      success: true,
      data: { genres },
    });
  } catch (error) {
    next(error);
  }
};

// Animes en vedette (mieux notés)
export const getFeaturedAnimes = async (req, res, next) => {
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

    res.status(200).json({
      success: true,
      data: { animes },
    });
  } catch (error) {
    next(error);
  }
};

// Derniers animes ajoutés
export const getRecentAnimes = async (req, res, next) => {
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