import express from 'express';
import {
    getMaBibliotheque,
    addToBibliotheque,
    updateBibliothequeEntry,
    removeFromBibliotheque,
    filterBibliothequeByStatut,
} from '../controllers/bibliothequeController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { userActionLimiter } from '../config/rateLimiter.js';

const router = express.Router();

// Toutes ces routes nécessitent d'être connecté
router.use(authMiddleware);

router.get('/', getMaBibliotheque);
router.get('/filter/:statut', filterBibliothequeByStatut);
router.post('/', userActionLimiter, addToBibliotheque);
router.put('/:id', userActionLimiter, updateBibliothequeEntry);
router.delete('/:id', userActionLimiter, removeFromBibliotheque);               

export default router;