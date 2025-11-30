import { z } from 'zod';

// Schéma pour créer un avis
const createAvisSchema = z.object({
  animeId: z.string().min(1, 'L\'ID de l\'anime est requis'),
  note: z.number().int().min(0, 'La note minimum est 0').max(10, 'La note maximum est 10'),
  commentaire: z.string().min(10, 'Le commentaire doit contenir au moins 10 caractères').max(2000, 'Le commentaire ne peut pas dépasser 2000 caractères').optional(),
});

// Schéma pour modifier un avis
const updateAvisSchema = z.object({
  note: z.number().int().min(0).max(10).optional(),
  commentaire: z.string().min(10).max(2000, 'Le commentaire ne peut pas dépasser 2000 caractères').optional(),
});

// Fonction de validation
const validateData = (schema, data) => {
  return schema.parse(data);
};

export {
  createAvisSchema,
  updateAvisSchema,
  validateData,
};