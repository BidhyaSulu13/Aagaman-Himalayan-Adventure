import mongoose from "mongoose";

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/himalayan_adventure";
  try {
    const conn = await mongoose.connect(uri, {
      autoIndex: true,
    });
    console.log(`MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    // Don't exit process in development to allow hot reload or inspection
    if (process.env.NODE_ENV === "production") {
      process.exit(1);
    }
  }
}
