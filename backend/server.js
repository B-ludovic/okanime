// Importation des dépendances
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Initialisation de l'application
const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API O\'Kanime 🎌' });
});

// TODO: Ajouter les routes ici
// app.use('/api/auth', authRoutes);
// app.use('/api/animes', animeRoutes);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
