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
    author: {
      type: String,
      default: "Dawa Sherpa",
    },
    category: {
      type: String,
      default: "Field Notes",
      index: true,
    },
    readTime: {
      type: String,
      default: "6 min read",
    },
    publicationStatus: {
      type: String,
      enum: ["Draft", "Published", "Archived"],
      default: "Published",
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

export const Article = model("Article", articleSchema);
export default Article;
