import { asyncHandler } from './errorHandler.js';
import { HttpUnauthorizedError } from '../utils/httpErrors.js';
import { verifyToken, getTokenFromHeader } from '../utils/jwt.js';
import prisma from '../config/prisma.js';


const authMiddleware = asyncHandler(async (req, res, next) => {
  // 1. Récupère le token depuis le cookie (priorité) ou le header Authorization (fallback)
  let token = req.cookies?.token; // Depuis le cookie httpOnly
  
  // Fallback : si pas de cookie, cherche dans le header (pour compatibilité)
  if (!token) {
    const authHeader = req.headers.authorization;
    token = getTokenFromHeader(authHeader);
  }
  
  if (!token) {
    throw new HttpUnauthorizedError('Token manquant. Veuillez vous connecter.');
  }

  // 2. Vérifie et décode le token
  const decoded = verifyToken(token); // Lève une erreur si invalide

  // 3. Récupère l'utilisateur en base de données
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

  // 4. Attache l'utilisateur à la requête
  req.user = user;

  // 5. Passe au middleware suivant
  next();
});


const optionalAuthMiddleware = asyncHandler(async (req, res, next) => {
  try {
    // Récupère le token depuis le cookie (priorité) ou le header
    let token = req.cookies?.token;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      token = getTokenFromHeader(authHeader);
    }
    
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