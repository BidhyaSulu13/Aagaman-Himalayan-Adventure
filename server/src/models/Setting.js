import mongoose from "mongoose";

const { Schema, model } = mongoose;

const settingSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "general",
    },
    siteName: {
      type: String,
      default: "Agaaman: A Himalayan Adventure",
    },
    contactEmail: {
      type: String,
      default: "info@agaaman.com",
    },
    contactPhone: {
      type: String,
      default: "+977 9851029894",
    },
    address: {
      type: String,
      default: "Thamel, Kathmandu, Nepal",
    },
    currency: {
      type: String,
      default: "USD",
    },
    depositPercent: {
      type: Number,
      default: 20,
    },
    freeCancellationDays: {
      type: Number,
      default: 30,
    },
    emergencyHelpline: {
      type: String,
      default: "+977 9851029894 (24/7 Sherpa Rescue Dispatch)",
    },
  },
  {
    timestamps: true,
  }
);

export const Setting = model("Setting", settingSchema);
export default Setting;
