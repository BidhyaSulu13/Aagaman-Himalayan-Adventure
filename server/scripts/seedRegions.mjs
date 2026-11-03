// Seed Nepal mountain regions into the Region collection
// These match the trek data already in the DB
import mongoose from 'mongoose';

await mongoose.connect('mongodb://127.0.0.1:27017/himalayan_adventure');

const RegionSchema = new mongoose.Schema({}, { strict: false });
const Region = mongoose.model('Region', RegionSchema, 'regions');

const existing = await Region.countDocuments();
if (existing > 0) {
  console.log(`⚠️  ${existing} regions already exist. Skipping seed.`);
  await mongoose.disconnect();
  process.exit(0);
}

const regions = [
  {
    name: "Khumbu",
    slug: "khumbu",
    label: "Everest Region",
    tagline: "Home of the world's highest peak and legendary Sherpa culture",
    description: "The Khumbu region in northeastern Nepal is the gateway to Everest. Home to Sagarmatha National Park (UNESCO World Heritage), this dramatic landscape of glaciers, high passes, and ancient Sherpa villages offers some of the world's most iconic high-altitude trekking routes.",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1500&q=85",
    coordinates: { lat: 27.9881, lng: 86.9250 },
    maxElevation: 8848,
    bestSeason: ["Spring", "Autumn"],
    highlights: [
      "Everest Base Camp (5,364m)",
      "Kala Patthar panorama (5,545m)",
      "Gokyo Lakes turquoise waters",
      "Namche Bazaar Sherpa capital",
      "Tengboche Monastery"
    ],
    gradingList: ["Challenging", "Strenuous"],
    permits: ["Sagarmatha National Park Permit", "Khumbu Pasang Lhamu Rural Municipality Permit", "TIMS Card"],
  },
  {
    name: "Annapurna",
    slug: "annapurna",
    label: "Annapurna Region",
    tagline: "A world of diversity from subtropical forests to arctic summits",
    description: "The Annapurna region encompasses one of the most diverse trekking areas on earth. From lush rhododendron forests to the arid Mustang rain shadow, past the world's deepest gorge at Kali Gandaki, and up to the challenging Thorong La pass at 5,416m.",
    image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=1500&q=85",
    coordinates: { lat: 28.5975, lng: 83.8200 },
    maxElevation: 8091,
    bestSeason: ["Spring", "Autumn", "Winter"],
    highlights: [
      "Thorong La Pass (5,416m)",
      "Annapurna Base Camp (4,130m)",
      "Poon Hill sunrise panorama (3,210m)",
      "Muktinath Temple sacred site",
      "Kali Gandaki Gorge — world's deepest"
    ],
    gradingList: ["Easy", "Moderate", "Challenging"],
    permits: ["ACAP — Annapurna Conservation Area Permit", "TIMS Card"],
  },
  {
    name: "Langtang",
    slug: "langtang",
    label: "Langtang Region",
    tagline: "Wild yaks, Tamang heritage, and glacial valleys near Kathmandu",
    description: "Just 60km north of Kathmandu, the Langtang region offers authentic trekking through Tamang villages, glacial valleys, and high-altitude meadows. Despite its proximity to the capital, it retains an untouched wilderness character with snow leopard habitat and Tibetan-influenced culture.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1500&q=85",
    coordinates: { lat: 28.2130, lng: 85.5140 },
    maxElevation: 7246,
    bestSeason: ["Spring", "Autumn"],
    highlights: [
      "Kyanjin Ri (4,773m) panorama",
      "Gosainkunda Sacred Alpine Lakes",
      "Langtang Village Tamang culture",
      "Tserko Ri (4,984m) viewpoint",
      "Fresh yak cheese at Kyanjin Gompa"
    ],
    gradingList: ["Moderate", "Challenging"],
    permits: ["Langtang National Park Permit", "TIMS Card"],
  },
  {
    name: "Manaslu",
    slug: "manaslu",
    label: "Manaslu Region",
    tagline: "Nepal's most dramatic and least-crowded circuit route",
    description: "The Manaslu Circuit is Nepal's premier off-the-beaten-path expedition. Circumnavigating the world's eighth highest peak (8,163m) through remote Nubri and Tsum valleys with Tibetan Buddhist culture, this route crosses the challenging Larkya La pass at 5,106m.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1500&q=85",
    coordinates: { lat: 28.5500, lng: 84.5590 },
    maxElevation: 8163,
    bestSeason: ["Spring", "Autumn"],
    highlights: [
      "Larkya La Pass (5,106m)",
      "Tsum Valley ancient monasteries",
      "Birendra Lake glacial views",
      "Nubri Valley Tibetan culture",
      "Wild remote trails with few trekkers"
    ],
    gradingList: ["Challenging", "Strenuous"],
    permits: ["Manaslu Conservation Area Permit", "Manaslu Restricted Area Permit", "TIMS Card"],
  },
  {
    name: "Makalu",
    slug: "makalu",
    label: "Makalu Region",
    tagline: "Nepal's wildest and most biodiverse trekking destination",
    description: "The Makalu Barun region is Nepal's wildest trekking area — a UNESCO World Heritage candidate and biodiversity hotspot surrounding the world's fifth highest peak. Pristine alpine wilderness with no permanent teahouses on upper sections means true wilderness expedition trekking.",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1500&q=85",
    coordinates: { lat: 27.8895, lng: 87.0889 },
    maxElevation: 8485,
    bestSeason: ["Spring", "Autumn"],
    highlights: [
      "Makalu Base Camp (5,700m)",
      "Barun Valley glacial wilderness",
      "Shipton Pass (4,216m)",
      "Red panda and snow leopard habitat",
      "Massive Makalu summit views"
    ],
    gradingList: ["Challenging", "Strenuous", "Expedition"],
    permits: ["Makalu Barun National Park Permit", "TIMS Card"],
  },
  {
    name: "Dolpo",
    slug: "dolpo",
    label: "Dolpo Region",
    tagline: "Tibet beyond Tibet — ancient Bon culture in Nepal's mystical far west",
    description: "Upper Dolpo is Nepal's most remote and culturally distinct trekking region. Lying in the rain shadow of the Dhaulagiri massif, this high-altitude Tibetan plateau features crystal salt lakes, ancient Bon monasteries, snow leopard territory, and the legendary Shey Phoksundo Lake.",
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1500&q=85",
    coordinates: { lat: 29.0500, lng: 82.8700 },
    maxElevation: 5940,
    bestSeason: ["Summer", "Autumn"],
    highlights: [
      "Shey Phoksundo Lake (3,600m) — Nepal's deepest lake",
      "Crystal Mountain pilgrimage",
      "Shey Gompa ancient monastery",
      "Kang La Pass (5,360m)",
      "Untouched Bon Buddhist culture"
    ],
    gradingList: ["Challenging", "Strenuous", "Expedition"],
    permits: ["Lower Dolpo Restricted Area Permit", "Upper Dolpo Restricted Area Permit", "Shey Phoksundo National Park Permit"],
  },
];

const result = await Region.insertMany(regions);
console.log(`✅ Seeded ${result.length} regions:`);
result.forEach(r => console.log(`  - ${r.name} (${r.slug}): ${r._id}`));

await mongoose.disconnect();

