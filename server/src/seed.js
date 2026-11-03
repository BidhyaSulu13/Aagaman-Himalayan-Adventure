import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import {
  Article,
  Booking,
  Departure,
  Destination,
  Review,
  Setting,
  Trek,
  User,
} from "./models/index.js";

async function seedData() {
  if (!process.argv.includes("--reset")) {
    throw new Error(
      "Seeding deletes existing application data. Re-run with `npm run seed -- --reset` to confirm."
    );
  }

  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  const travelerPassword = process.env.SEED_TRAVELER_PASSWORD;
  if (!adminPassword || adminPassword.length < 12 || !travelerPassword || travelerPassword.length < 12) {
    throw new Error(
      "Set SEED_ADMIN_PASSWORD and SEED_TRAVELER_PASSWORD to values of at least 12 characters before seeding."
    );
  }

  console.log("Connecting to database for seeding...");
  await connectDB();

  console.log("Clearing existing collections...");
  await Promise.all([
    User.deleteMany({}),
    Destination.deleteMany({}),
    Trek.deleteMany({}),
    Departure.deleteMany({}),
    Booking.deleteMany({}),
    Article.deleteMany({}),
    Review.deleteMany({}),
    Setting.deleteMany({}),
  ]);

  console.log("Creating default users (Admin & Traveler)...");
  const adminPasswordHash = await User.hashPassword(adminPassword);
  const travelerPasswordHash = await User.hashPassword(travelerPassword);

  const admin = await User.create({
    name: "Dawa Tenzing Sherpa",
    email: "admin@agaaman.com",
    passwordHash: adminPasswordHash,
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    profile: {
      bio: "IFMGA Certified Mountain Guide with 18 Himalayan summit seasons.",
      phone: "+977 9851029894",
      nationality: "Nepali (Sherpa)",
      emergencyContact: {
        name: "Lhakpa Sherpa",
        phone: "+977 9841234567",
        relationship: "Operations Base Manager",
      },
    },
  });

  const traveler = await User.create({
    name: "Alex Thorne",
    email: "traveler@agaaman.com",
    passwordHash: travelerPasswordHash,
    role: "traveler",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    profile: {
      bio: "High altitude trekking enthusiast preparing for Everest Three Passes.",
      phone: "+1 415 555 0192",
      nationality: "United States",
      emergencyContact: {
        name: "Emily Thorne",
        phone: "+1 415 555 0193",
        relationship: "Spouse",
      },
    },
  });

  console.log("Creating destinations...");
  const destinations = await Destination.create([
    {
      name: "Khumbu / Everest Region",
      slug: "everest-khumbu",
      region: "Khumbu",
      description: "Home of Mount Everest, ancient Sherpa gompas, soaring hanging glaciers, and legendary alpine passes.",
      images: [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1500&q=85",
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85",
      ],
      coordinates: { lat: 27.9881, lng: 86.9250 },
      bestSeason: ["Spring (March - May)", "Autumn (Sept - Nov)"],
      highlights: ["Kala Patthar panoramic sunrise", "Tengboche Monastery", "Namche Bazaar Sherpa capital"],
    },
    {
      name: "Annapurna Massif",
      slug: "annapurna-massif",
      region: "Annapurna",
      description: "A natural amphitheatre surrounded by ten peaks above 7,000 meters, rhododendron forests, and warm Gurung teahouses.",
      images: [
        "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=1500&q=85",
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
      ],
      coordinates: { lat: 28.5956, lng: 83.8203 },
      bestSeason: ["Spring", "Autumn", "Winter"],
      highlights: ["Poon Hill dawn panoramic view", "Machhapuchhre sacred fish tail view", "Chhomrong stone terraces"],
    },
    {
      name: "Langtang Valley",
      slug: "langtang-valley-region",
      region: "Langtang",
      description: "The valley of glaciers, wild yaks, Tamang Buddhist heritage, and soaring granite spires just north of Kathmandu.",
      images: [
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1500&q=85",
      ],
      coordinates: { lat: 28.2136, lng: 85.5562 },
      bestSeason: ["March - May", "October - December"],
      highlights: ["Kyanjin Ri summit (4,773m)", "Traditional yak cheese factory", "Langshisha Kharka glacial amphitheatre"],
    },
    {
      name: "Manaslu Circuit",
      slug: "manaslu-circuit-region",
      region: "Manaslu",
      description: "The untouched, restricted wilderness circuit circling the eighth highest mountain on Earth through Tibetan borderlands.",
      images: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1500&q=85",
      ],
      coordinates: { lat: 28.5497, lng: 84.5619 },
      bestSeason: ["March - May", "September - November"],
      highlights: ["Larkya La high pass (5,106m)", "Samagaon Tibetan village", "Pungyen Gompa glacial sanctuary"],
    },
  ]);

  console.log("Creating Treks...");
  const treks = await Trek.create([
    {
      title: "Everest Base Camp & Kala Patthar",
      slug: "everest-base-camp",
      shortDescription: "Follow the historic stone footsteps through pine-scented valleys into the inner sanctum of the world's tallest peaks.",
      fullDescription: "This isn't merely a high-altitude hike; it's a rite of passage. Walk beside yak caravans, receive blessings in centuries-old gompas, and spend cozy evenings sipping ginger lemon honey tea beside wood-burning teahouse stoves as the Himalayan alpenglow fades into a sky flooded with stars.",
      region: "Khumbu",
      location: "Khumbu · Sagarmatha National Park, Nepal",
      destination: destinations[0]._id,
      duration: 14,
      difficulty: "Challenging",
      maximumElevation: 5545,
      price: 1890,
      currency: "USD",
      featured: true,
      published: true,
      images: [
        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1500&q=85",
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85",
      ],
      gallery: [
        { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1500&q=85", caption: "Mount Everest sunrise" },
        { url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85", caption: "Namche Bazaar amphitheatre" },
      ],
      itinerary: [
        { day: 1, title: "Arrival in Kathmandu & Gear Check", details: "Arrive at Tribhuvan International Airport (1,400m). Meet your lead guide.", elevation: 1400 },
        { day: 2, title: "Flight to Lukla (2,860m) & Trek to Phakding", details: "Thrilling scenic flight to Lukla airstrip. Begin walking along Dudh Koshi.", elevation: 2610 },
        { day: 3, title: "Ascent to Namche Bazaar (3,440m)", details: "Cross high suspension bridges draped in prayer flags into the Sherpa capital.", elevation: 3440 },
        { day: 4, title: "Acclimatization Day in Namche", details: "Hike to Everest View Hotel for first glimpse of Everest and Ama Dablam.", elevation: 3880 },
        { day: 5, title: "Namche to Tengboche Monastery", details: "Walk through rhododendron woods to the sacred spiritual center of the Khumbu.", elevation: 3860 },
        { day: 6, title: "Tengboche to Dingboche", details: "Ascend past tree line into stone-walled yak pastures beneath Ama Dablam.", elevation: 4410 },
        { day: 7, title: "Dingboche Acclimatization Hike", details: "Ascend Nagarjun Hill (5,100m) for breathtaking views of Makalu and Island Peak.", elevation: 5100 },
        { day: 8, title: "Dingboche to Lobuche", details: "Pass the Sherpa climbers memorial cairns at Thokla Pass to moraine teahouses.", elevation: 4940 },
        { day: 9, title: "Lobuche to Gorak Shep & Everest Base Camp", details: "Walk the Khumbu glacier moraine to Base Camp (5,364m) beside the icefall.", elevation: 5364 },
        { day: 10, title: "Kala Patthar Sunrise (5,545m) & Pheriche", details: "Early morning summit of Kala Patthar for the iconic Everest panorama.", elevation: 5545 },
        { day: 11, title: "Pheriche down to Namche Bazaar", details: "Descend back into oxygen-rich pine forests and celebrate at Namche bakeries.", elevation: 3440 },
        { day: 12, title: "Namche Bazaar to Lukla", details: "Final trail day crossing Dudh Koshi bridges back to Lukla.", elevation: 2860 },
        { day: 13, title: "Morning Flight to Kathmandu", details: "Fly back to Kathmandu. Farewell dinner with traditional Nepali Sherpa banquet.", elevation: 1400 },
        { day: 14, title: "Departure", details: "Airport transfer for your onward international flight home.", elevation: 1400 },
      ],
      inclusions: ["All airport transfers in private vehicle", "Kathmandu to Lukla return flights", "Sagarmatha National Park entry permit & Khumbu Pasang Lhamu rural permit", "Certified English-speaking Sherpa lead guide and porters (1 porter for 2 trekkers)", "Teahouse accommodation throughout the trek", "Three freshly prepared meals daily (breakfast, lunch, dinner) with hot tea", "First aid medical kit with pulse oximeter for daily oxygen checks"],
      exclusions: ["International flights and Nepal entry visa", "Travel and high-altitude emergency medical evacuation insurance", "Personal trekking gear (sleeping bag, down jacket)", "Hot showers, battery charging, and Wi-Fi at teahouses", "Gratuities for guides and porters"],
      requiredPermits: ["Sagarmatha National Park Entry Permit", "Khumbu Pasang Lhamu Rural Municipality Permit"],
      recommendedSeason: ["Spring (March - May)", "Autumn (September - November)"],
      routeCoordinates: [
        { lat: 27.7172, lng: 85.3240, label: "Kathmandu" },
        { lat: 27.6868, lng: 86.7299, label: "Lukla" },
        { lat: 27.8056, lng: 86.7139, label: "Namche Bazaar" },
        { lat: 27.9861, lng: 86.8286, label: "Everest Base Camp" },
      ],
      rating: 4.98,
      reviewCount: 168,
    },
    {
      title: "Annapurna Sanctuary & Poon Hill",
      slug: "annapurna-sanctuary",
      shortDescription: "A gentle ascent through rhododendron forests into a glacial natural amphitheatre surrounded by towering 8,000m summits.",
      fullDescription: "From the sacred pyramid of Machhapuchhre (Fishtail) to the sheer south face of Annapurna I, this trek delivers maximum Himalayan drama in a compact 10-day itinerary with warm teahouse hospitality.",
      region: "Annapurna",
      location: "Annapurna · Gandaki Province, Nepal",
      destination: destinations[1]._id,
      duration: 10,
      difficulty: "Moderate",
      maximumElevation: 4130,
      price: 1340,
      currency: "USD",
      featured: true,
      published: true,
      images: [
        "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=1500&q=85",
      ],
      inclusions: ["ACAP permit and TIMS card", "Pokhara return transfers", "Full board meals", "Sherpa guide"],
      exclusions: ["International flights", "Personal travel insurance"],
      requiredPermits: ["Annapurna Conservation Area Permit (ACAP)", "TIMS Card"],
      recommendedSeason: ["Spring", "Autumn"],
      rating: 4.92,
      reviewCount: 94,
    },
    {
      title: "Langtang Valley & Kyanjin Ri",
      slug: "langtang-valley",
      shortDescription: "Wild yaks, sacred Tamang gompas, and panoramic peaks just north of Kathmandu.",
      fullDescription: "Explore the resurgent valley of Langtang, climbing to Kyanjin Ri (4,773m) and savoring freshly made artisan yak cheese under snow-capped peaks.",
      region: "Langtang",
      location: "Langtang · Bagmati Province, Nepal",
      destination: destinations[2]._id,
      duration: 8,
      difficulty: "Moderate",
      maximumElevation: 4773,
      price: 980,
      currency: "USD",
      featured: true,
      published: true,
      images: [
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1500&q=85",
      ],
      inclusions: ["Langtang National Park Permit", "Private jeep transport", "Sherpa guide", "All meals"],
      exclusions: ["Personal insurance", "Tipping"],
      requiredPermits: ["Langtang National Park Permit", "TIMS Card"],
      recommendedSeason: ["Spring", "Autumn"],
      rating: 4.88,
      reviewCount: 52,
    },
    {
      title: "Manaslu Circuit & Larkya La Pass",
      slug: "manaslu-circuit",
      shortDescription: "A wild, restricted circuit around the mountain of the spirit.",
      fullDescription: "Cross the challenging Larkya La Pass (5,106m) through untouched Tibetan-border valleys, cascading waterfalls, and ancient mani walls.",
      region: "Manaslu",
      location: "Gorkha · Manaslu Conservation Area, Nepal",
      destination: destinations[3]._id,
      duration: 15,
      difficulty: "Challenging",
      maximumElevation: 5106,
      price: 1680,
      currency: "USD",
      featured: true,
      published: true,
      images: [
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1500&q=85",
      ],
      inclusions: ["Manaslu Restricted Area Permit", "MCAP and ACAP permits", "Certified guide and porters"],
      exclusions: ["Nepal Visa", "Personal gear"],
      requiredPermits: ["Manaslu Restricted Area Permit (RAP)", "MCAP", "ACAP"],
      recommendedSeason: ["Spring", "Autumn"],
      rating: 4.96,
      reviewCount: 41,
    },
    {
      title: "Poon Hill Sunrise & Hot Springs",
      slug: "poon-hill",
      shortDescription: "The premier beginner trek with 360-degree Dhaulagiri and Annapurna panoramas.",
      fullDescription: "A classic 5-day walk suitable for families and first-time Himalayan trekkers, culminating in sunrise over Poon Hill and natural hot springs in Jhinu Danda.",
      region: "Annapurna",
      location: "Annapurna Foothills, Nepal",
      destination: destinations[1]._id,
      duration: 5,
      difficulty: "Easy",
      maximumElevation: 3210,
      price: 590,
      currency: "USD",
      featured: false,
      published: true,
      images: [
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=85",
      ],
      inclusions: ["ACAP permit", "Pokhara transfers", "Sherpa guide", "Lodging & meals"],
      exclusions: ["Personal expenses"],
      requiredPermits: ["ACAP"],
      recommendedSeason: ["All seasons"],
      rating: 4.85,
      reviewCount: 112,
    },
    {
      title: "Gokyo Lakes & Cho La Pass",
      slug: "gokyo-lakes",
      shortDescription: "Turquoise glacial lakes, Ngozumpa glacier, and high ridge vistas of Everest.",
      fullDescription: "Climb Gokyo Ri (5,357m) overlooking six emerald glacial lakes, then cross the glaciated Cho La pass into the Everest Base Camp valley.",
      region: "Khumbu",
      location: "Gokyo Valley, Everest Region, Nepal",
      destination: destinations[0]._id,
      duration: 16,
      difficulty: "Challenging",
      maximumElevation: 5360,
      price: 2190,
      currency: "USD",
      featured: true,
      published: true,
      images: [
        "https://images.unsplash.com/photo-1579618218290-24a26f63a708?auto=format&fit=crop&w=1500&q=85",
      ],
      inclusions: ["Sagarmatha permits", "Lukla flights", "Sherpa team", "Full board"],
      exclusions: ["Travel insurance"],
      requiredPermits: ["Sagarmatha National Park Permit", "Khumbu Permit"],
      recommendedSeason: ["Spring", "Autumn"],
      rating: 4.94,
      reviewCount: 38,
    },
    {
      title: "Gosainkunda Sacred Alpine Lakes",
      slug: "gosainkunda-lakes",
      shortDescription: "A holy pilgrimage route to high mountain tarns associated with Lord Shiva.",
      fullDescription: "Ascend pine and juniper forests to the crystal sacred lakes of Gosainkunda (4,380m) with sweeping views of the Ganesh Himal and Langtang ranges.",
      region: "Langtang",
      location: "Rasuwa District, Nepal",
      destination: destinations[2]._id,
      duration: 7,
      difficulty: "Moderate",
      maximumElevation: 4380,
      price: 760,
      currency: "USD",
      featured: false,
      published: true,
      images: [
        "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1500&q=85",
      ],
      inclusions: ["Langtang permit", "Jeep transport", "Guide & porter", "Meals"],
      exclusions: ["Personal items"],
      requiredPermits: ["Langtang Permit", "TIMS"],
      recommendedSeason: ["Spring", "Autumn"],
      rating: 4.87,
      reviewCount: 29,
    },
    {
      title: "Annapurna Circuit & Thorong La Pass",
      slug: "annapurna-circuit",
      shortDescription: "The grand Himalayan traverse across Thorong La Pass (5,416m).",
      fullDescription: "From subtropical banana groves of Besisahar to the arid Tibetan high plateau of Mustang and the sacred temples of Muktinath.",
      region: "Annapurna",
      location: "Gandaki & Mustang, Nepal",
      destination: destinations[1]._id,
      duration: 16,
      difficulty: "Challenging",
      maximumElevation: 5416,
      price: 1750,
      currency: "USD",
      featured: true,
      published: true,
      images: [
        "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1500&q=85",
      ],
      inclusions: ["ACAP and TIMS", "Jeep transfers", "Sherpa guide & porters", "All meals"],
      exclusions: ["International flights"],
      requiredPermits: ["ACAP", "TIMS"],
      recommendedSeason: ["Spring", "Autumn"],
      rating: 4.95,
      reviewCount: 88,
    },
  ]);

  console.log("Creating group departures...");
  const departures = await Departure.create([
    {
      trek: treks[0]._id, // EBC
      startDate: new Date("2026-05-10"),
      endDate: new Date("2026-05-23"),
      capacity: 12,
      bookedCount: 6,
      price: 1598,
      originalPrice: 1890,
      status: "Guaranteed",
    },
    {
      trek: treks[0]._id, // EBC
      startDate: new Date("2026-05-24"),
      endDate: new Date("2026-06-06"),
      capacity: 12,
      bookedCount: 9,
      price: 1598,
      originalPrice: 1890,
      status: "Filling Fast",
    },
    {
      trek: treks[1]._id, // Annapurna Sanctuary
      startDate: new Date("2026-05-15"),
      endDate: new Date("2026-05-24"),
      capacity: 10,
      bookedCount: 4,
      price: 1180,
      originalPrice: 1340,
      status: "Guaranteed",
    },
    {
      trek: treks[2]._id, // Langtang
      startDate: new Date("2026-05-18"),
      endDate: new Date("2026-05-25"),
      capacity: 8,
      bookedCount: 3,
      price: 850,
      originalPrice: 980,
      status: "Available",
    },
    {
      trek: treks[3]._id, // Manaslu
      startDate: new Date("2026-06-01"),
      endDate: new Date("2026-06-15"),
      capacity: 8,
      bookedCount: 5,
      price: 1480,
      originalPrice: 1680,
      status: "Guaranteed",
    },
  ]);

  console.log("Creating sample bookings...");
  await Booking.create([
    {
      bookingReference: "BK-2026-9021",
      user: traveler._id,
      departure: departures[0]._id,
      trek: treks[0]._id,
      travelerDetails: [
        {
          fullName: "Alex Thorne",
          email: "traveler@agaaman.com",
          phone: "+1 415 555 0192",
          nationality: "United States",
          passportNumber: "US982341A",
          dietaryRequirements: "None",
        },
        {
          fullName: "Emily Thorne",
          email: "emily.t@example.com",
          phone: "+1 415 555 0193",
          nationality: "United States",
          passportNumber: "US982342B",
          dietaryRequirements: "Vegetarian",
        },
      ],
      numberOfTravelers: 2,
      totalAmount: 3196,
      currency: "USD",
      bookingStatus: "Confirmed",
      paymentStatus: "Paid",
      paymentReference: "STRIPE-CH-9921448",
      notes: "Vegetarian meals for Emily. Arriving 2 days early in Kathmandu.",
    },
    {
      bookingReference: "BK-2026-9022",
      departure: departures[2]._id,
      trek: treks[1]._id,
      travelerDetails: [
        {
          fullName: "Marcus Lindqvist",
          email: "marcus.l@nordic.se",
          phone: "+46 70 123 4567",
          nationality: "Sweden",
          dietaryRequirements: "Gluten free",
        },
      ],
      numberOfTravelers: 1,
      totalAmount: 1180,
      currency: "USD",
      bookingStatus: "Requested",
      paymentStatus: "Pending",
      notes: "Need sleeping bag and trekking pole rental in Pokhara.",
    },
  ]);

  console.log("Creating journal articles...");
  await Article.create([
    {
      title: "A Gentler Way to Think About Walking at Altitude",
      slug: "walking-well-at-altitude",
      summary: "A practical introduction to pacing, acclimatization, and listening to your body on a high Himalayan trail.",
      content: `Walking high in the Himalaya is not a race. In the Khumbu, our elders teach us a word: 'Bistari, bistari' — slowly, slowly. 

When you rush up a mountain valley, your red blood cells cannot keep pace with the decreasing oxygen partial pressure. Above 3,000 meters, every extra heartbeat spent in haste takes a toll. 

Listen to your breath. If you can speak a full sentence without gasping, your pace is golden. Drink plenty of warm water, take your garlic soup, and rest well as twilight touches the snow-covered peaks.`,
      coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1500&q=85",
      author: "Dawa Tenzing Sherpa",
      category: "Field Notes",
      readTime: "6 min read",
      publicationStatus: "Published",
    },
    {
      title: "What to Pack for a Trek in Nepal: The Essential Guide",
      slug: "what-to-pack-for-nepal",
      summary: "Build a thoughtful kit for changing conditions without carrying more than you need on remote mountain passes.",
      content: `The secret to mountain packing is the three-layer system: moisture-wicking merino wool against your skin, an insulating mid-layer (fleece or lightweight down), and a weatherproof outer shell that stops Himalayan gales and precipitation. 

Keep your pack weight light so your porter is respected. Quality broken-in boots, wool socks, high-UV sunglasses, and a reliable headlamp are non-negotiable.`,
      coverImage: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=1500&q=85",
      author: "Pasang Nuru Sherpa",
      category: "Gear & Packing",
      readTime: "8 min read",
      publicationStatus: "Published",
    },
    {
      title: "Meeting the Mountains, One Village at a Time",
      slug: "meeting-the-mountain-slowly",
      summary: "Why a little extra time on the trail creates space for the deep cultural moments you never planned.",
      content: `Some of the most memorable moments in Nepal happen around a glowing bukhari stove in a Sherpa kitchen. Sipping butter tea while watching grandmother spin yak wool connects you to this land in ways a summit photo never can. Give yourself the gift of an unhurried itinerary.`,
      coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1500&q=85",
      author: "Lhakpa Dolma Sherpa",
      category: "Sherpa Heritage",
      readTime: "5 min read",
      publicationStatus: "Published",
    },
  ]);

  console.log("Creating default settings...");
  await Setting.create({
    key: "general",
    siteName: "Agaaman: A Himalayan Adventure",
    contactEmail: "info@agaaman.com",
    contactPhone: "+977 9851029894",
    address: "Thamel, Kathmandu (Opposite of LOD), Nepal",
    currency: "USD",
    depositPercent: 20,
    freeCancellationDays: 30,
    emergencyHelpline: "+977 9851029894 (24/7 Sherpa Rescue)",
  });

  console.log("==========================================");
  console.log(" DATABASE SEEDING COMPLETED SUCCESSFULLY!");
  console.log("Seeded users with the configured seed passwords.");
  console.log("==========================================");
  process.exit(0);
}

seedData().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});
