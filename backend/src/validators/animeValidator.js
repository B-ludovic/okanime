import { z } from 'zod';

// Schéma pour la recherche d'animés
const searchAnimeSchema = z.object({
  q: z.string().min(1, 'Le terme de recherche ne peut pas être vide').optional(),
  genre: z.string().optional(),
  page: z.string().regex(/^\d+$/, 'Le numéro de page doit être un nombre').optional(),
  limit: z.string().regex(/^\d+$/, 'La limite doit être un nombre').optional(),
});

// Schéma pour créer un anime manuellement
const createAnimeSchema = z.object({
  titreVf: z.string().min(1, 'Le titre est requis').max(200, 'Le titre ne peut pas dépasser 200 caractères'),
  synopsis: z.string().min(10, 'Le synopsis doit contenir au moins 10 caractères').max(5000, 'Le synopsis ne peut pas dépasser 5000 caractères'),
  anneeDebut: z.number().int().min(1900).max(new Date().getFullYear() + 2),
  studio: z.string().max(200, 'Le nom du studio ne peut pas dépasser 200 caractères').optional(),
  genreIds: z.array(z.string()).min(1, 'Au moins un genre est requis'),
});

// Schéma pour créer une saison
const createSaisonSchema = z.object({
  numeroSaison: z.number().int().min(1),
  titreSaison: z.string().max(200, 'Le titre de la saison ne peut pas dépasser 200 caractères').optional(),
  resume: z.string().max(3000, 'Le résumé ne peut pas dépasser 3000 caractères').optional(),
  nombreEpisodes: z.number().int().min(1),
  annee: z.number().int().min(1900).max(new Date().getFullYear() + 2),
  statut: z.enum(['EN_COURS', 'TERMINE']).default('TERMINE'),
});

// Schéma pour mettre à jour un anime
const updateAnimeSchema = z.object({
  titreVf: z.string().min(1).max(200, 'Le titre ne peut pas dépasser 200 caractères').optional(),
  synopsis: z.string().min(10).max(5000, 'Le synopsis ne peut pas dépasser 5000 caractères').optional(),
  anneeDebut: z.number().int().min(1900).max(new Date().getFullYear() + 2).optional(),
  studio: z.string().max(200, 'Le nom du studio ne peut pas dépasser 200 caractères').optional(),
  genreIds: z.array(z.string()).optional(),
  statutModeration: z.enum(['EN_ATTENTE', 'VALIDE', 'REFUSE']).optional(),
});

// Fonction de validation
const validateData = (schema, data) => {
  return schema.parse(data);
};

export {
  searchAnimeSchema,
  createAnimeSchema,
  createSaisonSchema,
  updateAnimeSchema,
  validateData,
};