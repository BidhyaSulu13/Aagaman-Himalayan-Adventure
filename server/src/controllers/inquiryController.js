import { Inquiry } from "../models/Inquiry.js";
import { Trek } from "../models/Trek.js";
import { sendInquiryReplyEmail } from "../services/emailService.js";

const inquiryStatuses = new Set(["New", "In Progress", "Resolved"]);

export async function createInquiry(req, res, next) {
  try {
    const { trekSlug, name, email, phone, country, travelers, travelMonth, message } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const normalizedName = String(name || "").trim();
    const normalizedMessage = String(message || "").trim();
    if (!normalizedName || normalizedName.length > 120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail) || !normalizedMessage || normalizedMessage.length > 5000) {
      return res.status(400).json({ success: false, message: "Enter a valid name, email, and question (up to 5,000 characters)." });
    }

    const trek = await Trek.findOne({
      slug: String(trekSlug || "").trim().toLowerCase(),
      published: true,
      isArchived: { $ne: true },
    }).select("_id slug title");
    if (!trek) return res.status(404).json({ success: false, message: "The selected trek is unavailable." });

    const travelerCount = Number(travelers) || 1;
    if (!Number.isInteger(travelerCount) || travelerCount < 1 || travelerCount > 100) {
      return res.status(400).json({ success: false, message: "Traveler count must be between 1 and 100." });
    }

    const inquiry = await Inquiry.create({
      user: req.user?._id || null,
      trek: trek._id,
      trekSlug: trek.slug,
      trekTitle: trek.title,
      name: normalizedName,
      email: normalizedEmail,
      phone: String(phone || "").trim(),
      country: String(country || "").trim(),
      travelers: travelerCount,
      travelMonth: String(travelMonth || "").trim(),
      message: normalizedMessage,
    });

    return res.status(201).json({
      success: true,
      inquiry,
      message: "Your question has been sent to our trek team. We will reply to your email address.",
    });
  } catch (error) {
    return next(error);
  }
}

export async function getAdminInquiries(_req, res, next) {
  try {
    const inquiries = await Inquiry.find().sort({ status: 1, createdAt: -1 }).lean();
    return res.json({ success: true, count: inquiries.length, inquiries });
  } catch (error) {
    return next(error);
  }
}

export async function updateInquiryStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!inquiryStatuses.has(status)) {
      return res.status(400).json({ success: false, message: "Status must be New, In Progress, or Resolved." });
    }
    const inquiry = await Inquiry.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
    if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found." });
    return res.json({ success: true, inquiry });
  } catch (error) {
    return next(error);
  }
}

export async function replyToInquiry(req, res, next) {
  try {
    const replyText = String(req.body.reply || "").trim();
    if (!replyText || replyText.length > 5000) {
      return res.status(400).json({ success: false, message: "Reply must contain 1 to 5,000 characters." });
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) return res.status(404).json({ success: false, message: "Inquiry not found." });

    const reply = inquiry.replies.create({
      message: replyText,
      sentBy: req.user._id,
      sentByName: req.user.name || "Agaaman team",
      deliveryStatus: "Pending",
    });
    inquiry.replies.push(reply);
    await inquiry.save();

    try {
      const delivery = await sendInquiryReplyEmail({
        email: inquiry.email,
        travelerName: inquiry.name,
        trekTitle: inquiry.trekTitle,
        originalMessage: inquiry.message,
        reply: replyText,
      });
      const savedReply = inquiry.replies.id(reply._id);
      savedReply.deliveryStatus = "Sent";
      savedReply.deliveryError = "";
      savedReply.sentAt = new Date();
      savedReply.messageId = delivery.messageId || "";
      if (inquiry.status === "New") inquiry.status = "In Progress";
      await inquiry.save();
      return res.json({ success: true, inquiry, message: "Reply emailed to the traveler." });
    } catch (deliveryError) {
      const savedReply = inquiry.replies.id(reply._id);
      savedReply.deliveryStatus = "Failed";
      savedReply.deliveryError = "Email delivery failed. Check SMTP configuration before retrying.";
      await inquiry.save();
      console.error("[TREK INQUIRY REPLY EMAIL FAILED]", deliveryError.message);
      return res.status(502).json({ success: false, inquiry, message: "Reply was saved, but email delivery failed. Check SMTP configuration and retry." });
    }
  } catch (error) {
    return next(error);
  }
}
