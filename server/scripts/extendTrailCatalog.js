import dotenv from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import { Destination } from "../src/models/Destination.js";
import { Region } from "../src/models/Region.js";
import { Trek } from "../src/models/Trek.js";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(scriptDir, "../.env") });

const image = {
  sotiKhola: "https://cdn.kimkim.com/files/a/images/f1bf2f3be19eedce14b58b1a8185c40864d5168e/big-7e66328bf1d3fca1a550852364d25a2c.jpg",
  jagat: "https://shilapatracdn.de/uploads/posts/manaslu-1736318136.JPG",
  namrung: "https://media.app.shikharadventure.com/uploads/media/Manaslu%20Region/namrung-to-lho.webp",
  samagaun: "https://media.exploreradventure.com/uploads/media/Manaslu/sparkling-view-mount-manaslu-from-samagaun-village-village-of-chortens.jpg",
  samdo: "https://www.highcamptrekking.com/wp-content/uploads/2023/06/Samdo-village.jpg",
  larkyaLa: "https://media.app.adventurevisiontreks.com/uploads/media/blogs/2025/04/larkya-la-pass-image-for-featured-image.jpeg",
  bimthang: "https://upload.wikimedia.org/wikipedia/commons/f/f4/A_Trekker_and_Manaslu_Range_seen_in_background_from_Bimthang%2C_Manang.jpg",
  lokpa: "https://media.app.ammoniteadventure.com/uploads/media/package-images/tsum-valley-trekking/trek-to-lokpa-village-descent.webp",
  chumling: "https://www.efratnakash.com/galleries_l_pics/asia/nepal_tsum_valley_trek/19-20221001_062819.jpg",
  chhokangparo: "https://www.efratnakash.com/galleries_l_pics/asia/nepal_tsum_valley_trek/21-20221002_082658.jpg",
  muGompa: "https://makaluadventure.com/pagegallery/tsum-valley-trek24.jpg",
  num: "https://nepaltraveller.com/laravel-filemanager/photos/30/makalu4.png",
  tashigaon: "https://www.thirdrockadventures.com/assets-back/images/trip/itineary/tashigaon.jpgLp8.jpg",
  khongma: "https://www.visithimalayastrek.com/uploads/photos/1/Makalu-Trek/Local-tea-House-Khongma-danda.jpg",
  dobate: "https://media.app.touchplanettreks.com/uploads/package/gallery/thumb/dobate-in-makalu-trek.webp",
  yangriKharka: "https://nepaltraveller.com/laravel-filemanager/photos/70/Baghdwar/800px-Morning_in_Yangle_Kharka%2C_3660m%2C_BARUN_trekking_2013._-_panoramio.jpg",
  langmale: "https://www.visithimalayastrek.com/uploads/galleries/camping-at-langmale-kharka-2679.webp",
  makaluBaseCamp: "https://www.visithimalayastrek.com/uploads/photos/1/Mt-Makalu-view-from-Base-Camp.jpg",
  bandipur: "https://bandipurmun.gov.np/sites/bandipurmun.gov.np/files/img/slider/Bandipur_Bazaar.PNG",
  bandipurTrail: "https://www.econepaladventure.com/page_gallery/bandipur-hiking60.jpg",
  sailung: "https://thehimalayantimes.com/thehimalayantimes/uploads/images/2025/11/30/44204.jpg",
  nagarkot: "https://media.app.himalayantrekkingpath.com/uploads/fullbanner/sunrise-views-nagarkot.webp",
  namche: "https://humbo.s3.eu-north-1.amazonaws.com/place-photo/5ff0ad6e8ff140caaa5d7048/IRZFInGZkq.jpeg",
  ghandruk: "https://nht-api.nepalhikingteam.com/media/attachments/Ghandruk-1024x645.jpg",
  kori: "https://nepaladventureteam.com/uploads/socialmedia/kori-danda-trekking.jpg",
  rolwaling: "https://www.karmaecoadventure.com/wp-content/uploads/2023/03/cloudy-weather-over-the-tsho-rolpa-glacial-lake-in-rowling-valley.jpg",
};

