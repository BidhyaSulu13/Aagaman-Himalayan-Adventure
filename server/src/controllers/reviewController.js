import { createHash, randomBytes } from "node:crypto";
import { Booking } from "../models/Booking.js";
import { Review } from "../models/Review.js";
import { Trek } from "../models/Trek.js";
import { recalculateTrekRating } from "../services/rankingService.js";
import { sendReviewVerificationEmail } from "../services/emailService.js";

const reviewLinkMessage =
  "If the completed booking matches those details, a review link will be sent to that email address.";

function isValidRating(rating) {
  return Number.isInteger(Number(rating)) && Number(rating) >= 1 && Number(rating) <= 5;
}

function uploadedPhotoUrls(files = []) {
  return files.map((file) => `/api/uploads/reviews/${file.filename}`);
}

function publicReviewQuery(query) {
  return Review.find(query)
    .populate("user", "name avatar nationality")
    .populate("trek", "title slug")
    .populate("booking", "bookingStatus")
    .sort({ createdAt: -1 });
}

function hasCompletedBooking(review) {
  return (
    review.verificationStatus === "Verified Trekker" &&
    review.booking?.bookingStatus === "Completed"
  );
}

function removeBookingDetails(reviews) {
  return reviews.filter(hasCompletedBooking).map((review) => {
    review.booking = undefined;
    return review;
  });
}

// GET /api/reviews/approved
export async function getApprovedReviews(req, res, next) {
  try {
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 6));
    const reviews = await publicReviewQuery({ moderationStatus: "approved" });
    const eligibleReviews = removeBookingDetails(reviews).slice(0, limit);
    return res.json({ success: true, count: eligibleReviews.length, reviews: eligibleReviews });
  } catch (error) {
    return next(error);
  }
}

// GET /api/reviews/trek/:trekId
export async function getTrekReviews(req, res, next) {
  try {
    const reviews = await publicReviewQuery({
      trek: req.params.trekId,
      moderationStatus: "approved",
    });
    const eligibleReviews = removeBookingDetails(reviews);
    return res.json({ success: true, count: eligibleReviews.length, reviews: eligibleReviews });
  } catch (error) {
    return next(error);
  }
}

