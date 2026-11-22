import mongoose from "mongoose";

const { Schema, model } = mongoose;

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    summary: {
      type: String,
      required: [true, "Summary is required"],
      maxlength: [500, "Summary cannot exceed 500 characters"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    coverImage: {
      type: String,
      required: [true, "Cover image URL is required"],
    },
    type: {
      type: String,
      enum: ["guide", "story"],
      default: "guide",
      index: true,
    },
    status: {
      type: String,
      enum: ["draft", "pending_review", "approved", "rejected", "published", "unpublished"],
      default: "draft",
      index: true,
    },
    author: {
      // Mixed keeps older articles with a plain-text author readable during migration.
      type: Schema.Types.Mixed,
      default: () => ({ name: "Dawa Sherpa", role: "Agaaman Travel Guide", avatarUrl: "", isVerifiedTrekker: false }),
    },
    relatedTrek: {
      type: Schema.Types.ObjectId,
      ref: "Trek",
      default: null,
      index: true,
    },
    completedBooking: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      default: null,
    },
    blocksDuplicateSubmission: {
      type: Boolean,
      default: true,
    },
    photos: {
      type: [String],
      default: [],
    },
    videoUrl: {
      type: String,
      default: "",
      trim: true,
    },
    instagramUrl: {
      type: String,
      default: "",
      trim: true,
    },
    facebookUrl: {
      type: String,
      default: "",
      trim: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },
    submittedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    moderationNote: {
      type: String,
      default: "",
      maxlength: [1000, "Moderation note cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      default: "Behind the Adventure",
      index: true,
    },
    readTime: {
      type: String,
      default: "6 min read",
    },
    publicationStatus: {
      type: String,
      enum: ["Draft", "Published", "Unpublished", "Archived"],
      default: "Draft",
      index: true,
    },
    publicationDate: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

articleSchema.index(
  { completedBooking: 1 },
  {
    unique: true,
    partialFilterExpression: { type: "story", completedBooking: { $type: "objectId" }, blocksDuplicateSubmission: true },
  }
);

export const Article = model("Article", articleSchema);
export default Article;
