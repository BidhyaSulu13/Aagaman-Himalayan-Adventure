import { Router } from "express";
import {
  cancelBookingRequest,
  createBooking,
  getAllBookings,
  getBookingById,
  getMyBookings,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import { optionalAuth, protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", optionalAuth, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/:id", optionalAuth, getBookingById);
router.post("/:id/cancel", optionalAuth, cancelBookingRequest);

// Admin-only endpoints
router.get("/", protect, requireAdmin, getAllBookings);
router.patch("/:id/status", protect, requireAdmin, updateBookingStatus);

export default router;
