import mongoose from "mongoose";

const { Schema, model } = mongoose;

const contactMessageSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254 },
    phone: { type: String, trim: true, default: "", maxlength: 40 },
    topic: { type: String, trim: true, default: "General inquiry", maxlength: 120 },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    category: {
      type: String,
      enum: ["contact", "expedition_inquiry"],
      default: "contact",
      index: true,
    },
    country: { type: String, trim: true, default: "", maxlength: 120 },
    travelers: { type: Number, min: 1, max: 100 },
    travelMonth: { type: String, trim: true, default: "", maxlength: 40 },
    trek: { type: Schema.Types.ObjectId, ref: "Trek", default: null },
    trekSlug: { type: String, trim: true, default: "" },
    trekTitle: { type: String, trim: true, default: "" },
    status: {
      type: String,
      enum: ["New", "In Progress", "Resolved"],
      default: "New",
      index: true,
    },
  },
  { timestamps: true }
);

export const ContactMessage = model("ContactMessage", contactMessageSchema);
export default ContactMessage;
