import { z } from 'zod';

// Schéma pour créer un avis
export const createAvisSchema = z.object({
  animeId: z.string().min(1, 'L\'ID de l\'anime est requis'),
  note: z.number().int().min(0, 'La note minimum est 0').max(10, 'La note maximum est 10'),
  commentaire: z.string().min(10, 'Le commentaire doit contenir au moins 10 caractères').optional(),
});

// Schéma pour modifier un avis
export const updateAvisSchema = z.object({
  note: z.number().int().min(0).max(10).optional(),
  commentaire: z.string().min(10).optional(),
});

export {
  createAvisSchema,
  updateAvisSchema,
};