import { asyncHandler } from '../middlewares/errorHandler.js';
import { createAvisSchema, updateAvisSchema, validateData } from '../validators/avisValidator.js';
import { HttpNotFoundError, HttpConflictError, HttpForbiddenError, httpStatusCodes } from '../utils/httpErrors.js';
import prisma from '../config/prisma.js';

// CRÉER UN AVIS - POST /api/avis
const createAvis = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    // Valide les données
    const validatedData = validateData(createAvisSchema, req.body);
    const { animeId, note, commentaire } = validatedData;

    // Vérifie que l'anime existe et est validé
    const anime = await prisma.anime.findUnique({
        where: { id: animeId },
    });

    if (!anime) {
        throw new HttpNotFoundError('Anime introuvable');
    }

    if (anime.statutModeration !== 'VALIDE') {
        throw new HttpNotFoundError('Cet anime n\'est pas encore validé');
    }

    // Vérifie que l'utilisateur n'a pas déjà laissé un avis sur cet anime
    const existingAvis = await prisma.avis.findUnique({
        where: {
            userId_animeId: {
                userId: userId,
                animeId: animeId,
            },
        },
    });

    if (existingAvis) {
        throw new HttpConflictError('Vous avez déjà laissé un avis sur cet anime');
    }

    // Crée l'avis
    const avis = await prisma.avis.create({
        data: {
            userId: userId,
            animeId: animeId,
            note: note,
            commentaire: commentaire,
        },
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                },
            },
            anime: {
                select: {
                    id: true,
                    titreVf: true,
                },
            },
        },
    });

    // Recalcule la note moyenne de l'anime
    await updateAnimeMoyenne(animeId);

    res.status(httpStatusCodes.CREATED).json({
        success: true,
        message: 'Avis créé avec succès',
        data: { avis },
    });
});

// RÉCUPÉRER LES AVIS D'UN ANIME - GET /api/avis/anime/:animeId
const getAvisByAnime = asyncHandler(async (req, res) => {
    const { animeId } = req.params;

    // Vérifie que l'anime existe
    const anime = await prisma.anime.findUnique({
        where: { id: animeId },
    });

    if (!anime) {
        throw new HttpNotFoundError('Anime introuvable');
    }

    // Récupère tous les avis de cet anime
    const avis = await prisma.avis.findMany({
        where: {
            animeId: animeId,
        },
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
            dateCreation: 'desc', // Les plus récents en premier
        },
    });

    res.status(httpStatusCodes.OK).json({
        success: true,
        data: { avis },
    });
});

// RÉCUPÉRER MES AVIS - GET /api/avis/me
export const getMesAvis = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const avis = await prisma.avis.findMany({
        where: {
            userId: userId,
        },
        include: {
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

// MODIFIER MON AVIS - PUT /api/avis/:id
export const updateAvis = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    // Valide les données
    const validatedData = validateData(updateAvisSchema, req.body);

    // Vérifie que l'avis existe
    const avis = await prisma.avis.findUnique({
        where: { id: id },
    });

    if (!avis) {
        throw new HttpNotFoundError('Avis introuvable');
    }

    // Vérifie que c'est bien l'avis de l'utilisateur connecté
    if (avis.userId !== userId) {
        throw new HttpForbiddenError('Vous ne pouvez modifier que vos propres avis');
    }

    // Met à jour l'avis
    const updatedAvis = await prisma.avis.update({
        where: { id: id },
        data: validatedData,
        include: {
            user: {
                select: {
                    id: true,
                    username: true,
                    avatar: true,
                },
            },
            anime: {
                select: {
                    id: true,
                    titreVf: true,
                },
            },
        },
    });

    // Recalcule la note moyenne de l'anime
    await updateAnimeMoyenne(avis.animeId);

    res.status(httpStatusCodes.OK).json({
        success: true,
        message: 'Avis modifié avec succès',
        data: { avis: updatedAvis },
    });
});

// SUPPRIMER MON AVIS - DELETE /api/avis/:id
const deleteAvis = asyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    // Vérifie que l'avis existe
    const avis = await prisma.avis.findUnique({
        where: { id: id },
    });

    if (!avis) {
        throw new HttpNotFoundError('Avis introuvable');
    }

    // Vérifie que c'est bien l'avis de l'utilisateur connecté
    if (avis.userId !== userId) {
        throw new HttpForbiddenError('Vous ne pouvez supprimer que vos propres avis');
    }

    const animeId = avis.animeId;

    // Supprime l'avis
    await prisma.avis.delete({
        where: { id: id },
    });

    // Recalcule la note moyenne de l'anime
    await updateAnimeMoyenne(animeId);

    res.status(httpStatusCodes.OK).json({
        success: true,
        message: 'Avis supprimé avec succès',
    });
});

// FONCTION HELPER - Recalcule la note moyenne d'un anime
const updateAnimeMoyenne = async (animeId) => {
    // Récupère tous les avis de l'anime
    const avis = await prisma.avis.findMany({
        where: { animeId: animeId },
        select: { note: true },
    });

    // Si aucun avis, la moyenne est 0
    if (avis.length === 0) {
        await prisma.anime.update({
            where: { id: animeId },
            data: { noteMoyenne: 0 },
        });
        return;
    }

    // Calcule la moyenne
    const total = avis.reduce((sum, avis) => sum + avis.note, 0);
    const moyenne = total / avis.length;

    // Arrondit à 1 décimale (ex: 7.5)
    const moyenneArrondie = Math.round(moyenne * 10) / 10;

    // Met à jour l'anime
    await prisma.anime.update({
        where: { id: animeId },
        data: { noteMoyenne: moyenneArrondie },
    });
};

export {
    createAvis,
    getAvisByAnime,
    getMesAvis,
    updateAvis,
    deleteAvis,
};