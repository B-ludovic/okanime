import { asyncHandler } from '../middlewares/errorHandler.js';
import { registerSchema, loginSchema, validateData } from '../validators/authValidator.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.js';
import { HttpBadRequestError, HttpUnauthorizedError, HttpConflictError, httpStatusCodes } from '../utils/httpErrors.js';
import { uploadAvatar, deleteFromCloudinary } from '../services/uploadService.js';
import prisma from '../config/prisma.js';

// INSCRIPTION - POST /api/auth/register
const register = asyncHandler(async (req, res) => {
  // 1. Valide les données reçues
  const validatedData = validateData(registerSchema, req.body);
  const { username, email, password } = validatedData;

  // 2. Vérifie si l'email existe déjà
  const existingEmail = await prisma.user.findUnique({
    where: { email },
  });

  if (existingEmail) {
    throw new HttpConflictError('Cet email est déjà utilisé');
  }

  // 3. Vérifie si le username existe déjà
  const existingUsername = await prisma.user.findUnique({
    where: { username },
  });

  if (existingUsername) {
    throw new HttpConflictError('Ce nom d\'utilisateur est déjà pris');
  }

  // 4. Hash le mot de passe
  const hashedPassword = await hashPassword(password);

  // 5. Crée l'utilisateur en base de données
  const user = await prisma.user.create({
    data: {
      username,
      email,
      password: hashedPassword,
      role: 'USER', // Par défaut, nouveau user = USER
    },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      dateInscription: true,
      // On ne renvoie JAMAIS le mot de passe
    },
  });

  // 6. Génère un token JWT
  const token = generateToken(user.id, user.role);

  // 7. Envoie le token dans un cookie httpOnly (sécurisé contre XSS)
  res.cookie('token', token, {
    httpOnly: true, // Inaccessible via JavaScript (protection XSS)
    secure: process.env.NODE_ENV === 'production', // HTTPS uniquement en production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Protection CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours en millisecondes
  });

  // 8. Renvoie la réponse (sans le token dans le JSON)
  res.status(httpStatusCodes.CREATED).json({
    success: true,
    message: 'Inscription réussie',
    data: {
      user,
    },
  });
});

// CONNEXION - POST /api/auth/login
const login = asyncHandler(async (req, res) => {
  // 1. Valide les données reçues
  const validatedData = validateData(loginSchema, req.body);
  const { email, password } = validatedData;

  // 2. Cherche l'utilisateur par email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new HttpUnauthorizedError('Email ou mot de passe incorrect');
  }

  // 3. Vérifie le mot de passe
  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new HttpUnauthorizedError('Email ou mot de passe incorrect');
  }

  // 4. Génère un token JWT
  const token = generateToken(user.id, user.role);

  // 5. Envoie le token dans un cookie httpOnly (sécurisé contre XSS)
  res.cookie('token', token, {
    httpOnly: true, // Inaccessible via JavaScript (protection XSS)
    secure: process.env.NODE_ENV === 'production', // HTTPS uniquement en production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // Protection CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours en millisecondes
  });

  // 6. Renvoie la réponse (sans le mot de passe ni le token)
  res.status(httpStatusCodes.OK).json({
    success: true,
    message: 'Connexion réussie',
    data: {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        dateInscription: user.dateInscription,
      },
    },
  });
});

// PROFIL - GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  // req.user est déjà rempli par authMiddleware
  res.status(httpStatusCodes.OK).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

// UPLOAD AVATAR - PUT /api/auth/avatar
const updateAvatar = asyncHandler(async (req, res) => {
  // 1. Vérifie qu'un fichier a été uploadé
  if (!req.file) {
    throw new HttpBadRequestError('Aucune image fournie');
  }

  // 2. Supprime l'ancien avatar si présent
  if (req.user.avatar) {
    await deleteFromCloudinary(req.user.avatar);
  }

  // 3. Upload le nouvel avatar
  const avatarUrl = await uploadAvatar(req.file.buffer);

  // 4. Met à jour l'utilisateur
  const updatedUser = await prisma.user.update({
    where: { id: req.user.id },
    data: { avatar: avatarUrl },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
      avatar: true,
      dateInscription: true,
    },
  });

  // 5. Renvoie la réponse
  res.status(httpStatusCodes.OK).json({
    success: true,
    message: 'Avatar mis à jour',
    data: {
      user: updatedUser,
    },
  });
});

// DÉCONNEXION - POST /api/auth/logout
const logout = asyncHandler(async (req, res) => {
  // Supprime le cookie en le remplaçant par un cookie expiré
  res.cookie('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 0, // Expire immédiatement
  });

  res.status(httpStatusCodes.OK).json({
    success: true,
    message: 'Déconnexion réussie',
  });
});

export { register, login, logout, getMe, updateAvatar };