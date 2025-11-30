import prisma from '../config/prisma.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { httpStatusCodes, HttpNotFoundError, HttpConflictError, HttpBadRequestError, HttpForbiddenError } from '../utils/httpErrors.js';


// BIBLIOTHÈQUE - Gestion de la liste personnelle


// Récupérer ma bibliothèque
// GET /api/bibliotheque
const getMaBibliotheque = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const bibliotheque = await prisma.bibliotheque.findMany({
    where: {
      userId: userId,
    },
    include: {
      saison: {
        include: {
          anime: {
            include: {
              genres: {
                include: {
                  genre: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      dateAjout: 'desc',
    },
  });

  res.status(httpStatusCodes.OK).json({
    success: true,
    data: { bibliotheque },
  });
});

// Ajouter une saison à ma bibliothèque
// POST /api/bibliotheque
const addToBibliotheque = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { saisonId, statut, progressionEpisodes } = req.body;

  // Vérifie que la saison existe
  const saison = await prisma.saison.findUnique({
    where: { id: saisonId },
  });

  if (!saison) {
    throw new HttpNotFoundError('Saison introuvable');
  }

  // Vérifie si déjà dans la bibliothèque
  const existingEntry = await prisma.bibliotheque.findUnique({
    where: {
      userId_saisonId: {
        userId: userId,
        saisonId: saisonId,
      },
    },
  });

  if (existingEntry) {
    throw new HttpConflictError('Cette saison est déjà dans votre bibliothèque');
  }

  // Crée l'entrée
  const bibliothequeEntry = await prisma.bibliotheque.create({
    data: {
      userId: userId,
      saisonId: saisonId,
      statut: statut,
      progressionEpisodes: progressionEpisodes || 0,
    },
    include: {
      saison: {
        include: {
          anime: true,
        },
      },
    },
  });

  res.status(httpStatusCodes.CREATED).json({
    success: true,
    message: 'Ajouté à votre bibliothèque',
    data: { entry: bibliothequeEntry },
  });
});

// Modifier une entrée de ma bibliothèque
// PUT /api/bibliotheque/:id
const updateBibliothequeEntry = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { statut, progressionEpisodes } = req.body;

  // PROTECTION IDOR : Vérifie que l'entrée existe ET appartient bien à l'utilisateur connecté
  const entry = await prisma.bibliotheque.findUnique({
    where: { id: id },
  });

  // Si l'entrée n'existe pas
  if (!entry) {
    throw new HttpNotFoundError('Entrée introuvable dans votre bibliothèque');
  }

  // CRITIQUE : Vérifie que l'entrée appartient bien à l'utilisateur
  // Sans cette vérification, un utilisateur pourrait modifier la bibliothèque d'un autre
  if (entry.userId !== userId) {
    throw new HttpForbiddenError('Vous ne pouvez pas modifier la bibliothèque d\'un autre utilisateur');
  }

  // Met à jour
  const updatedEntry = await prisma.bibliotheque.update({
    where: { id: id },
    data: {
      statut,
      progressionEpisodes,
    },
    include: {
      saison: {
        include: {
          anime: true,
        },
      },
    },
  });

  res.status(httpStatusCodes.OK).json({
    success: true,
    message: 'Bibliothèque mise à jour',
    data: { entry: updatedEntry },
  });
});

// Retirer une saison de ma bibliothèque
// DELETE /api/bibliotheque/:id
const removeFromBibliotheque = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  // PROTECTION IDOR : Vérifie que l'entrée existe ET appartient bien à l'utilisateur connecté
  const entry = await prisma.bibliotheque.findUnique({
    where: { id: id },
  });

  // Si l'entrée n'existe pas
  if (!entry) {
    throw new HttpNotFoundError('Entrée introuvable dans votre bibliothèque');
  }

  // CRITIQUE : Vérifie que l'entrée appartient bien à l'utilisateur
  // Sans cette vérification, un utilisateur pourrait supprimer la bibliothèque d'un autre
  if (entry.userId !== userId) {
    throw new HttpForbiddenError('Vous ne pouvez pas supprimer la bibliothèque d\'un autre utilisateur');
  }

  // Supprime l'entrée
  await prisma.bibliotheque.delete({
    where: { id: id },
  });

  res.status(httpStatusCodes.OK).json({
    success: true,
    message: 'Retiré de votre bibliothèque',
  });
});

// Filtrer ma bibliothèque par statut
// GET /api/bibliotheque/statut/:statut
const filterBibliothequeByStatut = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { statut } = req.params;

  // Liste des statuts valides
  const validStatuts = ['A_VOIR', 'EN_COURS', 'VU', 'FAVORI'];

  if (!validStatuts.includes(statut)) {
    throw new HttpBadRequestError('Statut invalide');
  }

  const bibliotheque = await prisma.bibliotheque.findMany({
    where: {
      userId: userId,
      statut: statut,
    },
    include: {
      saison: {
        include: {
          anime: {
            include: {
              genres: {
                include: {
                  genre: true,
                },
              },
            },
          },
        },
      },
    },
    orderBy: {
      dateAjout: 'desc',
    },
  });

  res.status(httpStatusCodes.OK).json({
    success: true,
    data: { bibliotheque },
  });
});

export {
  getMaBibliotheque,
  addToBibliotheque,
  updateBibliothequeEntry,
  removeFromBibliotheque,
  filterBibliothequeByStatut,
};