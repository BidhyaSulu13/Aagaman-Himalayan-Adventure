import { Booking } from "../models/Booking.js";
import { createBookingPdf } from "./bookingPdfService.js";
import { getTransporter } from "./emailService.js";

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character]);
}

function dateLabel(value) {
  if (!value) return "To be confirmed";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function dashboardUrl(path) {
  return `${process.env.CLIENT_URL || "http://localhost:5173"}${path}`;
}

function emailSender() {
  return process.env.SMTP_FROM || process.env.SMTP_USER || "Agaaman Himalayan Adventure";
}

function emailRecipient(booking) {
  return booking.user?.email || booking.travelerDetails?.[0]?.email;
}

async function getEmailBooking(bookingId) {
  return Booking.findById(bookingId)
    .populate("user", "name email")
    .populate("trek", "title region duration")
    .populate("departure", "startDate endDate");
}

async function markEmailSent(booking, field, message) {
  if (String(message.messageId || "").startsWith("dev-msg-")) return;
  await Booking.updateOne(
    { _id: booking._id, [field]: { $exists: false } },
    { $set: { [field]: new Date() } },
  );
}

export async function notifyBookingReceived(bookingId) {
  try {
    const booking = await getEmailBooking(bookingId);
    if (!booking || booking.bookingConfirmationEmailSentAt) return;
    const email = emailRecipient(booking);
    if (!email) throw new Error("Booking has no email address for its signed-in account or lead traveler.");

    const name = booking.travelerDetails?.[0]?.fullName || booking.user?.name || "Traveler";
    const trekTitle = booking.trek?.title || "your Himalayan trek";
    const url = dashboardUrl("/login");
    const total = `${booking.currency || "USD"} ${Number(booking.totalAmount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    const travelerNames = (booking.travelerDetails || []).map((traveler) => traveler.fullName).join(", ");
    const message = await getTransporter().sendMail({
      from: emailSender(),
      to: email,
      subject: `We received your trek booking - ${booking.bookingReference}`,
      text: `Namaste ${name},\n\nThank you for choosing Agaaman. We have received your booking request for ${trekTitle}.\n\nBooking reference: ${booking.bookingReference}\nDeparture: ${dateLabel(booking.departure?.startDate)}\nTravelers: ${booking.numberOfTravelers}\nBooking status: ${booking.bookingStatus}\nPayment status: ${booking.paymentStatus}\nTotal: ${total}\n\nYour booking details are attached as a PDF. This is a request receipt, not a confirmed reservation or payment receipt. Our team will contact you with updates.\n\nView your traveler dashboard: ${url}\n\nNamaste,\nThe Agaaman Himalayan Adventure Team`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#172c2a"><div style="background:#083c34;padding:26px 30px;color:#fff"><p style="margin:0;color:#c8d9d2;font-size:12px;letter-spacing:1px">AGAAMAN · A HIMALAYAN ADVENTURE</p><h1 style="margin:16px 0 0;font-size:24px">Booking request received</h1></div><div style="padding:28px 30px;border:1px solid #e2e8f0"><p>Namaste ${escapeHtml(name)},</p><p>Thank you for choosing Agaaman. We have received your booking request for <strong>${escapeHtml(trekTitle)}</strong>.</p><div style="background:#f5f8f6;padding:18px;margin:22px 0"><p><strong>Booking reference:</strong> ${escapeHtml(booking.bookingReference)}</p><p><strong>Departure:</strong> ${escapeHtml(dateLabel(booking.departure?.startDate))}</p><p><strong>Travelers:</strong> ${escapeHtml(booking.numberOfTravelers)}</p><p><strong>Booking status:</strong> ${escapeHtml(booking.bookingStatus)}</p><p><strong>Payment status:</strong> ${escapeHtml(booking.paymentStatus)}</p><p><strong>Total:</strong> ${escapeHtml(total)}</p></div><p>Your booking details are attached as a PDF. This is a request receipt, not a confirmed reservation or payment receipt. Our team will contact you with updates.</p><p><a href="${escapeHtml(url)}" style="display:inline-block;background:#083c34;color:#fff;padding:12px 18px;text-decoration:none;border-radius:5px">View my booking</a></p><p style="color:#64748b;font-size:13px">Travelers: ${escapeHtml(travelerNames)}</p><p style="margin-top:26px">Namaste,<br>The Agaaman Himalayan Adventure Team</p></div></div>`,
      attachments: [{
        filename: `Agaaman-booking-${booking.bookingReference}.pdf`,
        content: createBookingPdf(booking),
        contentType: "application/pdf",
      }],
    });
    await markEmailSent(booking, "bookingConfirmationEmailSentAt", message);
    if (!String(message.messageId || "").startsWith("dev-msg-")) {
      console.info(`[EMAIL SENT] Booking request ${booking.bookingReference} (${message.messageId}).`);
    }
  } catch (error) {
    console.error(`Booking email failed for ${bookingId}: ${error.message}`);
  }
}

