import { asyncHandler } from '../middlewares/errorHandler.js';
import { createAnimeSchema, updateAnimeSchema, createSaisonSchema, validateData } from '../validators/animeValidator.js';
import { HttpNotFoundError, HttpBadRequestError, HttpForbiddenError, HttpConflictError, httpStatusCodes } from '../utils/httpErrors.js';
import { uploadPoster, deleteFromCloudinary } from '../services/uploadService.js';
import prisma from '../config/prisma.js';

// GESTION DES ANIMÉS 

// CRÉER UN ANIME MANUELLEMENT - POST /api/admin/animes
const createAnime = asyncHandler(async (req, res) => {
  const { titreVf, synopsis, anneeDebut, studio, genreIds, posterUrl, bannerGradient } = req.body;

  // Parse genreIds si c'est une string, sinon utilise directement
  const parsedGenreIds = typeof genreIds === 'string' ? JSON.parse(genreIds) : genreIds;

  // Validation
  const validatedData = createAnimeSchema.parse({
    titreVf,
    synopsis,
    anneeDebut: parseInt(anneeDebut),
    studio,
    genreIds: parsedGenreIds,
  });

  // Gestion du poster
  let finalPosterUrl;
  if (posterUrl) {
    // Poster depuis Jikan (URL directe)
    finalPosterUrl = posterUrl;
  } else if (req.file) {
    // Poster uploadé
    finalPosterUrl = await uploadPoster(req.file.buffer);
  } else {
    throw new HttpBadRequestError('Le poster est obligatoire');
  }

  // Gestion de la bannière (gradient uniquement, obligatoire)
  if (!bannerGradient) {
    throw new HttpBadRequestError('La bannière est obligatoire');
  }
  
  const banniereUrl = `gradient-${bannerGradient}`;

  // Tous les animes sont VALIDES par défaut (visibles immédiatement)
  // L'admin peut les modérer après coup si nécessaire
  const statutModeration = 'VALIDE';

  // Crée l'anime
  const anime = await prisma.anime.create({
    data: {
      titreVf: validatedData.titreVf,
      synopsis: validatedData.synopsis,
      anneeDebut: validatedData.anneeDebut,
      studio: validatedData.studio,
      posterUrl: finalPosterUrl,
      banniereUrl,
      statutModeration,
      userIdAjout: req.user.id,
      genres: {
        create: validatedData.genreIds.map((genreId) => ({
          genre: { connect: { id: genreId } },
        })),
      },
    },
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
    },
  });

  res.status(httpStatusCodes.CREATED).json({
    success: true,
    message: 'Anime créé avec succès et visible immédiatement',
    anime,
  });
});

// MODIFIER UN ANIME - PUT /api/admin/animes/:id
const updateAnime = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Valide les données
  const validatedData = validateData(updateAnimeSchema, req.body);

  // Vérifie que l'anime existe
  const anime = await prisma.anime.findUnique({
    where: { id }
  });

  if (!anime) {
    throw new HttpNotFoundError('Anime introuvable');
  }

  // Vérifie les permissions : créateur ou admin
  if (anime.userIdAjout !== req.user.id && req.user.role !== 'ADMIN') {
    throw new HttpForbiddenError('Vous n\'avez pas les permissions pour modifier cet anime');
  }

  // Upload du nouveau poster si fourni
  let posterUrl = anime.posterUrl;
  if (req.files && req.files.poster) {
    // Supprime l'ancien poster de Cloudinary si c'est une URL Cloudinary
    if (anime.posterUrl && anime.posterUrl.includes('cloudinary')) {
      await deleteFromCloudinary(anime.posterUrl);
    }
    posterUrl = await uploadPoster(req.files.poster[0].buffer);
  }

  // Gestion de la bannière gradient
  let banniereUrl = anime.banniereUrl;
  if (req.body.bannerGradient) {
    banniereUrl = `gradient-${req.body.bannerGradient}`;
  }

  // Mise à jour de l'anime
  const updatedAnime = await prisma.anime.update({
    where: { id },
    data: {
      ...validatedData,
      posterUrl,
      banniereUrl,
      // Mise à jour des genres si fournis
      ...(validatedData.genreIds && {
        genres: {
          deleteMany: {}, // Supprime toutes les anciennes relations
          create: validatedData.genreIds.map(genreId => ({
            genre: {
              connect: { id: genreId }
            }
          }))
        }
      })
    },
    include: {
      genres: {
        include: {
          genre: true
        }
      }
    }
  });

  res.status(httpStatusCodes.OK).json({
    success: true,
    message: 'Anime modifié avec succès',
    data: { anime: updatedAnime }
  });
});

