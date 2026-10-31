import { Router } from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getTrekReviews,
  moderateReview,
} from "../controllers/reviewController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/trek/:trekId", getTrekReviews);
router.post("/", protect, createReview);

// Admin-only endpoints
router.get("/", protect, requireAdmin, getAllReviews);
router.patch("/:id/moderate", protect, requireAdmin, moderateReview);
router.delete("/:id", protect, requireAdmin, deleteReview);

export default router;
