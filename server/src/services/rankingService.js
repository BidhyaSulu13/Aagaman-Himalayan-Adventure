import crypto from "crypto";
import mongoose from "mongoose";
import { Booking } from "../models/Booking.js";
import { Favorite } from "../models/Favorite.js";
import { Review } from "../models/Review.js";
import { Trek } from "../models/Trek.js";
import { TrekView } from "../models/TrekView.js";

const VIEW_DEDUPLICATION_WINDOW_MS = 24 * 60 * 60 * 1000; // 24 hours

function verifiedCompletedReviewStages() {
  return [
    {
      $match: {
        moderationStatus: "approved",
        verificationStatus: "Verified Trekker",
        booking: { $exists: true, $ne: null },
      },
    },
    {
      $lookup: {
        from: "bookings",
        localField: "booking",
        foreignField: "_id",
        as: "bookingDetails",
      },
    },
    { $unwind: "$bookingDetails" },
    { $match: { "bookingDetails.bookingStatus": "Completed" } },
  ];
}

export async function getVerifiedReviewStats(trekIds) {
  if (!trekIds?.length) return new Map();
  const stats = await Review.aggregate([
    { $match: { trek: { $in: trekIds } } },
    ...verifiedCompletedReviewStages(),
    {
      $group: {
        _id: "$trek",
        rating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);
  return new Map(stats.map((item) => [
    item._id.toString(),
    { rating: Number(item.rating.toFixed(2)), count: item.count },
  ]));
}

/**
 * Generate a privacy-preserving deduplication hash for an incoming client request.
 */
export function generateClientIdentifier(req) {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.ip ||
    req.socket?.remoteAddress ||
    "127.0.0.1";
  const userAgent = req.headers["user-agent"] || "unknown";
  const userId = req.user?._id ? req.user._id.toString() : "";

  return crypto
    .createHash("sha256")
    .update(`${ip}::${userAgent}::${userId}`)
    .digest("hex");
}

/**
 * Record a unique trek view with strict 24-hour deduplication.
 */
export async function recordUniqueView({ trekId, req }) {
  if (!trekId || !mongoose.Types.ObjectId.isValid(trekId)) {
    return { recorded: false, reason: "invalid_id" };
  }

  const identifier = generateClientIdentifier(req);
  const cutoff = new Date(Date.now() - VIEW_DEDUPLICATION_WINDOW_MS);

  // Check if this identifier has viewed this trek in the deduplication window
  const existingView = await TrekView.findOne({
    trek: trekId,
    identifier,
    createdAt: { $gte: cutoff },
  });

  if (existingView) {
    return { recorded: false, reason: "deduplicated" };
  }

  // Create new view record
  const userAgent = (req.headers["user-agent"] || "").substring(0, 200);
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
    req.ip ||
    req.socket?.remoteAddress ||
    "";
  const isVerifiedTrekker = req.user?.role === "traveler" &&
    req.user.emailVerified === true &&
    await Booking.exists({
      trek: trekId,
      bookingStatus: "Completed",
      $or: [
        { user: req.user._id },
        { "travelerDetails.email": req.user.email.toLowerCase() },
      ],
    });

  await TrekView.create({
    trek: trekId,
    identifier,
    ip,
    userAgent,
    user: req.user?._id || null,
    verificationStatus: isVerifiedTrekker ? "Verified Trekker" : "Unverified",
  });

  // Increment cached unique views on Trek model for fast indexing
  await Trek.findByIdAndUpdate(trekId, { $inc: { uniqueViewsCount: 1 } });

  return { recorded: true };
}

/**
 * Calculate dynamic Popularity Score:
 * Popularity Score = (Confirmed Bookings × 5) + (Unique Views × 1) + (Wishlist Additions × 2) + (Approved Reviews × 3)
 */
export async function getMostPopularTreks({ limit = 8, region, difficulty } = {}) {
  const match = {
    published: true,
    isArchived: { $ne: true },
  };

  if (region && region !== "All") {
    match.region = { $regex: new RegExp(region, "i") };
  }

  if (difficulty && difficulty !== "All") {
    match.difficulty = difficulty;
  }

  const pipeline = [
    { $match: match },

    // 1. Confirmed Bookings only
    {
      $lookup: {
        from: "bookings",
        let: { trekId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$trek", "$$trekId"] },
                  { $in: ["$bookingStatus", ["Confirmed", "Completed"]] },
                ],
              },
            },
          },
        ],
        as: "confirmedBookingsList",
      },
    },

    // 2. Unique Views (deduplicated TrekView collection)
    {
      $lookup: {
        from: "trekviews",
        let: { trekId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$trek", "$$trekId"] },
            },
          },
        ],
        as: "viewsList",
      },
    },

    // 3. Wishlist additions from Favorite collection
    {
      $lookup: {
        from: "favorites",
        let: { trekId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $in: ["$$trekId", "$treks"] },
            },
          },
        ],
        as: "wishlistList",
      },
    },

    // 4. Reviews of completed, verified bookings
    {
      $lookup: {
        from: "reviews",
        let: { trekId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: { $eq: ["$trek", "$$trekId"] },
            },
          },
          ...verifiedCompletedReviewStages(),
        ],
        as: "approvedReviewsList",
      },
    },

    // 5. Populate Destination
    {
      $lookup: {
        from: "destinations",
        localField: "destination",
        foreignField: "_id",
        as: "destinationDetails",
      },
    },

    // 6. Compute Popularity Score dynamically
    {
      $addFields: {
        destination: { $arrayElemAt: ["$destinationDetails", 0] },
        confirmedBookingsCount: { $size: "$confirmedBookingsList" },
        uniqueViewsCount: {
          $max: [{ $size: "$viewsList" }, { $ifNull: ["$uniqueViewsCount", 0] }],
        },
        wishlistCount: { $size: "$wishlistList" },
        approvedReviewsCount: { $size: "$approvedReviewsList" },
        calculatedRating: {
          $cond: [
            { $gt: [{ $size: "$approvedReviewsList" }, 0] },
            { $round: [{ $avg: "$approvedReviewsList.rating" }, 2] },
            0,
          ],
        },
        popularityScore: {
          $add: [
            { $multiply: [{ $size: "$confirmedBookingsList" }, 5] },
            {
              $multiply: [
                { $max: [{ $size: "$viewsList" }, { $ifNull: ["$uniqueViewsCount", 0] }] },
                1,
              ],
            },
            { $multiply: [{ $size: "$wishlistList" }, 2] },
            { $multiply: [{ $size: "$approvedReviewsList" }, 3] },
          ],
        },
      },
    },

    // 7. Strip intermediate heavy arrays
    {
      $project: {
        confirmedBookingsList: 0,
        viewsList: 0,
        wishlistList: 0,
        approvedReviewsList: 0,
        destinationDetails: 0,
      },
    },

    // 8. Sort by Popularity Score descending, with newest as secondary sort
    {
      $sort: {
        popularityScore: -1,
        calculatedRating: -1,
        createdAt: -1,
      },
    },

    { $limit: Math.max(1, parseInt(limit, 10)) },
  ];

  const allResults = await Trek.aggregate(pipeline);

  // Only return treks with an actual popularity signal (score > 0).
  // If no treks have real activity yet, fall back to the top-rated pre-seeded treks
  // so the homepage is never empty during early-stage operation.
  const withScore = allResults.filter((t) => t.popularityScore > 0);
  return withScore.length > 0 ? withScore : allResults.slice(0, Math.min(3, allResults.length));
}

