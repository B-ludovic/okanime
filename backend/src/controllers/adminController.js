import { asyncHandler } from '../middlewares/errorHandler.js';
import { createAnimeSchema, updateAnimeSchema, createSaisonSchema, validateData } from '../validators/animeValidator.js';
import { HttpNotFoundError, HttpBadRequestError, HttpForbiddenError, HttpConflictError, httpStatusCodes } from '../utils/httpErrors.js';
import { uploadPoster, deleteFromCloudinary } from '../services/uploadService.js';
import { getAnimeDetailsFromJikan, getEpisodesCountFromJikan } from '../services/jikanService.js';
import { translateToFrench } from '../services/translationService.js';
import { generateSlug } from '../utils/slugUtils.js';
import prisma from '../config/prisma.js';

// GESTION DES ANIMÉS 

// CRÉER UN ANIME MANUELLEMENT - POST /api/admin/animes
const createAnime = asyncHandler(async (req, res) => {
  const { titreVf, synopsis, anneeDebut, studio, genreIds, posterUrl, malId } = req.body;

  // Parse genreIds si c'est une string, sinon utilise directement
  const parsedGenreIds = typeof genreIds === 'string' ? JSON.parse(genreIds) : genreIds;

  // Traduit le synopsis en français si DeepL est configuré
  let finalSynopsis = synopsis;
  if (synopsis && process.env.DEEPL_API_KEY) {
    console.log('Traduction du synopsis en français...');
    finalSynopsis = await translateToFrench(synopsis);
  }

  // Validation
  const validatedData = createAnimeSchema.parse({
    titreVf,
    synopsis: finalSynopsis,
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

  // Tous les animes sont VALIDES par défaut (visibles immédiatement)
  // Mais seuls les animes créés par ADMIN sont vérifiés automatiquement
  const statutModeration = 'VALIDE';
  const verifie = req.user.role === 'ADMIN'; // true si admin, false si user

  // Vérifie si le malId existe déjà dans la base
  if (malId) {
    const existingAnime = await prisma.anime.findUnique({
      where: { malId: parseInt(malId) },
      select: { id: true, titreVf: true }
    });

    if (existingAnime) {
      throw new HttpConflictError(`Cet anime existe déjà dans la base de données : "${existingAnime.titreVf}"`);
    }
  }

  // Vérifie si un anime avec le même titre existe déjà (insensible à la casse)
  const existingByTitle = await prisma.anime.findFirst({
    where: { titreVf: { equals: validatedData.titreVf, mode: 'insensitive' } },
    select: { id: true, titreVf: true }
  });

  if (existingByTitle) {
    throw new HttpConflictError(`Un anime avec ce titre existe déjà : "${existingByTitle.titreVf}"`);
  }

  // Récupère le nombre d'épisodes depuis Jikan si malId est fourni
  let nombreEpisodes = 12; // Valeur par défaut
  if (malId) {
    try {
      // Utilise la fonction spécialisée pour récupérer le nombre d'épisodes
      nombreEpisodes = await getEpisodesCountFromJikan(parseInt(malId));
      console.log(`📊 Nombre d'épisodes récupéré: ${nombreEpisodes}`);
    } catch (error) {
      console.warn('⚠️ Impossible de récupérer le nombre d\'épisodes depuis Jikan, utilisation de 12 par défaut');
    }
  }

  // Crée l'anime avec une saison par défaut
  const anime = await prisma.anime.create({
    data: {
      titreVf: validatedData.titreVf,
      slug: generateSlug(validatedData.titreVf),
      synopsis: validatedData.synopsis,
      anneeDebut: validatedData.anneeDebut,
      studio: validatedData.studio,
      posterUrl: finalPosterUrl,
      statutModeration,
      verifie, // Vérifié auto si admin, sinon nécessite vérification
      userIdAjout: req.user.id,
      malId: malId ? parseInt(malId) : null,
      genres: {
        create: validatedData.genreIds.map((genreId) => ({
          genre: { connect: { id: genreId } },
        })),
      },
      saisons: {
        create: {
          numeroSaison: 1,
          titreSaison: 'Saison 1',
          nombreEpisodes: nombreEpisodes,
          annee: validatedData.anneeDebut,
          statut: 'EN_COURS',
        },
      },
    },
    include: {
      genres: {
        include: {
          genre: true,
        },
      },
      saisons: true,
    },
  });

  res.status(httpStatusCodes.CREATED).json({
    success: true,
    message: 'Anime créé avec succès et visible immédiatement (saison par défaut ajoutée)',
    anime,
  });
});

// MODIFIER UN ANIME - PUT /api/admin/animes/:id
const updateAnime = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  // Parse les données du FormData (conversion des strings en types appropriés)
  const parsedData = {
    ...req.body,
    anneeDebut: req.body.anneeDebut ? parseInt(req.body.anneeDebut, 10) : undefined,
    genreIds: req.body.genreIds ? JSON.parse(req.body.genreIds) : undefined,
  };

  // Traduit le synopsis en français si modifié et si DeepL est configuré
  if (parsedData.synopsis && process.env.DEEPL_API_KEY) {
    console.log('🌐 Traduction du synopsis en français...');
    parsedData.synopsis = await translateToFrench(parsedData.synopsis);
  }

  // Valide les données
  const validatedData = validateData(updateAnimeSchema, parsedData);

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
  if (req.file) {
    // Supprime l'ancien poster de Cloudinary si c'est une URL Cloudinary
    if (anime.posterUrl && anime.posterUrl.includes('cloudinary')) {
      await deleteFromCloudinary(anime.posterUrl);
    }
    posterUrl = await uploadPoster(req.file.buffer);
  } else if (req.body.posterUrl) {
    // Si une URL de poster est fournie (depuis Jikan par exemple)
    posterUrl = req.body.posterUrl;
  }

  // Mise à jour de l'anime
  // Nettoie les valeurs undefined pour Prisma
  const dataToUpdate = Object.fromEntries(
    Object.entries(validatedData).filter(([_, value]) => value !== undefined)
  );
  
  // Retire genreIds de dataToUpdate car on le gère séparément
  const { genreIds, ...animeData } = dataToUpdate;

  const updatedAnime = await prisma.anime.update({
    where: { id },
    data: {
      ...animeData,
      posterUrl,
      // Mise à jour des genres si fournis
      ...(genreIds && genreIds.length > 0 && {
        genres: {
          deleteMany: {}, // Supprime toutes les anciennes relations
          create: genreIds.map(genreId => ({
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

// RÉCUPÉRER LES ANIMÉS EN ATTENTE DE VÉRIFICATION - GET /api/admin/animes/pending
const getPendingAnimes = asyncHandler(async (req, res) => {
  // Récupère tous les animes VALIDES mais pas encore vérifiés
  // (créés par des users, visibles mais à vérifier par admin)
  const animes = await prisma.anime.findMany({
    where: {
      statutModeration: 'VALIDE',
      verifie: false // Pas encore vérifiés définitivement
    },
    include: {
      userAjout: {
        select: {
          id: true,
          username: true,
          email: true,
          role: true
        }
      },
      genres: {
        include: {
          genre: true
        }
      },
      saisons: true
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

  // Met à jour le statut de modération ET marque comme vérifié
  // Si l'admin valide l'anime, il est considéré comme vérifié définitivement
  const updatedAnime = await prisma.anime.update({
    where: { id },
    data: {
      statutModeration: statut,
      verifie: statut === 'VALIDE' // Vérifié seulement si validé, pas si refusé
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
    where: { 
      statutModeration: 'VALIDE',
      verifie: true // Validés ET vérifiés définitivement
    }
  });
  
  // En attente = animés visibles mais pas encore vérifiés par un admin
  // (créés par des users, besoin de vérification)
  const animesEnAttente = await prisma.anime.count({
    where: { 
      statutModeration: 'VALIDE',
      verifie: false // Visible mais pas vérifié
    }
  });
  
  const animesRefuses = await prisma.anime.count({
    where: { statutModeration: 'REFUSE' }
  });

  // Compte le nombre total d'avis
  const totalAvis = await prisma.avis.count();

  // Compte le nombre de saisons
  const totalSaisons = await prisma.saison.count();

  // Compte le nombre de messages de contact
  const totalMessages = await prisma.message.count();

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
        totalSaisons,
        totalMessages
      }
    }
  });
});

// LISTE COMPLÈTE DES ANIMÉS (admin) - GET /api/admin/animes
const getAllAnimesAdmin = asyncHandler(async (req, res) => {
  const { query, page = '1', limit = '20', statut } = req.query;

  const pageNumber = Math.max(1, parseInt(page) || 1);
  const limitNumber = Math.min(50, Math.max(1, parseInt(limit) || 20));
  const skip = (pageNumber - 1) * limitNumber;

  const where = {};

  if (query) {
    where.titreVf = { contains: query, mode: 'insensitive' };
  }

  if (statut && ['VALIDE', 'EN_ATTENTE', 'REFUSE'].includes(statut)) {
    where.statutModeration = statut;
  }

  const [total, animes] = await Promise.all([
    prisma.anime.count({ where }),
    prisma.anime.findMany({
      where,
      skip,
      take: limitNumber,
      include: {
        genres: { include: { genre: true } },
        userAjout: { select: { id: true, username: true } },
      },
      orderBy: { dateAjout: 'desc' },
    }),
  ]);

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
      isSuperAdmin: true,
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

  // Empêche de modifier le super admin
  if (user.isSuperAdmin) {
    throw new HttpForbiddenError('Impossible de modifier le rôle du super administrateur');
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

// Supprimer un utilisateur
const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Vérifie que l'utilisateur existe
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new HttpNotFoundError('Utilisateur introuvable');
  }

  // Empêche de supprimer le super admin
  if (user.isSuperAdmin) {
    throw new HttpForbiddenError('Impossible de supprimer le super administrateur');
  }

  // Empêche de se supprimer soi-même
  if (user.id === req.user.id) {
    throw new HttpForbiddenError('Vous ne pouvez pas supprimer votre propre compte');
  }

  // Supprime l'avatar de Cloudinary s'il existe
  if (user.avatar && user.avatar.includes('cloudinary')) {
    await deleteFromCloudinary(user.avatar);
  }

  // Supprime l'utilisateur (cascade supprime aussi bibliotheque, avis, etc.)
  await prisma.user.delete({
    where: { id: userId },
  });

  res.status(httpStatusCodes.OK).json({
    success: true,
    message: 'Utilisateur supprimé avec succès',
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

// GESTION DES AVIS (ADMIN UNIQUEMENT)

// RÉCUPÉRER TOUS LES AVIS - GET /api/admin/avis
const getAllAvis = asyncHandler(async (req, res) => {
  const avis = await prisma.avis.findMany({
    include: {
      user: {
        select: {
          id: true,
          username: true,
          email: true,
        },
      },
      anime: {
        select: {
          id: true,
          titreVf: true,
          posterUrl: true,
        },
      },
    },
    orderBy: {
      dateCreation: 'desc',
    },
  });

  res.status(httpStatusCodes.OK).json({
    success: true,
    data: { avis },
  });
});

// SUPPRIMER UN AVIS - DELETE /api/admin/avis/:id
const deleteAvis = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Vérifie que l'avis existe
  const avis = await prisma.avis.findUnique({
    where: { id },
  });

  if (!avis) {
    throw new HttpNotFoundError('Avis introuvable');
  }

  const animeId = avis.animeId;

  // Supprime l'avis
  await prisma.avis.delete({
    where: { id },
  });

  // Recalcule la note moyenne de l'anime
  const allAvis = await prisma.avis.findMany({
    where: { animeId },
    select: { note: true },
  });

  let noteMoyenne = 0;
  if (allAvis.length > 0) {
    const total = allAvis.reduce((sum, a) => sum + a.note, 0);
    noteMoyenne = Math.round((total / allAvis.length) * 10) / 10;
  }

  await prisma.anime.update({
    where: { id: animeId },
    data: { noteMoyenne },
  });

  res.status(httpStatusCodes.OK).json({
    success: true,
    message: 'Avis supprimé avec succès',
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
  deleteUser,
  getAllAvis,
  deleteAvis,
  getAllAnimesAdmin,
};