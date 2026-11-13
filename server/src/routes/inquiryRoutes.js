import { Router } from "express";
import { rateLimit } from "express-rate-limit";
import { createInquiry, getAdminInquiries, replyToInquiry, updateInquiryStatus } from "../controllers/inquiryController.js";
import { optionalAuth, protect, requireAdmin } from "../middleware/auth.js";

const router = Router();
const inquirySubmissionLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many inquiry submissions. Please try again later." },
});

router.post("/", inquirySubmissionLimit, optionalAuth, createInquiry);
router.get("/admin", protect, requireAdmin, getAdminInquiries);
router.post("/:id/reply", protect, requireAdmin, replyToInquiry);
router.patch("/:id/status", protect, requireAdmin, updateInquiryStatus);

export default router;
