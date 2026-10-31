import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    trek: {
      type: Schema.Types.ObjectId,
      ref: "Trek",
      required: true,
      index: true,
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
      maxlength: [2000, "Comment cannot exceed 2000 characters"],
    },
    verificationStatus: {
      type: String,
      enum: ["Verified Trekker", "Unverified"],
      default: "Verified Trekker",
    },
    moderationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "approved",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure fast lookup of approved reviews for a trek
reviewSchema.index({ trek: 1, moderationStatus: 1, createdAt: -1 });

export const Review = model("Review", reviewSchema);
export default Review;
