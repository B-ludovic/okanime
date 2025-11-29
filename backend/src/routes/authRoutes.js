import express from 'express';
import { register, login, getMe } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Routes publiques
router.post('/register', register);
router.post('/login', login);

// Route protégée - profil utilisateur
router.get('/me', authMiddleware, getMe);

export default router;
