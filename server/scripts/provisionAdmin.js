import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import { User } from "../src/models/User.js";

const resetPassword = process.argv.includes("--reset-password");
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const name = process.env.ADMIN_NAME?.trim() || "Agaaman Administrator";

async function provisionAdmin() {
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error("Set ADMIN_EMAIL to a valid administrator email address in server/.env.");
  }

  if (!password || password.length < 16) {
    throw new Error("Set ADMIN_PASSWORD to a unique password with at least 16 characters in server/.env.");
  }

  await connectDB();

  const existingUser = await User.findOne({ email }).select("+passwordHash");
  if (existingUser && existingUser.role !== "admin") {
    throw new Error("That email already belongs to a non-admin account; no account was changed.");
  }

  if (existingUser && !resetPassword) {
    throw new Error("An admin already exists for that email. Use --reset-password to change its password.");
  }

  const passwordHash = await User.hashPassword(password);

  if (existingUser) {
    existingUser.passwordHash = passwordHash;
    await existingUser.save();
    console.log("Administrator password updated.");
    return;
  }

  await User.create({
    name,
    email,
    passwordHash,
    role: "admin",
  });
  console.log("Administrator account created.");
}

provisionAdmin()
  .catch((error) => {
    console.error(`Admin provisioning failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
