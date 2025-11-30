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
import { uploadMultiple, uploadMultipleOptional, uploadSingleOptional } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

// GESTION DES ANIMÉS (créateur ou admin)
router.post('/animes', authMiddleware, uploadSingleOptional('poster'),createAnime );
router.put('/animes/:id', authMiddleware, uploadSingleOptional('poster'), updateAnime );
router.delete('/animes/:id', authMiddleware, deleteAnime );

// GESTION DES SAISONS (créateur ou admin)
router.post('/animes/:animeId/saisons', authMiddleware, addSaison );
router.put('/saisons/:id', authMiddleware, updateSaison );
router.delete('/saisons/:id', authMiddleware, deleteSaison );

// MODÉRATION (admin uniquement)
router.get('/animes/pending', authMiddleware, adminOnly, getPendingAnimes);
router.put('/animes/:id/moderation', authMiddleware, adminOnly, moderateAnime );

// GESTION DES UTILISATEURS (admin uniquement)
router.delete('/users/:userId/avatar', authMiddleware, adminOnly, deleteUserAvatar );

// STATISTIQUES (admin uniquement)
router.get('/stats', authMiddleware, adminOnly,getStats );

export default router;