import mongoose from "mongoose";

const { Schema, model } = mongoose;

const trekViewSchema = new Schema(
  {
    trek: {
      type: Schema.Types.ObjectId,
      ref: "Trek",
      required: true,
      index: true,
    },
    identifier: {
      type: String,
      required: true,
      index: true,
    },
    ip: {
      type: String,
      default: "",
    },
    userAgent: {
      type: String,
      default: "",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    verificationStatus: {
      type: String,
      enum: ["Unverified", "Verified Trekker"],
      default: "Unverified",
      index: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
  }
);

// Compound index for fast deduplication check
trekViewSchema.index({ trek: 1, identifier: 1, createdAt: -1 });

export const TrekView = model("TrekView", trekViewSchema);
export default TrekView;
