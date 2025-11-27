const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');
const { parse } = require('dotenv');

const router = express.Router();
const prisma = new PrismaClient();

// Route GET /api/animes - Recuperer la liste des animes
router.get('/', authMiddleware, async (req, res) => {
    try {
        const animes = await prisma.anime.findMany({
            where: { userId: req.userId },
            orderBy: { createdAt: 'desc' },
        });
        res.json(animes);

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// Route POST /api/animes - Ajouter un nouvel anime
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { titre,
            resume,
            nbSaisons,
            nbEpisodes,
            dureeEpisode,
            studio,
            paysOrigine,
            note,
            avis,
            imageUrl,
            statut } = req.body;

        // verifier les champs obligatoires
        if (!titre || !statut || !nbEpisodes || !dureeEpisode || !nbSaisons || !studio || !paysOrigine) {
            return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
        }

        // creer le nouvel anime
        const anime = await prisma.anime.create({
            data: {
                titre,
                resume: resume || null,
                nbSaisons: parseInt(nbSaisons),
                nbEpisodes: parseInt(nbEpisodes),
                dureeEpisode: parseInt(dureeEpisode),
                studio,
                paysOrigine,
                note: note ? parseFloat(note) : null,
                avis: avis || null,
                imageUrl: imageUrl || null,
                statut: statut || 'a_voir',
                userId: req.userId,
            },
        });
        res.status(201).json(anime);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// PUT /api/animes/:id - Mettre a jour un anime
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { titre,
            resume,
            nbSaisons,
            nbEpisodes,
            dureeEpisode,
            studio,
            paysOrigine,
            note,
            avis,
            imageUrl,
            statut } = req.body;

            // Verifier que l'anime appartient a l'utilisateur
            const anime = await prisma.anime.findFirst({
                where: {
                    id: parseInt(id),
                    userId: req.userId,
                },
            });
            
            if (!anime) {
                return res.status(404).json({ message: 'Anime non trouve.' });
            }

        // Mettre a jour l'anime
        const updatedAnime = await prisma.anime.update({
            where: { id: parseInt(id) },
            data: {
                titre,
                resume: resume || null,
                nbSaisons: parseInt(nbSaisons),
                nbEpisodes: parseInt(nbEpisodes),
                dureeEpisode: parseInt(dureeEpisode),
                studio,
                paysOrigine,
                note: note ? parseFloat(note) : null,
                avis: avis || null,
                imageUrl: imageUrl || null,
                statut: statut || 'a_voir',
            },
        });
        res.json(updatedAnime);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

// DELETE /api/animes/:id - Supprimer un anime
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // Verifier que l'anime appartient a l'utilisateur
        const anime = await prisma.anime.findFirst({
            where: {
                id: parseInt(id),
                userId: req.userId,
            },
        });

        if (!anime) {
            return res.status(404).json({ message: 'Anime non trouve.' });
        }

        // Supprimer l'anime
        await prisma.anime.delete({
            where: { id: parseInt(id) },
        });
        res.json({ message: 'Anime supprime avec succes.' });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
});

module.exports = router;