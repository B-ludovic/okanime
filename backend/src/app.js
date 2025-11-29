import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/errorHandler.js';

// Configuration
dotenv.config();

const app = express();

// MIDDLEWARES 

app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES 

app.get('/', (req, res) => {
  res.json({
    message: '🎌 Bienvenue sur l\'API O\'Kanime',
    status: 'operational',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Import des routes
import authRoutes from './routes/authRoutes.js';
import animeRoutes from './routes/animeRoutes.js';
import bibliothequeRoutes from './routes/bibliothequeRoutes.js';
import avisRoutes from './routes/avisRoutes.js';

app.use('/api/auth', authRoutes);
app.use('/api/animes', animeRoutes);
app.use('/api/bibliotheque', bibliothequeRoutes);
app.use('/api/avis', avisRoutes);

// GESTION DES ERREURS 

app.use((req, res) => {
  res.status(404).json({
    error: 'Route non trouvée',
    path: req.path,
  });
});

// Middleware de gestion des erreurs (TOUJOURS EN DERNIER)
app.use(errorHandler);

// DÉMARRAGE DU SERVEUR 

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});

export default app;