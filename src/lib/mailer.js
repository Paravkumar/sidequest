import nodemailer from "nodemailer";

const smtpHost = process.env.SMTP_HOST;
const smtpPort = Number(process.env.SMTP_PORT || 587);

let transporter = null;
if (smtpHost) {
  transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendOtpEmail({ to, otp }) {
  if (!transporter) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`[DEV] OTP for ${to}: ${otp}`);
      return;
    }
    throw new Error("SMTP is not configured. Set SMTP_HOST/SMTP_PORT/SMTP_USER/SMTP_PASS.");
  }
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  const subject = "Your SideQuest verification code";
  const text = `Your verification code is ${otp}. It expires in 10 minutes.`;
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="margin: 0 0 12px;">Verify your email</h2>
      <p>Your SideQuest verification code is:</p>
      <p style="font-size: 22px; font-weight: bold; letter-spacing: 2px;">${otp}</p>
      <p>This code expires in 10 minutes.</p>
    </div>
  `;

  await transporter.sendMail({ from, to, subject, text, html });
}
