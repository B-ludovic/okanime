import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { HttpUnauthorizedError } from './httpErrors.js';

dotenv.config();

// Créer un token JWT pour un utilisateur
export const generateToken = (userId, role) => {
  const payload = { userId, role };
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// Vérifier si un token est valide
export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // Retourne { userId, role }
  } catch (error) {
    throw new HttpUnauthorizedError('Token invalide ou expiré');
  }
};

// Récupérer le token depuis le header Authorization
export const getTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  
  return authHeader.split(' ')[1];
};