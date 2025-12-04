// Templates d'emails O'Kanime
// Charte graphique cohérente avec le site
// Les styles sont inline car les clients emails ne supportent pas les CSS externes

const emailConfirmationTemplate = (username, confirmationLink) => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmez votre compte O'Kanime</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0F172A; background-color: #F8FAFC; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #FFFFFF; border-radius: 1rem; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="background-color: #FFFFFF; padding: 40px 30px 20px; text-align: center; border-bottom: 2px solid #E2E7EB;">
      <h1 style="margin: 0; color: #3B82F6; font-size: 28px; font-weight: 700;">🎌 O'Kanime</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #0F172A; font-size: 22px; font-weight: 600; margin-top: 0; margin-bottom: 20px;">
        Bienvenue ${username} ! 👋
      </h2>
      
      <p style="color: #475569; font-size: 16px; margin: 16px 0; line-height: 1.7;">
        Merci de vous être inscrit sur <strong style="color: #0F172A;">O'Kanime</strong>. Pour activer votre compte et commencer à gérer votre bibliothèque d'animés, veuillez confirmer votre adresse email.
      </p>
      
      <!-- Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${confirmationLink}" style="display: inline-block; background-color: #3B82F6; color: #FFFFFF !important; text-decoration: none; padding: 14px 32px; border-radius: 0.5rem; font-weight: 600; font-size: 16px;">
          Confirmer mon email
        </a>
      </div>
      
      <!-- Info Box -->
      <div style="background-color: #EFF6FF; border-left: 4px solid #3B82F6; padding: 16px 20px; margin: 24px 0; border-radius: 0.5rem;">
        <p style="margin: 0; color: #1E40AF; font-size: 15px;">
          <strong>⏱️ Ce lien est valide pendant 24 heures.</strong>
        </p>
      </div>
      
      <p style="color: #475569; font-size: 16px; margin: 16px 0; line-height: 1.7;">
        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
      </p>
      
      <!-- Link Box -->
      <div style="background-color: #F8FAFC; padding: 16px; border-radius: 0.5rem; margin: 20px 0; word-break: break-all;">
        <a href="${confirmationLink}" style="color: #3B82F6; font-size: 14px; text-decoration: none;">
          ${confirmationLink}
        </a>
      </div>
      
      <div style="height: 1px; background-color: #E2E7EB; margin: 30px 0;"></div>
      
      <p style="color: #64748B; font-size: 14px; margin: 16px 0;">
        Si vous n'avez pas créé de compte sur O'Kanime, vous pouvez ignorer cet email en toute sécurité.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #F8FAFC; padding: 30px; text-align: center; color: #64748B; font-size: 14px; border-top: 1px solid #E2E7EB;">
      <p style="margin: 8px 0; font-size: 13px; color: #94A3B8;">
        © 2025 O'Kanime - Votre bibliothèque d'animés en ligne
      </p>
      <p style="margin: 8px 0; font-size: 13px; color: #94A3B8;">
        Cet email a été envoyé à votre adresse suite à votre inscription sur <strong>okanime.live</strong>
      </p>
    </div>
    
  </div>
</body>
</html>
  `;
};

const passwordResetTemplate = (username, resetLink) => {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Réinitialisation de mot de passe - O'Kanime</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #0F172A; background-color: #F8FAFC; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #FFFFFF; border-radius: 1rem; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    
    <!-- Header -->
    <div style="background-color: #FFFFFF; padding: 40px 30px 20px; text-align: center; border-bottom: 2px solid #E2E7EB;">
      <h1 style="margin: 0; color: #3B82F6; font-size: 28px; font-weight: 700;">🎌 O'Kanime</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      <h2 style="color: #0F172A; font-size: 22px; font-weight: 600; margin-top: 0; margin-bottom: 20px;">
        Réinitialisation de mot de passe 🔒
      </h2>
      
      <p style="color: #475569; font-size: 16px; margin: 16px 0; line-height: 1.7;">
        Bonjour <strong style="color: #0F172A;">${username}</strong>,
      </p>
      
      <p style="color: #475569; font-size: 16px; margin: 16px 0; line-height: 1.7;">
        Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte O'Kanime. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
      </p>
      
      <!-- Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="display: inline-block; background-color: #3B82F6; color: #FFFFFF !important; text-decoration: none; padding: 14px 32px; border-radius: 0.5rem; font-weight: 600; font-size: 16px;">
          Réinitialiser mon mot de passe
        </a>
      </div>
      
      <!-- Warning Box -->
      <div style="background-color: #FEF3C7; border-left: 4px solid #F59E0B; padding: 16px 20px; margin: 24px 0; border-radius: 0.5rem;">
        <p style="margin: 0; color: #92400E; font-size: 15px;">
          <strong>⚠️ Important :</strong> Ce lien est valide pendant 1 heure seulement. Passé ce délai, vous devrez faire une nouvelle demande.
        </p>
      </div>
      
      <p style="color: #475569; font-size: 16px; margin: 16px 0; line-height: 1.7;">
        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
      </p>
      
      <!-- Link Box -->
      <div style="background-color: #F8FAFC; padding: 16px; border-radius: 0.5rem; margin: 20px 0; word-break: break-all;">
        <a href="${resetLink}" style="color: #3B82F6; font-size: 14px; text-decoration: none;">
          ${resetLink}
        </a>
      </div>
      
      <div style="height: 1px; background-color: #E2E7EB; margin: 30px 0;"></div>
      
      <p style="color: #64748B; font-size: 14px; margin: 16px 0;">
        <strong style="color: #0F172A;">Vous n'avez pas demandé cette réinitialisation ?</strong><br>
        Ignorez simplement cet email. Votre mot de passe actuel restera inchangé et votre compte est en sécurité.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #F8FAFC; padding: 30px; text-align: center; color: #64748B; font-size: 14px; border-top: 1px solid #E2E7EB;">
      <p style="margin: 8px 0; font-size: 13px; color: #94A3B8;">
        © 2025 O'Kanime - Votre bibliothèque d'animés en ligne
      </p>
      <p style="margin: 8px 0; font-size: 13px; color: #94A3B8;">
        Pour des raisons de sécurité, <strong>ne partagez jamais ce lien</strong> avec personne.
      </p>
    </div>
    
  </div>
</body>
</html>
  `;
};

export { emailConfirmationTemplate, passwordResetTemplate };