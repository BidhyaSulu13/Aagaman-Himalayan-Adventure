import { Router } from "express";
import { getFavorites, toggleFavorite } from "../controllers/favoriteController.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.get("/", protect, getFavorites);
router.post("/toggle", protect, toggleFavorite);

export default router;
