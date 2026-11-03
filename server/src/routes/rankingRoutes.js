import { Router } from "express";
import {
  batchUpdateFeatured,
  getFeaturedTreks,
  getPopularTreks,
  getTopRatedTreks,
  setTrekFeatured,
  trackTrekView,
} from "../controllers/rankingController.js";
import { optionalAuth, protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

// Public ranking discovery endpoints
router.get("/popular", getPopularTreks);
router.get("/top-rated", getTopRatedTreks);
router.get("/featured", getFeaturedTreks);

// Deduplicated view tracking endpoint (optionalAuth to capture logged-in user if available)
router.post("/view/:trekId", optionalAuth, trackTrekView);

// Admin-controlled featured management endpoints
router.patch("/featured/:trekId", protect, requireAdmin, setTrekFeatured);
router.put("/featured-order", protect, requireAdmin, batchUpdateFeatured);

export default router;

