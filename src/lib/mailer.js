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
    <div style="background:#0b1020;padding:32px 16px;font-family:Inter,Segoe UI,Arial,sans-serif;color:#e2e8f0;">
      <div style="max-width:520px;margin:0 auto;background:#0f172a;border:1px solid #1f2a44;border-radius:16px;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.35);">
        <div style="padding:16px 20px;border-bottom:1px solid #1f2a44;display:flex;align-items:center;">
          <div style="line-height:1.1;">
            <div style="font-size:18px;font-weight:700;color:#fff;">SideQuest</div>
            <div style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#94a3b8;">Verify your email</div>
          </div>
        </div>

        <div style="padding:24px;">
          <p style="margin:0 0 12px;color:#cbd5f5;">Use the code below to finish signing in.</p>
          <div style="background:#111827;border:1px solid #253057;border-radius:12px;padding:16px;text-align:center;">
            <div style="font-size:28px;letter-spacing:8px;font-weight:800;color:#fff;">${otp}</div>
          </div>
          <p style="margin:12px 0 0;color:#94a3b8;font-size:13px;">This code expires in 10 minutes. If you didn’t request it, you can safely ignore this email.</p>
        </div>

        <div style="padding:16px 24px;background:#0b1226;border-top:1px solid #1f2a44;color:#64748b;font-size:12px;">
          Need help? Reply to this email.
        </div>
      </div>
    </div>
  `;

  await transporter.sendMail({ from, to, subject, text, html });
}
