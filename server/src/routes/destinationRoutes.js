import { Router } from "express";
import {
  createDestination,
  deleteDestination,
  getDestinationBySlug,
  getDestinations,
  updateDestination,
} from "../controllers/destinationController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", getDestinations);
router.get("/:slug", getDestinationBySlug);
router.post("/", protect, requireAdmin, createDestination);
router.put("/:id", protect, requireAdmin, updateDestination);
router.delete("/:id", protect, requireAdmin, deleteDestination);

export default router;
