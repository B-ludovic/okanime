import express from 'express';
import {
    createAvis,
    getAvisByAnime,
    getMesAvis,
    updateAvis,
    deleteAvis,
} from '../controllers/avisController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { userActionLimiter } from '../config/rateLimiter.js';

const router = express.Router();

// Route publique - voir les avis d'un anime
router.get('/anime/:animeId', getAvisByAnime);

// Routes protégées - il faut être connecté
router.use(authMiddleware);

router.post('/', userActionLimiter, createAvis);
router.get('/me', getMesAvis);
router.put('/:id', userActionLimiter, updateAvis);
router.delete('/:id', userActionLimiter, deleteAvis);

export default router;