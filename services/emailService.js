import nodemailer from "nodemailer";

const {
  SMTP_HOST = "smtp.ukr.net",
  SMTP_PORT = 465,
  SMTP_SECURE = "true",
  SMTP_USER,
  SMTP_PASS,
  BASE_URL = "http://localhost:3000",
  SMTP_REJECT_UNAUTHORIZED = "true",
} = process.env;

const secure = String(SMTP_SECURE).toLowerCase() === "true";

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
  tls: { rejectUnauthorized: String(SMTP_REJECT_UNAUTHORIZED).toLowerCase() !== "false" },
});

export async function sendVerificationEmail(email, token) {
  const verifyLink = `${BASE_URL}/api/auth/verify/${token}`;
  console.info(`[verify-link] ${verifyLink}`);
  const info = await transporter.sendMail({
    from: SMTP_USER,
    to: email,
    subject: "Email verification",
    text: `Please verify your email by visiting: ${verifyLink}`,
    html: `<p>Please verify your email by clicking the link:</p><p><a href="${verifyLink}">${verifyLink}</a></p>`,
  });
  return info;
}

export default { sendVerificationEmail };
