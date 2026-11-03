import { Router } from "express";
import {
  deleteUser,
  getUsers,
  updateUserRole,
  updateUserStatus,
} from "../controllers/userController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, requireAdmin, getUsers);
router.patch("/:id/role", protect, requireAdmin, updateUserRole);
router.patch("/:id/status", protect, requireAdmin, updateUserStatus);
router.delete("/:id", protect, requireAdmin, deleteUser);

export default router;