const destinations = [
  { name: "Soti Khola", slug: "soti-khola", region: "Manaslu", elevation: 730, description: "A riverside trailhead settlement and common starting point for the Manaslu Circuit and Tsum Valley routes.", coordinates: { lat: 28.03, lng: 84.82 }, trekSlugs: ["manaslu-circuit", "tsum-valley-cultural-trek"], highlights: ["Budhi Gandaki river valley", "Manaslu trailhead", "Rural foothill scenery"], images: [image.sotiKhola] },
  { name: "Jagat", slug: "jagat-manaslu", region: "Manaslu", elevation: 1340, description: "A village checkpoint and overnight stop on the Manaslu Circuit, before the trail branches toward the Tsum Valley.", coordinates: { lat: 28.33, lng: 84.90 }, trekSlugs: ["manaslu-circuit", "tsum-valley-cultural-trek"], highlights: ["Historic trail settlement", "Manaslu and Tsum route junction", "Stone lanes and river scenery"], images: [image.jagat] },
  { name: "Namrung", slug: "namrung", region: "Manaslu", elevation: 2630, description: "A high-valley village on the Manaslu Circuit with mountain views and traditional settlements along the upper trail.", coordinates: { lat: 28.57, lng: 84.63 }, trekSlugs: ["manaslu-circuit"], highlights: ["Upper Budhi Gandaki valley", "Manaslu mountain views", "Village lodges"], images: [image.namrung] },
  { name: "Samagaun", slug: "samagaun", region: "Manaslu", elevation: 3530, description: "A major acclimatization stop on the Manaslu Circuit, with access to Birendra Lake and local side walks beneath Manaslu.", coordinates: { lat: 28.61, lng: 84.63 }, trekSlugs: ["manaslu-circuit"], highlights: ["Manaslu views", "Birendra Lake side trip", "Nubri cultural heritage"], images: [image.samagaun] },
  { name: "Samdo", slug: "samdo", region: "Manaslu", elevation: 3860, description: "A remote high-altitude settlement where circuit trekkers rest and acclimatize before the Larkya La approach.", coordinates: { lat: 28.66, lng: 84.64 }, trekSlugs: ["manaslu-circuit"], highlights: ["High Himalayan village", "Acclimatization walks", "Tibetan-influenced culture"], images: [image.samdo] },
  { name: "Dharamsala (Larkya Phedi)", slug: "dharamsala-larkya-phedi", region: "Manaslu", elevation: 4460, description: "The high camp below Larkya La, used for an early and weather-dependent pass crossing on the Manaslu Circuit.", coordinates: { lat: 28.67, lng: 84.58 }, trekSlugs: ["manaslu-circuit"], highlights: ["Larkya La approach", "High-altitude camp", "Glacial mountain scenery"], images: [image.larkyaLa] },
  { name: "Bimthang", slug: "bimthang", region: "Manaslu", elevation: 3720, description: "A broad alpine valley and overnight stop reached after crossing Larkya La on the Manaslu Circuit.", coordinates: { lat: 28.63, lng: 84.53 }, trekSlugs: ["manaslu-circuit"], highlights: ["Post-pass recovery stop", "Manaslu range views", "Alpine meadows"], images: [image.bimthang] },
  { name: "Lokpa", slug: "lokpa", region: "Manaslu", elevation: 1900, description: "The gateway settlement to the Tsum Valley branch, reached from the Manaslu route near Jagat.", coordinates: { lat: 28.45, lng: 84.90 }, trekSlugs: ["tsum-valley-cultural-trek"], highlights: ["Tsum Valley entrance", "Forest trail junction", "Remote mountain settlement"], images: [image.lokpa] },
  { name: "Chumling", slug: "chumling", region: "Manaslu", elevation: 2386, description: "A traditional Tsum Valley village reached on the upper trail, with stone houses, mani walls and monastery visits nearby.", coordinates: { lat: 28.49, lng: 84.89 }, trekSlugs: ["tsum-valley-cultural-trek"], highlights: ["Tsum Valley village life", "Monasteries and mani walls", "Ganesh Himal views"], images: [image.chumling] },
  { name: "Chhokangparo", slug: "chhokangparo", region: "Manaslu", elevation: 3030, description: "A high settlement in the Tsum Valley and a staging point for walks toward Nile and Mu Gompa.", coordinates: { lat: 28.54, lng: 84.92 }, trekSlugs: ["tsum-valley-cultural-trek"], highlights: ["Upper Tsum Valley", "Traditional stone villages", "High mountain panoramas"], images: [image.chhokangparo] },
  { name: "Nile & Mu Gompa", slug: "nile-mu-gompa", region: "Manaslu", elevation: 3700, description: "The upper Tsum Valley's remote village and monastery area, reached by a high-altitude walking route from Chhokangparo.", coordinates: { lat: 28.59, lng: 84.95 }, trekSlugs: ["tsum-valley-cultural-trek"], highlights: ["Mu Gompa monastery", "Upper Tsum Valley", "High-altitude day walks"], images: [image.muGompa] },
  { name: "Num", slug: "num-makalu", region: "Makalu-Barun", elevation: 1560, description: "A hill settlement and roadhead on the approach to the Makalu-Barun trekking corridor from Tumlingtar.", coordinates: { lat: 27.57, lng: 87.22 }, trekSlugs: ["makalu-base-camp"], highlights: ["Makalu trailhead", "Arun valley scenery", "Gateway to Seduwa"], images: [image.num] },
  { name: "Tashigaon", slug: "tashigaon", region: "Makalu-Barun", elevation: 2100, description: "The last substantial village on the southern approach before the Makalu Base Camp route enters high mountain terrain.", coordinates: { lat: 27.72, lng: 87.13 }, trekSlugs: ["makalu-base-camp"], highlights: ["Sherpa village", "Final village before high camps", "Makalu-Barun trail"], images: [image.tashigaon] },
  { name: "Khongma Danda", slug: "khongma-danda", region: "Makalu-Barun", elevation: 3560, description: "A high ridge camp on the Makalu Base Camp route, used to pace the steep climb above Tashigaon and prepare for the passes.", coordinates: { lat: 27.84, lng: 87.10 }, trekSlugs: ["makalu-base-camp"], highlights: ["High ridge camp", "Acclimatization stop", "Views across Makalu-Barun"], images: [image.khongma] },
  { name: "Dobate", slug: "dobate-makalu", region: "Makalu-Barun", elevation: 3570, description: "A remote overnight stop beyond the high passes on the Makalu Base Camp trail, with basic shelter and exposed alpine terrain.", coordinates: { lat: 27.90, lng: 87.07 }, trekSlugs: ["makalu-base-camp"], highlights: ["High-altitude trail stop", "Barun valley approach", "Remote mountain lodges"], images: [image.dobate] },
  { name: "Yangri Kharka", slug: "yangri-kharka", region: "Makalu-Barun", elevation: 3557, description: "An open meadow and camping area in the Barun Valley, used as a rest point on the route toward Makalu Base Camp.", coordinates: { lat: 27.94, lng: 87.09 }, trekSlugs: ["makalu-base-camp"], highlights: ["Barun Valley meadow", "Mountain camping", "River and glacier scenery"], images: [image.yangriKharka] },
  { name: "Langmale Kharka", slug: "langmale-kharka", region: "Makalu-Barun", elevation: 4410, description: "A high alpine camp on the upper Barun route, before the final approach to Makalu Base Camp.", coordinates: { lat: 27.98, lng: 87.09 }, trekSlugs: ["makalu-base-camp"], highlights: ["High alpine camp", "Glacial valley scenery", "Makalu approach"], images: [image.langmale] },
  { name: "Makalu Base Camp", slug: "makalu-base-camp-destination", region: "Makalu-Barun", elevation: 4870, description: "A remote high-altitude destination beneath Makalu, reached through the Barun Valley after a demanding trek with camping support.", coordinates: { lat: 27.90, lng: 87.09 }, trekSlugs: ["makalu-base-camp"], highlights: ["Makalu north face views", "Barun glacier landscape", "Remote expedition trail"], images: [image.makaluBaseCamp] },
];