/**
 * Dynamic Top Rated Treks:
 * Calculate ratings dynamically from approved reviews of completed, verified bookings.
 * Enforce minimum threshold of approved reviews before awarding top-tier status.
 */
export async function getTopRatedTreks({ limit = 8, minThreshold = 1 } = {}) {
  const match = {
    published: true,
    isArchived: { $ne: true },
  };

  const threshold = Math.max(1, parseInt(minThreshold, 10));

  const pipeline = [
    { $match: match },

    // Count only reviews backed by completed bookings and server-side verification.
    {
      $lookup: {
        from: "reviews",
        let: { trekId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $eq: ["$trek", "$$trekId"],
              },
            },
          },
          ...verifiedCompletedReviewStages(),
        ],
        as: "approvedReviewsList",
      },
    },

    // Lookup Destination
    {
      $lookup: {
        from: "destinations",
        localField: "destination",
        foreignField: "_id",
        as: "destinationDetails",
      },
    },

    {
      $addFields: {
        destination: { $arrayElemAt: ["$destinationDetails", 0] },
        approvedReviewsCount: { $size: "$approvedReviewsList" },
        rating: {
          $cond: [
            { $gt: [{ $size: "$approvedReviewsList" }, 0] },
            { $round: [{ $avg: "$approvedReviewsList.rating" }, 2] },
            0,
          ],
        },
        computedRating: {
          $cond: [
            { $gt: [{ $size: "$approvedReviewsList" }, 0] },
            { $round: [{ $avg: "$approvedReviewsList.rating" }, 2] },
            0,
          ],
        },
        meetsThreshold: {
          $gte: [{ $size: "$approvedReviewsList" }, threshold],
        },
      },
    },

    {
      $project: {
        approvedReviewsList: 0,
        destinationDetails: 0,
      },
    },

    // Rank treks that meet the review threshold higher, then by rating
    {
      $sort: {
        meetsThreshold: -1,
        computedRating: -1,
        approvedReviewsCount: -1,
        createdAt: -1,
      },
    },

    { $limit: Math.max(1, parseInt(limit, 10)) },
  ];

  const allResults = await Trek.aggregate(pipeline);

  const verified = allResults.filter((t) => t.approvedReviewsCount >= threshold);
  return verified;
}

