import nodemailer from "nodemailer";
import User from "../models/user.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function createTransporter() {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASSWORD;

  if (!user || !pass) return null;

  if (process.env.EMAIL_HOST) {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT || 587),
      secure: process.env.EMAIL_SECURE === "true",
      auth: { user, pass }
    });
  }

  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail",
    auth: { user, pass }
  });
}

// lazy transporter creation to avoid module-load timing issues
let transporter = null;

export const sendButtonClickEmail = async (req, res) => {
  try {
    // ensure transporter is created now (after dotenv.config in server.js)
    if (!transporter) transporter = createTransporter();

    if (!transporter) {
      // Detailed diagnostic logging (do NOT print secret values)
      console.error("Email send error: transporter not configured.");
      console.error("ENV flags:",
        { EMAIL_USER_present: !!process.env.EMAIL_USER, EMAIL_PASSWORD_present: !!process.env.EMAIL_PASSWORD });
      console.error("SMTP config:",
        { EMAIL_SERVICE: process.env.EMAIL_SERVICE || null, EMAIL_HOST: process.env.EMAIL_HOST || null, EMAIL_PORT: process.env.EMAIL_PORT || null });

      // Try to create transporter again and log any thrown error
      try {
        const attempt = createTransporter();
        if (attempt) {
          transporter = attempt;
          console.info("Transporter created on second attempt.");
        } else {
          console.error("createTransporter returned null (missing EMAIL_USER/EMAIL_PASSWORD).");
        }
      } catch (createErr) {
        console.error("createTransporter threw an error:", createErr);
      }

      if (!transporter) {
        return res.status(500).json({ error: "Email not configured on server. Check backend .env and restart." });
      }
    }

    const { buttonLabel, senderName, recipientEmail, userId } = req.body;

    let toEmail = recipientEmail;
    if (!toEmail && userId) {
      const user = await User.findById(userId).lean();
      if (!user || !user.email) {
        return res.status(400).json({ error: "No email found for provided userId" });
      }
      toEmail = user.email;
    }

    if (!toEmail || !emailRegex.test(String(toEmail).trim().toLowerCase())) {
      return res.status(400).json({ error: "Invalid or missing recipient email" });
    }

    const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
    const subject = `Message from ${senderName || "Communication Board"}`;
    const html = `
      <h3>Communication Board Message</h3>
      <p><strong>${senderName || "Someone"}</strong> clicked:</p>
      <p style="font-size:18px;color:#007bff"><strong>"${buttonLabel || ""}"</strong></p>
      <p>Sent at ${new Date().toLocaleString()}</p>
    `;

    await transporter.sendMail({
      from,
      to: toEmail.trim().toLowerCase(),
      subject,
      html
    });

    return res.json({ message: "Email sent", to: toEmail });
  } catch (err) {
    console.error("Email send error:", err);
    return res.status(500).json({ error: "Failed to send email (check server email configuration)" });
  }
};

// New: verify transporter health
export const verifyEmailConfig = async (req, res) => {
  try {
    if (!transporter) {
      return res.status(500).json({ ok: false, error: "Email not configured (missing EMAIL_USER/EMAIL_PASSWORD)" });
    }
    await transporter.verify();
    return res.json({ ok: true, message: "Email transporter verified" });
  } catch (err) {
    console.error("Email verify error:", err);
    return res.status(500).json({ ok: false, error: err.message || "Verification failed" });
  }
};