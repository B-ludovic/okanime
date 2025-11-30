import helmet from 'helmet';


// HELMET - Configuration des headers de sécurité

// Configuration de Helmet pour la sécurité
const helmetConfig = helmet({
  // Content Security Policy - Contrôle les sources autorisées
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"], // Par défaut, autorise uniquement notre domaine
      scriptSrc: ["'self'"], // Scripts uniquement depuis notre domaine
      styleSrc: ["'self'", "'unsafe-inline'"], // Styles depuis notre domaine + inline
      imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'], // Images : notre domaine + Cloudinary
      connectSrc: ["'self'"], // Connexions API uniquement vers notre domaine
      fontSrc: ["'self'"], // Fonts uniquement depuis notre domaine
      objectSrc: ["'none'"], // Désactive les plugins (Flash, etc.)
      upgradeInsecureRequests: [], // Force HTTPS en production
    },
  },
  
  // Cache le fait qu'on utilise Express
  hidePoweredBy: true,
  
  // Protection contre le clickjacking
  // Empêche le site d'être affiché dans une iframe
  frameguard: {
    action: 'deny', // Interdit complètement les iframes
  },
  
  // Force HTTPS (Strict Transport Security)
  hsts: {
    maxAge: 31536000, // 1 an en secondes
    includeSubDomains: true, // S'applique aussi aux sous-domaines
    preload: true, // Demande l'inclusion dans la liste de preload des navigateurs
  },
  
  // Empêche le navigateur de deviner le type MIME
  noSniff: true,
  
  // Désactive la mise en cache DNS prefetching
  dnsPrefetchControl: {
    allow: false,
  },
  
  // Désactive le téléchargement automatique dans IE
  ieNoOpen: true,
  
  // Protection XSS intégrée du navigateur (ancienne protection, mais utile)
  xssFilter: true,
});

export default helmetConfig;
