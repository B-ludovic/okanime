import express from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { userOrAdmin } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Route user ou admin - créer un avis
router.post('/', authMiddleware, userOrAdmin, (req, res) => {
  res.json({ message: 'Avis créé' });
  
});

export default router;