// SUPPRIMER UN ANIME - DELETE /api/admin/animes/:id
const deleteAnime = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Vérifie que l'anime existe
  const anime = await prisma.anime.findUnique({
    where: { id }
  });

  if (!anime) {
    throw new HttpNotFoundError('Anime introuvable');
  }

  // Vérifie les permissions : créateur ou admin
  if (anime.userIdAjout !== req.user.id && req.user.role !== 'ADMIN') {
    throw new HttpForbiddenError('Vous n\'avez pas les permissions pour supprimer cet anime');
  }

  // Supprime les images de Cloudinary (sauf les bannières gradient)
  if (anime.posterUrl && anime.posterUrl.includes('cloudinary')) {
    await deleteFromCloudinary(anime.posterUrl);
  }
  // Les bannières gradient ne sont pas sur Cloudinary, pas besoin de les supprimer

  // Supprime l'anime (cascade supprime aussi saisons, avis, etc.)
  await prisma.anime.delete({
    where: { id }
  });

  res.status(httpStatusCodes.OK).json({
    success: true,
    message: 'Anime supprimé avec succès'
  });
});

// GESTION DES SAISONS 

// AJOUTER UNE SAISON À UN ANIME - POST /api/admin/animes/:animeId/saisons
const addSaison = asyncHandler(async (req, res) => {
  const { animeId } = req.params;

  // Valide les données
  const validatedData = validateData(createSaisonSchema, req.body);

  // Vérifie que l'anime existe
  const anime = await prisma.anime.findUnique({
    where: { id: animeId }
  });

  if (!anime) {
    throw new HttpNotFoundError('Anime introuvable');
  }

  // Vérifie les permissions : créateur ou admin
  if (anime.userIdAjout !== req.user.id && req.user.role !== 'ADMIN') {
    throw new HttpForbiddenError('Vous n\'avez pas les permissions pour ajouter une saison à cet anime');
  }

  // Crée la saison
  const saison = await prisma.saison.create({
    data: {
      ...validatedData,
      animeId
    }
  });

  res.status(httpStatusCodes.CREATED).json({
    success: true,
    message: 'Saison ajoutée avec succès',
    data: { saison }
  });
});

// MODIFIER UNE SAISON - PUT /api/admin/saisons/:id
const updateSaison = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Valide les données
  const validatedData = validateData(createSaisonSchema, req.body);

  // Vérifie que la saison existe
  const saison = await prisma.saison.findUnique({
    where: { id },
    include: {
      anime: true // On a besoin de l'anime pour vérifier le créateur
    }
  });

  if (!saison) {
    throw new HttpNotFoundError('Saison introuvable');
  }

  // Vérifie les permissions : créateur ou admin
  if (saison.anime.userIdAjout !== req.user.id && req.user.role !== 'ADMIN') {
    throw new HttpForbiddenError('Vous n\'avez pas les permissions pour modifier cette saison');
  }

  // Met à jour la saison
  const updatedSaison = await prisma.saison.update({
    where: { id },
    data: validatedData
  });

  res.status(httpStatusCodes.OK).json({
    success: true,
    message: 'Saison modifiée avec succès',
    data: { saison: updatedSaison }
  });
});

