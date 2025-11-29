import express from 'express';
import {
  createAnime,
  updateAnime,
  deleteAnime,
  addSaison,
  updateSaison,
  deleteSaison,
  getPendingAnimes,
  moderateAnime,
  deleteUserAvatar,
  getStats,
} from '../controllers/adminController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/roleMiddleware.js';
import { uploadMultiple } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// Toutes les routes admin nécessitent d'être connecté ET d'être admin
router.use(authMiddleware);
router.use(adminOnly);

// GESTION DES ANIMÉS 
router.post(
  '/animes',
  uploadMultiple([
    { name: 'poster', maxCount: 1 },
    { name: 'banniere', maxCount: 1 }
  ]),
  createAnime
);
router.put(
  '/animes/:id',
  uploadMultiple([
    { name: 'poster', maxCount: 1 },
    { name: 'banniere', maxCount: 1 }
  ]),
  updateAnime
);
router.delete('/animes/:id', deleteAnime);

// GESTION DES SAISONS 
router.post('/animes/:animeId/saisons', addSaison);
router.put('/saisons/:id', updateSaison);
router.delete('/saisons/:id', deleteSaison);

// MODÉRATION
router.get('/animes/pending', getPendingAnimes);
router.put('/animes/:id/moderation', moderateAnime);

// GESTION DES UTILISATEURS
router.delete('/users/:userId/avatar', deleteUserAvatar);

// STATISTIQUES
router.get('/stats', getStats);

export default router;