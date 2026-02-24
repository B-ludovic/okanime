import express from 'express';
import { createMessage } from '../controllers/contactController.js';
import { strictLimiter } from '../config/rateLimiter.js';
import honeypot from '../middlewares/honeypot.js';

const router = express.Router();

// Route publique pour envoyer un message de contact
// POST /api/contact
// Pas besoin d'authentification, tout le monde peut envoyer un message
// Rate limit : 10 messages / 15 min par IP + honeypot anti-bots
router.post('/', strictLimiter, honeypot('website'), createMessage);

export default router;
