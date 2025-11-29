import prisma from '../config/prisma.js';
import { httpStatusCodes } from '../utils/httpErrors.js';

// Récupérer ma bibliothèque
export const getMaBibliotheque = async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
};

// Ajouter une saison à ma bibliothèque
export const addToBibliotheque = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { saisonId, statut, progressionEpisodes } = req.body;

    // Vérifie que la saison existe
    const saison = await prisma.saison.findUnique({
      where: { id: saisonId },
    });

    if (!saison) {
      return res.status(httpStatusCodes.NOT_FOUND).json({
        success: false,
        error: 'Saison introuvable',
      });
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
      return res.status(httpStatusCodes.CONFLICT).json({
        success: false,
        error: 'Cette saison est déjà dans votre bibliothèque',
      });
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
      data: { bibliothequeEntry },
    });
  } catch (error) {
    next(error);
  }
};

// Modifier une entrée de ma bibliothèque
export const updateBibliothequeEntry = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { statut, progressionEpisodes } = req.body;

    // Vérifie que l'entrée existe et appartient à l'utilisateur
    const entry = await prisma.bibliotheque.findUnique({
      where: { id: id },
    });

    if (!entry || entry.userId !== userId) {
      return res.status(httpStatusCodes.NOT_FOUND).json({
        success: false,
        error: 'Entrée introuvable dans votre bibliothèque',
      });
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
      data: { bibliothequeEntry: updatedEntry },
    });
  } catch (error) {
    next(error);
  }
};

// Retirer une saison de ma bibliothèque
export const removeFromBibliotheque = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    // Vérifie que l'entrée existe et appartient à l'utilisateur
    const entry = await prisma.bibliotheque.findUnique({
      where: { id: id },
    });

    if (!entry || entry.userId !== userId) {
      return res.status(httpStatusCodes.NOT_FOUND).json({
        success: false,
        error: 'Entrée introuvable dans votre bibliothèque',
      });
    }

    // Supprime l'entrée
    await prisma.bibliotheque.delete({
      where: { id: id },
    });

    res.status(httpStatusCodes.OK).json({
      success: true,
      message: 'Retiré de votre bibliothèque',
    });
  } catch (error) {
    next(error);
  }
};

// Filtrer ma bibliothèque par statut
export const filterBibliothequeByStatut = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { statut } = req.params;

    // Liste des statuts valides
    const validStatuts = ['A_VOIR', 'EN_COURS', 'VU', 'FAVORI'];
    
    if (!validStatuts.includes(statut)) {
      return res.status(httpStatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Statut invalide',
      });
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
  } catch (error) {
    next(error);
  }
};