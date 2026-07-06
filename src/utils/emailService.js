// Email Service for Password Reset
// Configure with your email provider (Gmail, SendGrid, Mailgun, etc.)

/**
 * Send password reset email
 * @param {string} email - Recipient email address
 * @param {string} resetToken - Reset token to include in the link
 * @param {string} resetLink - Full reset link URL
 * @returns {Promise<object>} - Response from email service
 */
const sendPasswordResetEmail = async (email, resetToken, resetLink) => {
  // Option 1: Using nodemailer with Gmail
  // Install: npm install nodemailer

  /*
  const nodemailer = require('nodemailer');

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Request',
    html: generatePasswordResetEmailHTML(resetLink),
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return { success: true, message: 'Reset email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send reset email');
  }
  */

  // Option 2: Using SendGrid
  // Install: npm install @sendgrid/mail

  /*
  const sgMail = require('@sendgrid/mail');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL,
    subject: 'Password Reset Request',
    html: generatePasswordResetEmailHTML(resetLink),
  };

  try {
    await sgMail.send(msg);
    console.log('Email sent via SendGrid');
    return { success: true, message: 'Reset email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send reset email');
  }
  */

  // Option 3: Using Mailgun
  // Install: npm install mailgun.js

  /*
  const mailgun = require('mailgun.js');
  const mg = mailgun.client({
    username: 'api',
    key: process.env.MAILGUN_API_KEY,
  });

  try {
    const data = {
      from: process.env.MAILGUN_FROM_EMAIL,
      to: email,
      subject: 'Password Reset Request',
      html: generatePasswordResetEmailHTML(resetLink),
    };

    const result = await mg.messages.create(
      process.env.MAILGUN_DOMAIN,
      data
    );

    console.log('Email sent via Mailgun:', result.id);
    return { success: true, message: 'Reset email sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send reset email');
  }
  */

  // Placeholder for demo
  console.log(`Password reset link for ${email}: ${resetLink}`);
  return { success: true, message: "Reset email sent successfully" };
};

/**
 * Generate HTML template for password reset email
 * @param {string} resetLink - Full reset link URL
 * @returns {string} - HTML email template
 */
const generatePasswordResetEmailHTML = (resetLink) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; border-radius: 8px; margin: 20px 0; }
          .button { display: inline-block; background-color: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          
          <div class="content">
            <p>Hi,</p>
            <p>We received a request to reset your password. Click the button below to reset your password. This link will expire in 1 hour.</p>
            
            <center>
              <a href="${resetLink}" class="button">Reset Password</a>
            </center>
            
            <p>Or copy and paste this link in your browser:</p>
            <p><a href="${resetLink}">${resetLink}</a></p>
            
            <p>If you didn't request a password reset, please ignore this email or contact our support team.</p>
            
            <p>Best regards,<br>Quiz App Team</p>
          </div>
          
          <div class="footer">
            <p>This is an automated email. Please do not reply to this message.</p>
            <p>&copy; 2024 Quiz App. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;
};

/**
 * Send account confirmation email (optional)
 * @param {string} email - Recipient email
 * @param {string} name - User name
 * @returns {Promise<object>} - Email send response
 */
const sendWelcomeEmail = async (email, name) => {
  const welcomeHTML = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Quiz App!</h1>
          </div>
          
          <div class="content">
            <p>Hi ${name},</p>
            <p>Welcome to our Quiz App community! Your account has been successfully created.</p>
            <p>You can now log in and start taking quizzes to test your knowledge.</p>
            <p>Best regards,<br>Quiz App Team</p>
          </div>
        </div>
      </body>
    </html>
  `;

  console.log(`Welcome email for ${email}: ${name}`);
  return { success: true, message: "Welcome email sent successfully" };
};

module.exports = {
  sendPasswordResetEmail,
  generatePasswordResetEmailHTML,
  sendWelcomeEmail,
};
