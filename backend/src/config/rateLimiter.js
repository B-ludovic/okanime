import rateLimit from 'express-rate-limit';

// RATE LIMITERS - Protection contre le brute force

// Limite : 5 connexions par 15 minutes depuis la même IP
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: {
    success: false,
    error: {
      message: 'Trop de tentatives de connexion. Veuillez réessayer dans 15 minutes.',
      type: 'RateLimitError'
    }
  },
  // En-tête pour informer le client du nombre de requêtes restantes
  standardHeaders: true,
  // Désactive les anciens headers X-RateLimit
  legacyHeaders: false,
  // Identifie l'utilisateur par son IP (géré automatiquement par express-rate-limit)
  skipSuccessfulRequests: false, // Compte même les requêtes réussies
});


// Limite : 3 inscriptions par heure depuis la même IP
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 heure
  max: 3, // Maximum 3 inscriptions par heure
  message: {
    success: false,
    error: {
      message: 'Trop de tentatives d\'inscription. Veuillez réessayer plus tard.',
      type: 'RateLimitError'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter général pour l'API
// Limite : 1000 requêtes par 15 minutes (permet navigation normale)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Maximum 1000 requêtes (augmenté pour usage normal)
  message: {
    success: false,
    error: {
      message: 'Trop de requêtes. Veuillez ralentir.',
      type: 'RateLimitError'
    }
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
    error: {
      message: 'Trop de requêtes admin. Veuillez ralentir.',
      type: 'RateLimitError'
    }
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
    error: {
      message: 'Trop de requêtes sensibles. Veuillez patienter.',
      type: 'RateLimitError'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter pour les actions d'écriture des utilisateurs authentifiés
// Limite : 100 requêtes par 15 minutes (ajout avis, modification biblio, etc.)
const userActionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Maximum 100 actions d'écriture par utilisateur
  message: {
    success: false,
    error: {
      message: 'Trop d\'actions. Veuillez ralentir.',
      type: 'RateLimitError'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter pour utilisateurs authentifiés (identifie par userId au lieu de IP)
// Limite : 500 requêtes par 15 minutes par utilisateur
const authenticatedUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Maximum 500 requêtes par utilisateur
  message: {
    success: false,
    error: {
      message: 'Trop de requêtes. Veuillez ralentir.',
      type: 'RateLimitError'
    }
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Identifie par userId si authentifié, sinon par IP (géré automatiquement)
  skip: (req) => {
    // Ne s'applique pas si pas authentifié (utilise apiLimiter à la place)
    return !req.user;
  },
});

export { loginLimiter, registerLimiter, apiLimiter, adminLimiter, strictLimiter, authenticatedUserLimiter, userActionLimiter };
