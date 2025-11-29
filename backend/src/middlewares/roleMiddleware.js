import { HttpForbiddenError, HttpUnauthorizedError } from '../utils/httpErrors.js';

// Vérifie que l'utilisateur a le bon rôle
const checkRole = (rolesAutorisés) => {
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
const adminOnly = checkRole(['ADMIN']);
const userOrAdmin = checkRole(['USER', 'ADMIN']);

export { checkRole, adminOnly, userOrAdmin };