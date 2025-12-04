import express from 'express';
import { 
    register, 
    login, 
    getMe, 
    updateAvatar,
    confirmEmail,
    resendConfirmationEmail
 } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { uploadSingleOptional } from '../middlewares/uploadMiddleware.js';
import { loginLimiter, registerLimiter, strictLimiter } from '../config/rateLimiter.js';
import honeypot from '../middlewares/honeypot.js';

const router = express.Router();


// ROUTES PUBLIQUES - Avec rate limiting strict

// Inscription - Limité à 3 tentatives par heure + protection honeypot contre les bots
router.post('/register', honeypot('website'), registerLimiter, register);

// Connexion - Limité à 5 tentatives par 15 minutes + protection honeypot
router.post('/login', honeypot('website'), loginLimiter, login);

// Confirmation d'email - Limité à 5 tentatives par heure
router.get('/confirm/:token', strictLimiter, confirmEmail);

// Renvoyer l'email de confirmation - Limité à 3 tentatives par heure
router.post('/resend-confirmation', strictLimiter, resendConfirmationEmail);


// ROUTES PROTÉGÉES - Nécessitent authentification

// Récupère les infos de l'utilisateur connecté
router.get('/me', authMiddleware, getMe);

// Upload d'avatar - Limité à 10 uploads par 15 minutes
router.put('/avatar', authMiddleware, strictLimiter, uploadSingleOptional('avatar'), updateAvatar);

export default router;
