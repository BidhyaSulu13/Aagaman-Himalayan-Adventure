import { Router } from "express";
import {
  createTrek,
  deleteTrek,
  getTrekBySlug,
  getTreks,
  toggleArchiveTrek,
  toggleFeaturedTrek,
  togglePublishTrek,
  updateTrek,
} from "../controllers/trekController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", getTreks);
router.get("/:slug", getTrekBySlug);

// Admin-only endpoints
router.post("/", protect, requireAdmin, createTrek);
router.put("/:id", protect, requireAdmin, updateTrek);
router.delete("/:id", protect, requireAdmin, deleteTrek);
router.patch("/:id/publish", protect, requireAdmin, togglePublishTrek);
router.patch("/:id/featured", protect, requireAdmin, toggleFeaturedTrek);
router.patch("/:id/archive", protect, requireAdmin, toggleArchiveTrek);

export default router;