export async function notifyBookingConfirmed(bookingId) {
  try {
    const booking = await getEmailBooking(bookingId);
    if (
      !booking ||
      booking.bookingStatus !== "Confirmed" ||
      booking.bookingConfirmedEmailSentAt
    ) return;

    const email = emailRecipient(booking);
    if (!email) throw new Error("Booking has no email address for its signed-in account or lead traveler.");

    const name = booking.travelerDetails?.[0]?.fullName || booking.user?.name || "Traveler";
    const trekTitle = booking.trek?.title || "your Himalayan trek";
    const startDate = dateLabel(booking.departure?.startDate);
    const endDate = dateLabel(booking.departure?.endDate);
    const total = `${booking.currency || "USD"} ${Number(booking.totalAmount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    const url = dashboardUrl("/dashboard?tab=bookings");
    const message = await getTransporter().sendMail({
      from: emailSender(),
      to: email,
      subject: `Your ${trekTitle} trek is confirmed - ${booking.bookingReference}`,
      text: `Namaste ${name},\n\nGreat news: our team has confirmed your booking for ${trekTitle}. Your place on this departure is reserved.\n\nBooking reference: ${booking.bookingReference}\nDeparture: ${startDate} to ${endDate}\nTravelers: ${booking.numberOfTravelers}\nBooking status: Confirmed\nPayment status: ${booking.paymentStatus}\nTotal: ${total}\n\nYour updated booking summary is attached as a PDF. You can view your booking any time in your Agaaman traveler dashboard: ${url}\n\nWe look forward to welcoming you to the Himalaya.\n\nWith warm regards,\nThe Agaaman Himalayan Adventure Team`,
      html: `<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;background:#f4f7f5;padding:24px;color:#172c2a"><div style="background:#fff;border:1px solid #dce6e1;border-radius:12px;overflow:hidden"><div style="background:#083c34;padding:26px 30px;color:#fff"><p style="margin:0;color:#c8d9d2;font-size:12px;letter-spacing:1px">AGAAMAN · A HIMALAYAN ADVENTURE</p><h1 style="margin:14px 0 0;font-size:25px">Your trek is confirmed</h1></div><div style="padding:28px 30px"><p>Namaste ${escapeHtml(name)},</p><p>Great news: our team has confirmed your booking for <strong>${escapeHtml(trekTitle)}</strong>. Your place on this departure is reserved.</p><div style="background:#f5f8f6;border:1px solid #e4ebe7;border-radius:8px;padding:18px 20px;margin:22px 0"><p style="margin:3px 0 12px;color:#52635e;font-size:12px;text-transform:uppercase;letter-spacing:.6px">Booking details</p><p><strong>Reference</strong><br>${escapeHtml(booking.bookingReference)}</p><p><strong>Departure</strong><br>${escapeHtml(startDate)} to ${escapeHtml(endDate)}</p><p><strong>Travelers</strong><br>${escapeHtml(booking.numberOfTravelers)}</p><p><strong>Booking status</strong><br><span style="color:#087443;font-weight:700">Confirmed</span></p><p><strong>Payment status</strong><br>${escapeHtml(booking.paymentStatus)}</p><p style="margin-bottom:0"><strong>Total</strong><br>${escapeHtml(total)}</p></div><p>Your updated booking summary is attached as a PDF. You can also view your booking any time in your Agaaman traveler dashboard.</p><p><a href="${escapeHtml(url)}" style="display:inline-block;background:#083c34;color:#fff;padding:12px 18px;text-decoration:none;border-radius:5px">View my booking</a></p><p>We look forward to welcoming you to the Himalaya.</p><p style="margin-top:26px">With warm regards,<br>The Agaaman Himalayan Adventure Team</p></div></div></div>`,
      attachments: [{
        filename: `Agaaman-confirmed-booking-${booking.bookingReference}.pdf`,
        content: createBookingPdf(booking),
        contentType: "application/pdf",
      }],
    });
    await markEmailSent(booking, "bookingConfirmedEmailSentAt", message);
    if (!String(message.messageId || "").startsWith("dev-msg-")) {
      console.info(`[EMAIL SENT] Booking confirmation ${booking.bookingReference} (${message.messageId}).`);
    }
  } catch (error) {
    console.error(`Booking confirmation email failed for ${bookingId}: ${error.message}`);
  }
}

