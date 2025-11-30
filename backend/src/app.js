import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import xss from 'xss-clean';
import helmetConfig from './config/security.js';
import { apiLimiter } from './config/rateLimiter.js';
import { errorHandler } from './middlewares/errorHandler.js';

// Import des routes
import authRoutes from './routes/authRoutes.js';
import animeRoutes from './routes/animeRoutes.js';
import genreRoutes from './routes/genreRoutes.js';
import bibliothequeRoutes from './routes/bibliothequeRoutes.js';
import avisRoutes from './routes/avisRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { httpStatusCodes } from './utils/httpErrors.js';

// Configuration
dotenv.config();

const app = express();


// SÉCURITÉ - Middlewares de protection


// 1. Helmet - Headers de sécurité HTTP
app.use(helmetConfig);

// 2. XSS Protection - Nettoie les données pour éviter les attaques XSS
app.use(xss());


// MIDDLEWARES GÉNÉRAUX



// 3. CORS - Contrôle d'accès cross-origin
// En production, seul le frontend officiel peut accéder à l'API
const corsOptions = {
  origin: (origin, callback) => {
    // Liste des origines autorisées
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      process.env.FRONTEND_URL, // URL de production (ex: https://okanime.com)
    ].filter(Boolean); // Retire les valeurs undefined/null

    // En développement, autorise aussi les requêtes sans origin (Postman, etc.)
    if (process.env.NODE_ENV !== 'production' && !origin) {
      return callback(null, true);
    }

    // Vérifie si l'origin est dans la liste
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true, // Autorise l'envoi de cookies
};

app.use(cors(corsOptions));

// 4. Parse les données JSON
app.use(express.json({ limit: '10mb' })); // Limite la taille des requêtes JSON à 10MB

// 5. Parse les données URL-encoded
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 6. Rate limiting général - Limite toutes les requêtes API
app.use('/api', apiLimiter);


// ROUTES DE BASE


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


// ROUTES API - Avec leurs protections spécifiques


// Routes API
app.use('/api/auth', authRoutes); // Rate limiting appliqué dans authRoutes
app.use('/api/animes', animeRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/bibliotheque', bibliothequeRoutes);
app.use('/api/avis', avisRoutes);

// Routes admin - Protection admin dans les routes
app.use('/api/admin', adminRoutes);


// GESTION DES ERREURS


app.use((req, res) => {
  res.status(httpStatusCodes.NOT_FOUND).json({
    error: 'Route non trouvée',
    path: req.path,
  });
});

// Middleware de gestion des erreurs (TOUJOURS EN DERNIER)
// Capture toutes les erreurs passées avec next(err) dans l'application (GENIAL !!!)
app.use(errorHandler);

// DÉMARRAGE DU SERVEUR 

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV}`);
});

export default app;