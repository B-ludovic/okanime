import { asyncHandler } from '../middlewares/errorHandler.js';
import { createAnimeSchema, updateAnimeSchema, createSaisonSchema, validateData } from '../validators/animeValidator.js';
import { HttpNotFoundError, HttpBadRequestError, httpStatusCodes } from '../utils/httpErrors.js';
import { uploadPoster, uploadBanniere, deleteFromCloudinary } from '../services/uploadService.js';
import prisma from '../config/prisma.js';

// GESTION DES ANIMÉS 

// CRÉER UN ANIME MANUELLEMENT - POST /api/admin/animes
const createAnime = asyncHandler(async (req, res) => {
  // Valide les données
  const validatedData = validateData(createAnimeSchema, req.body);
  const { titreVf, synopsis, anneeDebut, studio, genreIds } = validatedData;

  // Upload du poster (obligatoire pour ajout manuel)
  let posterUrl = null;
  if (req.files && req.files.poster) {
    posterUrl = await uploadPoster(req.files.poster[0].buffer);
  } else {
    throw new HttpBadRequestError('Le poster est obligatoire');
  }

  // Upload de la bannière (optionnel)
  let banniereUrl = null;
  if (req.files && req.files.banniere) {
    banniereUrl = await uploadBanniere(req.files.banniere[0].buffer);
  }

  // Crée l'anime
  const anime = await prisma.anime.create({
    data: {
      titreVf,
      synopsis,
      anneeDebut,
      studio,
      posterUrl,
      banniereUrl,
      statutModeration: 'VALIDE', // Admin ajoute = validé directement
      userIdAjout: req.user.id, // L'admin qui a ajouté
      genres: {
        create: genreIds.map(genreId => ({
          genre: {
            connect: { id: genreId }
          }
        }))
      }
    },
    include: {
      genres: {
        include: {
          genre: true
        }
      }
    }
  });

  res.status(httpStatusCodes.CREATED).json({
    success: true,
    message: 'Anime créé avec succès',
    data: { anime }
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

  // Upload du nouveau poster si fourni
  let posterUrl = anime.posterUrl;
  if (req.files && req.files.poster) {
    // Supprime l'ancien poster de Cloudinary
    if (anime.posterUrl) {
      await deleteFromCloudinary(anime.posterUrl);
    }
    posterUrl = await uploadPoster(req.files.poster[0].buffer);
  }

  // Upload de la nouvelle bannière si fournie
  let banniereUrl = anime.banniereUrl;
  if (req.files && req.files.banniere) {
    if (anime.banniereUrl) {
      await deleteFromCloudinary(anime.banniereUrl);
    }
    banniereUrl = await uploadBanniere(req.files.banniere[0].buffer);
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

  // Supprime les images de Cloudinary
  if (anime.posterUrl) {
    await deleteFromCloudinary(anime.posterUrl);
  }
  if (anime.banniereUrl) {
    await deleteFromCloudinary(anime.banniereUrl);
  }

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
    where: { id }
  });

  if (!saison) {
    throw new HttpNotFoundError('Saison introuvable');
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
    where: { id }
  });

  if (!saison) {
    throw new HttpNotFoundError('Saison introuvable');
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
};