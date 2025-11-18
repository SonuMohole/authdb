import nodemailer from 'nodemailer';

// ✅ Use environment variables for credentials (App Password or OAuth2)
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // Use Gmail App Password or OAuth2 for production
  },
});

// 🧩 Reusable HTML Email Template (Professional Look)
const generateEmailTemplate = (
  title: string,
  message: string,
  buttonText: string,
  buttonLink: string
) => `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      body {
        font-family: 'Segoe UI', Roboto, Arial, sans-serif;
        background-color: #f4f7fa;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background: #fff;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
      }
      .header {
        background-color: #007bff;
        padding: 20px;
        text-align: center;
        color: white;
      }
      .content {
        padding: 30px;
        text-align: center;
      }
      .content h2 {
        color: #007bff;
        margin-bottom: 20px;
      }
      .button {
        display: inline-block;
        margin-top: 20px;
        padding: 12px 25px;
        background-color: #007bff;
        color: #fff !important;
        text-decoration: none;
        border-radius: 6px;
        font-weight: bold;
        transition: background-color 0.2s;
      }
      .button:hover {
        background-color: #0056b3;
      }
      .footer {
        text-align: center;
        font-size: 13px;
        color: #888;
        padding: 20px;
        background: #f4f4f4;
      }
      @media only screen and (max-width: 600px) {
        .content { padding: 20px; }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header"><h1>${title}</h1></div>
      <div class="content">
        <h2>Hello!</h2>
        <p>${message}</p>
        <a href="${buttonLink}" class="button">${buttonText}</a>
      </div>
      <div class="footer">
        <p>If you didn’t request this, you can safely ignore this email.</p>
        <p>&copy; ${new Date().getFullYear()} Your Company Name. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;

// ✅ Verification Email Function
export const sendVerificationEmail = async (to: string, token: string) => {
  const verifyLink = `${process.env.BACKEND_URL.replace(/\/$/, '')}/api/auth/verify-email?token=${encodeURIComponent(token)}`;

  const html = generateEmailTemplate(
    'Verify Your Account',
    'Please verify your account by clicking the button below. This link is valid for 1 hour.',
    'Verify Account',
    verifyLink
  );

  await transporter.sendMail({
    to,
    from: process.env.SMTP_USER,
    subject: 'Verify Your Account - Secure Access',
    html,
  });
};

// ✅ Password Reset Email Function
export const sendResetEmail = async (to: string, token: string) => {
  const resetLink = `${process.env.FRONTEND_URL.replace(/\/$/, '')}/reset-password?token=${encodeURIComponent(token)}`;

  const html = generateEmailTemplate(
    'Reset Your Password',
    'You requested to reset your password. Click below to securely reset it. This link will expire in 1 hour.',
    'Reset Password',
    resetLink
  );

  await transporter.sendMail({
    to,
    from: process.env.SMTP_USER,
    subject: 'Reset Your Password - Secure Link',
    html,
  });
};
