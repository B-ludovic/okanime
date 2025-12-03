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

// Applique le rate limiter spécifique admin (1000 req/15min) sur toutes les routes admin
router.use(adminLimiter);

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
router.get('/users', authMiddleware, adminOnly, getAllUsers );        
router.put('/users/:userId/role', authMiddleware, adminOnly, changeUserRole );
router.delete('/users/:userId', authMiddleware, adminOnly, deleteUser );
router.delete('/users/:userId/avatar', authMiddleware, adminOnly, deleteUserAvatar );

// GESTION DES GENRES (admin uniquement)
router.post('/genres', authMiddleware, adminOnly, createGenre );
router.put('/genres/:id', authMiddleware, adminOnly, updateGenre );
router.delete('/genres/:id', authMiddleware, adminOnly, deleteGenre );

// GESTION DES AVIS (admin uniquement)
router.get('/avis', authMiddleware, adminOnly, getAllAvis);
router.delete('/avis/:id', authMiddleware, adminOnly, deleteAvis);

// STATISTIQUES (admin uniquement)
router.get('/stats', authMiddleware, adminOnly,getStats );

export default router;