destinations.push({
  name: "Bandipur",
  slug: "bandipur",
  region: "Gandaki Foothills",
  elevation: 1030,
  description: "A preserved hill town with historic bazaar lanes and short walking trails to nearby viewpoints.",
  coordinates: { lat: 27.94, lng: 84.41 },
  trekSlugs: ["bandipur-heritage-walk"],
  highlights: ["Historic bazaar", "Hilltop walking trails", "Gandaki foothill views"],
  images: [image.bandipur],
});

const tsums = {
  title: "Tsum Valley Cultural Trek",
  slug: "tsum-valley-cultural-trek",
  region: "Manaslu",
  location: "Gorkha, Nepal",
  duration: 14,
  difficulty: "Challenging",
  maximumElevation: 3700,
  distance: "Approx. 115 km",
  price: 2250,
  shortDescription: "A challenging guided trek from the Manaslu trail into Tsum Valley, visiting Chumling, Chhokangparo and Mu Gompa.",
  fullDescription: "This route branches from the Manaslu trail into the Tsum Valley and returns by the same valley corridor. It combines long walking days, substantial elevation gain and remote settlements. A registered local operator should confirm current route access, permits, transport and acclimatization before booking.",
  introduction: "A culturally focused high-valley journey in the Manaslu region.",
  recommendedSeason: ["Spring (March-May)", "Autumn (September-November)"],
  itinerary: [
    { day: 1, title: "Arrive in Kathmandu", details: "Briefing, equipment review and route preparation." },
    { day: 2, title: "Drive to Soti Khola", details: "Travel by road to the Manaslu trailhead." },
    { day: 3, title: "Trek to Machha Khola", details: "Begin the trail along the Budhi Gandaki valley." },
    { day: 4, title: "Trek to Jagat", details: "Continue through river gorges and settlements." },
    { day: 5, title: "Trek to Lokpa", details: "Leave the main circuit and enter the Tsum Valley branch." },
    { day: 6, title: "Trek to Chumling", details: "Climb through forest and village paths." },
    { day: 7, title: "Trek to Chhokangparo", details: "Gain elevation gradually through the upper valley." },
    { day: 8, title: "Acclimatization day", details: "Rest and take a short guided walk near the village." },
    { day: 9, title: "Trek to Nile", details: "Continue to the upper Tsum Valley settlement." },
    { day: 10, title: "Visit Mu Gompa", details: "Visit the monastery and return to Nile, subject to local access." },
    { day: 11, title: "Return to Chumling", details: "Descend along the valley trail." },
    { day: 12, title: "Return to Jagat", details: "Rejoin the main route and retrace the valley." },
    { day: 13, title: "Return to Soti Khola", details: "Complete the walking section toward the roadhead." },
    { day: 14, title: "Drive to Kathmandu", details: "Return by road; keep flexible time for conditions." },
  ],
  requiredPermits: ["Confirm current restricted-area and conservation-area permits with the relevant authorities and a registered local operator."],
  images: [image.muGompa],
  routeCoordinates: [
    { lat: 28.03, lng: 84.82, label: "Soti Khola" },
    { lat: 28.33, lng: 84.90, label: "Jagat" },
    { lat: 28.45, lng: 84.90, label: "Lokpa" },
    { lat: 28.49, lng: 84.89, label: "Chumling" },
    { lat: 28.54, lng: 84.92, label: "Chhokangparo" },
    { lat: 28.59, lng: 84.95, label: "Mu Gompa" },
  ],
};

