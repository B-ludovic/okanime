import express from 'express';
import {
    createAvis,
    getAvisByAnime,
    getMesAvis,
    updateAvis,
    deleteAvis,
} from '../controllers/avisController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route publique - voir les avis d'un anime
router.get('/anime/:animeId', getAvisByAnime);

// Routes protégées - il faut être connecté
router.use(authMiddleware);

router.post('/', createAvis);
router.get('/me', getMesAvis);
router.put('/:id', updateAvis);
router.delete('/:id', deleteAvis);

export default router;