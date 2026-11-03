import nodemailer from "nodemailer";

let transporter = null;

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;

  if (host && user && pass) {
    transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT) || 587,
      auth: { user, pass },
    });
  } else {
    // Development fallback mock
    transporter = {
      sendMail: async (opts) => {
        console.log("-----------------------------------------");
        console.log(`[EMAIL DISPATCH - DEV SIMULATION]`);
        console.log(`To: ${opts.to}`);
        console.log(`Subject: ${opts.subject}`);
        console.log(`Body:\n${opts.text || opts.html}`);
        console.log("-----------------------------------------");
        return { messageId: `dev-msg-${Date.now()}` };
      },
    };
  }

  return transporter;
}

export async function sendBookingConfirmationEmail({
  email,
  travelerName,
  bookingReference,
  trekTitle,
  startDate,
  totalAmount,
}) {
  try {
    const t = getTransporter();
    const reviewRequestUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/review/request`;
    const safeTravelerName = escapeHtml(travelerName);
    const safeTrekTitle = escapeHtml(trekTitle);
    const safeBookingReference = escapeHtml(bookingReference);
    const safeStartDate = escapeHtml(startDate);
    const safeTotalAmount = escapeHtml(totalAmount);
    const safeReviewRequestUrl = escapeHtml(reviewRequestUrl);
    const mailOptions = {
      from: process.env.SMTP_FROM || "no-reply@agaaman.com",
      to: email,
      subject: `Trek Booking Confirmation - ${bookingReference}`,
      text: `Namaste ${travelerName},

Your booking request for "${trekTitle}" has been received!

Booking Reference: ${bookingReference}
Departure Date: ${startDate}
Total Amount: $${totalAmount} USD
Status: Requested / Pending Guide Confirmation

Our Himalayan lead operations team is reviewing your dates and mountain permits.
Keep this booking reference for your records. If you have an account, you can view the reservation in your Traveler Dashboard.
After your trek is completed, request a secure review link at: ${reviewRequestUrl}
No traveler account is required to submit a review.

Warm mountain regards,
The Agaaman Himalayan Expeditions Team`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #ea580c; margin-top: 0;">Namaste ${safeTravelerName},</h2>
          <p>Your booking request for <strong>${safeTrekTitle}</strong> has been received by our expedition desk!</p>
          <div style="background: #f8fafc; padding: 16px; border-radius: 6px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Booking Reference:</strong> <span style="color: #ea580c; font-weight: bold;">${safeBookingReference}</span></p>
            <p style="margin: 4px 0;"><strong>Departure Date:</strong> ${safeStartDate}</p>
            <p style="margin: 4px 0;"><strong>Total Amount:</strong> $${safeTotalAmount} USD</p>
            <p style="margin: 4px 0;"><strong>Status:</strong> Requested (Pending Review)</p>
          </div>
          <p>Our Kathmandu operations team and local Sherpa guides are preparing your permit allocations. You will receive an update once confirmed.</p>
          <p>After your trek is completed, <a href="${safeReviewRequestUrl}">request a secure review link</a> using your booking reference and booking email. No traveler account is required.</p>
          <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
          <p style="font-size: 13px; color: #64748b;">Agaaman: A Himalayan Adventure · Thamel, Kathmandu, Nepal</p>
        </div>
      `,
    };

    await t.sendMail(mailOptions);
  } catch (err) {
    console.error("Failed to send booking email notification:", err.message);
  }
}

export async function sendPasswordResetEmail({ email, name, resetToken, clientUrl }) {
  try {
    const t = getTransporter();
    const resetUrl = `${clientUrl || "http://localhost:5173"}/reset-password/${resetToken}`;
    const safeName = escapeHtml(name);
    const safeResetUrl = escapeHtml(resetUrl);
    const mailOptions = {
      from: process.env.SMTP_FROM || "no-reply@agaaman.com",
      to: email,
      subject: "Agaaman Password Reset Request",
      text: `Hello ${name},\n\nYou requested to reset your password. Use the following link within 1 hour:\n${resetUrl}\n\nIf you did not request this, please disregard.`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; padding: 20px; border: 1px solid #e2e8f0; border-radius: 6px;">
          <h3>Password Reset Request</h3>
          <p>Hello ${safeName},</p>
          <p>We received a request to reset your password for your Agaaman account.</p>
          <a href="${safeResetUrl}" style="display: inline-block; padding: 10px 20px; background: #ea580c; color: #fff; text-decoration: none; border-radius: 4px; font-weight: bold; margin: 12px 0;">Reset Password</a>
          <p style="font-size: 12px; color: #64748b;">This link expires in 1 hour. If you did not make this request, no action is needed.</p>
        </div>
      `,
    };
    await t.sendMail(mailOptions);
  } catch (err) {
    console.error("Failed to send password reset email:", err.message);
  }
}

export async function sendReviewVerificationEmail({ email, name, trekTitle, bookingReference, token, clientUrl }) {
  const verificationUrl = `${clientUrl || process.env.CLIENT_URL || "http://localhost:5173"}/review/verify/${token}`;
  const transporter = getTransporter();
  const safeName = escapeHtml(name);
  const safeTrekTitle = escapeHtml(trekTitle);
  await transporter.sendMail({
    from: process.env.SMTP_FROM || "no-reply@agaaman.com",
    to: email,
    subject: `Verify your completed trek review - ${bookingReference}`,
    text: `Hello ${name},\n\nUse this secure link to review your completed ${trekTitle} trek:\n${verificationUrl}\n\nThe link expires in 30 minutes and can be used once. If you did not request this, ignore this email.`,
    html: `<p>Hello ${safeName},</p><p>Use this secure link to review your completed <strong>${safeTrekTitle}</strong> trek:</p><p><a href="${verificationUrl}">Write your verified trek review</a></p><p>This link expires in 30 minutes and can be used once. If you did not request this, ignore this email.</p>`,
  });
}
