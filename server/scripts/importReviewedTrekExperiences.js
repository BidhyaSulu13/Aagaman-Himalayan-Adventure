import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import { Article, Review } from "../src/models/index.js";

function isBookingForReviewer(review, booking) {
  const accountId = String(review.user?._id || review.user || "");
  const bookingAccountId = String(booking.user?._id || booking.user || "");
  if (accountId && bookingAccountId && accountId === bookingAccountId) return true;

  const accountEmail = String(review.user?.email || review.email || "").toLowerCase();
  return Boolean(accountEmail && booking.travelerDetails?.some(
    (traveler) => String(traveler.email || "").toLowerCase() === accountEmail
  ));
}

async function importReviewedExperiences() {
  await connectDB();
  try {
    const reviews = await Review.find({
      moderationStatus: "approved",
      verificationStatus: "Verified Trekker",
      booking: { $ne: null },
      user: { $ne: null },
    })
      .select("+email name title comment photos trek booking user")
      .populate("user", "name email avatar role")
      .populate({
        path: "booking",
        select: "bookingReference bookingStatus user trek travelerDetails",
        populate: [
          { path: "trek", select: "title slug images image coverImage" },
          { path: "user", select: "email" },
        ],
      })
      .populate("trek", "title slug")
      .lean();

    let created = 0;
    let skipped = 0;
    for (const review of reviews) {
      const booking = review.booking;
      const trek = booking?.trek;
      const reviewer = review.user;
      const sameTrek = trek && String(trek._id) === String(review.trek?._id || review.trek);
      if (booking?.bookingStatus !== "Completed" || !sameTrek || !reviewer || reviewer.role !== "traveler" || !isBookingForReviewer(review, booking)) {
        skipped += 1;
        continue;
      }

      if (await Article.exists({ type: "story", completedBooking: booking._id })) {
        skipped += 1;
        continue;
      }

      const name = reviewer.name || review.name || "Verified Trekker";
      const content = String(review.comment || "").trim();
      const title = String(review.title || `${trek.title}: ${name}’s Trail Notes`).trim().slice(0, 200);
      if (!content) {
        skipped += 1;
        continue;
      }

      const photo = review.photos?.[0] || trek.coverImage || trek.image || trek.images?.[0] || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1500&q=85";
      const slug = `${trek.slug || "trek"}-${String(booking.bookingReference || booking._id).toLowerCase()}-trekker-notes`
        .replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");

      await Article.create({
        title,
        slug,
        summary: content.replace(/\s+/g, " ").slice(0, 497) + (content.length > 497 ? "..." : ""),
        content,
        coverImage: photo,
        photos: review.photos || [],
        type: "story",
        category: "Trekker Stories",
        status: "pending_review",
        publicationStatus: "Draft",
        author: {
          name,
          role: "Verified Trekker",
          avatarUrl: reviewer.avatar || "",
          isVerifiedTrekker: true,
        },
        relatedTrek: trek._id,
        completedBooking: booking._id,
        submittedBy: reviewer._id,
        moderationNote: "Prepared from this traveler’s approved review. Confirm the traveler’s permission and expand the account before publishing it as a Journal experience.",
        readTime: `${Math.max(1, Math.ceil(content.split(/\s+/).length / 200))} min read`,
        isFeatured: false,
      });
      created += 1;
    }

    console.log(`Created ${created} Trekker Journal review drafts; skipped ${skipped} unmatched or duplicate reviews.`);
  } finally {
    await mongoose.disconnect();
  }
}

importReviewedExperiences().catch((error) => {
  console.error("Trekker experience import failed:", error.message);
  process.exitCode = 1;
});
