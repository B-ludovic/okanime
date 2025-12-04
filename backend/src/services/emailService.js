import resend from '../config/resend.js';
import { emailConfirmationTemplate, passwordResetTemplate } from '../utils/emailTemplates.js';

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';

// Envoie un email de confirmation
export const sendConfirmationEmail = async (email, username, token) => {
  const confirmationLink = `${process.env.FRONTEND_URL}/confirm-email?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: `O'Kanime <${FROM_EMAIL}>`,
      to: email,
      subject: "Confirmez votre compte O'Kanime",
      html: emailConfirmationTemplate(username, confirmationLink),
    });

    if (error) {
      throw new Error('Erreur lors de l\'envoi de l\'email');
    }

    return data;
  } catch (error) {
    throw error;
  }
};

// Envoie un email de réinitialisation de mot de passe
export const sendPasswordResetEmail = async (email, username, token) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  try {
    const { data, error } = await resend.emails.send({
      from: `O'Kanime <${FROM_EMAIL}>`,
      to: email,
      subject: "Réinitialisation de votre mot de passe - O'Kanime",
      html: passwordResetTemplate(username, resetLink),
    });

    if (error) {
      throw new Error('Erreur lors de l\'envoi de l\'email');
    }

    return data;
  } catch (error) {
    throw error;
  }
};