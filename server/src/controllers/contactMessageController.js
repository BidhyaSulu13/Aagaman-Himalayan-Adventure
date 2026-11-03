import { ContactMessage } from "../models/ContactMessage.js";
import { Trek } from "../models/Trek.js";

const contactStatuses = new Set(["New", "In Progress", "Resolved"]);

export async function createContactMessage(req, res, next) {
  try {
    const {
      name, email, phone, topic, message, category = "contact",
      country, travelers, travelMonth, trekSlug,
    } = req.body;
    if (
      !name?.trim() ||
      !email?.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ||
      !message?.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid name, email address, and message.",
      });
    }
    if (!["contact", "expedition_inquiry"].includes(category)) {
      return res.status(400).json({ success: false, message: "Invalid message category." });
    }
    let trekRecord = null;
    if (category === "expedition_inquiry") {
      if (!trekSlug?.trim()) {
        return res.status(400).json({
          success: false,
          message: "A trek must be selected for an expedition inquiry.",
        });
      }
      trekRecord = await Trek.findOne({
        slug: trekSlug.trim().toLowerCase(),
        published: true,
        isArchived: { $ne: true },
      }).select("_id slug title");
      if (!trekRecord) {
        return res.status(404).json({ success: false, message: "The selected trek is unavailable." });
      }
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone,
      topic: topic || (category === "expedition_inquiry" ? "Expedition inquiry" : undefined),
      message,
      category,
      country,
      travelers,
      travelMonth,
      trek: trekRecord?._id || null,
      trekSlug: trekRecord?.slug || "",
      trekTitle: trekRecord?.title || "",
    });

    return res.status(201).json({
      success: true,
      contactMessage,
      message: "Your message has been received. Our team will be in touch.",
    });
  } catch (error) {
    return next(error);
  }
}

export async function getContactMessages(_req, res, next) {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).lean();
    return res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    return next(error);
  }
}

export async function updateContactMessageStatus(req, res, next) {
  try {
    const { status } = req.body;
    if (!contactStatuses.has(status)) {
      return res.status(400).json({
        success: false,
        message: "Status must be New, In Progress, or Resolved.",
      });
    }

    const message = await ContactMessage.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    if (!message) {
      return res.status(404).json({ success: false, message: "Contact message not found." });
    }

    return res.json({ success: true, message });
  } catch (error) {
    return next(error);
  }
}