// SUPPRIMER UNE SAISON - DELETE /api/admin/saisons/:id
const deleteSaison = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Vérifie que la saison existe
  const saison = await prisma.saison.findUnique({
    where: { id },
    include: {
      anime: true // On a besoin de l'anime pour vérifier le créateur
    }
  });

  if (!saison) {
    throw new HttpNotFoundError('Saison introuvable');
  }

  // Vérifie les permissions : créateur ou admin
  if (saison.anime.userIdAjout !== req.user.id && req.user.role !== 'ADMIN') {
    throw new HttpForbiddenError('Vous n\'avez pas les permissions pour supprimer cette saison');
  }

  // Supprime la saison
  await prisma.saison.delete({
    where: { id }
  });

  res.status(httpStatusCodes.OK).json({
    success: true,
    message: 'Saison supprimée avec succès'
  });
});

// MODÉRATION 

// RÉCUPÉRER LES ANIMÉS EN ATTENTE - GET /api/admin/animes/pending
const getPendingAnimes = asyncHandler(async (req, res) => {
  const animes = await prisma.anime.findMany({
    where: {
      statutModeration: 'EN_ATTENTE'
    },
    include: {
      userAjout: {
        select: {
          id: true,
          username: true,
          email: true
        }
      },
      genres: {
        include: {
          genre: true
        }
      }
    },
    orderBy: {
      dateAjout: 'asc' // Les plus anciens en premier
    }
  });

  res.status(httpStatusCodes.OK).json({
    success: true,
    data: { animes }
  });
});

// MODÉRER UN ANIME - PUT /api/admin/animes/:id/moderation
const moderateAnime = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { statut } = req.body;

  // Vérifie que le statut est valide
  if (!['VALIDE', 'REFUSE'].includes(statut)) {
    throw new HttpBadRequestError('Statut invalide. Utilisez VALIDE ou REFUSE');
  }

  // Vérifie que l'anime existe
  const anime = await prisma.anime.findUnique({
    where: { id }
  });

  if (!anime) {
    throw new HttpNotFoundError('Anime introuvable');
  }

  // Met à jour le statut de modération
  const updatedAnime = await prisma.anime.update({
    where: { id },
    data: {
      statutModeration: statut
    }
  });

  res.status(httpStatusCodes.OK).json({
    success: true,
    message: `Anime ${statut === 'VALIDE' ? 'validé' : 'refusé'} avec succès`,
    data: { anime: updatedAnime }
  });
});

// GESTION DES AVATARS UTILISATEURS 

// SUPPRIMER L'AVATAR D'UN UTILISATEUR - DELETE /api/admin/users/:userId/avatar
const deleteUserAvatar = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Vérifie que l'utilisateur existe
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });

  if (!user) {
    throw new HttpNotFoundError('Utilisateur introuvable');
  }

  if (!user.avatar) {
    throw new HttpBadRequestError('Cet utilisateur n\'a pas d\'avatar');
  }

  // Supprime l'avatar de Cloudinary
  await deleteFromCloudinary(user.avatar);

  // Met à jour l'utilisateur
  await prisma.user.update({
    where: { id: userId },
    data: {
      avatar: null
    }
  });

  res.status(httpStatusCodes.OK).json({
    success: true,
    message: 'Avatar supprimé avec succès'
  });
});

// STATISTIQUES ADMIN 

// RÉCUPÉRER LES STATISTIQUES - GET /api/admin/stats
const getStats = asyncHandler(async (req, res) => {
  // Compte le nombre total d'utilisateurs
  const totalUsers = await prisma.user.count();

  // Compte le nombre d'animés par statut
  const totalAnimes = await prisma.anime.count();
  const animesValides = await prisma.anime.count({
    where: { statutModeration: 'VALIDE' }
  });
  const animesEnAttente = await prisma.anime.count({
    where: { statutModeration: 'EN_ATTENTE' }
  });
  const animesRefuses = await prisma.anime.count({
    where: { statutModeration: 'REFUSE' }
  });

  // Compte le nombre total d'avis
  const totalAvis = await prisma.avis.count();

  // Compte le nombre de saisons
  const totalSaisons = await prisma.saison.count();

  res.status(httpStatusCodes.OK).json({
    success: true,
    data: {
      stats: {
        totalUsers,
        totalAnimes,
        animesValides,
        animesEnAttente,
        animesRefuses,
        totalAvis,
        totalSaisons
      }
    }
  });
});

