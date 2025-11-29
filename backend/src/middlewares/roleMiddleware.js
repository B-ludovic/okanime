import { HttpForbiddenError, HttpUnauthorizedError } from '../utils/httpErrors.js';

// Vérifie que l'utilisateur a le bon rôle
// À utiliser APRÈS authMiddleware
export const checkRole = (rolesAutorisés) => {
  return (req, res, next) => {
    // Vérifie que l'utilisateur est connecté
    if (!req.user) {
      throw new HttpUnauthorizedError('Vous devez être connecté');
    }

    // Vérifie que l'utilisateur a le bon rôle
    if (!rolesAutorisés.includes(req.user.role)) {
      throw new HttpForbiddenError('Vous n\'avez pas les permissions nécessaires');
    }

    next();
  };
};

// Raccourcis pratiques
export const adminOnly = checkRole(['ADMIN']);
export const userOrAdmin = checkRole(['USER', 'ADMIN']);