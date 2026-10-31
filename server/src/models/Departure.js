import mongoose from "mongoose";

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
    },
    bookedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Guaranteed", "Filling Fast", "Available", "Closed", "Cancelled"],
      default: "Available",
      index: true,
    },
    price: {
      type: Number,
      required: [true, "Price per person is required"],
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

export const Departure = model("Departure", departureSchema);
export default Departure;
