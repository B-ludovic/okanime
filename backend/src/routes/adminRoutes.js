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
  getAllAnimesAdmin,
} from '../controllers/adminController.js';
import {
  getAllMessages,
  toggleReadStatus,
  deleteMessage,
} from '../controllers/contactController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/roleMiddleware.js';
import { uploadSingleOptional } from '../middlewares/uploadMiddleware.js';
import { adminLimiter, userActionLimiter } from '../config/rateLimiter.js';

const router = express.Router();

// GESTION DES ANIMÉS (créateur ou admin)
// POST/PUT/DELETE : créateur peut gérer ses propres animés, admin a le CRUD complet
// Vérification IDOR dans le contrôleur (anime.userIdAjout === req.user.id || role === ADMIN)
router.post('/animes', authMiddleware, userActionLimiter, uploadSingleOptional('poster'), createAnime);
router.put('/animes/:id', authMiddleware, userActionLimiter, uploadSingleOptional('poster'), updateAnime);
router.delete('/animes/:id', authMiddleware, userActionLimiter, deleteAnime);

// GESTION DES SAISONS (admin uniquement)
router.post('/animes/:animeId/saisons', authMiddleware, adminOnly, adminLimiter, addSaison);
router.put('/saisons/:id', authMiddleware, adminOnly, adminLimiter, updateSaison);
router.delete('/saisons/:id', authMiddleware, adminOnly, adminLimiter, deleteSaison);

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

// GESTION DES MESSAGES DE CONTACT (admin uniquement) - rate limit augmenté
router.get('/messages', authMiddleware, adminOnly, adminLimiter, getAllMessages);
router.put('/messages/:id/toggle-read', authMiddleware, adminOnly, adminLimiter, toggleReadStatus);
router.delete('/messages/:id', authMiddleware, adminOnly, adminLimiter, deleteMessage);

// STATISTIQUES (admin uniquement) - rate limit augmenté
router.get('/stats', authMiddleware, adminOnly, adminLimiter, getStats );

export default router;