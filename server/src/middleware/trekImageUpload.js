import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

export const TREK_IMAGE_DIR = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../uploads/treks"
);

mkdirSync(TREK_IMAGE_DIR, { recursive: true });

const allowedTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, TREK_IMAGE_DIR),
  filename: (_req, file, callback) => {
    const extension = allowedTypes.get(file.mimetype) || extname(file.originalname).toLowerCase();
    callback(null, `${randomUUID()}${extension}`);
  },
});

export const uploadTrekImages = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024, files: 12 },
  fileFilter: (_req, file, callback) => {
    if (!allowedTypes.has(file.mimetype)) {
      callback(new Error("Only JPEG, PNG, and WebP images are supported."));
      return;
    }
    callback(null, true);
  },
}).array("images", 12);
