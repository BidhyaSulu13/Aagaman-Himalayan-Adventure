import { Router } from "express";
import {
  createTripRequest,
  getAllTripRequests,
  getMyTripRequests,
  updateTripRequestStatus,
} from "../controllers/tripRequestController.js";
import { optionalAuth, protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", optionalAuth, createTripRequest);
router.get("/my", protect, getMyTripRequests);

// Admin-only endpoints
router.get("/", protect, requireAdmin, getAllTripRequests);
router.patch("/:id/status", protect, requireAdmin, updateTripRequestStatus);

export default router;
