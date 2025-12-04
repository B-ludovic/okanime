import { PrismaClient } from '@prisma/client';
import { httpStatusCodes, HttpNotFoundError, HttpConflictError, HttpBadRequestError, HttpForbiddenError } from '../utils/httpErrors.js';

const prisma = new PrismaClient();

// Fonction pour créer un message de contact
// Cette fonction est appelée quand un utilisateur remplit le formulaire de contact
const createMessage = async (req, res, next) => {
  try {
    // On récupère les données envoyées par l'utilisateur
    const { nom, email, sujet, message } = req.body;

    // Validation basique : on vérifie que tous les champs sont remplis
    if (!nom || !email || !sujet || !message) {
      return res.status(httpStatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Tous les champs sont requis',
      });
    }

    // Validation de l'email : format basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(httpStatusCodes.BAD_REQUEST).json({
        success: false,
        error: 'Email invalide',
      });
    }

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
