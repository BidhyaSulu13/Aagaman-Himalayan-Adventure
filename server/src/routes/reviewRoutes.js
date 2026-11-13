import { Router } from "express";
import {
  createReview,
  deleteReview,
  getAllReviews,
  getApprovedReviews,
  getTrekReviews,
  moderateReview,
  createVerifiedReview,
  getReviewVerification,
  verifyCompletedTrekBooking,
  requestReviewVerification,
} from "../controllers/reviewController.js";
import { protect, requireAdmin } from "../middleware/auth.js";
import { rateLimit } from "express-rate-limit";
import { uploadReviewPhotos } from "../middleware/reviewPhotoUpload.js";

const router = Router();
const reviewSubmissionLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 6,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many review requests. Please try again later." },
});
const verificationRequestLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many verification requests. Please try again later." },
});

router.get("/approved", getApprovedReviews);
router.get("/trek/:trekId", getTrekReviews);
router.post("/request-verification", verificationRequestLimit, requestReviewVerification);
router.post("/verify-booking", verificationRequestLimit, verifyCompletedTrekBooking);
router.get("/verify/:token", getReviewVerification);
router.post("/verified", reviewSubmissionLimit, uploadReviewPhotos, createVerifiedReview);
router.post("/", reviewSubmissionLimit, protect, uploadReviewPhotos, createReview);

// Admin-only endpoints
router.get("/", protect, requireAdmin, getAllReviews);
router.patch("/:id/moderate", protect, requireAdmin, moderateReview);
router.delete("/:id", protect, requireAdmin, deleteReview);

export default router;
