import { Router } from "express";
import { getAllFavorites, getFavorites, toggleFavorite } from "../controllers/favoriteController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/admin", protect, requireAdmin, getAllFavorites);
router.get("/", protect, getFavorites);
router.post("/toggle", protect, toggleFavorite);

export default router;
