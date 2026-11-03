import { Router } from "express";
import {
  createRegion,
  deleteRegion,
  getRegionBySlug,
  getRegions,
  updateRegion,
} from "../controllers/regionController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", getRegions);
router.get("/:slug", getRegionBySlug);
router.post("/", protect, requireAdmin, createRegion);
router.put("/:id", protect, requireAdmin, updateRegion);
router.delete("/:id", protect, requireAdmin, deleteRegion);

export default router;
