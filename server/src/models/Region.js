import mongoose from "mongoose";

const { Schema, model } = mongoose;

const regionSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Region name is required"],
      trim: true,
      maxlength: [120, "Name cannot exceed 120 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    label: {
      type: String,
      default: "",
    },
    tagline: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    image: {
      type: String,
      default: "",
    },
    coordinates: {
      lat: { type: Number, default: 28.0 },
      lng: { type: Number, default: 85.0 },
    },
    bestSeason: {
      type: [String],
      default: ["Spring", "Autumn"],
    },
    highlights: {
      type: [String],
      default: [],
    },
    maxElevation: {
      type: Number,
      default: 5400,
    },
    gradingList: {
      type: [String],
      default: ["Challenging", "Strenuous", "Moderate", "Easy"],
    },
    permits: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const Region = model("Region", regionSchema);
export default Region;
