import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { adminOnly } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Route publique - liste des animes
router.get('/', (req, res) => {
  res.json({ message: 'Liste des animes' });
});

// Route admin - supprimer un anime
router.delete('/:id', authMiddleware, adminOnly, (req, res) => {
  res.json({ message: 'Anime supprimé' });

});

export default router;
