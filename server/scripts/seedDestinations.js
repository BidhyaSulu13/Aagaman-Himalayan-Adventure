import mongoose from "mongoose";
import dotenv from "dotenv";
import { Destination } from "../src/models/Destination.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const destinationsData = [
  {
    slug: "namche-bazaar",
    name: "Namche Bazaar",
    region: "Everest Region",
    elevation: 3440,
    label: "The legendary Sherpa capital & amphitheater of Khumbu",
    description:
      "A vibrant mountain amphitheater carved into the sheer hillside of the Khumbu. Namche Bazaar is the historic trading crossroads of the Sherpa people and the essential acclimatization hub for all Everest expeditions. Filled with cozy cafes, artisan bakeries, trekking gear boutiques, and dramatic vistas of Kongde Ri and Thamserku.",
    coordinates: { lat: 27.806, lng: 86.714 },
    images: [
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
    ],
    bestSeason: ["Spring (Mar–May)", "Autumn (Late Sep–Nov)"],
    trekSlugs: ["everest-base-camp", "gokyo-lakes"],
    highlights: [
      "Vibrant high-altitude amphitheater with panoramic mountain views",
      "Sagarmatha National Park Visitor Center and Sherpa Museum",
      "World-famous Saturday High Altitude Market",
      "Artisan bakeries serving warm apple strudel at 3,440m"
    ],
    attractions: [
      { name: "Sagarmatha National Park Center", type: "Museum & Viewpoint", description: "Perched above the town on the ridge, offering historical exhibits on Sherpa culture and an iconic front-row vista of Everest and Ama Dablam." },
      { name: "Namche Monastery (Gompa)", type: "Sacred Shrine", description: "Historic Nyingma Buddhist sanctuary where expedition teams receive blessings for safe passage across the high passes." },
      { name: "Saturday Weekly Haat Bazaar", type: "Cultural Market", description: "Centuries-old trade gathering where lowland traders and Tibetan merchants display salt, yak butter, spices, and textiles." },
      { name: "Hotel Everest View Ridge", type: "Panoramic Viewpoint", description: "World's highest placed luxury hotel (3,880m), reachable by an easy morning acclimatization hike directly from the bazaar." }
    ],
    accommodationTypes: [
      {
        type: "Traditional Timber Teahouses",
        badge: "Most Popular",
        description: "Comfortable family-run lodges featuring double rooms, wood-burning bukhari dining halls, and hearty local meals.",
        amenities: ["Heated Dining Rooms", "Hot Showers (Gas/Solar)", "Wi-Fi Cards Available", "Device Charging"]
      },
      {
        type: "Luxury Mountain Lodges",
        badge: "Premium Comfort",
        description: "Boutique high-comfort lodges (such as Yeti Mountain Home) featuring en-suite heated bathrooms, heated mattresses, and gourmet dining.",
        amenities: ["Private Heated En-suite", "Electric Underblankets", "Artisan Dining & Wine", "High-speed Wi-Fi"]
      }
    ],
    culturalHighlights: {
      ethnicGroups: ["Sherpa", "Rai", "Tibetan traders"],
      overview: "Namche is the cultural capital of the Sherpa people, deeply tied to Tibetan Buddhist traditions, mountaineering lore, and mountain hospitality.",
      etiquette: [
        "Always pass prayer stones, chortens, and mani walls keeping them on your right (clockwise).",
        "Greet locals and trekking companions with a respectful 'Tashi Delek' or 'Namaste'.",
        "Remove trekking boots or heavy outerwear before stepping into monastery prayer spaces."
      ]
    },
    nearbySideTrips: [
      { name: "Hotel Everest View Morning Hike", duration: "3–4 Hours round trip", elevation: "3,880m", description: "Classic gentle acclimatization circuit with balcony coffee facing Mt. Everest, Lhotse, and Ama Dablam." },
      { name: "Khumjung & Sir Edmund Hillary School", duration: "4 Hours round trip", elevation: "3,790m", description: "Visit the peaceful green-roofed village, the famous school built by Hillary, and Khumjung Gompa." }
    ]
  },
  {
    slug: "pokhara",
    name: "Pokhara",
    region: "Annapurna",
    elevation: 822,
    label: "A lakeside city and access point for Annapurna journeys",
    description:
      "Pokhara is a lakeside city in Nepal’s Gandaki Province, set beneath views of the Annapurna range and Machhapuchhre (Fishtail). It is a popular place to prepare for nearby Annapurna treks, with road and air connections, shops, lodging, and services. Visitors also come for Phewa Lake, hilltop viewpoints, museums, and day trips around the Pokhara Valley. Weather, transport schedules, and trail access vary by season and should be confirmed before travel.",
    coordinates: { lat: 28.2096, lng: 83.9856 },
    images: [
      "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ],
    bestSeason: ["Autumn (Sep–Nov)", "Spring (Mar–May)"],
    trekSlugs: ["annapurna-sanctuary", "poon-hill", "annapurna-circuit"],
    highlights: [
      "Phewa Lake and views toward the Annapurna range and Machhapuchhre",
      "Sarangkot viewpoint, known for mountain panoramas and paragliding launches",
      "A convenient base for planning and reaching nearby Annapurna trailheads",
      "Museums, caves, waterfalls, temples, and lakeside neighborhoods"
    ],
    attractions: [
      { name: "Phewa Lake and Tal Barahi Temple", type: "Lake and Hindu temple", description: "A major Pokhara landmark. Boats cross the lake to the island temple; follow local guidance and check current boating conditions and fees." },
      { name: "Sarangkot", type: "Viewpoint and paragliding area", description: "A hilltop viewpoint above Pokhara with broad valley and mountain views on clear days. Sunrise visibility depends on weather; paragliding is operated by local providers and is weather-dependent." },
      { name: "World Peace Pagoda", type: "Buddhist monument and viewpoint", description: "A hilltop stupa above Phewa Lake reached by road or walking routes. Respect the site and follow posted visitor guidance." },
      { name: "Davis Falls and Gupteshwor Mahadev Cave", type: "Waterfall and cave", description: "Popular sites in the city area. Water flow and cave access conditions vary; observe barriers and local safety instructions." },
      { name: "International Mountain Museum", type: "Museum", description: "Exhibitions cover mountaineering, Himalayan environments, and mountain communities. Check current opening hours before visiting." }
    ],
    accommodationTypes: [
      {
        type: "Lakeside hotels and resorts",
        badge: "Multiple comfort levels",
        description: "The Lakeside area has a range of properties, from simple rooms to full-service hotels. Facilities, views, accessibility, and prices vary by property.",
        amenities: ["Restaurants nearby", "Options near the lake", "Facilities vary by property"]
      },
      {
        type: "Guesthouses and locally run stays",
        badge: "Local stays",
        description: "Guesthouses and smaller hotels are available in Lakeside and other parts of Pokhara. Confirm the location, included services, and current conditions directly with the property.",
        amenities: ["A range of room types", "Local dining options", "Facilities vary by property"]
      }
    ],
    culturalHighlights: {
      ethnicGroups: ["Gurung", "Magar", "Newar", "Thakali", "Brahmin and Chhetri communities"],
      overview: "Pokhara and the surrounding region are home to diverse communities and religious traditions. Learn about local history and customs from community-led museums, guides, and cultural organizations.",
      etiquette: [
        "Follow signs and local guidance at temples, monasteries, and other sacred places.",
        "Ask permission before photographing people or private ceremonies.",
        "Use designated paths and dispose of waste responsibly around lakes and viewpoints."
      ]
    },
    nearbySideTrips: [
      { name: "Sarangkot viewpoint", duration: "Half day", elevation: "About 1,600m", description: "Reach the hilltop by road or walking route for views over Pokhara and, when visibility allows, the surrounding mountains." },
      { name: "World Peace Pagoda walk", duration: "Half day", elevation: "About 1,100m", description: "A hill walk above Phewa Lake. Route conditions and access can change; ask locally before setting out." },
      { name: "Dhampus and Australian Camp", duration: "One or more days", elevation: "About 2,000m", description: "Foothill villages and viewpoints reached by walking routes from the Pokhara area. Confirm route, transport, and overnight arrangements with a local operator." },
      { name: "Begnas Lake", duration: "Half day", elevation: "About 650m", description: "A quieter lake east of Pokhara with local communities and lakeside views; confirm current transport and boating options." }
    ]
  },
  {
    slug: "kathmandu",
    name: "Kathmandu",
    region: "Kathmandu Valley",
    elevation: 1400,
    label: "Valley of the gods · Cultural heart & expedition basecamp",
    description:
      "The ancient capital of Nepal and the vibrant threshold for all Himalayan adventures. A UNESCO World Heritage valley of medieval brick courtyards, living goddesses, fluttering prayer flags, and bustling Thamel expedition outfitters.",
    coordinates: { lat: 27.7172, lng: 85.324 },
    images: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80"
    ],
    bestSeason: ["All Year", "Autumn (Sep–Nov)", "Spring (Mar–May)"],
    trekSlugs: ["everest-base-camp", "annapurna-sanctuary", "langtang-valley", "manaslu-circuit", "poon-hill"],
    highlights: [
      "7 UNESCO World Heritage monuments in a single valley",
      "Thamel vibrant hub for expedition briefings and gear rentals",
      "Sacred Buddhist stupas at Boudhanath and Swayambhunath",
      "Centuries-old living Newari architecture and festival traditions"
    ],
    attractions: [
      { name: "Boudhanath Stupa", type: "UNESCO Buddhist Monument", description: "One of the world's largest spherical stupas; center of Tibetan Buddhism in Nepal surrounded by monasteries and rooftop cafes." },
      { name: "Swayambhunath (Monkey Temple)", type: "Ancient Shrine", description: "Hilltop complex crowned by Buddha's watchful eyes overlooking the entire Kathmandu valley basin." },
      { name: "Pashupatinath Temple", type: "Sacred Hindu Temple", description: "Holiest Hindu shrine in Nepal dedicated to Lord Shiva, located on the sacred banks of the Bagmati River." }
    ],
    accommodationTypes: [
      {
        type: "Heritage Boutique Palaces",
        badge: "Cultural Luxury",
        description: "Restored historic Newari architecture with antique terracotta, carved timber pillars, and royal courtyards.",
        amenities: ["Heritage Courtyards", "Fine Dining", "Authentic Spas", "Airport Limousine"]
      }
    ],
    culturalHighlights: {
      ethnicGroups: ["Newar", "Tamang", "Brahmin/Chhetri", "Sherpa"],
      overview: "The cradle of Nepalese arts and architecture. Newari artisans have perfected metal casting, stone sculpting, and wood joinery for millennia.",
      etiquette: [
        "Walk clockwise around all Buddhist stupas and monuments.",
        "Remove leather items and shoes before entering Hindu temple precincts."
      ]
    },
    nearbySideTrips: [
      { name: "Bhaktapur Ancient City of Devotees", duration: "Half Day", elevation: "1,401m", description: "Pristine medieval brick city famed for pottery squares, Nyatapola 5-story pagoda, and delicious King Curd." },
      { name: "Nagarkot Himalayan Sunrise Ridge", duration: "Half Day", elevation: "2,175m", description: "Rim viewpoint offering dawn vistas stretching from Langtang to Everest." }
    ]
  },
  {
    slug: "lumbini",
    name: "Lumbini",
    region: "Western Terai",
    elevation: 150,
    label: "Birthplace of Lord Buddha · UNESCO World Heritage Sacred Garden",
    description:
      "The holiest Buddhist pilgrimage site in the world, where Prince Siddhartha Gautama was born in 623 BC. Lumbini's Sacred Garden features the ancient Mayadevi Temple, the Ashoka Pillar, monasteries built by over 25 nations, and an atmosphere of deep peace and spiritual contemplation.",
    coordinates: { lat: 27.4833, lng: 83.2833 },
    images: [
      "https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&w=1200&q=80"
    ],
    bestSeason: ["Autumn (Oct–Mar)", "Spring (Feb–Apr)"],
    trekSlugs: [],
    highlights: [
      "Mayadevi Temple — exact nativity spot of Siddhartha Gautama",
      "Emperor Ashoka's 249 BC stone pillar with royal inscription",
      "International monastery zone with 25+ world nation temples",
      "Eternal World Peace Flame lit in the Sacred Garden"
    ],
    attractions: [
      { name: "Mayadevi Temple & Sacred Garden", type: "UNESCO Heritage", description: "The precise birthplace marker stone, ancient bathing pool, and sacred Bodhi tree." },
      { name: "Ashoka Pillar (249 BC)", type: "Ancient Monument", description: "One of the oldest stone inscriptions in South Asia, personally erected by Emperor Ashoka." },
      { name: "World Peace Pagoda", type: "Buddhist Monument", description: "Striking golden Japanese-built pagoda with four gilded Buddha sculptures." }
    ],
    accommodationTypes: [
      {
        type: "Pilgrimage Hotels & Guesthouses",
        badge: "Peaceful Stay",
        description: "Simple, clean accommodations near the Sacred Garden with tranquil gardens and meditation spaces.",
        amenities: ["Meditation Gardens", "Vegetarian Dining", "Bicycle Rentals"]
      }
    ],
    culturalHighlights: {
      ethnicGroups: ["Tharu", "Awadhi", "Buddhist pilgrims worldwide"],
      overview: "Lumbini is the global spiritual center of Buddhism, attracting millions of pilgrims annually. A place of deep reverence and meditative silence.",
      etiquette: [
        "Dress modestly and remove shoes before entering temple areas.",
        "Maintain silence in the Sacred Garden and meditation zones."
      ]
    },
    nearbySideTrips: [
      { name: "Kapilvastu (Tilaurakot) Ancient Palace Ruins", duration: "Half Day", elevation: "100m", description: "Archaeological remains of Prince Siddhartha's childhood palace." }
    ]
  },
  {
    slug: "bandipur",
    name: "Bandipur",
    region: "Gandaki Province",
    elevation: 1030,
    label: "Enchanting medieval hilltop village frozen in time",
    description:
      "A breathtaking Newari hilltop village perched along a high ridge between Kathmandu and Pokhara. Bandipur's traffic-free cobblestone main street is lined with centuries-old brick and timber mansions, traditional brass shopfronts, and dramatic Himalayan panoramas stretching from Dhaulagiri to Manaslu.",
    coordinates: { lat: 27.9347, lng: 84.4086 },
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=80"
    ],
    bestSeason: ["All Year", "Autumn (Sep–Nov)", "Spring (Mar–May)"],
    trekSlugs: [],
    highlights: [
      "Traffic-free cobblestone main bazaar with panoramic Himalayan views",
      "Centuries-old Newari mansions with original carved wooden windows",
      "Siddha Gufa — one of South Asia's largest cave systems",
      "Stunning 180° sunrise panorama spanning Dhaulagiri to Manaslu"
    ],
    attractions: [
      { name: "Bandipur Bazaar", type: "Heritage Walkway", description: "Perfectly preserved traffic-free Newari trading street with brass-trimmed shopfronts." },
      { name: "Siddha Gufa (Siddha Cave)", type: "Natural Wonder", description: "Nepal's largest stalactite cave, stretching over 600m deep." }
    ],
    accommodationTypes: [
      {
        type: "Heritage Boutique Inns",
        badge: "Restored Newari",
        description: "Beautifully restored 200-year-old merchant mansions with antique furnishings and mountain terraces.",
        amenities: ["Antique Decor", "Organic Meals", "Mountain Terraces"]
      }
    ],
    culturalHighlights: {
      ethnicGroups: ["Newar", "Magar", "Gurung"],
      overview: "Once a prosperous trading post on the India-Tibet route, Bandipur preserves pristine Newari architecture and artisan metalwork.",
      etiquette: ["Support local artisans by purchasing handmade textiles and brassware."]
    },
    nearbySideTrips: [
      { name: "Ramkot Viewpoint Hike", duration: "2 Hours", elevation: "1,150m", description: "Short hill walk to a spectacular vantage point overlooking the Marsyangdi river gorge." }
    ]
  },
  {
    slug: "chitwan",
    name: "Chitwan National Park",
    region: "Terai Lowlands",
    elevation: 150,
    label: "UNESCO World Heritage jungle safari & Bengal tiger sanctuary",
    description:
      "Nepal's most celebrated wildlife reserve, spread across the dense subtropical jungles and grasslands of the inner Terai. Home to one-horned rhinos, Bengal tigers, wild elephants, gharial crocodiles, and over 550 species of birds.",
    coordinates: { lat: 27.5, lng: 84.3333 },
    images: [
      "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80"
    ],
    bestSeason: ["Autumn (Oct–Feb)", "Spring (Mar–May)"],
    trekSlugs: [],
    highlights: [
      "One-horned rhinoceros sightings on guided jungle walks",
      "Bengal tiger corridor in the buffer zone forests",
      "Traditional Tharu village cultural programs & stick dance",
      "Dugout canoe safari along the crocodile-rich Rapti River"
    ],
    attractions: [
      { name: "Rapti River Canoe Safari", type: "Wildlife Experience", description: "Glide silently past sunbathing gharial crocodiles." },
      { name: "Tharu Cultural Village", type: "Cultural Heritage", description: "Experience the indigenous Tharu people's stick dances and mud-walled longhouses." }
    ],
    accommodationTypes: [
      {
        type: "Luxury Jungle Lodges",
        badge: "Premium Safari",
        description: "Eco-luxury lodges with private verandas overlooking the jungle canopy and full-board dining.",
        amenities: ["Pool", "Private Verandas", "Naturalist Guides"]
      }
    ],
    culturalHighlights: {
      ethnicGroups: ["Tharu", "Bote", "Darai"],
      overview: "The Tharu people are the indigenous jungle inhabitants with rich traditions in stick fighting and eco-friendly mud-walled architecture.",
      etiquette: ["Always follow your naturalist guide's instructions during jungle activities."]
    },
    nearbySideTrips: [
      { name: "Bis Hazari Tal (20,000 Lakes) Birdwatching", duration: "Half Day", elevation: "150m", description: "Wetland paradise for rare migratory birds." }
    ]
  },
  {
    slug: "lukla",
    name: "Lukla",
    region: "Everest Region",
    elevation: 2860,
    label: "Cliff-perched mountain threshold to Mount Everest",
    description:
      "Perched precipitously on a granite shelf high above the Dudh Koshi river, Lukla is famous worldwide for the thrilling mountain runway of Tenzing-Hillary Airport (VNLK). The essential starting line where trekkers assemble before embarking on the trail to Everest Base Camp.",
    coordinates: { lat: 27.6869, lng: 86.729 },
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
    ],
    bestSeason: ["Spring (Mar–May)", "Autumn (Sep–Nov)"],
    trekSlugs: ["everest-base-camp", "gokyo-lakes"],
    highlights: [
      "World-famous Tenzing-Hillary Airport (2,860m) airstrip view",
      "Trailhead starting point for the classic Everest Base Camp expedition",
      "Pasang Lhamu Memorial Gate welcoming travelers into the Khumbu"
    ],
    attractions: [
      { name: "Tenzing-Hillary Runway Viewpoint", type: "Aviation Landmark", description: "Watch twin-otter aircraft land and take off from the mountain runway." }
    ],
    accommodationTypes: [
      {
        type: "Transit Expedition Lodges",
        badge: "Trail Standard",
        description: "Warm timber lodges providing hot meals and flight coordination desks.",
        amenities: ["Flight Desks", "Hot Showers", "Hearty Breakfasts"]
      }
    ],
    culturalHighlights: {
      ethnicGroups: ["Sherpa", "Rai"],
      overview: "Lukla blends traditional Sherpa hospitality with expedition logistics.",
      etiquette: ["Yield the mountain side of the trail when yaks pass."]
    },
    nearbySideTrips: [
      { name: "Phakding Riverside Walk", duration: "3–4 Hours", elevation: "2,610m", description: "Gentle downhill walk along pine-fringed banks of Dudh Koshi river." }
    ]
  },
  {
    slug: "manang",
    name: "Manang",
    region: "Annapurna Region",
    elevation: 3519,
    label: "Ancient high Tibetan valley & premier acclimatization haven",
    description:
      "A broad, sun-bleached alpine valley set against the dramatic northern ramparts of the Annapurna range. Features ancient flat-roofed stone houses, Tibetan prayer walls, turquoise glacial lakes, and crucial rest days before crossing the formidable 5,416m Thorong La pass.",
    coordinates: { lat: 28.6667, lng: 84.0167 },
    images: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80"
    ],
    bestSeason: ["Autumn (Sep–Nov)", "Spring (Mar–May)"],
    trekSlugs: ["annapurna-circuit"],
    highlights: [
      "Spectacular views of Annapurna II, III, IV, and Gangapurna",
      "Essential high-altitude acclimatization staging before Thorong La Pass",
      "Scenic Gangapurna turquoise glacial lake directly opposite village"
    ],
    attractions: [
      { name: "Gangapurna Glacial Lake", type: "Glacial Lake", description: "Turquoise alpine lake formed by meltwaters from Gangapurna." },
      { name: "Braga 500-Year-Old Monastery", type: "Ancient Gompa", description: "Perched dramatically into the cliff wall at Braga." }
    ],
    accommodationTypes: [
      {
        type: "High-Alpine Stone Teahouses",
        badge: "Comfortable Lodges",
        description: "Substantial stone hotels with glass-enclosed dining halls.",
        amenities: ["Solar Showers", "Heated Dining Halls", "Wi-Fi"]
      }
    ],
    culturalHighlights: {
      ethnicGroups: ["Manangi (Bhotia)", "Gurung"],
      overview: "Manangis preserve rich Tibetan Buddhist customs and equestrian traditions.",
      etiquette: ["Attend the free 3:00 PM altitude briefing at the Himalayan Rescue Association."]
    },
    nearbySideTrips: [
      { name: "Ice Lake (Kicho Tal) Day Trek", duration: "6 Hours", elevation: "4,600m", description: "Acclimatization hike with unbeatable panoramas of Annapurna massif." }
    ]
  },
  {
    slug: "kyanjin-gompa",
    name: "Kyanjin Gompa",
    region: "Langtang Region",
    elevation: 3870,
    label: "Glaciated alpine sanctuary & yak cheese haven of Langtang",
    description:
      "The crowning destination of the Langtang Valley, nestled inside a natural rock and glacier amphitheater. Surrounded by towering 7,000m giants including Langtang Lirung, Kyanjin Gompa features a historic Swiss-founded yak cheese factory, sacred monastery, and panoramic summit scrambles.",
    coordinates: { lat: 28.2119, lng: 85.5684 },
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ],
    bestSeason: ["Spring (Mar–May)", "Autumn (Sep–Nov)"],
    trekSlugs: ["langtang-valley"],
    highlights: [
      "Spectacular amphitheater surrounded by Langtang Lirung (7,227m)",
      "Historic Government Yak Cheese Factory established in 1955",
      "Panoramic day climbs to Kyanjin Ri (4,773m) and Tserko Ri (4,984m)"
    ],
    attractions: [
      { name: "Historic Yak Cheese Factory", type: "Alpine Dairy", description: "Sample freshly prepared alpine yak cheese." },
      { name: "Kyanjin Buddhist Monastery", type: "Gompa", description: "Peaceful stone monastery with prayer flags framing Langtang Lirung." }
    ],
    accommodationTypes: [
      {
        type: "Mountain Stone Lodges",
        badge: "Cozy & Welcoming",
        description: "Rebuilt alpine lodges with thick stone insulation and panoramic sunrooms.",
        amenities: ["Sunrooms", "Hot Bucket Baths", "Sherpa Stew"]
      }
    ],
    culturalHighlights: {
      ethnicGroups: ["Tamang", "Tibetan highland herders"],
      overview: "Deeply connected to yak pastoralism and Buddhist traditions.",
      etiquette: ["Do not leave trash on the high summit ridges."]
    },
    nearbySideTrips: [
      { name: "Kyanjin Ri Summit Climb", duration: "3–4 Hours", elevation: "4,773m", description: "Spectacular rocky peak offering 360° panorama." }
    ]
  },
  {
    slug: "ghandruk",
    name: "Ghandruk",
    region: "Annapurna Region",
    elevation: 1940,
    label: "Picturesque Gurung village framed by Annapurna South",
    description:
      "A storybook hillside settlement of slate-roofed stone houses and cobblestone alleys, perched among terraced fields. Famous for its fearless British Gurkha regiments, rich cultural museums, and panoramic views of Annapurna South, Hiunchuli, and the sacred Fishtail.",
    coordinates: { lat: 28.375, lng: 83.808 },
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
    ],
    bestSeason: ["All Year", "Spring (Mar–May)", "Autumn (Sep–Nov)"],
    trekSlugs: ["annapurna-sanctuary", "poon-hill"],
    highlights: [
      "Cobblestone lanes and slate stone architecture of the Gurung people",
      "Dramatic up-close views of Annapurna South and Machapuchare",
      "Traditional Gurung Cultural Museum showcasing antique highland life"
    ],
    attractions: [
      { name: "Old Gurung Cultural Museum", type: "Museum", description: "Historic stone residence exhibiting traditional weapons and tools." }
    ],
    accommodationTypes: [
      {
        type: "Gurung Heritage Lodges",
        badge: "Cultural Immersion",
        description: "Family-operated stone lodges with courtyards and mountain terraces.",
        amenities: ["Attached Bathrooms", "Hot Showers", "Organic Vegetables"]
      }
    ],
    culturalHighlights: {
      ethnicGroups: ["Gurung"],
      overview: "Home of legendary Gurkha warriors.",
      etiquette: ["Dress modestly when walking through the village center."]
    },
    nearbySideTrips: [
      { name: "Hike to Tadapani through Rhododendron Forest", duration: "3–4 Hours", elevation: "2,630m", description: "Walk through mossy cloud forest." }
    ]
  }
];

