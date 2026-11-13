import { Router } from "express";
import {
  createArticle,
  deleteArticle,
  getAdminArticles,
  getArticleBySlug,
  getArticles,
  getMyStories,
  moderateTrekStory,
  submitTrekStory,
  updateMyTrekStory,
  updateArticle,
} from "../controllers/articleController.js";
import { protect, requireAdmin } from "../middleware/auth.js";
import { uploadStoryCover } from "../middleware/storyCoverUpload.js";

const router = Router();

router.get("/admin", protect, requireAdmin, getAdminArticles);
router.get("/mine", protect, getMyStories);
router.post("/stories", protect, (req, res, next) => {
  if (req.user.role !== "traveler") return res.status(403).json({ success: false, message: "Only traveler accounts can submit trek stories." });
  next();
}, uploadStoryCover, submitTrekStory);
router.patch("/stories/:id", protect, (req, res, next) => {
  if (req.user.role !== "traveler") return res.status(403).json({ success: false, message: "Only traveler accounts can revise trek experiences." });
  next();
}, uploadStoryCover, updateMyTrekStory);
router.patch("/:id/moderate-story", protect, requireAdmin, moderateTrekStory);
router.get("/", getArticles);
router.get("/:slug", getArticleBySlug);
router.post("/", protect, requireAdmin, createArticle);
router.put("/:id", protect, requireAdmin, updateArticle);
router.delete("/:id", protect, requireAdmin, deleteArticle);

export default router;
