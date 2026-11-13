import { Router } from "express";
import {
  createContactMessage,
  getContactMessages,
  replyToContactMessage,
  updateContactMessageStatus,
} from "../controllers/contactMessageController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.post("/", createContactMessage);
router.get("/", protect, requireAdmin, getContactMessages);
router.post("/:id/reply", protect, requireAdmin, replyToContactMessage);
router.patch("/:id/status", protect, requireAdmin, updateContactMessageStatus);

export default router;
