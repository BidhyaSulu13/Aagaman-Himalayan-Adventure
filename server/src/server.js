import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const port = Number(process.env.PORT) || 5000;

process.on("uncaughtException", (err) => {
  console.error("[CRITICAL] Uncaught Exception:", err);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("[CRITICAL] Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

function validateConfiguration() {
  for (const name of ["JWT_SECRET", "COOKIE_SECRET"]) {
    if (!process.env[name] || process.env[name].length < 32) {
      throw new Error(`${name} must be configured with at least 32 characters.`);
    }
  }
}

async function startServer() {
  validateConfiguration();
  await connectDB();

  app.listen(port, () => {
    console.log(`===============================================`);
    console.log(` Himalayan Adventure API Server`);
    console.log(` Port: ${port}`);
    console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(` Health check: http://localhost:${port}/api/health`);
    console.log(`===============================================`);
  });
}

startServer().catch((error) => {
  console.error("[STARTUP] API server failed to start:", error.message);
  process.exitCode = 1;
});