const bandipurWalk = {
  title: "Bandipur Heritage & Hill Walk",
  slug: "bandipur-heritage-walk",
  region: "Gandaki Foothills",
  location: "Tanahun, Nepal",
  duration: 2,
  difficulty: "Easy",
  maximumElevation: 1350,
  distance: "Approx. 12 km",
  price: 120,
  shortDescription: "A relaxed two-day walking break linking Bandipur's historic bazaar with nearby ridge and hilltop trails.",
  fullDescription: "A low-altitude walking itinerary based around Bandipur. Trail access, local conditions and opening status for individual viewpoints should be checked locally before departure.",
  introduction: "A short heritage and countryside walk in Nepal's Gandaki foothills.",
  recommendedSeason: ["Spring (March-May)", "Autumn (September-November)"],
  itinerary: [
    { day: 1, title: "Explore Bandipur bazaar", details: "Walk the historic center and nearby viewpoints with time to visit local sites." },
    { day: 2, title: "Hill and village trails", details: "Take a guided walk on nearby paths before continuing your onward journey." },
  ],
  requiredPermits: ["Confirm current local access rules before travel."],
  images: [image.bandipurTrail],
  routeCoordinates: [
    { lat: 27.94, lng: 84.41, label: "Bandipur Bazaar" },
    { lat: 27.93, lng: 84.42, label: "Thanimai viewpoint trail" },
  ],
};

async function upsert(Model, data) {
  return Model.findOneAndUpdate(
    { slug: data.slug },
    { $setOnInsert: data },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true }
  );
}

