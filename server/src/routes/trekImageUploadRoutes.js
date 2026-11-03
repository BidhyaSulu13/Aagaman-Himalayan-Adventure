import { Router } from "express";
import { uploadTrekImages as handleTrekImageUpload } from "../controllers/trekImageUploadController.js";
import { protect, requireAdmin } from "../middleware/auth.js";
import { uploadTrekImages } from "../middleware/trekImageUpload.js";

const router = Router();

router.post("/", protect, requireAdmin, uploadTrekImages, handleTrekImageUpload);

export default router;
