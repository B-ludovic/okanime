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
import contactRoutes from './routes/contactRoutes.js';
import { httpStatusCodes } from './utils/httpErrors.js';

// Configuration
dotenv.config();

const app = express();

// Trust proxy - Nécessaire pour Render et le rate limiting
// Permet à Express de reconnaître les headers X-Forwarded-* du proxy
app.set('trust proxy', 1);


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
      'http://localhost:3000', // Développement local
      'http://localhost:3001',
      'https://okanime.live', // Production (domaine principal)
      'https://www.okanime.live', // Production (avec www)
      'https://okanime.vercel.app', // Vercel (déploiement)
      process.env.FRONTEND_URL, // URL depuis .env (si définie)
    ].filter(Boolean); // Retire les valeurs undefined/null

    // Autorise les requêtes sans origin (accès direct, Postman, health checks)
    if (!origin) {
      return callback(null, true);
    }

    // Vérifie si l'origin est dans la liste OU si c'est une preview Vercel
    const isVercelPreview = origin.endsWith('.vercel.app');
    if (allowedOrigins.includes(origin) || isVercelPreview) {
      callback(null, true);
    } else {
      console.error(`CORS bloqué pour l'origin: ${origin}`);
      callback(new Error('Non autorisé par CORS'));
    }
  },
  credentials: true, // Autorise l'envoi de cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Méthodes autorisées
  allowedHeaders: ['Content-Type', 'Authorization'], // Headers autorisés
  exposedHeaders: ['Content-Range', 'X-Content-Range'], // Headers exposés
  maxAge: 86400, // Cache preflight 24h
};

app.use(cors(corsOptions));

// Gestion des requêtes OPTIONS (preflight CORS)
app.options('*', cors(corsOptions));

// 4. Parse les données JSON
app.use(express.json({ limit: '10mb' })); // Limite la taille des requêtes JSON à 10MB

// 6. Parse les données URL-encoded
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 6. Rate limiting général - RETIRÉ
// Les rate limiters spécifiques sont appliqués directement dans les routes sensibles
// (auth, upload, admin) pour éviter de bloquer la navigation normale


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
app.use('/api/contact', contactRoutes); // Route publique pour le formulaire de contact

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