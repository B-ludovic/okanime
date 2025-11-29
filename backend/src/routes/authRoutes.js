import express from 'express';
import { register } from 'module';
import { login } from '../controllers/authController';
import { register, getMe, getMe } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route publique - inscription
router.post('/register', register );
router.post('/login', login);

// Route protégée - profil utilisateur
router.get('/me', authMiddleware, getMe );

export default router;
