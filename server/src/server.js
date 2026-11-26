import "dotenv/config";
import app from "./app.js";
import { connectDB } from "./config/db.js";

const port = Number(process.env.PORT) || 5000;

async function startServer() {
  await connectDB();

  app.listen(port, "0.0.0.0", () => {
    console.log(`===============================================`);
    console.log(` Himalayan Adventure API Server`);
    console.log(` Port: ${port}`);
    console.log(` Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(` Health check: http://localhost:${port}/api/health`);
    console.log(`===============================================`);
  });
}

startServer();