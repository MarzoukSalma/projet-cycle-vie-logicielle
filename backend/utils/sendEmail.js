const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

exports.sendResetPasswordEmail = async (to, resetLink) => {
  await transporter.sendMail({
    from: `"Recipe App 🍲" <${process.env.SMTP_USER}>`,
    to,
    subject: "Reset your password",
    html: `
      <h2>Password Reset</h2>
      <p>You requested to reset your password.</p>
      <p>Click the link below (valid for 1 hour):</p>
      <a href="${resetLink}">${resetLink}</a>
      <br/><br/>
      <p>If you didn’t request this, ignore this email.</p>
    `,
  });
};
