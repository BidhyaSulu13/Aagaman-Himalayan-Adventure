import { Router } from "express";
import { getAdminStats, getSettings, updateSettings } from "../controllers/adminController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/stats", protect, requireAdmin, getAdminStats);
router.get("/settings", protect, requireAdmin, getSettings);
router.put("/settings", protect, requireAdmin, updateSettings);

export default router;
