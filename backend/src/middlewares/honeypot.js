import { HttpBadRequestError } from '../utils/httpErrors.js';

// HONEYPOT - Protection contre les bots

const honeypot = (fieldName = 'website') => {
  return (req, res, next) => {
    // Récupère la valeur du champ honeypot
    const honeypotValue = req.body[fieldName];

    // Si le champ honeypot est rempli, c'est probablement un bot
    if (honeypotValue && honeypotValue.trim() !== '') {
      console.warn(`Honeypot déclenché ! Champ "${fieldName}" rempli:`, honeypotValue);
      
      // On peut logger l'IP pour analyse
      const ip = req.ip || req.connection.remoteAddress;
      console.warn(`IP suspecte: ${ip}`);
      
      // On rejette la requête
      throw new HttpBadRequestError('Requête invalide');
    }

    // Si le champ est vide, c'est probablement un humain → on continue
    next();
  };
};

export default honeypot;
