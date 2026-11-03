import * as rankingService from "../services/rankingService.js";

// GET /api/rankings/popular
export async function getPopularTreks(req, res, next) {
  try {
    const { limit = 8, region, difficulty } = req.query;
    const treks = await rankingService.getMostPopularTreks({
      limit: Number(limit) || 8,
      region,
      difficulty,
    });

    res.json({
      success: true,
      count: treks.length,
      algorithm:
        "Popularity Score = (Confirmed Bookings × 5) + (Unique Views × 1) + (Wishlist Additions × 2) + (Approved Reviews × 3)",
      treks,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/rankings/top-rated
export async function getTopRatedTreks(req, res, next) {
  try {
    const { limit = 8, minReviewsThreshold = 1 } = req.query;
    const treks = await rankingService.getTopRatedTreks({
      limit: Number(limit) || 8,
      minThreshold: Number(minReviewsThreshold) || 1,
    });

    res.json({
      success: true,
      count: treks.length,
      treks,
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/rankings/featured
export async function getFeaturedTreks(req, res, next) {
  try {
    const { limit = 8 } = req.query;
    const treks = await rankingService.getFeaturedTreks({
      limit: Number(limit) || 8,
    });

    res.json({
      success: true,
      count: treks.length,
      treks,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/rankings/view/:trekId
export async function trackTrekView(req, res, next) {
  try {
    const { trekId } = req.params;
    const result = await rankingService.recordUniqueView({
      trekId,
      req,
    });

    res.json({
      success: true,
      ...result,
      message: result.recorded
        ? "Unique trek view recorded."
        : "View deduplicated (cooldown active).",
    });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/rankings/featured/:trekId (Admin)
export async function setTrekFeatured(req, res, next) {
  try {
    const { trekId } = req.params;
    const { featured, featuredOrder } = req.body;

    const trek = await rankingService.updateTrekFeaturedSettings(trekId, {
      featured,
      featuredOrder,
    });

    if (!trek) {
      return res.status(404).json({ success: false, message: "Trek not found." });
    }

    res.json({
      success: true,
      trek,
      message: `Trek featured settings updated successfully.`,
    });
  } catch (error) {
    next(error);
  }
}

// PUT /api/rankings/featured-order (Admin)
export async function batchUpdateFeatured(req, res, next) {
  try {
    const { items } = req.body;
    if (!Array.isArray(items)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payload: 'items' array required.",
      });
    }

    await rankingService.batchUpdateFeaturedOrder(items);

    res.json({
      success: true,
      message: "Featured trek order updated successfully.",
    });
  } catch (error) {
    next(error);
  }
}

