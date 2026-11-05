import { Router } from "express";
import {
  createDeparture,
  deleteDeparture,
  getDepartureById,
  getAdminDepartures,
  getDepartureSummary,
  getDepartures,
  updateDeparture,
} from "../controllers/departureController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/admin/summary", protect, requireAdmin, getDepartureSummary);
router.get("/admin", protect, requireAdmin, getAdminDepartures);
router.get("/", getDepartures);
router.get("/:id", getDepartureById);
router.post("/", protect, requireAdmin, createDeparture);
router.put("/:id", protect, requireAdmin, updateDeparture);
router.delete("/:id", protect, requireAdmin, deleteDeparture);

export default router;
