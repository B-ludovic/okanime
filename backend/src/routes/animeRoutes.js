import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/roleMiddleware.js';
import {
    getAllAnimes,
    getAnimeById,
    getAllGenres,
    getFeaturedAnimes,
    getRecentAnimes,
} from '../controllers/animeController.js';

export const router = express.Router();

// Routes publiques (pas besoin d'être connecté)
router.get('/', getAllAnimes);
router.get('/featured', getFeaturedAnimes);
router.get('/recent', getRecentAnimes);
router.get('/:id', getAnimeById);
router.get('/genres/all', getAllGenres);

// Routes admin (besoin d'être admin)

