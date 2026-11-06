import "dotenv/config";
import mongoose from "mongoose";
import { Departure } from "../src/models/Departure.js";
import { getNepalDateKey } from "../src/utils/nepalTime.js";
import "../src/models/Trek.js";

const applyChanges = process.argv.includes("--apply");

function endDateFor(startDate, durationDays) {
  if (!startDate || !Number.isInteger(durationDays) || durationDays < 1) return null;
  const [year, month, day] = getNepalDateKey(startDate).split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day + durationDays));
}

async function syncDepartureEndDates() {
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/himalayan_adventure"
  );

  try {
    const departures = await Departure.find()
      .select("startDate endDate trek")
      .populate("trek", "duration")
      .lean();
    let updated = 0;
    let unchanged = 0;
    let skipped = 0;

    for (const departure of departures) {
      const calculatedEndDate = endDateFor(departure.startDate, departure.trek?.duration);
      if (!calculatedEndDate) {
        skipped += 1;
        continue;
      }
      if (
        departure.endDate &&
        getNepalDateKey(departure.endDate) === getNepalDateKey(calculatedEndDate)
      ) {
        unchanged += 1;
        continue;
      }
      if (!applyChanges) {
        updated += 1;
        continue;
      }

      const result = await Departure.updateOne(
        {
          _id: departure._id,
          startDate: departure.startDate,
          endDate: departure.endDate,
        },
        { $set: { endDate: calculatedEndDate } },
      );
      if (result.modifiedCount === 1) updated += 1;
      else skipped += 1;
    }

    console.log(
      `${applyChanges ? "Updated" : "Would update"}: ${updated}; unchanged: ${unchanged}; skipped: ${skipped}.`
    );
  } finally {
    await mongoose.disconnect();
  }
}

syncDepartureEndDates().catch((error) => {
  console.error("Departure end-date migration failed:", error.message);
  process.exitCode = 1;
});
