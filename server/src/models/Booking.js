import mongoose from "mongoose";

const { Schema, model } = mongoose;

const travelerDetailSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: "" },
    passportNumber: { type: String, default: "" },
    nationality: { type: String, default: "" },
    dietaryRequirements: { type: String, default: "None" },
    emergencyContact: { type: String, default: "" },
  },
  { _id: false }
);

const bookingSchema = new Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      index: true,
      default: null,
    },
    departure: {
      type: Schema.Types.ObjectId,
      ref: "Departure",
      required: [true, "Departure is required"],
    },
    trek: {
      type: Schema.Types.ObjectId,
      ref: "Trek",
      required: [true, "Trek is required"],
    },
    travelerDetails: {
      type: [travelerDetailSchema],
      required: true,
      validate: [
        (val) => val.length > 0,
        "At least one traveler detail must be provided",
      ],
    },
    numberOfTravelers: {
      type: Number,
      required: true,
      min: [1, "Number of travelers must be at least 1"],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },
    currency: {
      type: String,
      default: "USD",
    },
    bookingStatus: {
      type: String,
      enum: [
        "Pending",
        "Requested",
        "Pending confirmation",
        "Confirmed",
        "Cancelled",
        "Completed",
      ],
      default: "Pending",
      index: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Pending", "Paid", "Failed", "Refunded"],
      default: "Pending",
      index: true,
    },
    paymentReference: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      default: "",
    },
    cancellationReason: {
      type: String,
      default: null,
    },
    reviewVerificationTokenHash: {
      type: String,
      select: false,
      index: true,
    },
    reviewVerificationEmail: {
      type: String,
      lowercase: true,
      select: false,
    },
    reviewVerificationExpiresAt: {
      type: Date,
      select: false,
    },
    bookingConfirmationEmailSentAt: {
      type: Date,
      default: undefined,
    },
    bookingConfirmedEmailSentAt: {
      type: Date,
      default: undefined,
    },
    trekCompletionEmailSentAt: {
      type: Date,
      default: undefined,
    },
  },
  {
    timestamps: true,
  }
);

export const Booking = model("Booking", bookingSchema);
export default Booking;
