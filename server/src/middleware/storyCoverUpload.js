import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

export const STORY_IMAGE_DIR = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../uploads/stories"
);

mkdirSync(STORY_IMAGE_DIR, { recursive: true });

const allowedTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);
const allowedVideos = new Map([
  ["video/mp4", ".mp4"],
  ["video/webm", ".webm"],
]);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, STORY_IMAGE_DIR),
  filename: (_req, file, callback) => {
    const extension = allowedTypes.get(file.mimetype) || allowedVideos.get(file.mimetype) || extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${extension}`);
  },
});

export const uploadStoryCover = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024, files: 9 },
  fileFilter: (_req, file, callback) => {
    const validImage = file.fieldname === "photos" && allowedTypes.has(file.mimetype);
    const validVideo = file.fieldname === "videoFile" && allowedVideos.has(file.mimetype);
    if (!validImage && !validVideo) {
      callback(new Error("Experience media must be JPEG, PNG, WebP, MP4, or WebM."));
      return;
    }
    callback(null, true);
  },
}).fields([
  { name: "photos", maxCount: 8 },
  { name: "videoFile", maxCount: 1 },
]);
