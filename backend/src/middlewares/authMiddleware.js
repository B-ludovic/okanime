import { asyncHandler } from './errorHandler.js';
import { HttpUnauthorizedError } from '../utils/httpErrors.js';
import { verifyToken, extractTokenFromHeader } from '../utils/jwt.js';
import prisma from '../config/database.js';


const authMiddleware = asyncHandler(async (req, res, next) => {
  // 1. Récupère le header Authorization
  const authHeader = req.headers.authorization;
  
  // 2. Extrait le token
  const token = extractTokenFromHeader(authHeader);
  
  if (!token) {
    throw new HttpUnauthorizedError('Token manquant. Veuillez vous connecter.');
  }

  // 3. Vérifie et décode le token
  const decoded = verifyToken(token); // Lève une erreur si invalide

  // 4. Récupère l'utilisateur en base de données
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      avatar: true,
    },
  });

  if (!user) {
    throw new HttpUnauthorizedError('Utilisateur introuvable. Veuillez vous reconnecter.');
  }

  // 5. Attache l'utilisateur à la requête
  req.user = user;

  // 6. Passe au middleware suivant
  next();
});


const optionalAuthMiddleware = asyncHandler(async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = extractTokenFromHeader(authHeader);
    
    if (token) {
      const decoded = verifyToken(token);
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          avatar: true,
        },
      });
      
      if (user) {
        req.user = user;
      }
    }
  } catch (error) {}
  
  next();
});

export { authMiddleware, optionalAuthMiddleware };