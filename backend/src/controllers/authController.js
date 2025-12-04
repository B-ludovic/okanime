import { asyncHandler } from '../middlewares/errorHandler.js';
import { registerSchema, loginSchema, validateData } from '../validators/authValidator.js';
import { hashPassword, comparePassword } from '../utils/bcrypt.js';
import { generateToken } from '../utils/jwt.js';
import { HttpBadRequestError, HttpUnauthorizedError, HttpConflictError, httpStatusCodes } from '../utils/httpErrors.js';
import { uploadAvatar, deleteFromCloudinary } from '../services/uploadService.js';
import { sendConfirmationEmail, sendPasswordResetEmail } from '../services/emailService.js';
import prisma from '../config/prisma.js';
import crypto from 'crypto';

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
      emailVerified: true,
      dateInscription: true,
      // On ne renvoie JAMAIS le mot de passe
    },
  });

  // 6. Génère un token de vérification d'email
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      token: verificationToken,
      expiresAt,
    },
  });

  // 7. Envoie l'email de confirmation
  try {
    await sendConfirmationEmail(user.email, user.username, verificationToken);
  } catch (error) {
    // On ne bloque pas l'inscription si l'email échoue
  }

  // 8. Génère un token JWT
  const token = generateToken(user.id, user.role);

  // 9. Renvoie la réponse
  res.status(httpStatusCodes.CREATED).json({
    success: true,
    message: 'Inscription réussie ! Veuillez vérifier votre email pour confirmer votre compte.',
    data: {
      user,
      token,
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

  // 5. Renvoie la réponse (sans le mot de passe)
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
      token,
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

// CONFIRMATION EMAIL - GET /api/auth/confirm/:token
// Cette fonction vérifie le token et active le compte utilisateur
const confirmEmail = asyncHandler(async (req, res) => {
  // 1. Récupère le token depuis l'URL
  const { token } = req.params;

  // 2. Cherche le token dans la base de données
  const verificationToken = await prisma.emailVerificationToken.findUnique({
    where: { token },
    include: { user: true }, // Inclut les infos de l'utilisateur
  });

  // 3. Vérifie que le token existe
  if (!verificationToken) {
    throw new HttpBadRequestError('Token invalide ou expiré');
  }

  // 4. Vérifie que le token n'est pas expiré
  if (new Date() > verificationToken.expiresAt) {
    // Supprime le token expiré de la BDD
    await prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    });
    throw new HttpBadRequestError('Token expiré. Veuillez demander un nouveau lien de confirmation.');
  }

  // 5. Vérifie si l'email est déjà confirmé
  if (verificationToken.user.emailVerified) {
    // Supprime le token car déjà utilisé
    await prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    });
    throw new HttpBadRequestError('Email déjà confirmé');
  }

  // 6. Active le compte utilisateur
  await prisma.user.update({
    where: { id: verificationToken.userId },
    data: { emailVerified: true },
  });

  // 7. Supprime le token après utilisation
  await prisma.emailVerificationToken.delete({
    where: { id: verificationToken.id },
  });

  // 8. Renvoie la réponse de succès
  res.status(httpStatusCodes.OK).json({
    success: true,
    message: 'Email confirmé avec succès ! Vous pouvez maintenant vous connecter.',
  });
});

// RENVOYER EMAIL DE CONFIRMATION - POST /api/auth/resend-confirmation
// Cette fonction permet de renvoyer un email de confirmation si le premier a expiré
const resendConfirmationEmail = asyncHandler(async (req, res) => {
  // 1. Récupère l'email depuis le body de la requête
  const { email } = req.body;

  // 2. Vérifie que l'email est fourni
  if (!email) {
    throw new HttpBadRequestError('Email requis');
  }

  // 3. Cherche l'utilisateur par email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // 4. Vérifie que l'utilisateur existe
  if (!user) {
    throw new HttpBadRequestError('Aucun compte associé à cet email');
  }

  // 5. Vérifie si l'email est déjà confirmé
  if (user.emailVerified) {
    throw new HttpBadRequestError('Email déjà confirmé');
  }

  // 6. Supprime les anciens tokens de cet utilisateur
  await prisma.emailVerificationToken.deleteMany({
    where: { userId: user.id },
  });

  // 7. Génère un nouveau token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 heures

  // 8. Sauvegarde le nouveau token en BDD
  await prisma.emailVerificationToken.create({
    data: {
      userId: user.id,
      token: verificationToken,
      expiresAt,
    },
  });

  // 5. Envoie l'email
  try {
    await sendConfirmationEmail(user.email, user.username, verificationToken);
  } catch (error) {
    throw new HttpBadRequestError('Impossible d\'envoyer l\'email. Réessayez plus tard.');
  }

  // 10. Renvoie la réponse de succès
  res.status(httpStatusCodes.OK).json({
    success: true,
    message: 'Email de confirmation renvoyé avec succès',
  });
});

