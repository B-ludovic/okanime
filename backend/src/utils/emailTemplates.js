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
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1F2937; background-color: #F9FAFB; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #FFFFFF; border-radius: 1rem; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    
    <!-- Header avec logo et gradient -->
    <div style="background: linear-gradient(135deg, #BFDBFE 0%, #93C5FD 50%, #A5B4FC 100%); padding: 40px 30px; text-align: center;">
      <img src="https://okanime.live/icons/japan-flag.png" alt="O'Kanime" style="width: 50px; height: 50px; margin-bottom: 16px;" />
      <h1 style="margin: 0; color: #1F2937; font-size: 28px; font-family: 'Quicksand', sans-serif; font-weight: 700; letter-spacing: 0.03em;">O'Kanime</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="https://okanime.live/icons/hello.png" alt="Email" style="width: 64px; height: 64px;" />
      </div>
      
      <h2 style="color: #1F2937; font-size: 22px; font-weight: 600; margin-top: 0; margin-bottom: 20px; text-align: center;">
        Bienvenue ${username} !
      </h2>
      
      <p style="color: #6B7280; font-size: 16px; margin: 16px 0; line-height: 1.7;">
        Merci de vous être inscrit sur <strong style="color: #60A5FA; font-family: 'Quicksand', sans-serif;">O'Kanime</strong>. Pour activer votre compte et commencer à gérer votre bibliothèque d'animés, veuillez confirmer votre adresse email.
      </p>
      
      <!-- Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${confirmationLink}" style="display: inline-block; background: linear-gradient(135deg, #FFA69E 0%, #FFB6B0 100%); color: #FFFFFF !important; text-decoration: none; padding: 14px 32px; border-radius: 0.5rem; font-weight: 600; font-size: 16px; box-shadow: 0 2px 8px rgba(255, 166, 158, 0.3);">
          Confirmer mon email
        </a>
      </div>
      
      <!-- Info Box -->
      <div style="background-color: #BFDBFE; padding: 16px 20px; margin: 24px 0; border-radius: 0.5rem; box-shadow: 0 2px 8px rgba(96, 165, 250, 0.2); display: flex; align-items: center; gap: 12px;">
        <img src="https://okanime.live/icons/sand-timer.png" alt="Timer" style="width: 24px; height: 24px;" />
        <p style="margin: 0; color: #1F2937; font-size: 15px;">
          <strong>Ce lien est valide pendant 24 heures.</strong>
        </p>
      </div>
      
      <p style="color: #6B7280; font-size: 16px; margin: 16px 0; line-height: 1.7;">
        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
      </p>
      
      <!-- Link Box -->
      <div style="background-color: #F9FAFB; padding: 16px; border-radius: 0.5rem; margin: 20px 0; word-break: break-all;">
        <a href="${confirmationLink}" style="color: #60A5FA; font-size: 14px; text-decoration: none;">
          ${confirmationLink}
        </a>
      </div>
      
      <div style="height: 1px; background-color: #E5E7EB; margin: 30px 0;"></div>
      
      <p style="color: #6B7280; font-size: 14px; margin: 16px 0;">
        Si vous n'avez pas créé de compte sur O'Kanime, vous pouvez ignorer cet email en toute sécurité.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #F9FAFB; padding: 30px; text-align: center; color: #6B7280; font-size: 14px; border-top: 1px solid #E5E7EB;">
      <p style="margin: 8px 0; font-size: 13px;">
        © 2025 <strong style="font-family: 'Quicksand', sans-serif;">O'Kanime</strong> - Votre bibliothèque d'animés en ligne
      </p>
      <p style="margin: 8px 0; font-size: 13px;">
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
<body style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #1F2937; background-color: #F9FAFB; margin: 0; padding: 0;">
  <div style="max-width: 600px; margin: 40px auto; background-color: #FFFFFF; border-radius: 1rem; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
    
    <!-- Header avec logo et gradient -->
    <div style="background: linear-gradient(135deg, #BFDBFE 0%, #93C5FD 50%, #A5B4FC 100%); padding: 40px 30px; text-align: center;">
      <img src="https://okanime.live/icons/japan-flag.png" alt="O'Kanime" style="width: 50px; height: 50px; margin-bottom: 16px;" />
      <h1 style="margin: 0; color: #1F2937; font-size: 28px; font-family: 'Quicksand', sans-serif; font-weight: 700; letter-spacing: 0.03em;">O'Kanime</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px;">
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="https://okanime.live/icons/padlock.png" alt="Sécurité" style="width: 64px; height: 64px;" />
      </div>
      
      <h2 style="color: #1F2937; font-size: 22px; font-weight: 600; margin-top: 0; margin-bottom: 20px; text-align: center;">
        Réinitialisation de mot de passe
      </h2>
      
      <p style="color: #6B7280; font-size: 16px; margin: 16px 0; line-height: 1.7;">
        Bonjour <strong style="color: #1F2937;">${username}</strong>,
      </p>
      
      <p style="color: #6B7280; font-size: 16px; margin: 16px 0; line-height: 1.7;">
        Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte <strong style="font-family: 'Quicksand', sans-serif; color: #60A5FA;">O'Kanime</strong>. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe.
      </p>
      
      <!-- Button -->
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetLink}" style="display: inline-block; background: linear-gradient(135deg, #FFA69E 0%, #FFB6B0 100%); color: #FFFFFF !important; text-decoration: none; padding: 14px 32px; border-radius: 0.5rem; font-weight: 600; font-size: 16px; box-shadow: 0 2px 8px rgba(255, 166, 158, 0.3);">
          Réinitialiser mon mot de passe
        </a>
      </div>
      
      <!-- Warning Box -->
      <div style="background-color: #FEF3C7; padding: 16px 20px; margin: 24px 0; border-radius: 0.5rem; box-shadow: 0 2px 8px rgba(245, 158, 11, 0.2); display: flex; align-items: flex-start; gap: 12px;">
        <img src="https://okanime.live/icons/danger.png" alt="Important" style="width: 24px; height: 24px; margin-top: 2px;" />
        <p style="margin: 0; color: #92400E; font-size: 15px;">
          <strong>Important :</strong> Ce lien est valide pendant 1 heure seulement. Passé ce délai, vous devrez faire une nouvelle demande.
        </p>
      </div>
      
      <p style="color: #6B7280; font-size: 16px; margin: 16px 0; line-height: 1.7;">
        Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
      </p>
      
      <!-- Link Box -->
      <div style="background-color: #F9FAFB; padding: 16px; border-radius: 0.5rem; margin: 20px 0; word-break: break-all;">
        <a href="${resetLink}" style="color: #60A5FA; font-size: 14px; text-decoration: none;">
          ${resetLink}
        </a>
      </div>
      
      <div style="height: 1px; background-color: #E5E7EB; margin: 30px 0;"></div>
      
      <p style="color: #6B7280; font-size: 14px; margin: 16px 0;">
        <strong style="color: #1F2937;">Vous n'avez pas demandé cette réinitialisation ?</strong><br>
        Ignorez simplement cet email. Votre mot de passe actuel restera inchangé et votre compte est en sécurité.
      </p>
    </div>
    
    <!-- Footer -->
    <div style="background-color: #F9FAFB; padding: 30px; text-align: center; color: #6B7280; font-size: 14px; border-top: 1px solid #E5E7EB;">
      <p style="margin: 8px 0; font-size: 13px;">
        © 2025 <strong style="font-family: 'Quicksand', sans-serif;">O'Kanime</strong> - Votre bibliothèque d'animés en ligne
      </p>
      <p style="margin: 8px 0; font-size: 13px;">
        Pour des raisons de sécurité, <strong>ne partagez jamais ce lien</strong> avec personne.
      </p>
    </div>
    
  </div>
</body>
</html>
  `;
};

export { emailConfirmationTemplate, passwordResetTemplate };