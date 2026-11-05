import mongoose from "mongoose";
import { getNepalDateKey, getUtcDateKey } from "../utils/nepalTime.js";

const { Schema, model } = mongoose;

const departureSchema = new Schema(
  {
    trek: {
      type: Schema.Types.ObjectId,
      ref: "Trek",
      required: [true, "Trek reference is required"],
      index: true,
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
      index: true,
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },
    capacity: {
      type: Number,
      required: [true, "Capacity is required"],
      min: [1, "Capacity must be at least 1"],
      validate: Number.isInteger,
    },
    bookedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Guaranteed", "Filling Fast", "Available", "Closed", "Cancelled", "Completed"],
      default: "Available",
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Price per person is required"],
      min: [0, "Price cannot be negative"],
    },
    bookingClosingDate: {
      type: Date,
      default: null,
    },
    minGroupSize: {
      type: Number,
      default: 1,
      min: [1, "Minimum group size must be at least 1"],
      validate: Number.isInteger,
    },
    published: {
      type: Boolean,
      // Treat existing departure records as published; the admin create API drafts new records explicitly.
      default: true,
      index: true,
    },
    originalPrice: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for available seats
departureSchema.virtual("availableSeats").get(function () {
  return Math.max(0, this.capacity - (this.bookedCount || 0));
});

departureSchema.virtual("lifecycleStatus").get(function () {
  if (this.status === "Cancelled") return "Cancelled";
  if (this.status === "Completed") return "Completed";

  const today = getNepalDateKey();
  if (getNepalDateKey(this.startDate) <= today) return "In Progress";

  if (!this.published) return "Draft";

  if (
    this.status === "Closed" ||
    (this.bookingClosingDate && getUtcDateKey(this.bookingClosingDate) < today)
  ) {
    return "Closed";
  }

  const availableSeats = Math.max(0, this.capacity - (this.bookedCount || 0));
  if (availableSeats === 0) return "Fully Booked";
  if (this.status === "Guaranteed") return "Guaranteed";
  if (
    this.status === "Filling Fast" ||
    availableSeats <= Math.max(1, Math.ceil(this.capacity * 0.25))
  ) {
    return "Limited Seats";
  }
  return "Open";
});

departureSchema.index({ published: 1, startDate: 1, status: 1 });

departureSchema.pre("validate", function validateDepartureDates() {
  if (this.status === "Filling Fast") this.status = "Available";

  if (this.startDate && this.endDate && this.endDate < this.startDate) {
    this.invalidate("endDate", "Return date must be on or after departure date.");
  }
  if (
    this.bookingClosingDate &&
    this.startDate &&
    getUtcDateKey(this.bookingClosingDate) >= getUtcDateKey(this.startDate)
  ) {
    this.invalidate("bookingClosingDate", "Booking close date must be before departure date.");
  }
  if (this.minGroupSize > this.capacity) {
    this.invalidate("minGroupSize", "Minimum group size cannot exceed departure capacity.");
  }
});

export const Departure = model("Departure", departureSchema);
export default Departure;
