import { Router } from "express";
import {
  createDeparture,
  deleteDeparture,
  getDepartures,
  updateDeparture,
} from "../controllers/departureController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", getDepartures);
router.post("/", protect, requireAdmin, createDeparture);
router.put("/:id", protect, requireAdmin, updateDeparture);
router.delete("/:id", protect, requireAdmin, deleteDeparture);

export default router;
