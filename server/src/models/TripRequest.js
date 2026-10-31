import mongoose from "mongoose";

const { Schema, model } = mongoose;

const tripRequestSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      default: "",
    },
    preferredRegion: {
      type: String,
      required: [true, "Preferred region is required"],
      trim: true,
    },
    travelDates: {
      startDate: { type: Date },
      durationDays: { type: Number, default: 14 },
    },
    budget: {
      type: Number,
      default: null,
    },
    groupSize: {
      type: Number,
      default: 2,
      min: [1, "Group size must be at least 1"],
    },
    experienceLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Expert"],
      default: "Intermediate",
    },
    specialRequirements: {
      type: String,
      default: "",
    },
    requestStatus: {
      type: String,
      enum: [
        "Received",
        "Under Review",
        "Proposal Sent",
        "Confirmed",
        "Closed",
      ],
      default: "Received",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TripRequest = model("TripRequest", tripRequestSchema);
export default TripRequest;