try {
  await connectDB();
  await upsert(Region, {
    name: "Gandaki Foothills",
    slug: "gandaki-foothills",
    label: "Bandipur and central Gandaki",
    tagline: "Heritage towns and gentle hill walks",
    description: "A low-altitude region of historic hill towns and accessible countryside walks in central Nepal.",
    image: image.bandipur,
    coordinates: { lat: 27.94, lng: 84.41 },
    maxElevation: 2000,
    bestSeason: ["Spring", "Autumn", "Winter"],
    gradingList: ["Easy", "Moderate", "Hard", "Challenging", "Strenuous"],
    highlights: ["Bandipur bazaar", "Ridge walks", "Gandaki foothills"],
  });
  await upsert(Trek, { ...tsums, published: true });
  await upsert(Trek, { ...bandipurWalk, published: true });

  const destinationDocs = new Map();
  for (const destination of destinations) {
    const doc = await upsert(Destination, destination);
    await Destination.updateOne({ _id: doc._id }, { $set: { region: destination.region, images: destination.images, trekSlugs: destination.trekSlugs } });
    destinationDocs.set(destination.slug, doc);
  }

  const linkedSlugs = [...new Set(destinations.flatMap((destination) => destination.trekSlugs))];
  const linkedTreks = await Trek.find({ slug: { $in: linkedSlugs } }).select("_id slug");
  const trekIdsBySlug = new Map(linkedTreks.map((trek) => [trek.slug, trek._id]));

  for (const destination of destinations) {
    const doc = destinationDocs.get(destination.slug);
    doc.trekSlugs = destination.trekSlugs;
    doc.relatedTreks = destination.trekSlugs.map((slug) => trekIdsBySlug.get(slug)).filter(Boolean);
    await doc.save();
  }

  for (const trek of linkedTreks) {
    const stop = destinations.find((destination) => destination.trekSlugs.includes(trek.slug));
    if (stop) await Trek.updateOne({ _id: trek._id }, { $set: { destination: destinationDocs.get(stop.slug)._id } });
  }

  for (const destination of await Destination.find()) {
    let slugs = [...new Set(destination.trekSlugs || [])];
    let matches = await Trek.find({
      slug: { $in: slugs },
      published: true,
      isArchived: { $ne: true },
    }).select("_id slug").limit(3);

    if (matches.length === 0) {
      matches = await Trek.find({
        region: destination.region,
        published: true,
        isArchived: { $ne: true },
      }).select("_id slug").limit(3);
    }

    if (matches.length === 0) {
      throw new Error(`Destination ${destination.slug} has no matching published trek in region ${destination.region}.`);
    }

    slugs = matches.map((trek) => trek.slug);
    destination.trekSlugs = slugs;
    destination.relatedTreks = matches.map((trek) => trek._id);
    await destination.save();
  }

  await Trek.updateOne({ slug: "manaslu-circuit" }, { $set: { difficulty: "Hard", images: [image.samagaun] } });
  await Trek.updateOne({ slug: "makalu-base-camp" }, { $set: { difficulty: "Strenuous", images: [image.makaluBaseCamp] } });
  await Region.updateMany({}, {
    $set: { gradingList: ["Easy", "Moderate", "Hard", "Challenging", "Strenuous"] },
  });

  const destinationImages = {
    sailung: image.sailung,
    nagarkot: image.nagarkot,
    "namche-bazaar": image.namche,
    ghandruk: image.ghandruk,
    "kori-village": image.kori,
    "tsho-rolpa-beding": image.rolwaling,
    bandipur: image.bandipur,
  };
  await Promise.all(Object.entries(destinationImages).map(([slug, url]) =>
    Destination.updateOne({ slug }, { $set: { images: [url] } })
  ));

  const trekImages = {
    "sailung-ridge-trail": image.sailung,
    "nagarkot-dhulikhel-ridge-walk": image.nagarkot,
    "rolwaling-tsho-rolpa": image.rolwaling,
    "kori-danda-kapuche-lake": image.kori,
    "poon-hill": image.ghandruk,
    "annapurna-sanctuary": image.ghandruk,
    "everest-base-camp": image.namche,
  };
  await Promise.all(Object.entries(trekImages).map(([slug, url]) =>
    Trek.updateOne({ slug }, { $set: { images: [url] } })
  ));

  console.log(`Trail catalog extended: ${destinations.length} route destinations ensured; Tsum Valley and Bandipur routes linked.`);
  console.log(`MongoDB totals: ${await Destination.countDocuments()} destinations, ${await Trek.countDocuments()} treks.`);
} catch (error) {
  console.error("Unable to extend the trail catalog:", error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
