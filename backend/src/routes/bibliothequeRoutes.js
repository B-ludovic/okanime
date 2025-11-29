import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Route protégée - ajouter à la bibliothèque
router.post('/', authMiddleware, (req, res) => {
  res.json({ message: 'Ajouté à la bibliothèque' });
  
});

export default router;
