import mongoose from "mongoose";

const { Schema, model } = mongoose;

const guideSchema = new Schema({
  title: { type: String, required: true, trim: true, maxlength: 200 },
  category: { type: String, required: true, enum: ["altitude", "permits", "packing", "seasons", "culture", "faq"] },
  categoryLabel: { type: String, trim: true, maxlength: 100 },
  type: { type: String, enum: ["article", "rules"], default: "article" },
  summary: { type: String, trim: true, maxlength: 500, default: "" },
  content: { type: String, trim: true, default: "" },
  rules: [{ id: String, title: { type: String, trim: true }, text: { type: String, trim: true } }],
  published: { type: Boolean, default: true, index: true },
}, { timestamps: true });

guideSchema.index({ category: 1, published: 1, updatedAt: -1 });

export const Guide = model("Guide", guideSchema);
export default Guide;
