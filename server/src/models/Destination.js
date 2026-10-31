import mongoose from "mongoose";

const { Schema, model } = mongoose;

const destinationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Destination name is required"],
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
    region: {
      type: String,
      required: [true, "Region is required"],
      trim: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    images: {
      type: [String],
      default: [],
    },
    coordinates: {
      lat: { type: Number, default: 27.7172 },
      lng: { type: Number, default: 85.324 },
    },
    bestSeason: {
      type: [String],
      default: ["Spring", "Autumn"],
    },
    highlights: {
      type: [String],
      default: [],
    },
    relatedTreks: [
      {
        type: Schema.Types.ObjectId,
        ref: "Trek",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Destination = model("Destination", destinationSchema);
export default Destination;
