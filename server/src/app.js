import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

// Import all routes
import adminRoutes from "./routes/adminRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import guideRoutes from "./routes/guideRoutes.js";
import contactMessageRoutes from "./routes/contactMessageRoutes.js";
import inquiryRoutes from "./routes/inquiryRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import departureRoutes from "./routes/departureRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import regionRoutes from "./routes/regionRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import trekRoutes from "./routes/trekRoutes.js";
import tripRequestRoutes from "./routes/tripRequestRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import rankingRoutes from "./routes/rankingRoutes.js";
import trekImageUploadRoutes from "./routes/trekImageUploadRoutes.js";
import { TREK_IMAGE_DIR } from "./middleware/trekImageUpload.js";
import { REVIEW_IMAGE_DIR } from "./middleware/reviewPhotoUpload.js";
import { STORY_IMAGE_DIR } from "./middleware/storyCoverUpload.js";

// Error handling middleware
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Security headers
app.use(helmet());

// CORS configuration supporting credentials (HttpOnly cookies)
const configuredClientOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);
const allowedOrigins = new Set([
  ...configuredClientOrigins,
  ...(process.env.NODE_ENV === "production"
    ? []
    : [
        "http://localhost:5173",
        "http://localhost:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5175",
      ]),
].filter(Boolean));

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.has(origin.replace(/\/+$/, ""))) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
  })
);

// Body parsing & cookies
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET));

// Health-check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "himalayan-adventure-api",
    timestamp: new Date().toISOString(),
    uptime: Math.round(process.uptime()),
  });
});

// Mount organized API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/treks", trekRoutes);
app.use("/api/destinations", destinationRoutes);
app.use("/api/regions", regionRoutes);
app.use("/api/departures", departureRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/guides", guideRoutes);
app.use("/api/contact-messages", contactMessageRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/uploads/treks", express.static(TREK_IMAGE_DIR, { fallthrough: true, maxAge: "1d" }));
app.use("/api/uploads/reviews", express.static(REVIEW_IMAGE_DIR, { fallthrough: true, maxAge: "1d" }));
app.use("/api/uploads/stories", express.static(STORY_IMAGE_DIR, { fallthrough: true, maxAge: "1d" }));
app.use("/api/uploads/treks", trekImageUploadRoutes);
app.use("/api/trip-requests", tripRequestRoutes);
app.use("/api/rankings", rankingRoutes);
app.use("/api/admin", adminRoutes);

// Fallback 404 handler and central error handler
app.use(notFound);
app.use(errorHandler);

export default app;