/**
 * Admin-Controlled Featured Treks:
 * Returns packages flagged as featured by admins, ordered by manual display index `featuredOrder`.
 */
export async function getFeaturedTreks({ limit = 8 } = {}) {
  const treks = await Trek.find({
    published: true,
    featured: true,
    isArchived: { $ne: true },
  })
    .populate("destination", "name slug region")
    .sort({ featuredOrder: 1, createdAt: -1 })
    .limit(Math.max(1, parseInt(limit, 10)));

  // Attach dynamic review statistics
  const trekIds = treks.map((t) => t._id);
  const reviewStats = await Review.aggregate([
    {
      $match: {
        trek: { $in: trekIds },
      },
    },
    ...verifiedCompletedReviewStages(),
    {
      $group: {
        _id: "$trek",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const statsMap = new Map();
  reviewStats.forEach((s) => {
    statsMap.set(s._id.toString(), {
      avgRating: Number(s.avgRating.toFixed(2)),
      count: s.count,
    });
  });

  return treks.map((t) => {
    const obj = t.toObject();
    const st = statsMap.get(t._id.toString());
    obj.rating = st?.avgRating ?? 0;
    obj.reviewCount = st?.count ?? 0;
    obj.approvedReviewsCount = st?.count ?? 0;
    obj.calculatedRating = st?.avgRating ?? 0;
    return obj;
  });
}

/**
 * Automatically recalculate and synchronize aggregate rating and review count on Trek
 * whenever a review is approved, modified, or deleted.
 */
export async function recalculateTrekRating(trekId) {
  if (!trekId) return null;

  const validId =
    typeof trekId === "string" ? new mongoose.Types.ObjectId(trekId) : trekId;

  const stats = await Review.aggregate([
    {
      $match: {
        trek: validId,
      },
    },
    ...verifiedCompletedReviewStages(),
    {
      $group: {
        _id: "$trek",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const avgRating = stats[0]?.avgRating ? Number(stats[0].avgRating.toFixed(2)) : 0;
  const count = stats[0]?.count || 0;

  return await Trek.findByIdAndUpdate(
    validId,
    {
      rating: avgRating,
      reviewCount: count,
    },
    { new: true }
  );
}

/**
 * Update featured flag and manual display order index.
 */
export async function updateTrekFeaturedSettings(trekId, { featured, featuredOrder }) {
  const updateData = {};
  if (typeof featured === "boolean") updateData.featured = featured;
  if (featuredOrder !== undefined && !isNaN(Number(featuredOrder))) {
    updateData.featuredOrder = Number(featuredOrder);
  }

  return await Trek.findByIdAndUpdate(trekId, updateData, { new: true });
}

/**
 * Batch update display orders for featured treks.
 */
export async function batchUpdateFeaturedOrder(items) {
  const bulkOps = items.map((item) => ({
    updateOne: {
      filter: { _id: item.trekId },
      update: {
        $set: {
          featuredOrder: Number(item.featuredOrder) || 0,
          ...(item.featured !== undefined ? { featured: Boolean(item.featured) } : {}),
        },
      },
    },
  }));

  if (bulkOps.length > 0) {
    await Trek.bulkWrite(bulkOps);
  }
  return true;
}
