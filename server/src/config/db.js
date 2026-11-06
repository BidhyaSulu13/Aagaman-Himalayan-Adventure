import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI?.trim() || "mongodb://127.0.0.1:27017/himalayan_adventure";
  const timeout = Number(process.env.MONGODB_SERVER_SELECTION_TIMEOUT_MS) || 15000;

  if (process.env.NODE_ENV === "production" && !process.env.MONGODB_URI?.trim()) {
    throw new Error("MONGODB_URI is required when NODE_ENV is production.");
  }

  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
      serverSelectionTimeoutMS: timeout,
      connectTimeoutMS: Math.min(timeout, 10000),
    });
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error (${error.name || "unknown error"}).`);
    const serverErrors = [...(error.reason?.servers?.values?.() || [])]
      .map((server) => server.error)
      .filter(Boolean);
    const serverCodes = [...new Set(serverErrors.map((item) => item.codeName || item.code || item.name).filter(Boolean))];
    if (serverCodes.length) console.error(`MongoDB server response code(s): ${serverCodes.join(", ")}.`);

    if (error.code === 18 || serverErrors.some((item) => item.code === 18 || /authentication failed|bad auth/i.test(item.message || ""))) {
      console.error("MongoDB rejected authentication. Check the Atlas database username, password, and authSource.");
    } else if (error.name === "MongoServerSelectionError" || error.name === "MongooseServerSelectionError") {
      console.error(
        "Check Atlas Network Access for this computer's current public IP, confirm the cluster is active, and allow outbound TCP 27017. For mongodb+srv URIs, also verify SRV DNS resolution."
      );
    } else if (error.name === "MongoParseError") {
      console.error("Check MONGODB_URI format and URL-encode special characters in the database user's password.");
    } else {
      console.error(error.message);
    }
    throw error;
  }
}
