import "dotenv/config";
import mongoose from "mongoose";
import { Departure } from "../src/models/Departure.js";
import { Trek } from "../src/models/Trek.js";

const departureOffsets = [45, 105];
const capacity = 12;

function dateAfterDays(days) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + days);
  return date;
}

async function createDepartures() {
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/himalayan_adventure"
  );

  try {
    const treks = await Trek.find({ isArchived: { $ne: true } })
      .select("_id title slug duration price published")
      .lean();
    let created = 0;

    for (const trek of treks) {
      const duration = Number.isInteger(trek.duration) && trek.duration > 0 ? trek.duration : 1;
      const price = Number.isFinite(trek.price) && trek.price >= 0 ? trek.price : 0;

      for (const offset of departureOffsets) {
        const startDate = dateAfterDays(offset);
        const existing = await Departure.exists({ trek: trek._id, startDate });
        if (existing) continue;

        const endDate = new Date(startDate);
        endDate.setUTCDate(endDate.getUTCDate() + duration);
        const bookingClosingDate = new Date(startDate);
        bookingClosingDate.setUTCDate(bookingClosingDate.getUTCDate() - 14);

        await Departure.create({
          trek: trek._id,
          startDate,
          endDate,
          bookingClosingDate,
          capacity,
          bookedCount: 0,
          minGroupSize: 1,
          status: "Available",
          price,
          published: true,
        });
        created += 1;
      }
    }

    console.log(`Created ${created} upcoming departures across ${treks.length} treks.`);
  } finally {
    await mongoose.disconnect();
  }
}

createDepartures().catch((error) => {
  console.error("Departure generation failed:", error.message);
  process.exitCode = 1;
});
