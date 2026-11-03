import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    name: {
      type: String,
      trim: true,
      maxlength: [120, "Name cannot exceed 120 characters"],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      maxlength: [254, "Email cannot exceed 254 characters"],
      select: false,
    },
    trek: {
      type: Schema.Types.ObjectId,
      ref: "Trek",
      required: true,
      index: true,
    },
    booking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
    },
    title: {
      type: String,
      default: "",
      trim: true,
      maxlength: [120, "Review title cannot exceed 120 characters"],
    },
    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: [true, "Comment is required"],
      trim: true,
      maxlength: [2000, "Comment cannot exceed 2000 characters"],
    },
    photos: {
      type: [String],
      default: [],
    },
    verificationStatus: {
      type: String,
      enum: ["Verified Trekker", "Unverified"],
      default: "Unverified",
    },
    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure fast lookup of approved reviews for a trek
reviewSchema.index({ trek: 1, moderationStatus: 1, createdAt: -1 });
reviewSchema.index({ booking: 1 }, { unique: true, sparse: true });

export const Review = model("Review", reviewSchema);
export default Review;
