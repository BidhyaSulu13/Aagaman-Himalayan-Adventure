import { Router } from "express";
import {
  createArticle,
  deleteArticle,
  getArticleBySlug,
  getArticles,
  updateArticle,
} from "../controllers/articleController.js";
import { protect, requireAdmin } from "../middleware/auth.js";

const router = Router();

router.get("/", getArticles);
router.get("/:slug", getArticleBySlug);
router.post("/", protect, requireAdmin, createArticle);
router.put("/:id", protect, requireAdmin, updateArticle);
router.delete("/:id", protect, requireAdmin, deleteArticle);

export default router;
