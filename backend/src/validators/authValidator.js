import { z } from 'zod';

// Schéma de validation pour l'inscription
const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères')
    .max(30, 'Le nom d\'utilisateur ne peut pas dépasser 30 caractères')
    .regex(/^[a-zA-Z0-9_-]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores'),
  
  email: z
    .string()
    .email('Email invalide')
    .toLowerCase(), // Convertit l'email en minuscules automatiquement
  
  password: z
    .string()
    .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
    .regex(/[a-z]/, 'Le mot de passe doit contenir au moins une minuscule')
    .regex(/[A-Z]/, 'Le mot de passe doit contenir au moins une majuscule')
    .regex(/[0-9]/, 'Le mot de passe doit contenir au moins un chiffre'),
});

// Schéma de validation pour la connexion
const loginSchema = z.object({
  email: z
    .string()
    .email('Email invalide')
    .toLowerCase(),
  
  password: z
    .string()
    .min(1, 'Le mot de passe est requis'),
});

const validateData = (schema, data) => {
  return schema.parse(data);
};

export {
  registerSchema,
  loginSchema,
  validateData
};