// POST /api/reviews/request-verification
export async function requestReviewVerification(req, res, next) {
  try {
    const bookingReference = String(req.body.bookingReference || "").trim().toUpperCase();
    const email = String(req.body.email || "").trim().toLowerCase();
    const trekSlug = String(req.body.trekSlug || "").trim().toLowerCase();
    if (!bookingReference || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter your booking reference and booking email address.",
      });
    }

    const emailPattern = new RegExp(
      `^${email.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
      "i"
    );
    let trekId;
    if (trekSlug) {
      const trek = await Trek.findOne({
        slug: trekSlug,
        published: true,
        isArchived: { $ne: true },
      }).select("_id");
      if (!trek) {
        return res.json({ success: true, message: reviewLinkMessage });
      }
      trekId = trek._id;
    }

    const query = {
      bookingReference,
      bookingStatus: "Completed",
      "travelerDetails.email": emailPattern,
    };
    if (trekId) query.trek = trekId;
    const booking = await Booking.findOne(query)
      .select("+reviewVerificationTokenHash +reviewVerificationEmail +reviewVerificationExpiresAt")
      .populate("trek", "title slug published isArchived");

    if (booking?.trek?.published && !booking.trek.isArchived) {
      const alreadyReviewed = await Review.exists({ booking: booking._id });
      if (!alreadyReviewed) {
        const traveler = booking.travelerDetails.find(
          (detail) => detail.email.toLowerCase() === email
        );
        if (traveler) {
          const token = randomBytes(32).toString("hex");
          booking.reviewVerificationTokenHash = createHash("sha256").update(token).digest("hex");
          booking.reviewVerificationEmail = email;
          booking.reviewVerificationExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
          await booking.save();
          try {
            await sendReviewVerificationEmail({
              email,
              name: traveler.fullName,
              trekTitle: booking.trek?.title || "your completed trek",
              bookingReference: booking.bookingReference,
              token,
            });
          } catch (error) {
            booking.reviewVerificationTokenHash = undefined;
            booking.reviewVerificationEmail = undefined;
            booking.reviewVerificationExpiresAt = undefined;
            await booking.save();
            return next(error);
          }
        }
      }
    }

    return res.json({ success: true, message: reviewLinkMessage });
  } catch (error) {
    return next(error);
  }
}

async function findBookingForReviewToken(token) {
  const tokenHash = createHash("sha256").update(token).digest("hex");
  return Booking.findOne({
    reviewVerificationTokenHash: tokenHash,
    reviewVerificationExpiresAt: { $gt: new Date() },
    bookingStatus: "Completed",
  })
    .select("+reviewVerificationTokenHash +reviewVerificationEmail +reviewVerificationExpiresAt")
    .populate("trek", "title slug");
}

// GET /api/reviews/verify/:token
export async function getReviewVerification(req, res, next) {
  try {
    const booking = await findBookingForReviewToken(req.params.token);
    if (!booking || await Review.exists({ booking: booking?._id })) {
      return res.status(410).json({
        success: false,
        message: "This review link is invalid, expired, or has already been used.",
      });
    }

    const traveler = booking.travelerDetails.find(
      (detail) => detail.email.toLowerCase() === booking.reviewVerificationEmail
    );
    return res.json({
      success: true,
      reviewRequest: {
        name: traveler?.fullName || "",
        bookingReference: booking.bookingReference,
        trek: booking.trek,
        expiresAt: booking.reviewVerificationExpiresAt,
      },
    });
  } catch (error) {
    return next(error);
  }
}

// POST /api/reviews/verified
export async function createVerifiedReview(req, res, next) {
  try {
    const token = String(req.body.token || "");
    const rating = Number(req.body.rating);
    const comment = String(req.body.comment || "").trim();
    const title = String(req.body.title || "").trim();
    if (!token || !isValidRating(rating) || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: "A valid review link, title, 1–5 star rating, and written feedback are required.",
      });
    }

    const booking = await findBookingForReviewToken(token);
    if (!booking) {
      return res.status(410).json({
        success: false,
        message: "This review link is invalid, expired, or has already been used.",
      });
    }
    if (await Review.exists({ booking: booking._id })) {
      return res.status(409).json({ success: false, message: "A review already exists for this booking." });
    }

    const traveler = booking.travelerDetails.find(
      (detail) => detail.email.toLowerCase() === booking.reviewVerificationEmail
    );
    const review = await Review.create({
      name: traveler?.fullName || "Completed trek traveler",
      email: booking.reviewVerificationEmail,
      trek: booking.trek._id || booking.trek,
      booking: booking._id,
      title,
      rating,
      comment,
      photos: uploadedPhotoUrls(req.files),
      moderationStatus: "pending",
      verificationStatus: "Verified Trekker",
    });

    booking.reviewVerificationTokenHash = undefined;
    booking.reviewVerificationEmail = undefined;
    booking.reviewVerificationExpiresAt = undefined;
    await booking.save();
    return res.status(201).json({
      success: true,
      review,
      message: "Your verified review is submitted and pending admin approval.",
    });
  } catch (error) {
    return next(error);
  }
}

// POST /api/reviews
export async function createReview(req, res, next) {
  try {
    const rating = Number(req.body.rating);
    const title = String(req.body.title || "").trim();
    const comment = String(req.body.comment || "").trim();
    if (!req.body.bookingId || !isValidRating(rating) || !title || !comment) {
      return res.status(400).json({
        success: false,
        message: "A completed booking, review title, 1–5 star rating, and written feedback are required.",
      });
    }

    const booking = await Booking.findById(req.body.bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }

    const isOwner =
      booking.user?.toString() === req.user._id.toString() ||
      (req.user.role === "traveler" &&
        req.user.emailVerified === true &&
        booking.travelerDetails.some(
        (traveler) => traveler.email.toLowerCase() === req.user.email.toLowerCase()
        ));
    if (!isOwner || booking.bookingStatus !== "Completed") {
      return res.status(403).json({
        success: false,
        message: "Only a traveler on a completed booking can submit its review.",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      name: req.user.name,
      email: req.user.email,
      trek: booking.trek,
      booking: booking._id,
      title,
      rating,
      comment,
      photos: uploadedPhotoUrls(req.files),
      moderationStatus: "pending",
      verificationStatus: "Verified Trekker",
    });

    const populated = await review.populate([
      { path: "user", select: "name avatar nationality" },
      { path: "trek", select: "title slug" },
      { path: "booking", select: "bookingReference" },
    ]);
    return res.status(201).json({
      success: true,
      review: populated,
      message: "Your verified review is submitted and pending admin approval.",
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ success: false, message: "A review already exists for this booking." });
    }
    return next(error);
  }
}

// GET /api/reviews (Admin review moderation queue)
export async function getAllReviews(req, res, next) {
  try {
    const query = {};
    if (req.query.moderationStatus) query.moderationStatus = req.query.moderationStatus;

    const reviews = await Review.find(query)
      .select("+email")
      .populate("user", "name email avatar")
      .populate("trek", "title slug")
      .populate("booking", "bookingReference bookingStatus travelerDetails numberOfTravelers totalAmount createdAt")
      .sort({ createdAt: -1 });

    return res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    return next(error);
  }
}

// PATCH /api/reviews/:id/moderate
export async function moderateReview(req, res, next) {
  try {
    const { moderationStatus } = req.body;
    if (!["approved", "rejected"].includes(moderationStatus)) {
      return res.status(400).json({
        success: false,
        message: "Moderation status must be approved or rejected.",
      });
    }

    const review = await Review.findById(req.params.id).populate("booking", "bookingStatus");
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }
    if (
      moderationStatus === "approved" &&
      (!review.booking ||
        review.booking.bookingStatus !== "Completed" ||
        review.verificationStatus !== "Verified Trekker")
    ) {
      return res.status(409).json({
        success: false,
        message: "Only verified reviews linked to completed bookings can be approved.",
      });
    }

    review.moderationStatus = moderationStatus;
    await review.save();
    await recalculateTrekRating(review.trek);
    return res.json({
      success: true,
      review,
      message: `Review moderation status updated to '${moderationStatus}'.`,
    });
  } catch (error) {
    return next(error);
  }
}

// DELETE /api/reviews/:id
export async function deleteReview(req, res, next) {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found." });
    await recalculateTrekRating(review.trek);
    return res.json({ success: true, message: "Review deleted." });
  } catch (error) {
    return next(error);
  }
}
