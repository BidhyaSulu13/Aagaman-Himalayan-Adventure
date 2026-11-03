import mongoose from "mongoose";
import "dotenv/config";

async function run() {
  if (!process.argv.includes("--confirm")) {
    throw new Error("This cleanup mutates database records. Re-run with --confirm to proceed.");
  }

  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/himalayan_adventure");
  const db = mongoose.connection.db;

  // Remove demo booking records where user is null and bookingReference matches demo
  const delRes = await db.collection("bookings").deleteMany({
    bookingReference: { $in: ["BK-2026-9022", "BK-2026-CBE2E8"] },
  });
  console.log("Cleaned up demo bookings count:", delRes.deletedCount);

  // Fix departure negative bookedCount
  await db.collection("departures").updateMany(
    { bookedCount: { $lt: 0 } },
    { $set: { bookedCount: 0 } }
  );

  // Remove orphan test departure
  await db.collection("departures").deleteOne({
    _id: new mongoose.Types.ObjectId("6ae37d265a9567deec6a9579"),
  });

  const remainingCount = await db.collection("bookings").countDocuments();
  console.log("Remaining booking records:", remainingCount);

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
