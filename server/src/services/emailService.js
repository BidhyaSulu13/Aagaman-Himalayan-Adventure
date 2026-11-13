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

export function getTransporter() {
  if (transporter) return transporter;

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD?.replace(/\s/g, "");
  const oauthConfigured = Boolean(
    process.env.SMTP_OAUTH_CLIENT_ID &&
    process.env.SMTP_OAUTH_CLIENT_SECRET &&
    process.env.SMTP_OAUTH_REFRESH_TOKEN
  );

  if (user && (pass || oauthConfigured)) {
    const port = Number(process.env.SMTP_PORT) || 465;
    transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: oauthConfigured
        ? {
            type: "OAuth2",
            user,
            clientId: process.env.SMTP_OAUTH_CLIENT_ID,
            clientSecret: process.env.SMTP_OAUTH_CLIENT_SECRET,
            refreshToken: process.env.SMTP_OAUTH_REFRESH_TOKEN,
          }
        : { user, pass },
    });
  } else {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Email is not configured. Set SMTP_USER and Gmail OAuth 2.0 or SMTP_PASSWORD credentials.");
    }
    console.warn("[EMAIL NOT SENT] SMTP credentials are missing. Local email calls will use a no-delivery development fallback.");
    transporter = {
      sendMail: async (opts) => {
        console.warn(`[EMAIL NOT SENT - DEV MODE] ${opts.subject} -> ${opts.to}`);
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
  travelers,
  bookingStatus,
  paymentStatus,
  totalAmount,
}) {
  try {
    const t = getTransporter();
    const dashboardUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/login`;
    const safeTravelerName = escapeHtml(travelerName);
    const safeTrekTitle = escapeHtml(trekTitle);
    const safeBookingReference = escapeHtml(bookingReference);
    const safeStartDate = escapeHtml(startDate);
    const safeTravelers = escapeHtml(travelers);
    const safeBookingStatus = escapeHtml(bookingStatus);
    const safePaymentStatus = escapeHtml(paymentStatus);
    const safeTotalAmount = escapeHtml(totalAmount);
    const safeDashboardUrl = escapeHtml(dashboardUrl);
    const mailOptions = {
      from: process.env.SMTP_FROM || "no-reply@agaaman.com",
      to: email,
      subject: `Booking request received - ${bookingReference}`,
      text: `Namaste ${travelerName},

Your booking request for "${trekTitle}" has been received.

Booking Reference: ${bookingReference}
Departure date: ${startDate}
Travelers: ${travelers}
Estimated total: $${totalAmount} USD
Booking status: ${bookingStatus}
Payment status: ${paymentStatus}

This is a booking request, not a confirmed reservation or payment receipt. Our team will contact you with any updates.
To view this booking in your dashboard, sign in using this booking email (Google sign-in or a one-time email link): ${dashboardUrl}
Keep your booking reference for your records.

The Agaaman Himalayan Adventure Team`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 8px;">
          <h2 style="color: #ea580c; margin-top: 0;">Namaste ${safeTravelerName},</h2>
          <p>Your booking request for <strong>${safeTrekTitle}</strong> has been received.</p>
          <div style="background: #f8fafc; padding: 16px; border-radius: 6px; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Booking Reference:</strong> <span style="color: #ea580c; font-weight: bold;">${safeBookingReference}</span></p>
            <p style="margin: 4px 0;"><strong>Departure Date:</strong> ${safeStartDate}</p>
            <p style="margin: 4px 0;"><strong>Travelers:</strong> ${safeTravelers}</p>
            <p style="margin: 4px 0;"><strong>Total Amount:</strong> $${safeTotalAmount} USD</p>
            <p style="margin: 4px 0;"><strong>Booking status:</strong> ${safeBookingStatus}</p>
            <p style="margin: 4px 0;"><strong>Payment status:</strong> ${safePaymentStatus}</p>
          </div>
          <p>This is a booking request, not a confirmed reservation or payment receipt. Our team will contact you with any updates.</p>
          <p><a href="${safeDashboardUrl}">Sign in to your traveler dashboard</a> using this booking email. You can use Google sign-in or request a one-time email sign-in link.</p>
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

export async function sendDepartureStatusEmail({
  email,
  travelerName,
  bookingReference,
  trekTitle,
  startDate,
  endDate,
  departureStatus,
}) {
  const dashboardUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/dashboard?tab=bookings&booking=${encodeURIComponent(bookingReference)}`;
  const safeTravelerName = escapeHtml(travelerName || "Traveler");
  const safeBookingReference = escapeHtml(bookingReference);
  const safeTrekTitle = escapeHtml(trekTitle);
  const safeStartDate = escapeHtml(startDate);
  const safeEndDate = escapeHtml(endDate);
  const safeStatus = escapeHtml(departureStatus);
  const safeDashboardUrl = escapeHtml(dashboardUrl);
  const cancelled = departureStatus === "Cancelled";
  const subject = `Departure ${departureStatus.toLowerCase()} - ${bookingReference}`;
  const message = cancelled
    ? `We are sorry to inform you that this fixed departure has been cancelled. Your booking and payment history remain available in your traveler dashboard. Please contact our team to discuss next steps.`
    : `Your fixed departure has been updated to ${departureStatus}.`;

  await getTransporter().sendMail({
    from: process.env.SMTP_FROM || "no-reply@agaaman.com",
    to: email,
    subject,
    text: `Namaste ${travelerName || "Traveler"},\n\n${message}\n\nTrek: ${trekTitle}\nDeparture: ${startDate} – ${endDate}\nBooking reference: ${bookingReference}\n\nView your booking: ${dashboardUrl}\n\nThe Agaaman Himalayan Adventure Team`,
    html: `<div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:8px"><h2 style="color:#083c34">Namaste ${safeTravelerName},</h2><p>${escapeHtml(message)}</p><p><strong>Trek:</strong> ${safeTrekTitle}<br><strong>Departure:</strong> ${safeStartDate} – ${safeEndDate}<br><strong>Booking reference:</strong> ${safeBookingReference}<br><strong>Departure status:</strong> ${safeStatus}</p><p><a href="${safeDashboardUrl}">View your booking in the traveler dashboard</a></p><p style="font-size:13px;color:#64748b">Agaaman: A Himalayan Adventure · Thamel, Kathmandu, Nepal</p></div>`,
  });
}

export async function sendLoginLinkEmail({ email, name, token, returnTo }) {
  const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
  const safeReturnTo = returnTo?.startsWith("/") && !returnTo.startsWith("//")
    ? returnTo
    : "/dashboard";
  const loginUrl = `${clientUrl}/auth/email/${encodeURIComponent(token)}?returnTo=${encodeURIComponent(safeReturnTo)}`;
  const transporter = getTransporter();
  const safeName = escapeHtml(name);
  const safeLoginUrl = escapeHtml(loginUrl);

  await transporter.sendMail({
    from: process.env.SMTP_FROM || "no-reply@agaaman.com",
    to: email,
    subject: "Your Agaaman sign-in link",
    text: `Hello ${name},\n\nUse this one-time link to sign in and view your traveler dashboard:\n${loginUrl}\n\nThe link expires in 15 minutes and can only be used once. If you did not request it, ignore this email.`,
    html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px;border:1px solid #e2e8f0;border-radius:8px"><h2>Sign in to Agaaman</h2><p>Hello ${safeName},</p><p>Use this one-time link to sign in and view your traveler dashboard:</p><p><a href="${safeLoginUrl}" style="display:inline-block;padding:12px 18px;background:#083c34;color:#fff;text-decoration:none;border-radius:6px">Open my dashboard</a></p><p style="font-size:13px;color:#64748b">This link expires in 15 minutes and can only be used once. If you did not request it, ignore this email.</p></div>`,
  });
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

export async function sendInquiryReplyEmail({ email, travelerName, trekTitle, topic, originalMessage, reply }) {
  const inquirySubject = trekTitle || topic || "general inquiry";
  const safeName = escapeHtml(travelerName || "Traveler");
  const safeTrekTitle = escapeHtml(inquirySubject);
  const safeOriginalMessage = escapeHtml(originalMessage || "");
  const safeReply = escapeHtml(reply || "");
  const sender = process.env.SMTP_FROM || process.env.SMTP_USER || "Agaaman Himalayan Adventure";
  const mailResult = await getTransporter().sendMail({
    from: sender,
    to: email,
    replyTo: process.env.SMTP_USER || undefined,
    subject: `Reply to your inquiry about ${inquirySubject} | Agaaman Himalayan Adventure`,
    text: `Namaste ${travelerName || "Traveler"},\n\nOur team has replied to your inquiry about ${inquirySubject}.\n\nYour question:\n${originalMessage}\n\nOur reply:\n${reply}\n\nYou can reply directly to this email if you have another question.\n\nAgaaman Himalayan Adventure`,
    html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;padding:28px;color:#172033"><div style="background:#083c34;border-radius:12px 12px 0 0;padding:22px 26px;color:#fff"><p style="margin:0 0 8px;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#b8d5cf">Agaaman Himalayan Adventure</p><h1 style="font-size:22px;margin:0">A reply about your trek</h1></div><div style="border:1px solid #e2e8f0;border-top:0;border-radius:0 0 12px 12px;padding:26px"><p>Namaste ${safeName},</p><p>Our team has replied to your inquiry about <strong>${safeTrekTitle}</strong>.</p><div style="margin:20px 0;padding:16px 18px;background:#f8fafc;border-left:3px solid #cbd5e1;border-radius:6px"><p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase">Your question</p><p style="margin:0;white-space:pre-wrap;line-height:1.6">${safeOriginalMessage}</p></div><div style="margin:20px 0;padding:16px 18px;background:#f0fdf4;border-left:3px solid #0f766e;border-radius:6px"><p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#0f766e;text-transform:uppercase">Our reply</p><p style="margin:0;white-space:pre-wrap;line-height:1.6">${safeReply}</p></div><p style="color:#475569">You can reply directly to this email if you have another question.</p><p style="margin-top:28px;font-size:13px;color:#64748b">Agaaman Himalayan Adventure<br>Thamel, Kathmandu, Nepal</p></div></div>`,
  });
  return { messageId: mailResult.messageId };
}
