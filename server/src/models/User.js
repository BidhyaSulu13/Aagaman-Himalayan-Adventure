import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please provide a valid email address",
      ],
      index: true,
    },
    passwordHash: {
      type: String,
      select: false,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      select: false,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["traveler", "admin"],
      default: "traveler",
      index: true,
    },
    avatar: {
      type: String,
      default: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    },
    profile: {
      bio: { type: String, default: "" },
      phone: { type: String, default: "" },
      nationality: { type: String, default: "" },
      emergencyContact: {
        name: { type: String, default: "" },
        phone: { type: String, default: "" },
        relationship: { type: String, default: "" },
      },
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
    loginLinkTokenHash: { type: String, select: false },
    loginLinkExpiresAt: { type: Date, select: false },
  },
  {
    timestamps: true,
  }
);

// Method to verify password
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.passwordHash) return false;
  return bcrypt.compare(enteredPassword, this.passwordHash);
};

// Static helper to hash password
userSchema.statics.hashPassword = async function (rawPassword) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(rawPassword, salt);
};

export const User = model("User", userSchema);
export default User;