async function seed() {
  try {
    const onlySlug = process.argv.find((argument) => argument.startsWith("--only="))?.slice("--only=".length);
    if (!process.argv.includes("--confirm")) {
      throw new Error(onlySlug
        ? `Re-run with --only=${onlySlug} --confirm to upsert only that destination.`
        : "This script deletes and upserts destination records. Re-run with --confirm to proceed.");
    }
    if (onlySlug && !destinationsData.some((destination) => destination.slug === onlySlug)) {
      throw new Error(`Unknown destination slug "${onlySlug}". No records were changed.`);
    }

    const uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/himalayan_adventure";
    console.log("Connecting to the configured MongoDB database.");
    await mongoose.connect(uri);

    if (!onlySlug) {
      const oldRegionsToRemove = ["annapurna-massif", "everest-khumbu", "langtang-valley-region", "manaslu-circuit-region"];
      await Destination.deleteMany({ slug: { $in: oldRegionsToRemove } });
      console.log("Removed old regions from destinations collection.");
    }

    const destinationsToUpsert = onlySlug
      ? destinationsData.filter((destination) => destination.slug === onlySlug)
      : destinationsData;
    for (const d of destinationsToUpsert) {
      await Destination.findOneAndUpdate(
        { slug: d.slug },
        { $set: d },
        { upsert: true, returnDocument: "after", runValidators: true }
      );
      console.log(`Upserted destination: ${d.name} (${d.slug})`);
    }

    const total = await Destination.countDocuments();
    console.log(`Finished! Total destinations in database now: ${total}`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Error seeding destinations:", err);
    process.exit(1);
  }
}

seed();
