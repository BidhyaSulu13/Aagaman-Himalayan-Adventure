import { Review } from "../models/Review.js";
import { Trek } from "../models/Trek.js";

// GET /api/reviews/trek/:trekId
export async function getTrekReviews(req, res, next) {
  try {
    const { trekId } = req.params;
    const reviews = await Review.find({
      trek: trekId,
      moderationStatus: "approved",
    })
      .populate("user", "name avatar nationality")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/reviews (Authenticated user creates review)
export async function createReview(req, res, next) {
  try {
    const { trekId, rating, comment } = req.body;

    if (!trekId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "Trek ID, rating (1-5), and comment are required.",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      trek: trekId,
      rating: Number(rating),
      comment: comment.trim(),
      moderationStatus: "approved",
    });

    // Update Trek aggregate rating
    const allReviews = await Review.find({ trek: trekId, moderationStatus: "approved" });
    const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / (allReviews.length || 1);

    await Trek.findByIdAndUpdate(trekId, {
      rating: Number(avgRating.toFixed(2)),
      reviewCount: allReviews.length,
    });

    const populated = await review.populate("user", "name avatar nationality");

    res.status(201).json({
      success: true,
      review: populated,
      message: "Thank you for sharing your trail experience!",
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/reviews (Admin review moderation queue)
export async function getAllReviews(req, res, next) {
  try {
    const { moderationStatus } = req.query;
    const query = {};
    if (moderationStatus) query.moderationStatus = moderationStatus;

    const reviews = await Review.find(query)
      .populate("user", "name email avatar")
      .populate("trek", "title slug")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/reviews/:id/moderate (Admin)
export async function moderateReview(req, res, next) {
  try {
    const { id } = req.params;
    const { moderationStatus } = req.body;

    const review = await Review.findByIdAndUpdate(
      id,
      { moderationStatus },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    res.json({
      success: true,
      review,
      message: `Review moderation status updated to '${moderationStatus}'.`,
    });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/reviews/:id (Admin)
export async function deleteReview(req, res, next) {
  try {
    const { id } = req.params;
    const review = await Review.findByIdAndDelete(id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found." });
    res.json({ success: true, message: "Review deleted." });
  } catch (error) {
    next(error);
  }
}
