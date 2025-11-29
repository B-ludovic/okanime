import express from 'express';
import {
    getMaBibliotheque,
    addToBibliotheque,
    updateBibliothequeEntry,
    removeFromBibliotheque,
    filterBibliothequeByStatut,
} from '../controllers/bibliothequeController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

export const router = express.Router();

// Toutes ces routes nécessitent d'être connecté
router.use(authMiddleware);

router.get('/', getMaBibliotheque);
router.get('/filter/:statut', filterBibliothequeByStatut);
router.post('/', addToBibliotheque);
router.put('/:id', updateBibliothequeEntry);
router.delete('/:id', removeFromBibliotheque);               