// MOT DE PASSE OUBLIÉ - POST /api/auth/forgot-password
// Cette fonction génère un token de reset et envoie l'email
const forgotPassword = asyncHandler(async (req, res) => {
  // 1. Récupère l'email depuis le body
  const { email } = req.body;

  // 2. Vérifie que l'email est fourni
  if (!email) {
    throw new HttpBadRequestError('Email requis');
  }

  // 3. Cherche l'utilisateur par email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  // 4. Si l'utilisateur n'existe pas, on répond quand même "Email envoyé"
  // Sécurité : ne pas révéler si un email existe ou non dans la BDD
  if (!user) {
    return res.status(httpStatusCodes.OK).json({
      success: true,
      message: 'Si cet email existe, un lien de réinitialisation a été envoyé.',
    });
  }

  // 5. Supprime les anciens tokens de reset de cet utilisateur
  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id },
  });

  // 6. Génère un nouveau token (32 bytes = 64 caractères hexa)
  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

  // 7. Sauvegarde le token en BDD
  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token: resetToken,
      expiresAt,
    },
  });

  // 8. Envoie l'email avec le lien de reset
  try {
    await sendPasswordResetEmail(user.email, user.username, resetToken);
  } catch (error) {
    throw new HttpBadRequestError('Impossible d\'envoyer l\'email. Réessayez plus tard.');
  }

  // 9. Renvoie la réponse de succès
  res.status(httpStatusCodes.OK).json({
    success: true,
    message: 'Si cet email existe, un lien de réinitialisation a été envoyé.',
  });
});

// RÉINITIALISER LE MOT DE PASSE - POST /api/auth/reset-password
// Cette fonction valide le token et change le mot de passe
const resetPassword = asyncHandler(async (req, res) => {
  // 1. Récupère le token et le nouveau mot de passe
  const { token, newPassword } = req.body;

  // 2. Vérifie que les champs sont fournis
  if (!token || !newPassword) {
    throw new HttpBadRequestError('Token et nouveau mot de passe requis');
  }

  // 3. Vérifie la longueur du mot de passe
  if (newPassword.length < 8) {
    throw new HttpBadRequestError('Le mot de passe doit contenir au moins 8 caractères');
  }

  // 4. Cherche le token dans la BDD
  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token },
    include: { user: true },
  });

  // 5. Vérifie que le token existe
  if (!resetToken) {
    throw new HttpBadRequestError('Token invalide ou expiré');
  }

  // 6. Vérifie que le token n'est pas expiré
  if (new Date() > resetToken.expiresAt) {
    // Supprime le token expiré
    await prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });
    throw new HttpBadRequestError('Token expiré. Veuillez faire une nouvelle demande.');
  }

  // 7. Hash le nouveau mot de passe
  const hashedPassword = await hashPassword(newPassword);

  // 8. Met à jour le mot de passe de l'utilisateur
  await prisma.user.update({
    where: { id: resetToken.userId },
    data: { password: hashedPassword },
  });

  // 9. Supprime le token après utilisation
  await prisma.passwordResetToken.delete({
    where: { id: resetToken.id },
  });

  // 10. Renvoie la réponse de succès
  res.status(httpStatusCodes.OK).json({
    success: true,
    message: 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.',
  });
});

export { register, login, getMe, updateAvatar, confirmEmail, resendConfirmationEmail, forgotPassword, resetPassword };