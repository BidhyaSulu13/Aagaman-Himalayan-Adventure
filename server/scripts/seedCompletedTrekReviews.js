import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import { Booking } from "../src/models/Booking.js";
import { Departure } from "../src/models/Departure.js";
import { Review } from "../src/models/Review.js";
import { Trek } from "../src/models/Trek.js";
import { User } from "../src/models/User.js";

const demoReviews = [
  {
    reviewerEmail: "sulubidhya@gmail.com",
    trekSlug: "everest-base-camp",
    startDate: "2025-09-01",
    rating: 5,
    title: "A thoughtfully paced Everest Base Camp trek",
    comment:
      "The gradual acclimatization days made a real difference, and our guide explained the route and local culture with care. Reaching Base Camp was a remarkable moment, made even better by the steady support from the team throughout the journey.",
  },
  {
    reviewerEmail: "bbidhyaa1@gmail.com",
    trekSlug: "annapurna-sanctuary",
    startDate: "2025-09-15",
    rating: 5,
    title: "A beautiful route with excellent support",
    comment:
      "The changing scenery on the way into the sanctuary was extraordinary. Our itinerary felt well organized, the daily pace was comfortable, and the team made sure everyone had the information and support they needed.",
  },
  {
    reviewerEmail: "bikesh1058@gmail.com",
    trekSlug: "langtang-valley",
    startDate: "2025-10-01",
    rating: 5,
    title: "A rewarding and welcoming Langtang journey",
    comment:
      "Langtang offered a wonderful balance of mountain views and time in local villages. The guide was attentive, the daily plan was clear, and the time set aside to adjust to the altitude helped us enjoy the trek with confidence.",
  },
  {
    reviewerEmail: "antigravity121ada@gmail.com",
    trekSlug: "manaslu-circuit",
    startDate: "2025-10-15",
    rating: 5,
    title: "A memorable circuit, handled professionally",
    comment:
      "The Manaslu route was challenging in the best way. Logistics were dependable across the remote sections, and our guide kept the group informed and encouraged a sensible pace. The views from the pass were worth every step.",
  },
  {
    reviewerEmail: "sulubidhya@gmail.com",
    trekSlug: "poon-hill",
    startDate: "2025-11-01",
    rating: 4,
    title: "A relaxed introduction to trekking in Nepal",
    comment:
      "The walking days were manageable and the sunrise view from Poon Hill was a highlight. Our guide handled the arrangements smoothly and shared helpful context along the trail. It was an enjoyable first trekking experience in Nepal.",
  },
];

async function seedCompletedTrekReviews() {
  await connectDB();

  let createdReviews = 0;
  for (const [index, entry] of demoReviews.entries()) {
    const trek = await Trek.findOne({ slug: entry.trekSlug, isArchived: { $ne: true } });
    if (!trek) throw new Error(`Trek not found or archived: ${entry.trekSlug}`);

    const user = await User.findOne({ email: entry.reviewerEmail, role: "traveler" });
    if (!user) throw new Error(`Traveler account not found: ${entry.reviewerEmail}`);

    const bookingReference = `DEMO-REVIEW-${String(index + 1).padStart(2, "0")}`;
    let booking = await Booking.findOne({ bookingReference });
    if (!booking) {
      const startDate = new Date(`${entry.startDate}T00:00:00.000Z`);
      const endDate = new Date(startDate);
      endDate.setUTCDate(endDate.getUTCDate() + trek.duration - 1);

      const departure = await Departure.create({
        trek: trek._id,
        startDate,
        endDate,
        capacity: 8,
        bookedCount: 1,
        price: trek.price,
        status: "Completed",
        published: false,
      });

      booking = await Booking.create({
        bookingReference,
        user: user._id,
        departure: departure._id,
        trek: trek._id,
        travelerDetails: [{
          fullName: user.name,
          email: user.email,
        }],
        numberOfTravelers: 1,
        totalAmount: trek.price,
        currency: trek.currency || "USD",
        bookingStatus: "Completed",
        paymentStatus: "Paid",
        paymentReference: `DEMO-${bookingReference}`,
        notes: "Sample completed booking for review moderation.",
      });
    }

    booking.user = user._id;
    const traveler = booking.travelerDetails[0];
    traveler.fullName = user.name;
    traveler.email = user.email;
    await booking.save();

    let review = await Review.findOne({ booking: booking._id });
    if (!review) {
      review = new Review({
        trek: trek._id,
        booking: booking._id,
        departure: booking.departure,
        title: entry.title,
        rating: entry.rating,
        comment: entry.comment,
        verificationStatus: "Verified Trekker",
        moderationStatus: "pending",
      });
      createdReviews += 1;
    }
    review.user = user._id;
    review.name = user.name;
    review.email = user.email;
    await review.save();
  }

  const demoEmails = demoReviews.map((_, index) =>
    `demo.trekker.${String(index + 1).padStart(2, "0")}@example.com`
  );
  const demoUsers = await User.find({ email: { $in: demoEmails } }).select("_id");
  const demoUserIds = demoUsers.map(({ _id }) => _id);
  if (demoUserIds.length) {
    const [remainingBookings, remainingReviews] = await Promise.all([
      Booking.countDocuments({ user: { $in: demoUserIds } }),
      Review.countDocuments({ user: { $in: demoUserIds } }),
    ]);
    if (remainingBookings || remainingReviews) {
      throw new Error("Demo accounts still have linked records; they were kept to avoid deleting referenced data.");
    }
    await User.deleteMany({ _id: { $in: demoUserIds } });
  }

  console.log(`Completed trek reviews are linked to existing traveler accounts. Added ${createdReviews} new review(s); existing reviews were updated in place.`);
}

seedCompletedTrekReviews()
  .catch((error) => {
    console.error(`Completed trek review demo data failed: ${error.message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
