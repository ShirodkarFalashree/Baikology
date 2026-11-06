const nodemailer = require('nodemailer');

/**
 * Creates and returns a Nodemailer transporter based on .env config.
 * Falls back to an Ethereal test account if credentials aren't provided.
 */
async function getTransporter() {
  // If SMTP or Gmail credentials exist in .env
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    if (process.env.EMAIL_SERVICE) {
      return nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE, // e.g. 'gmail'
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.mailtrap.io',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  // Fallback: Generate an Ethereal test SMTP account on the fly for development
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log('📬 Using Ethereal test email account for development:', testAccount.user);
    return nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (err) {
    console.warn('⚠️ Could not create Ethereal test account, will log email to console:', err.message);
    return null;
  }
}

/**
 * Sends a comforting, pastel-branded password reset email
 *
 * @param {string} toEmail - Recipient email address
 * @param {string} resetToken - Raw unhashed reset token
 * @param {string} userName - User's first or preferred name
 */
async function sendPasswordResetEmail(toEmail, resetToken, userName = 'lovely') {
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
  const resetUrl = `${clientUrl}/forgot-password?token=${resetToken}&email=${encodeURIComponent(toEmail)}`;

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #FFFAF5; margin: 0; padding: 24px; color: #403344; }
          .card { max-width: 520px; margin: 0 auto; background: #ffffff; border-radius: 28px; border: 1px solid #E9DFFF; padding: 36px; box-shadow: 0 10px 30px rgba(64,51,68,0.04); }
          .logo { display: inline-block; font-size: 20px; font-weight: bold; color: #403344; margin-bottom: 20px; }
          .flower { color: #C95B7E; }
          h2 { font-size: 24px; font-weight: 800; color: #403344; margin-top: 0; margin-bottom: 12px; }
          p { font-size: 15px; line-height: 1.6; color: #5F5363; margin-bottom: 18px; }
          .btn-container { text-align: center; margin: 28px 0; }
          .btn { display: inline-block; background: linear-gradient(135deg, #F9DDE5 0%, #E9DFFF 50%, #DDF3DE 100%); color: #403344; font-weight: 700; text-decoration: none; padding: 14px 32px; border-radius: 9999px; font-size: 14px; box-shadow: 0 4px 15px rgba(233,223,255,0.8); }
          .footer-note { font-size: 12px; color: #817583; border-top: 1px solid #F9DDE5; padding-top: 20px; margin-top: 24px; line-height: 1.5; }
          .token-box { background: #FFFAF5; border: 1px dashed #E9DFFF; border-radius: 12px; padding: 12px; font-size: 12px; word-break: break-all; color: #756291; margin-top: 14px; }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="logo">
            <span class="flower">🌷</span> Baikology
          </div>
          <h2>Reset your password, ${userName} 🤍</h2>
          <p>
            It happens! We received a gentle request to reset the password for your Baikology account (<strong>${toEmail}</strong>).
          </p>
          <p>
            Click the button below to choose a fresh password. This link is private to you and expires in 1 hour.
          </p>
          <div class="btn-container">
            <a href="${resetUrl}" class="btn" target="_blank">Reset my password →</a>
          </div>
          <p style="font-size: 13px; color: #817583;">
            If the button doesn't open, copy and paste this link into your browser:
          </p>
          <div class="token-box">
            ${resetUrl}
          </div>
          <div class="footer-note">
            <p style="margin: 0 0 6px 0;"><strong>Didn't request this?</strong></p>
            <p style="margin: 0;">
              No worries at all — you can safely ignore this email. Your account remains completely safe and unchanged.
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Baikology Care 🌷" <care@baikology.com>',
    to: toEmail,
    subject: '🌷 Reset your Baikology password',
    text: `Hello ${userName},\n\nWe received a request to reset your password for ${toEmail}.\n\nClick the link below to set a new password:\n${resetUrl}\n\nThis link will expire in 1 hour.\n\nIf you did not request this, please ignore this email.`,
    html: emailHtml,
  };

  const transporter = await getTransporter();

  if (!transporter) {
    console.log('\n================== [PASSWORD RESET EMAIL] ==================');
    console.log(`To: ${toEmail}`);
    console.log(`Reset URL: ${resetUrl}`);
    console.log('============================================================\n');
    return { success: true, mode: 'console_logged', resetUrl };
  }

  const info = await transporter.sendMail(mailOptions);
  console.log(`✨ Password reset email dispatched to ${toEmail} (ID: ${info.messageId})`);

  // If using Ethereal, log the preview URL for immediate browser inspection
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`🔗 Preview email in browser: ${previewUrl}`);
  }

  return {
    success: true,
    messageId: info.messageId,
    previewUrl,
    resetUrl,
  };
}

module.exports = {
  sendPasswordResetEmail,
};
