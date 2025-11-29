import { z } from 'zod';

// Schéma pour ajouter une saison à sa bibliothèque
export const addToBibliothequeSchema = z.object({
  saisonId: z.string().min(1, 'L\'ID de la saison est requis'),
  statut: z.enum(['A_VOIR', 'EN_COURS', 'VU', 'FAVORI']).default('A_VOIR'),
  progressionEpisodes: z.number().int().min(0).default(0),
});

// Schéma pour mettre à jour une entrée de bibliothèque
export const updateBibliothequeSchema = z.object({
  statut: z.enum(['A_VOIR', 'EN_COURS', 'VU', 'FAVORI']).optional(),
  progressionEpisodes: z.number().int().min(0).optional(),
});