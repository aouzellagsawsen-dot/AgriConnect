export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sceau de Vérification</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #F7F4EB; margin: 0; padding: 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid rgba(212, 175, 55, 0.2); box-shadow: 0 10px 25px rgba(212, 175, 55, 0.05);">
    <tr>
      <td style="background-color: #0B0C10; padding: 40px 20px; text-align: center; border-bottom: 2px solid #D4AF37;">
        <h1 style="color: #D4AF37; margin: 0; font-family: 'Georgia', serif; font-size: 22px; font-weight: normal; letter-spacing: 3px; text-transform: uppercase;">L'Archive de votre existence</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px; text-align: center;">
        <h2 style="color: #0B0C10; font-family: 'Georgia', serif; font-size: 24px; margin-bottom: 20px;">Sceau de Vérification</h2>
        <p style="color: #666666; font-size: 16px; margin-bottom: 10px;">Salutations, futur auteur.</p>
        <p style="color: #666666; font-size: 16px; margin-bottom: 30px;">Avant de confier vos souvenirs à notre alchimiste numérique, nous devons sceller votre inscription. Voici la clef de votre archive :</p>
        
        <div style="margin: 30px 0;">
          <span style="font-family: 'Georgia', serif; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #D4AF37; background-color: #F7F4EB; padding: 20px 30px; border: 1px solid rgba(212, 175, 55, 0.3); display: inline-block;">{verificationCode}</span>
        </div>
        
        <p style="color: #888888; font-size: 14px; margin-top: 30px;">Ce parchemin numérique expirera dans 15 minutes pour des raisons de sécurité.</p>
        <p style="color: #888888; font-size: 14px;">Si vous n'avez pas demandé l'ouverture de cette archive, veuillez ignorer cette missive.</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #F7F4EB; padding: 20px; text-align: center; border-top: 1px solid rgba(212, 175, 55, 0.2);">
        <p style="color: #888888; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin: 0;">Ceci est un message automatisé. Veuillez ne pas y répondre.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Requête de Nouvelle Clef</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #F7F4EB; margin: 0; padding: 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid rgba(212, 175, 55, 0.2); box-shadow: 0 10px 25px rgba(212, 175, 55, 0.05);">
    <tr>
      <td style="background-color: #0B0C10; padding: 40px 20px; text-align: center; border-bottom: 2px solid #D4AF37;">
        <h1 style="color: #D4AF37; margin: 0; font-family: 'Georgia', serif; font-size: 22px; font-weight: normal; letter-spacing: 3px; text-transform: uppercase;">L'Archive de votre existence</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px; text-align: center;">
        <h2 style="color: #0B0C10; font-family: 'Georgia', serif; font-size: 24px; margin-bottom: 20px;">Clef Égarée</h2>
        <p style="color: #666666; font-size: 16px; margin-bottom: 10px;">Salutations,</p>
        <p style="color: #666666; font-size: 16px; margin-bottom: 30px;">Nous avons reçu une requête pour forger une nouvelle clef d'accès à votre roman royal. Si vous êtes à l'origine de cette demande, veuillez cliquer sur le lien ci-dessous :</p>
        
        <div style="margin: 35px 0;">
          <a href="{resetURL}" style="background-color: #D4AF37; color: #ffffff; padding: 16px 32px; text-decoration: none; font-size: 12px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; display: inline-block; transition: background-color 0.3s;">Forger une nouvelle clef</a>
        </div>
        
        <p style="color: #888888; font-size: 14px; margin-top: 30px;">Ce passage restera ouvert pendant 1 heure.</p>
        <p style="color: #888888; font-size: 14px;">Si cette demande ne vient pas de vous, votre archive reste sécurisée. Ignorez simplement cette missive.</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #F7F4EB; padding: 20px; text-align: center; border-top: 1px solid rgba(212, 175, 55, 0.2);">
        <p style="color: #888888; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin: 0;">Ceci est un message automatisé. Veuillez ne pas y répondre.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Clef Forgée avec Succès</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #F7F4EB; margin: 0; padding: 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid rgba(212, 175, 55, 0.2); box-shadow: 0 10px 25px rgba(212, 175, 55, 0.05);">
    <tr>
      <td style="background-color: #0B0C10; padding: 40px 20px; text-align: center; border-bottom: 2px solid #D4AF37;">
        <h1 style="color: #D4AF37; margin: 0; font-family: 'Georgia', serif; font-size: 22px; font-weight: normal; letter-spacing: 3px; text-transform: uppercase;">L'Archive de votre existence</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 40px 30px; text-align: center;">
        <div style="margin-bottom: 20px;">
          <div style="background-color: #F7F4EB; border: 2px solid #D4AF37; color: #D4AF37; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; display: inline-block; font-size: 30px;">
            ✓
          </div>
        </div>
        <h2 style="color: #0B0C10; font-family: 'Georgia', serif; font-size: 24px; margin-bottom: 20px;">Archive Sécurisée</h2>
        <p style="color: #666666; font-size: 16px; margin-bottom: 20px;">Salutations,</p>
        <p style="color: #666666; font-size: 16px; margin-bottom: 30px;">Nous vous confirmons que votre nouvelle clef d'accès a été forgée et scellée avec succès. Les portes de votre archive vous sont de nouveau ouvertes.</p>
        
        <div style="text-align: left; background-color: #F7F4EB; padding: 20px; border-left: 3px solid #D4AF37; margin: 30px 0;">
          <p style="margin: 0 0 10px 0; color: #333333; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Conseils de l'Alchimiste :</p>
          <ul style="margin: 0; padding-left: 20px; color: #666666; font-size: 14px;">
            <li style="margin-bottom: 5px;">Conservez cette clef précieusement.</li>
            <li>Ne la partagez avec aucun tiers.</li>
          </ul>
        </div>
        
        <p style="color: #888888; font-size: 14px;">Si vous n'êtes pas à l'origine de cette modification, veuillez contacter nos scribes immédiatement.</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: #F7F4EB; padding: 20px; text-align: center; border-top: 1px solid rgba(212, 175, 55, 0.2);">
        <p style="color: #888888; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin: 0;">Ceci est un message automatisé. Veuillez ne pas y répondre.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;