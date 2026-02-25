import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { httpStatusCodes, HttpNotFoundError, HttpConflictError, HttpBadRequestError, HttpForbiddenError } from '../utils/httpErrors.js';

const prisma = new PrismaClient();

// Schéma de validation Zod pour le formulaire de contact
const contactSchema = z.object({
  nom: z.string().min(1, 'Le nom est requis').max(100, 'Le nom ne peut pas dépasser 100 caractères').trim(),
  email: z.string().email('Email invalide').max(254, 'Email trop long').trim(),
  sujet: z.enum(
    ['question', 'suggestion', 'bug', 'anime', 'compte', 'autre'],
    { errorMap: () => ({ message: 'Sujet invalide' }) }
  ),
  message: z
    .string()
    .min(10, 'Le message doit contenir au moins 10 caractères')
    .max(1000, 'Le message ne peut pas dépasser 1000 caractères')
    .trim(),
});

// Fonction pour créer un message de contact
// Cette fonction est appelée quand un utilisateur remplit le formulaire de contact
const createMessage = async (req, res, next) => {
  try {
    // Validation avec Zod (taille, format, enum sujet)
    const result = contactSchema.safeParse(req.body);
    if (!result.success) {
      const firstError = result.error.errors[0]?.message || 'Données invalides';
      return res.status(httpStatusCodes.BAD_REQUEST).json({
        success: false,
        error: firstError,
      });
    }

    const { nom, email, sujet, message } = result.data;

    // On crée le message dans la base de données
    const newMessage = await prisma.message.create({
      data: {
        nom,
        email,
        sujet,
        message,
        // lu est false par défaut (défini dans le schéma Prisma)
        // dateCreation est automatique (défini dans le schéma Prisma)
      },
    });

    // On renvoie une réponse de succès avec le message créé
    res.status(httpStatusCodes.CREATED).json({
      success: true,
      message: 'Message envoyé avec succès',
      data: {
        id: newMessage.id,
        dateCreation: newMessage.dateCreation,
      },
    });
  } catch (error) {
    // En cas d'erreur, on log et on passe au middleware d'erreur
    console.error('Erreur lors de la création du message:', error);
    next(error);
  }
};

// Fonction pour récupérer tous les messages (admin uniquement)
// Cette fonction renvoie la liste complète des messages pour l'admin
const getAllMessages = async (req, res, next) => {
  try {
    // On récupère tous les messages, triés du plus récent au plus ancien
    const messages = await prisma.message.findMany({
      orderBy: {
        dateCreation: 'desc', // Les plus récents en premier
      },
    });

    // On renvoie les messages
    res.status(httpStatusCodes.OK).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    next(error);
  }
};

// Fonction pour marquer un message comme lu ou non lu
// L'admin peut changer le statut "lu" d'un message
const toggleReadStatus = async (req, res, next) => {
  try {
    const { id } = req.params; // ID du message dans l'URL

    // On récupère d'abord le message pour connaître son statut actuel
    const message = await prisma.message.findUnique({
      where: { id },
    });

    // Si le message n'existe pas, on renvoie une erreur
    if (!message) {
      return res.status(httpStatusCodes.NOT_FOUND).json({
        success: false,
        error: 'Message introuvable',
      });
    }

    // On inverse le statut "lu" : si lu = true, on met false et vice-versa
    const updatedMessage = await prisma.message.update({
      where: { id },
      data: {
        lu: !message.lu, // Inverse le statut
      },
    });

    res.status(httpStatusCodes.OK).json({
      success: true,
      message: 'Statut mis à jour',
      data: updatedMessage,
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    next(error);
  }
};

// Fonction pour supprimer un message
// L'admin peut supprimer définitivement un message
const deleteMessage = async (req, res, next) => {
  try {
    const { id } = req.params;

    // On vérifie que le message existe avant de le supprimer
    const message = await prisma.message.findUnique({
      where: { id },
    });

    if (!message) {
      return res.status(httpStatusCodes.NOT_FOUND).json({
        success: false,
        error: 'Message introuvable',
      });
    }

    // On supprime le message de la base de données
    await prisma.message.delete({
      where: { id },
    });

    res.status(httpStatusCodes.OK).json({
      success: true,
      message: 'Message supprimé avec succès',
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    next(error);
  }
};


export {
  createMessage,
  getAllMessages,
  toggleReadStatus,
  deleteMessage,
};
