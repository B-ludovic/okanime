// Palette de couleurs O'Kanime
const COLORS = {
  // Couleurs principales
  primary: '#7C3AED',      // Violet vif
  secondary: '#EC4899',    // Rose/Magenta
  accent: '#06B6D4',       // Cyan

  // Couleurs neutres
  background: '#0A0A14',   // Noir-bleu profond
  surface: '#1A1A2E',      // Bleu nuit
  card: '#262640',         // Gris-violet
  textPrimary: '#F8FAFC',  // Blanc cassé
  textSecondary: '#94A3B8', // Gris clair

  // Couleurs fonctionnelles
  success: '#10B981',      // Vert émeraude (Vu)
  warning: '#F59E0B',      // Orange ambré (En cours)
  info: '#3B82F6',         // Bleu (À voir)
  favorite: '#FBBF24',     // Or (Favori)
};

// Statuts de bibliothèque
const STATUTS_BIBLIOTHEQUE = {
  A_VOIR: 'À voir',
  EN_COURS: 'En cours',
  VU: 'Vu',
  FAVORI: 'Favori',
};

// Classes DaisyUI par statut (utilise les couleurs du thème)
const STATUT_BADGE_CLASSES = {
  A_VOIR: 'badge-info',        // Bleu
  EN_COURS: 'badge-warning',    // Orange
  VU: 'badge-success',          // Vert
  FAVORI: 'badge-secondary',    // Rose (au lieu de favorite)
};

// Rôles utilisateurs
const ROLES = {
  VISITEUR: 'Visiteur',
  USER: 'Utilisateur',
  ADMIN: 'Administrateur',
};

// Configuration de pagination
const PAGINATION = {
  ANIMES_PER_PAGE: 20,
  AVIS_PER_PAGE: 10,
};

// Couleurs par statut
const STATUT_COLORS = {
  A_VOIR: '--bleu-pastel',
  EN_COURS: '--jaune-pastel',
  VU: '--vert-pastel',
  FAVORI: '--corail-pastel',
};


export {
  COLORS,
  STATUTS_BIBLIOTHEQUE,
  STATUT_BADGE_CLASSES,
  ROLES,
  PAGINATION,
  STATUT_COLORS,
};