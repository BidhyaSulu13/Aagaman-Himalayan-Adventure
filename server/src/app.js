import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";

// Import all routes
import adminRoutes from "./routes/adminRoutes.js";
import articleRoutes from "./routes/articleRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import departureRoutes from "./routes/departureRoutes.js";
import destinationRoutes from "./routes/destinationRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import trekRoutes from "./routes/trekRoutes.js";
import tripRequestRoutes from "./routes/tripRequestRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Error handling middleware
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const app = express();

// Security headers
app.use(helmet());

// CORS configuration supporting credentials (HttpOnly cookies)
const allowedOrigins = [
  process.env.CLIENT_URL || "http://localhost:5173",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "http://127.0.0.1:5175",
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Dev convenience
      }
    },
    credentials: true,
  })
);

// Body parsing & cookies
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser(process.env.COOKIE_SECRET || "agaaman_cookie_secret"));

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
app.use("/api/departures", departureRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/trip-requests", tripRequestRoutes);
app.use("/api/admin", adminRoutes);

// Fallback 404 handler and central error handler
app.use(notFound);
app.use(errorHandler);

export default app;