// GESTION DES UTILISATEURS 

// Récupère tous les utilisateurs
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      dateInscription: true,
      avatar: true,
    },
    orderBy: {
      dateInscription: 'desc',
    },
  });

  res.status(httpStatusCodes.OK).json({
    success: true,
    users,
  });
});

// Change le rôle d'un utilisateur
const changeUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  // Validation du rôle
  if (!['USER', 'ADMIN'].includes(role)) {
    throw new HttpBadRequestError('Rôle invalide');
  }

  // Vérifie que l'utilisateur existe
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new HttpNotFoundError('Utilisateur introuvable');
  }

  // Empêche de changer son propre rôle
  if (user.id === req.user.id) {
    throw new HttpForbiddenError('Vous ne pouvez pas modifier votre propre rôle');
  }

  // Met à jour le rôle
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });

  res.status(httpStatusCodes.OK).json({
    success: true,
    message: `Rôle changé en ${role}`,
    user: updatedUser,
  });
});

// GESTION DES GENRES 

// Créer un nouveau genre
const createGenre = asyncHandler(async (req, res) => {
  const { nom } = req.body;

  if (!nom || nom.trim().length === 0) {
    throw new HttpBadRequestError('Le nom du genre est requis');
  }

  // Vérifie que le genre n'existe pas déjà
  const existingGenre = await prisma.genre.findFirst({
    where: {
      nom: {
        equals: nom.trim(),
        mode: 'insensitive',
      },
    },
  });

  if (existingGenre) {
    throw new HttpConflictError('Ce genre existe déjà');
  }

  // Crée le genre
  const genre = await prisma.genre.create({
    data: {
      nom: nom.trim(),
    },
  });

  res.status(httpStatusCodes.CREATED).json({
    success: true,
    message: 'Genre créé avec succès',
    genre,
  });
});

// Modifier un genre
const updateGenre = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { nom } = req.body;

  if (!nom || nom.trim().length === 0) {
    throw new HttpBadRequestError('Le nom du genre est requis');
  }

  // Vérifie que le genre existe
  const existingGenre = await prisma.genre.findUnique({
    where: { id },
  });

  if (!existingGenre) {
    throw new HttpNotFoundError('Genre introuvable');
  }

  // Vérifie qu'un autre genre n'a pas déjà ce nom
  const duplicateGenre = await prisma.genre.findFirst({
    where: {
      nom: {
        equals: nom.trim(),
        mode: 'insensitive',
      },
      id: {
        not: id,
      },
    },
  });

  if (duplicateGenre) {
    throw new HttpConflictError('Un autre genre avec ce nom existe déjà');
  }

  // Met à jour le genre
  const genre = await prisma.genre.update({
    where: { id },
    data: {
      nom: nom.trim(),
    },
  });

  res.status(httpStatusCodes.OK).json({
    success: true,
    message: 'Genre modifié avec succès',
    genre,
  });
});

// Supprimer un genre
const deleteGenre = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Vérifie que le genre existe
  const existingGenre = await prisma.genre.findUnique({
    where: { id },
    include: {
      _count: {
        select: { animes: true },
      },
    },
  });

  if (!existingGenre) {
    throw new HttpNotFoundError('Genre introuvable');
  }

  // Avertissement si le genre est utilisé
  if (existingGenre._count.animes > 0) {
    // On supprime quand même, mais ça supprimera les relations dans AnimeGenre
    // grâce au onDelete: Cascade dans le schema Prisma
  }

  // Supprime le genre
  await prisma.genre.delete({
    where: { id },
  });

  res.status(httpStatusCodes.OK).json({
    success: true,
    message: 'Genre supprimé avec succès',
  });
});

export {
  createAnime,
  updateAnime,
  deleteAnime,
  addSaison,
  updateSaison,
  deleteSaison,
  getPendingAnimes,
  moderateAnime,
  deleteUserAvatar,
  getStats,
  createGenre,
  updateGenre,
  deleteGenre,
  getAllUsers,
  changeUserRole,
};