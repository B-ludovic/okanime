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
  getAllUsers,        
  changeUserRole,
  deleteUser,
  createGenre,        
  updateGenre,        
  deleteGenre,
  getAllAvis,
  deleteAvis,
} from '../controllers/adminController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/roleMiddleware.js';
import { uploadSingleOptional } from '../middlewares/uploadMiddleware.js';
import { adminLimiter } from '../config/rateLimiter.js';

const router = express.Router();

// GESTION DES ANIMÉS (créateur ou admin) - rate limit normal
router.post('/animes', authMiddleware, uploadSingleOptional('poster'),createAnime );
router.put('/animes/:id', authMiddleware, uploadSingleOptional('poster'), updateAnime );
router.delete('/animes/:id', authMiddleware, deleteAnime );

// GESTION DES SAISONS (créateur ou admin) - rate limit normal
router.post('/animes/:animeId/saisons', authMiddleware, addSaison );
router.put('/saisons/:id', authMiddleware, updateSaison );
router.delete('/saisons/:id', authMiddleware, deleteSaison );

// MODÉRATION (admin uniquement) - rate limit augmenté
router.get('/animes/pending', authMiddleware, adminOnly, adminLimiter, getPendingAnimes);
router.put('/animes/:id/moderation', authMiddleware, adminOnly, adminLimiter, moderateAnime );

// GESTION DES UTILISATEURS (admin uniquement) - rate limit augmenté
router.get('/users', authMiddleware, adminOnly, adminLimiter, getAllUsers );        
router.put('/users/:userId/role', authMiddleware, adminOnly, adminLimiter, changeUserRole );
router.delete('/users/:userId', authMiddleware, adminOnly, adminLimiter, deleteUser );
router.delete('/users/:userId/avatar', authMiddleware, adminOnly, adminLimiter, deleteUserAvatar );

// GESTION DES GENRES (admin uniquement) - rate limit augmenté
router.post('/genres', authMiddleware, adminOnly, adminLimiter, createGenre );
router.put('/genres/:id', authMiddleware, adminOnly, adminLimiter, updateGenre );
router.delete('/genres/:id', authMiddleware, adminOnly, adminLimiter, deleteGenre );

// GESTION DES AVIS (admin uniquement) - rate limit augmenté
router.get('/avis', authMiddleware, adminOnly, adminLimiter, getAllAvis);
router.delete('/avis/:id', authMiddleware, adminOnly, adminLimiter, deleteAvis);

// STATISTIQUES (admin uniquement) - rate limit augmenté
router.get('/stats', authMiddleware, adminOnly, adminLimiter, getStats );

export default router;