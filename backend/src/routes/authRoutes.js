import express from 'express';

const router = express.Router();

// Route publique - inscription
router.post('/register', (req, res) => {
  res.json({ message: 'Inscription' });
  
});

// Route publique - connexion
router.post('/login', (req, res) => {
  res.json({ message: 'Connexion' });
  
});

export default router;
