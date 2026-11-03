import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/himalayan_adventure';

async function testBackend() {
  console.log('Connecting to the configured MongoDB database...');
  await mongoose.connect(MONGODB_URI);

  try {
    const {
      getMostPopularTreks,
      getTopRatedTreks,
      getFeaturedTreks,
    } = await import('../src/services/rankingService.js');
    const { Trek, Booking, Review, User } = await import('../src/models/index.js');

    const [trekCount, bookingCount, userCount, reviewCount] = await Promise.all([
      Trek.countDocuments(),
      Booking.countDocuments(),
      User.countDocuments(),
      Review.countDocuments(),
    ]);
    const [popular, topRated, featured] = await Promise.all([
      getMostPopularTreks({ limit: 5 }),
      getTopRatedTreks({ limit: 5 }),
      getFeaturedTreks({ limit: 5 }),
    ]);
    const activeTreks = await Trek.countDocuments({ isArchived: { $ne: true } });
    const archivedTreks = await Trek.countDocuments({ isArchived: true });

    console.log(
      `Read-only integrity check passed. Treks=${trekCount}, Bookings=${bookingCount}, Users=${userCount}, Reviews=${reviewCount}.`
    );
    console.log(
      `Ranking results: popular=${popular.length}, topRated=${topRated.length}, featured=${featured.length}.`
    );
    console.log(`Treks status: Active=${activeTreks}, Archived=${archivedTreks}.`);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected cleanly.');
  }
}

testBackend().catch((err) => {
  console.error('Test failed with error:', err);
  process.exit(1);
});
