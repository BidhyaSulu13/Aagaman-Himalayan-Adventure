import { Router } from "express";
import { createGuide, deleteGuide, getAdminGuides, getGuides, updateGuide } from "../controllers/guideController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = Router();
router.get("/admin", protect, requireAdmin, getAdminGuides);
router.get("/", getGuides);
router.post("/", protect, requireAdmin, createGuide);
router.put("/:id", protect, requireAdmin, updateGuide);
router.delete("/:id", protect, requireAdmin, deleteGuide);

export default router;
