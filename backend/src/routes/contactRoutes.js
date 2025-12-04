import express from 'express';
import { createMessage } from '../controllers/contactController.js';

const router = express.Router();

// Route publique pour envoyer un message de contact
// POST /api/contact
// Pas besoin d'authentification, tout le monde peut envoyer un message
router.post('/', createMessage);

export default router;
