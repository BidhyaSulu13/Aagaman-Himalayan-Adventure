import mongoose from "mongoose";

const { Schema, model } = mongoose;

const inquiryReplySchema = new Schema({
  message: { type: String, required: true, trim: true, maxlength: 5000 },
  sentBy: { type: Schema.Types.ObjectId, ref: "User" },
  sentByName: { type: String, trim: true, default: "Agaaman team", maxlength: 120 },
  deliveryStatus: { type: String, enum: ["Pending", "Sent", "Failed"], default: "Pending" },
  deliveryError: { type: String, trim: true, default: "", maxlength: 300 },
  sentAt: { type: Date },
  messageId: { type: String, trim: true, default: "", maxlength: 300 },
}, { timestamps: true });

const inquirySchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", default: null, index: true },
  trek: { type: Schema.Types.ObjectId, ref: "Trek", required: true, index: true },
  trekSlug: { type: String, required: true, trim: true, index: true },
  trekTitle: { type: String, required: true, trim: true, maxlength: 200 },
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 254, index: true },
  phone: { type: String, trim: true, default: "", maxlength: 40 },
  country: { type: String, trim: true, default: "", maxlength: 120 },
  travelers: { type: Number, min: 1, max: 100, default: 1 },
  travelMonth: { type: String, trim: true, default: "", maxlength: 40 },
  message: { type: String, required: true, trim: true, maxlength: 5000 },
  status: { type: String, enum: ["New", "In Progress", "Resolved"], default: "New", index: true },
  replies: { type: [inquiryReplySchema], default: [] },
}, { timestamps: true });

inquirySchema.index({ status: 1, createdAt: -1 });

export const Inquiry = model("Inquiry", inquirySchema);
export default Inquiry;