export async function notifyTrekCompleted(bookingId) {
  try {
    const booking = await getEmailBooking(bookingId);
    if (!booking || booking.trekCompletionEmailSentAt) return;
    const email = emailRecipient(booking);
    if (!email) throw new Error("Booking has no email address for its signed-in account or lead traveler.");

    const name = booking.travelerDetails?.[0]?.fullName || booking.user?.name || "Traveler";
    const trekTitle = booking.trek?.title || "your Himalayan trek";
    const url = dashboardUrl("/dashboard?tab=bookings");
    const message = await getTransporter().sendMail({
      from: emailSender(),
      to: email,
      subject: `Congratulations on completing ${trekTitle}!`,
      text: `Namaste ${name},\n\nCongratulations on completing ${trekTitle}! We hope the trail, mountain landscapes, and time with local communities made for a journey you will remember.\n\nBooking reference: ${booking.bookingReference}\nYour completed booking remains available in your Agaaman traveler dashboard: ${url}\n\nThank you for trekking with us. We would be delighted to welcome you back to Nepal for another adventure.\n\nWith warm regards,\nThe Agaaman Himalayan Adventure Team`,
      html: `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#172c2a"><div style="background:#083c34;padding:26px 30px;color:#fff"><p style="margin:0;color:#c8d9d2;font-size:12px;letter-spacing:1px">AGAAMAN · A HIMALAYAN ADVENTURE</p><h1 style="margin:16px 0 0;font-size:24px">Congratulations on your trek!</h1></div><div style="padding:28px 30px;border:1px solid #e2e8f0"><p>Namaste ${escapeHtml(name)},</p><p>Congratulations on completing <strong>${escapeHtml(trekTitle)}</strong>! We hope the trail, mountain landscapes, and time with local communities made for a journey you will remember.</p><p><strong>Booking reference:</strong> ${escapeHtml(booking.bookingReference)}</p><p>Your completed booking is available in your Agaaman traveler dashboard.</p><p><a href="${escapeHtml(url)}" style="display:inline-block;background:#083c34;color:#fff;padding:12px 18px;text-decoration:none;border-radius:5px">View my journey</a></p><p>Thank you for trekking with us. We would be delighted to welcome you back to Nepal for another adventure.</p><p style="margin-top:26px">With warm regards,<br>The Agaaman Himalayan Adventure Team</p></div></div>`,
    });
    await markEmailSent(booking, "trekCompletionEmailSentAt", message);
    if (!String(message.messageId || "").startsWith("dev-msg-")) {
      console.info(`[EMAIL SENT] Trek completion ${booking.bookingReference} (${message.messageId}).`);
    }
  } catch (error) {
    console.error(`Trek completion email failed for ${bookingId}: ${error.message}`);
  }
}
