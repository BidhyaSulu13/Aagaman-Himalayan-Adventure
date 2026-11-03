import mongoose from "mongoose";

const { Schema, model } = mongoose;

const itineraryDaySchema = new Schema(
  {
    day: { type: Number, required: true },
    title: { type: String, required: true },
    details: { type: String, default: "" },
    elevation: { type: Number },
    stay: { type: String, default: "Mountain Teahouse" },
    meals: { type: String, default: "Breakfast, Lunch, Dinner" },
  },
  { _id: false }
);

const routeCoordinateSchema = new Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    label: { type: String, default: "" },
  },
  { _id: false }
);

const trekSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Trek title is required"],
      trim: true,
      maxlength: [150, "Title cannot exceed 150 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      maxlength: [400, "Short description cannot exceed 400 characters"],
    },
    fullDescription: {
      type: String,
      required: [true, "Full description is required"],
    },
    introduction: {
      type: String,
      default: "",
    },
    region: {
      type: String,
      required: [true, "Region is required"],
      trim: true,
      index: true,
    },
    location: {
      type: String,
      default: "Nepal",
    },
    destination: {
      type: Schema.Types.ObjectId,
      ref: "Destination",
      default: null,
    },
    duration: {
      type: Number,
      required: [true, "Duration in days is required"],
      min: [1, "Duration must be at least 1 day"],
      index: true,
    },
    difficulty: {
      type: String,
      enum: ["Easy", "Moderate", "Challenging", "Strenuous"],
      default: "Moderate",
      index: true,
    },
    maximumElevation: {
      type: Number,
      required: [true, "Maximum elevation in meters is required"],
    },
    distance: {
      type: String,
      default: "130 km / 80 mi",
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    currency: {
      type: String,
      default: "USD",
      uppercase: true,
    },
    images: {
      type: [String],
      default: [],
    },
    gallery: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: "" },
        caption: { type: String, default: "" },
        _id: false,
      },
    ],
    itinerary: {
      type: [itineraryDaySchema],
      default: [],
    },
    inclusions: {
      type: [String],
      default: [],
    },
    exclusions: {
      type: [String],
      default: [],
    },
    requiredPermits: {
      type: [String],
      default: [],
    },
    recommendedSeason: {
      type: [String],
      default: ["Spring (March - May)", "Autumn (Sept - Nov)"],
    },
    routeCoordinates: {
      type: [routeCoordinateSchema],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
    featuredOrder: {
      type: Number,
      default: 0,
      index: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
      index: true,
    },
    uniqueViewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
    discountPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    groupCapacity: {
      type: Number,
      default: 12,
      min: 1,
    },
    minGroupSize: {
      type: Number,
      min: 1,
      default: 1,
    },
    transportation: {
      type: String,
      trim: true,
      default: "",
    },
    accommodation: {
      type: String,
      trim: true,
      default: "",
    },
    meals: {
      type: String,
      trim: true,
      default: "",
    },
    tripType: {
      type: String,
      trim: true,
      default: "",
    },
    highlights: {
      type: [String],
      default: [],
    },
    published: {
      type: Boolean,
      default: true,
      index: true,
    },
    rating: {
      type: Number,
      default: 4.95,
      min: 1,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast filtering by region, difficulty, and published status
trekSchema.index({ published: 1, region: 1, difficulty: 1 });
trekSchema.index({ published: 1, featured: 1 });

export const Trek = model("Trek", trekSchema);
export default Trek;
