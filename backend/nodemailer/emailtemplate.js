export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Verification</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #162A12; margin: 0; padding: 40px 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #FCFBF7; border-radius: 40px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
    <tr>
      <td style="padding: 40px 40px 20px 40px; text-align: center;">
        <span style="font-size: 12px; font-weight: bold; letter-spacing: 3px; color: #557A46; text-transform: uppercase; display: block; margin-bottom: 10px;">AgriConnect</span>
        <h1 style="color: #1A3619; margin: 0; font-family: 'Georgia', serif; font-size: 28px; font-weight: bold;">Welcome aboard!</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 40px 40px 40px; text-align: center;">
        <p style="color: #4b5563; font-size: 16px; margin-bottom: 30px;">Hello,</p>
        <p style="color: #4b5563; font-size: 16px; margin-bottom: 30px;">To complete the setup of your AgriConnect account, please use the verification code below:</p>
        
        <div style="margin: 30px 0;">
          <span style="font-family: 'Helvetica Neue', Helvetica, sans-serif; font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #D96B40; background-color: white; padding: 20px 40px; border: 2px solid rgba(26, 54, 25, 0.1); border-radius: 16px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">{verificationCode}</span>
        </div>
        
        <p style="color: #9ca3af; font-size: 14px; margin-top: 30px;">This code will expire in 24 hours for security reasons.</p>
        <p style="color: #9ca3af; font-size: 14px;">If you didn't create an AgriConnect account, you can safely ignore this email.</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: rgba(26, 54, 25, 0.05); padding: 20px; text-align: center;">
        <p style="color: #9ca3af; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin: 0;">This is an automated message. Please do not reply.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Request</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #162A12; margin: 0; padding: 40px 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #FCFBF7; border-radius: 40px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
    <tr>
      <td style="padding: 40px 40px 20px 40px; text-align: center;">
        <span style="font-size: 12px; font-weight: bold; letter-spacing: 3px; color: #557A46; text-transform: uppercase; display: block; margin-bottom: 10px;">AgriConnect</span>
        <h1 style="color: #1A3619; margin: 0; font-family: 'Georgia', serif; font-size: 28px; font-weight: bold;">Forgot your password?</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 40px 40px 40px; text-align: center;">
        <p style="color: #4b5563; font-size: 16px; margin-bottom: 30px;">Hello,</p>
        <p style="color: #4b5563; font-size: 16px; margin-bottom: 30px;">We received a request to reset the password for your AgriConnect account. If you made this request, please click the button below:</p>
        
        <div style="margin: 35px 0;">
          <a href="{resetURL}" style="background-color: #D96B40; color: #ffffff; padding: 16px 32px; text-decoration: none; font-size: 14px; font-weight: bold; border-radius: 12px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(217, 107, 64, 0.3);">Reset my password</a>
        </div>
        
        <p style="color: #9ca3af; font-size: 14px; margin-top: 30px;">This link will remain valid for 1 hour.</p>
        <p style="color: #9ca3af; font-size: 14px;">If you didn't request a password reset, your account is safe. You can simply ignore this email.</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: rgba(26, 54, 25, 0.05); padding: 20px; text-align: center;">
        <p style="color: #9ca3af; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin: 0;">This is an automated message. Please do not reply.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Updated Successfully</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #162A12; margin: 0; padding: 40px 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #FCFBF7; border-radius: 40px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
    <tr>
      <td style="padding: 40px 40px 20px 40px; text-align: center;">
        <span style="font-size: 12px; font-weight: bold; letter-spacing: 3px; color: #557A46; text-transform: uppercase; display: block; margin-bottom: 10px;">AgriConnect</span>
        <div style="margin: 20px auto; background-color: #d1fae5; color: #059669; width: 60px; height: 60px; line-height: 60px; border-radius: 16px; display: inline-block; font-size: 30px; font-weight: bold;">
          ✓
        </div>
        <h1 style="color: #1A3619; margin: 0; font-family: 'Georgia', serif; font-size: 28px; font-weight: bold;">Success!</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 10px 40px 40px 40px; text-align: center;">
        <p style="color: #4b5563; font-size: 16px; margin-bottom: 20px;">Hello,</p>
        <p style="color: #4b5563; font-size: 16px; margin-bottom: 30px;">We confirm that your password has been successfully updated. You can now use your new password to access your AgriConnect account.</p>
        
        <div style="text-align: left; background-color: white; padding: 20px; border-left: 4px solid #557A46; border-radius: 8px; margin: 30px 0; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
          <p style="margin: 0 0 10px 0; color: #1A3619; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">Security Reminder:</p>
          <ul style="margin: 0; padding-left: 20px; color: #6b7280; font-size: 14px;">
            <li style="margin-bottom: 5px;">Never share your password with anyone.</li>
            <li>The AgriConnect team will never ask for your password.</li>
          </ul>
        </div>
        
        <p style="color: #9ca3af; font-size: 14px;">If you did not make this change, please contact us immediately.</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: rgba(26, 54, 25, 0.05); padding: 20px; text-align: center;">
        <p style="color: #9ca3af; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin: 0;">This is an automated message. Please do not reply.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;

export const WELCOME_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to AgriConnect</title>
</head>
<body style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #333333; background-color: #162A12; margin: 0; padding: 40px 20px;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #FCFBF7; border-radius: 40px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
    <tr>
      <td style="padding: 40px 40px 20px 40px; text-align: center;">
        <span style="font-size: 12px; font-weight: bold; letter-spacing: 3px; color: #557A46; text-transform: uppercase; display: block; margin-bottom: 10px;">AgriConnect</span>
        <h1 style="color: #1A3619; margin: 0; font-family: 'Georgia', serif; font-size: 28px; font-weight: bold;">Welcome to the community!</h1>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 40px 40px 40px; text-align: center;">
        <p style="color: #4b5563; font-size: 18px; font-weight: bold; margin-bottom: 20px;">Hello {name},</p>
        <p style="color: #4b5563; font-size: 16px; margin-bottom: 30px;">We are thrilled to have you on board. Your account has been successfully verified, and you are now ready to explore everything AgriConnect has to offer.</p>
        
        <div style="margin: 35px 0;">
          <a href="http://localhost:5173/dashboard" style="background-color: #D96B40; color: #ffffff; padding: 16px 32px; text-decoration: none; font-size: 14px; font-weight: bold; border-radius: 12px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(217, 107, 64, 0.3);">Go to Dashboard</a>
        </div>
        
        <p style="color: #9ca3af; font-size: 14px; margin-top: 30px;">If you have any questions, our support team is always here to help.</p>
      </td>
    </tr>
    <tr>
      <td style="background-color: rgba(26, 54, 25, 0.05); padding: 20px; text-align: center;">
        <p style="color: #9ca3af; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin: 0;">This is an automated message. Please do not reply.</p>
      </td>
    </tr>
  </table>
</body>
</html>
`;