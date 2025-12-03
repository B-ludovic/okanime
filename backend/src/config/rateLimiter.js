import rateLimit from 'express-rate-limit';


// RATE LIMITERS - Protection contre le brute force

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: {
    success: false,
    error: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
  },
  // En-tête pour informer le client du nombre de requêtes restantes
  standardHeaders: true,
  // Désactive les anciens headers X-RateLimit
  legacyHeaders: false,
  // Identifie l'utilisateur par son IP
  skipSuccessfulRequests: false, // Compte même les requêtes réussies
});


// Limite : 3 inscriptions par heure depuis la même IP
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // Maximum 3 inscriptions par heure
  message: {
    success: false,
    error: 'Trop de tentatives d\'inscription. Veuillez réessayer plus tard.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter général pour l'API
// Limite : 300 requêtes par 15 minutes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Maximum 300 requêtes
  message: {
    success: false,
    error: 'Trop de requêtes. Veuillez ralentir.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter spécifique pour l'admin (plus permissif)
// Limite : 1000 requêtes par 15 minutes
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Maximum 1000 requêtes (beaucoup d'appels API en admin)
  message: {
    success: false,
    error: 'Trop de requêtes admin. Veuillez ralentir.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter strict pour les actions sensibles (upload, suppression, etc.)
// Limite : 10 requêtes par 15 minutes
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    error: 'Trop de requêtes sensibles. Veuillez patienter.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export { loginLimiter, registerLimiter, apiLimiter, adminLimiter, strictLimiter };
