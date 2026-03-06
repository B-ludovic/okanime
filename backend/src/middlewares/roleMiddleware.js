import { HttpForbiddenError, HttpUnauthorizedError } from '../utils/httpErrors.js';

// Vérifie que l'utilisateur a le bon rôle
const checkRole = (rolesAutorisés) => {
  return (req, res, next) => {
    // Vérifie que l'utilisateur est connecté
    if (!req.user) {
      return next(new HttpUnauthorizedError('Vous devez être connecté'));
    }

    // Vérifie que l'utilisateur a le bon rôle
    if (!rolesAutorisés.includes(req.user.role)) {
      return next(new HttpForbiddenError('Vous n\'avez pas les permissions nécessaires'));
    }

    next();
  };
};

// Raccourcis pratiques
const adminOnly = checkRole(['ADMIN']);
const userOrAdmin = checkRole(['USER', 'ADMIN']);

export { checkRole, adminOnly, userOrAdmin };