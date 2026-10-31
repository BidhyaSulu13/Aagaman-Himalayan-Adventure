import { Router } from "express";
import { getUsers, updateUserRole, updateUserStatus } from "../controllers/userController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, requireAdmin, getUsers);
router.patch("/:id/role", protect, requireAdmin, updateUserRole);
router.patch("/:id/status", protect, requireAdmin, updateUserStatus);

export default router;
