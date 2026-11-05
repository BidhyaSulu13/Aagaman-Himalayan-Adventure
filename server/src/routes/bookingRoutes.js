import { Router } from "express";
import {
  cancelBookingRequest,
  createBooking,
  deleteBooking,
  getAllBookings,
  getBookingById,
  getMyBookings,
  updateBookingDetails,
  updateBookingStatus,
} from "../controllers/bookingController.js";
import { optionalAuth, protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/:id", optionalAuth, getBookingById);
router.post("/:id/cancel", optionalAuth, cancelBookingRequest);

// Admin-only endpoints
router.get("/", protect, requireAdmin, getAllBookings);
router.patch("/:id/status", protect, requireAdmin, updateBookingStatus);
router.put("/:id", protect, requireAdmin, updateBookingDetails);
router.delete("/:id", protect, requireAdmin, deleteBooking);

export default router;
