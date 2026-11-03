export const destinations = [
  {
    slug: "namche-bazaar",
    name: "Namche Bazaar",
    region: "Everest Region",
    elevation: 3440,
    label: "The legendary Sherpa capital & amphitheater of Khumbu",
    description:
      "A vibrant mountain amphitheater carved into the sheer hillside of the Khumbu. Namche Bazaar is the historic trading crossroads of the Sherpa people and the essential acclimatization hub for all Everest expeditions. Filled with cozy cafes, artisan bakeries, trekking gear boutiques, and dramatic vistas of Kongde Ri and Thamserku.",
    lat: 27.806,
    lng: 86.714,
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
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
      },
      {
        type: "Cozy Bakeries & B&Bs",
        badge: "Casual Stay",
        description: "Charming lodges situated above aroma-filled bakeries serving fresh espresso, yak cheese pizza, and chocolate croissants.",
        amenities: ["Espresso Coffee", "Fresh European Pastries", "Warm Common Lounges"]
      }
    ],
    culturalHighlights: {
      ethnicGroups: ["Sherpa", "Rai", "Tibetan traders"],
      overview: "Namche is the cultural capital of the Sherpa people, deeply tied to Tibetan Buddhist traditions, mountaineering lore, and mountain hospitality.",
      etiquette: [
        "Always pass prayer stones, chortens, and mani walls keeping them on your right (clockwise).",
        "Greet locals and trekking companions with a respectful 'Tashi Delek' or 'Namaste'.",
        "Remove trekking boots or heavy outerwear before stepping into monastery prayer spaces.",
        "Respect the fragile alpine ecosystem by avoiding single-use plastics and carrying out all personal rubbish."
      ]
    },
    nearbySideTrips: [
      { name: "Hotel Everest View Morning Hike", duration: "3–4 Hours round trip", elevation: "3,880m", description: "Classic gentle acclimatization circuit with balcony coffee facing Mt. Everest, Lhotse, and Ama Dablam." },
      { name: "Khumjung & Sir Edmund Hillary School", duration: "4 Hours round trip", elevation: "3,790m", description: "Visit the peaceful green-roofed village, the famous school built by Hillary, and Khumjung Gompa." },
      { name: "Thame Valley Historic Day Excursion", duration: "6–7 Hours round trip", elevation: "3,800m", description: "Trek along the Bhote Koshi gorge to the ancestral home of Tenzing Norgay and Apa Sherpa." },
      { name: "Syangboche Old Airstrip Ridge", duration: "1.5 Hours", elevation: "3,720m", description: "Short sunset ridge walk overlooking the entire horseshoe bowl of Namche Bazaar." }
    ]
  },
  {
    slug: "pokhara",
    name: "Pokhara",
    region: "Annapurna Region",
    elevation: 822,
    label: "Nepal’s enchanting lakeside paradise & gateway to the Annapurnas",
    description:
      "A tranquil sub-tropical oasis resting beneath the dramatic, snow-draped pyramid of Machapuchare (Fishtail, 6,993m). Pokhara is the beloved staging ground for all Annapurna expeditions, famed for serene boat rides on Phewa Lake, lakeside cafes, and panoramic Himalayan sunrises.",
    lat: 28.2096,
    lng: 83.9856,
    image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ],
    bestSeason: ["Autumn (Sep–Nov)", "Spring (Mar–May)", "Winter (Dec–Feb)"],
    trekSlugs: ["annapurna-sanctuary", "poon-hill", "annapurna-circuit"],
    highlights: [
      "Mirror reflections of Machapuchare (Fishtail) in Phewa Lake",
      "World-class paragliding flights from Sarangkot ridge",
      "Staging hub with direct road and air connections to trekking trailheads",
      "Vibrant pedestrian lakeside with organic cafes and live acoustic music"
    ],
    attractions: [
      { name: "Phewa Lake & Tal Barahi Island Temple", type: "Lake & Spiritual Shrine", description: "Nepal's second largest lake; wooden paddle boats drift past the two-story pagoda temple floating in the center." },
      { name: "Sarangkot Sunrise Hill", type: "Viewpoint", description: "Breathtaking dawn vista spanning Dhaulagiri, Annapurna I (8,091m), Machapuchare, and Manaslu." },
      { name: "World Peace Pagoda (Shanti Stupa)", type: "Buddhist Monument", description: "Brilliant white stupa situated atop Anadu Hill overlooking the valley, lake, and snow peaks." },
      { name: "International Mountain Museum", type: "Cultural Museum", description: "Extensive exhibits on Himalayan expeditions, flora, fauna, and indigenous mountain peoples." }
    ],
    accommodationTypes: [
      {
        type: "Lakeside Luxury Resorts",
        badge: "5-Star & Boutique",
        description: "Opulent garden resorts offering swimming pools, Ayurvedic spas, and private balconies overlooking the lake and Annapurnas.",
        amenities: ["Swimming Pools", "Ayurvedic Spas", "Fine Dining", "Airport Transfers"]
      },
      {
        type: "Heritage Boutique Guesthouses",
        badge: "Charming & Quiet",
        description: "Cozy family-run villas tucked away in quiet side alleys with manicured lawns and complimentary morning mountain tea.",
        amenities: ["Private Balconies", "Organic Breakfast", "Trekking Gear Storage"]
      },
      {
        type: "Trekker Hostels & B&Bs",
        badge: "Budget Friendly",
        description: "Vibrant social hostels where international hikers meet, share guides, and prepare for trail departures.",
        amenities: ["High-speed Wi-Fi", "Laundry Services", "Travel Desk & Permit Desk"]
      }
    ],
    culturalHighlights: {
      ethnicGroups: ["Gurung", "Magar", "Newar", "Brahmin/Chhetri"],
      overview: "Pokhara is a melting pot of hill traditions, renowned for legendary Gurung Gurkha soldiers and rich musical folklore.",
      etiquette: [
        "Always remove footwear before entering Hindu temples and local homes.",
        "Negotiate boat rentals and taxis with a friendly smile.",
        "Dress respectfully when visiting religious sites like Shanti Stupa and Bindhyabasini Temple."
      ]
    },
    nearbySideTrips: [
      { name: "Sarangkot Paragliding Flight", duration: "Half Day", elevation: "1,590m", description: "Tandem paragliding glide over green hills with Annapurna peaks towering in the background." },
      { name: "Australian Camp & Dhampus Day Hike", duration: "Full Day", elevation: "2,060m", description: "Short gentle foothill trek through Gurung farming villages and pine forests." },
      { name: "Begnas & Rupa Quiet Twin Lakes", duration: "Half Day", elevation: "650m", description: "Peaceful countryside lake 15km east of Pokhara, free of crowds with delicious fresh fish." },
      { name: "Seti River Gorge & Bat Cave", duration: "3 Hours", elevation: "850m", description: "Fascinating limestone caves and the deep milky-white limestone gorge running under the city." }
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
    lat: 27.7172,
    lng: 85.324,
    image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
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
      { name: "Pashupatinath Temple", type: "Sacred Hindu Temple", description: "Holiest Hindu shrine in Nepal dedicated to Lord Shiva, located on the sacred banks of the Bagmati River." },
      { name: "Kathmandu Durbar Square", type: "Historic Palace", description: "Medieval royal palace plaza featuring intricately carved wooden temples and the residence of the Living Goddess (Kumari)." }
    ],
    accommodationTypes: [
      {
        type: "Heritage Boutique Palaces",
        badge: "Cultural Luxury",
        description: "Restored historic Newari architecture (Dwarika's style) with antique terracotta, carved timber pillars, and royal courtyards.",
        amenities: ["Heritage Courtyards", "Fine Dining", "Authentic Spas", "Airport Limousine"]
      },
      {
        type: "Thamel Expedition Hotels",
        badge: "Trekker Base",
        description: "Modern hotels located steps from gear shops, money exchangers, and international mountain guide headquarters.",
        amenities: ["Free Gear Storage", "Breakfast Buffets", "Tour Desks", "Reliable Hot Showers"]
      }
    ],
    culturalHighlights: {
      ethnicGroups: ["Newar", "Tamang", "Brahmin/Chhetri", "Sherpa"],
      overview: "The cradle of Nepalese arts and architecture. Newari artisans have perfected metal casting, stone sculpting, and wood joinery for millennia.",
      etiquette: [
        "Walk clockwise around all Buddhist stupas and monuments.",
        "Remove leather items and shoes before entering Hindu temple precincts.",
        "Use right hand when giving or receiving money or food."
      ]
    },
    nearbySideTrips: [
      { name: "Bhaktapur Ancient City of Devotees", duration: "Half Day", elevation: "1,401m", description: "Pristine medieval brick city famed for pottery squares, Nyatapola 5-story pagoda, and delicious King Curd (Juju Dhau)." },
      { name: "Nagarkot Himalayan Sunrise Ridge", duration: "Half Day", elevation: "2,175m", description: "Rim viewpoint offering dawn vistas stretching from Langtang to Everest on crystal-clear mornings." },
      { name: "Patan Durbar Square & Museum", duration: "3 Hours", elevation: "1,350m", description: "World-renowned museum housing Asia's finest collection of bronze sacred sculptures." }
    ]
  },
  {
    slug: "lukla",
    name: "Lukla",
    region: "Everest Region",
    elevation: 2860,
    label: "Cliff-perched mountain threshold to Mount Everest",
    description:
      "Perched precipitously on a granite shelf high above the Dudh Koshi river, Lukla is famous worldwide for the thrilling mountain runway of Tenzing-Hillary Airport (VNLK). It is the pulsing starting line where trekkers, Sherpa guides, porters, and yaks assemble before embarking on the trail to Everest Base Camp.",
    lat: 27.6869,
    lng: 86.729,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
    ],
    bestSeason: ["Spring (Mar–May)", "Autumn (Sep–Nov)"],
    trekSlugs: ["everest-base-camp", "gokyo-lakes"],
    highlights: [
      "World-famous Tenzing-Hillary Airport (2,860m) airstrip view",
      "Trailhead starting point for the classic Everest Base Camp expedition",
      "Pasang Lhamu Memorial Gate welcoming travelers into the Khumbu",
      "Bustling expedition staging lodges with hot lemon honey tea"
    ],
    attractions: [
      { name: "Tenzing-Hillary Runway Viewpoint", type: "Aviation Landmark", description: "Watch twin-otter aircraft land and take off from the inclined 527-meter mountain runway hanging over a 600m drop." },
      { name: "Pasang Lhamu Memorial Gate", type: "Monument", description: "Traditional stone gateway erected in honor of the first Nepalese woman to summit Mount Everest." },
      { name: "Lukla Village Monastery", type: "Gompa", description: "Quiet Tibetan Buddhist monastery situated in upper Lukla away from the bustling runway noise." }
    ],
    accommodationTypes: [
      {
        type: "Transit Expedition Lodges",
        badge: "Trail Standard",
        description: "Warm timber lodges providing hot meals, cozy rooms, and flight coordination desks for flights to/from Kathmandu and Ramechhap.",
        amenities: ["Flight Status Desks", "Hot Showers", "Hearty Breakfasts", "Luggage Weighing Scales"]
      }
    ],
    culturalHighlights: {
      ethnicGroups: ["Sherpa", "Rai"],
      overview: "Lukla blends traditional Sherpa hospitality with expedition logistics, where yaks are loaded with expedition duffels.",
      etiquette: [
        "Yield the mountain side of the trail when yaks or mules pass.",
        "Greet guides and porters with respect—they are the backbone of the Himalayas."
      ]
    },
    nearbySideTrips: [
      { name: "Phakding Riverside Walk", duration: "3–4 Hours", elevation: "2,610m", description: "The gentle first day hike downhill along pine-fringed banks of the roaring Dudh Koshi river." },
      { name: "Bom Village & Surke Countryside Walk", duration: "2 Hours", elevation: "2,400m", description: "Exploration of traditional farming hamlets tucked in the valley below the airstrip." }
    ]
  },
  {
    slug: "manang",
    name: "Manang",
    region: "Annapurna Region",
    elevation: 3519,
    label: "Ancient high Tibetan valley & premier acclimatization haven",
    description:
      "A broad, sun-bleached alpine valley set against the dramatic northern ramparts of the Annapurna range. Manang features ancient flat-roofed stone houses, Tibetan prayer walls, turquoise glacial lakes, and crucial rest days before crossing the formidable 5,416m Thorong La pass.",
    lat: 28.6667,
    lng: 84.0167,
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80"
    ],
    bestSeason: ["Autumn (Sep–Nov)", "Spring (Mar–May)"],
    trekSlugs: ["annapurna-circuit"],
    highlights: [
      "Spectacular views of Annapurna II, III, IV, and Gangapurna",
      "Essential high-altitude acclimatization staging before Thorong La Pass",
      "Scenic Gangapurna turquoise glacial lake directly opposite the village",
      "Himalayan Rescue Association (HRA) daily altitude lectures"
    ],
    attractions: [
      { name: "Gangapurna Glacial Lake & Icefall", type: "Glacial Lake", description: "Turquoise alpine lake formed by meltwaters from the hanging glaciers of Gangapurna peak." },
      { name: "Braga 500-Year-Old Monastery", type: "Ancient Gompa", description: "Perched dramatically into the cliff wall at Braga, housing ancient clay statues of the 108 Buddhas." },
      { name: "Milarepa’s Cave", type: "Sacred Meditation Cave", description: "Historic cliff hermitage where the legendary Tibetan yogi Milarepa lived and composed songs." }
    ],
    accommodationTypes: [
      {
        type: "High-Alpine Stone Teahouses",
        badge: "Comfortable Lodges",
        description: "Substantial stone hotels with glass-enclosed dining halls, wood-fired stoves, and artisan bakeries serving fresh cinnamon buns.",
        amenities: ["Solar Showers", "Heated Dining Halls", "Local Seabuckthorn Juice", "Wi-Fi"]
      }
    ],
    culturalHighlights: {
      ethnicGroups: ["Manangi (Bhotia)", "Gurung"],
      overview: "Manangis possess distinct trading rights granted by ancient royal decrees, preserving rich Tibetan Buddhist customs and equestrian traditions.",
      etiquette: [
        "Attend the free 3:00 PM altitude safety briefing at the Himalayan Rescue Association clinic.",
        "Always circumambulate Braga Monastery and chortens clockwise."
      ]
    },
    nearbySideTrips: [
      { name: "Tilicho Lake High Pass Excursion", duration: "2–3 Days", elevation: "4,919m", description: "Side trek to one of the highest alpine lakes in the world, surrounded by sheer ice walls." },
      { name: "Ice Lake (Kicho Tal) Day Trek", duration: "6 Hours round trip", elevation: "4,600m", description: "Challenging steep acclimatization hike with unbeatable panoramas of the entire Annapurna massif." },
      { name: "Praken Gompa Hermit Blessing", duration: "2 Hours", elevation: "3,950m", description: "Hike up the cliff to receive a blessed safety string from the resident monk for Thorong La pass." }
    ]
  },
  {
    slug: "kyanjin-gompa",
    name: "Kyanjin Gompa",
    region: "Langtang Region",
    elevation: 3870,
    label: "Glaciated alpine sanctuary & yak cheese haven of Langtang",
    description:
      "The crowning destination of the Langtang Valley, nestled inside a natural rock and glacier amphitheater. Surrounded by towering 7,000m giants including Langtang Lirung, Kyanjin Gompa features a historic Swiss-founded yak cheese factory, sacred monastery, and incredible panoramic summit scrambles.",
    lat: 28.2119,
    lng: 85.5684,
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80"
    ],
    bestSeason: ["Spring (Mar–May)", "Autumn (Sep–Nov)"],
    trekSlugs: ["langtang-valley"],
    highlights: [
      "Spectacular amphitheater surrounded by Langtang Lirung (7,227m)",
      "Historic Government Yak Cheese Factory established in 1955",
      "Challenging panoramic day climbs to Kyanjin Ri (4,773m) and Tserko Ri (4,984m)",
      "Vibrant high-altitude Tamang and Tibetan mountain culture"
    ],
    attractions: [
      { name: "Historic Yak Cheese Factory", type: "Alpine Dairy", description: "Sample freshly prepared hard alpine yak cheese and warm curd produced using traditional Swiss techniques." },
      { name: "Kyanjin Buddhist Monastery", type: "Gompa", description: "Peaceful stone monastery with fluttering prayer flags framing the sheer ice wall of Langtang Lirung." },
      { name: "Langtang Lirung Glacial Moraine", type: "Glacier Walk", description: "Short walk behind the village to view the deep crevasses and glacial lagoon of the tumbling icefall." }
    ],
    accommodationTypes: [
      {
        type: "Mountain Stone Lodges",
        badge: "Cozy & Welcoming",
        description: "Rebuilt modern alpine lodges with thick stone insulation, panoramic sunrooms, and generous servings of warm Tibetan bread.",
        amenities: ["Sunrooms with Mountain Views", "Hot Bucket Baths", "Hearty Sherpa Stew & Dal Bhat"]
      }
    ],
    culturalHighlights: {
      ethnicGroups: ["Tamang", "Tibetan highland herders"],
      overview: "Deeply connected to yak pastoralism and Buddhist traditions, Tamang communities rebuilt the valley with inspiring resilience.",
      etiquette: [
        "Do not leave trash on the high summit ridges of Kyanjin Ri or Tserko Ri.",
        "Buy local cheese and honey to support local highland farming families."
      ]
    },
    nearbySideTrips: [
      { name: "Kyanjin Ri Summit Climb", duration: "3–4 Hours round trip", elevation: "4,773m", description: "Spectacular rocky peak directly above the village offering a breathtaking 360° panorama." },
      { name: "Tserko Ri High Summit Excursion", duration: "6–7 Hours round trip", elevation: "4,984m", description: "Demanding high pass climb with vistas reaching deep into Tibet and the Shishapangma massif." },
      { name: "Langshisa Kharka Alpine Pasture Walk", duration: "Full Day", elevation: "4,100m", description: "Gentle trek up the flat valley floor past grazing yak herds to the high pasture boundary." }
    ]
  },
  {
    slug: "samagaun",
    name: "Samagaun",
    region: "Manaslu Region",
    elevation: 3530,
    label: "Foot of the Mountain of the Spirit · Manaslu Base Staging",
    description:
      "A timeless, sprawling stone village of the Bhotia people spread across an alpine meadow directly beneath Mt. Manaslu (8,163m). With its massive carved mani walls, ancient monasteries, and grazing yak caravans, Samagaun feels like stepping back into medieval Tibet.",
    lat: 28.5833,
    lng: 84.6333,
    image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=80"
    ],
    bestSeason: ["Autumn (Sep–Nov)", "Spring (Mar–May)"],
    trekSlugs: ["manaslu-circuit"],
    highlights: [
      "Direct front-row views of the towering south-east face of Mt. Manaslu (8,163m)",
      "Pungyen Gompa sanctuary nestled on an elevated plateau beneath the glaciers",
      "Turquoise waters of Birendra Tal glacial lake",
      "Authentic, uncommercialized Bhotia Tibetan lifestyle"
    ],
    attractions: [
      { name: "Pungyen Gompa", type: "Monastery Sanctuary", description: "Historic monastery destroyed by an avalanche in the 1950s and rebuilt in an isolated mountain amphitheater." },
      { name: "Birendra Tal Glacial Lake", type: "Alpine Lake", description: "A stunning turquoise glacial meltwater lake located an hour’s walk from the village." },
      { name: "Manaslu Base Camp (4,800m)", type: "Climbing Base", description: "The active expedition tent city where international climbing teams prepare to summit Manaslu." }
    ],
    accommodationTypes: [
      {
        type: "Traditional Bhotia Lodges",
        badge: "Authentic Trail",
        description: "Rustic wooden and stone lodges with central fire stoves, serving authentic hot Tibetan butter tea, potato pancakes, and tsampa.",
        amenities: ["Warm Fireplace Dining", "Boiled Drinking Water", "Comfortable Wool Blankets"]
      }
    ],
    culturalHighlights: {
      ethnicGroups: ["Bhotia (Nubri people)"],
      overview: "Preserves ancient Nyingma Buddhist rituals, traditional dress with colorful woven aprons (pangden), and unique regional dialects.",
      etiquette: [
        "Always pass the extensive mani stone walls on your right side.",
        "Take care when photographing local villagers and monks; ask politely first."
      ]
    },
    nearbySideTrips: [
      { name: "Manaslu Base Camp Acclimatization Hike", duration: "6–7 Hours round trip", elevation: "4,800m", description: "Steep day climb to the base of the climbing route with views of icefall seracs." },
      { name: "Birendra Tal Lake Morning Stroll", duration: "2 Hours round trip", elevation: "3,620m", description: "Gentle acclimatization walk to the tranquil shoreline beneath Manaslu." }
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
    lat: 28.375,
    lng: 83.808,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"
    ],
    bestSeason: ["All Year", "Spring (Mar–May)", "Autumn (Sep–Nov)"],
    trekSlugs: ["annapurna-sanctuary", "poon-hill"],
    highlights: [
      "Cobblestone lanes and slate stone architecture of the Gurung people",
      "Dramatic up-close views of Annapurna South and Machapuchare",
      "Traditional Gurung Cultural Museum showcasing antique highland life",
      "Accessible foothill trek perfect for families and first-time hikers"
    ],
    attractions: [
      { name: "Old Gurung Cultural Museum", type: "Museum", description: "Historic stone residence exhibiting traditional weapons, clothing, agricultural tools, and Gurkha military medals." },
      { name: "ACAP Visitor Center", type: "Conservation Center", description: "Informative exhibits detailing the flora, wildlife, and community conservation projects of the Annapurna area." },
      { name: "Ghandruk Sunrise Viewpoint", type: "Viewpoint", description: "Early morning terrace view where sunlight strikes the jagged peak of Fishtail in golden orange." }
    ],
    accommodationTypes: [
      {
        type: "Gurung Heritage Lodges & Homestays",
        badge: "Cultural Immersion",
        description: "Delightful family-operated stone lodges with flowers in the courtyards, local Gurung cooking, and mountain-facing terraces.",
        amenities: ["Attached Bathrooms Available", "Hot Showers", "Organic Local Vegetables", "Free Wi-Fi"]
      }
    ],
    culturalHighlights: {
      ethnicGroups: ["Gurung"],
      overview: "Home of legendary Gurkha warriors. Celebrates Loshar (Gurung New Year) with traditional dances (Ghatu and Sorathi).",
      etiquette: [
        "Dress modestly when walking through the village center.",
        "Support local weaving women cooperatives by purchasing authentic nettle shawls."
      ]
    },
    nearbySideTrips: [
      { name: "Hike to Tadapani through Rhododendron Forest", duration: "3–4 Hours", elevation: "2,630m", description: "Walk through mossy cloud forest alive with bird calls and spring rhododendron blossoms." },
      { name: "Kimche Downhill Valley Walk", duration: "1.5 Hours", elevation: "1,600m", description: "Pleasant descent through terraced rice paddies to the Modi Khola river suspension bridge." }
    ]
  },
  {
    slug: "chitwan",
    name: "Chitwan National Park",
    region: "Terai Lowlands",
    elevation: 150,
    label: "UNESCO World Heritage jungle safari & Bengal tiger sanctuary",
    description:
      "Nepal's most celebrated wildlife reserve, spread across the dense subtropical jungles and grasslands of the inner Terai. Home to one-horned rhinos, Bengal tigers, wild elephants, gharial crocodiles, and over 550 species of birds. A magical counterpoint to high-altitude trekking.",
    lat: 27.5,
    lng: 84.3333,
    image: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1474511320723-9a56873571b7?auto=format&fit=crop&w=1200&q=80"
    ],
    bestSeason: ["Autumn (Oct–Feb)", "Spring (Mar–May)"],
    trekSlugs: [],
    highlights: [
      "One-horned rhinoceros sightings on guided jungle walks",
      "Bengal tiger corridor in the buffer zone forests",
      "Traditional Tharu village cultural programs & dance performances",
      "Dugout canoe safari along the crocodile-rich Rapti River"
    ],
    attractions: [
      { name: "Elephant Breeding Center", type: "Wildlife Sanctuary", description: "Watch baby elephants and learn about Nepal's elephant conservation programs." },
      { name: "Rapti River Canoe Safari", type: "Wildlife Experience", description: "Glide silently past sunbathing gharial crocodiles and marsh muggers on a traditional wooden dugout." },
      { name: "Tharu Cultural Village", type: "Cultural Heritage", description: "Experience the indigenous Tharu people's stick dances, mud-walled longhouses, and authentic jungle cuisine." },
      { name: "20,000 Lakes Wetlands", type: "Bird Sanctuary", description: "World-class birdwatching habitat with rare species including the Bengal florican and giant hornbill." }
    ],
    accommodationTypes: [
      {
        type: "Luxury Jungle Lodges",
        badge: "Premium Safari",
        description: "Eco-luxury lodges with private verandas overlooking the jungle canopy, swimming pools, and full-board gourmet dining.",
        amenities: ["Pool", "Private Verandas", "Full-Board Dining", "Naturalist Guides"]
      },
      {
        type: "Community Homestays",
        badge: "Cultural Immersion",
        description: "Traditional Tharu longhouses with organic meals, village walks, and authentic cultural exchange.",
        amenities: ["Organic Meals", "Cultural Programs", "Village Walks"]
      }
    ],
    culturalHighlights: {
      ethnicGroups: ["Tharu", "Bote", "Darai"],
      overview: "The Tharu people are the indigenous jungle inhabitants with rich traditions in stick fighting, folk dance, and eco-friendly mud-walled architecture.",
      etiquette: [
        "Always follow your naturalist guide's instructions during jungle activities.",
        "Do not feed or approach wild animals under any circumstances.",
        "Support community tourism by purchasing Tharu handicrafts."
      ]
    },
    nearbySideTrips: [
      { name: "Bis Hazari Tal (20,000 Lakes) Birdwatching", duration: "Half Day", elevation: "150m", description: "Wetland paradise for rare migratory birds in the western buffer zone." },
      { name: "Devghat Sacred Confluence", duration: "Half Day", elevation: "200m", description: "Holy Hindu pilgrimage site where the Trisuli and Narayani rivers merge." }
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
    lat: 27.4833,
    lng: 83.2833,
    image: "https://images.unsplash.com/photo-1609920658906-8223bd289001?auto=format&fit=crop&w=1200&q=80",
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
      { name: "Mayadevi Temple & Sacred Garden", type: "UNESCO Heritage", description: "The precise birthplace marker stone, the ancient bathing pool (Puskarini), and the sacred Bodhi tree within the protected garden." },
      { name: "Ashoka Pillar (249 BC)", type: "Ancient Monument", description: "One of the oldest stone inscriptions in South Asia, personally erected by Emperor Ashoka marking Buddha's birthplace." },
      { name: "World Peace Pagoda", type: "Buddhist Monument", description: "A striking golden Japanese-built pagoda with four gilded Buddha sculptures facing the cardinal directions." },
      { name: "International Monastery Zone", type: "Spiritual Complex", description: "Over 25 monasteries built by China, Thailand, Germany, Myanmar, Korea, and other nations, each in their national Buddhist style." }
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
      ethnicGroups: ["Tharu", "Awadhi", "Buddhist monks from around the world"],
      overview: "Lumbini is the global spiritual center of Buddhism, attracting millions of pilgrims annually. A place of deep reverence and meditative silence.",
      etiquette: [
        "Dress modestly and remove shoes before entering temple areas.",
        "Maintain silence in the Sacred Garden and meditation zones.",
        "Do not touch or lean on ancient monuments."
      ]
    },
    nearbySideTrips: [
      { name: "Kapilvastu (Tilaurakot) Ancient Palace Ruins", duration: "Half Day", elevation: "100m", description: "Archaeological remains of Prince Siddhartha's childhood palace and the ancient Shakya kingdom." },
      { name: "Kudan Archaeological Site", duration: "2 Hours", elevation: "100m", description: "The sacred site where Lord Buddha met his father King Suddhodana after attaining enlightenment." }
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
    lat: 27.9347,
    lng: 84.4086,
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1200&q=80",
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
      { name: "Bandipur Bazaar (Main Street)", type: "Heritage Walkway", description: "Perfectly preserved traffic-free Newari trading street with brass-trimmed shopfronts and flower-draped balconies." },
      { name: "Siddha Gufa (Siddha Cave)", type: "Natural Wonder", description: "Nepal's largest stalactite cave, stretching over 600m deep with massive bat colonies and limestone formations." },
      { name: "Thani Mai Temple Viewpoint", type: "Hilltop Shrine", description: "Climb to the highest ridgetop for a 360° panorama of the Himalayan chain and the Marsyangdi valley below." },
      { name: "Tundikhel Open Meadow", type: "Heritage Grounds", description: "Central village green where ancient Newar festivals, dances, and community gatherings still take place." }
    ],
    accommodationTypes: [
      {
        type: "Heritage Boutique Inns",
        badge: "Restored Newari",
        description: "Beautifully restored 200-year-old merchant mansions with antique furnishings, terraced gardens, and mountain-facing rooms.",
        amenities: ["Antique Decor", "Organic Meals", "Mountain Terraces", "Free Wi-Fi"]
      }
    ],
    culturalHighlights: {
      ethnicGroups: ["Newar", "Magar", "Gurung"],
      overview: "Once a prosperous trading post on the India-Tibet route, Bandipur preserves pristine Newari architecture, Jatra festival traditions, and artisan metalwork.",
      etiquette: [
        "Support local artisans by purchasing handmade textiles and brassware.",
        "Respect the tranquil atmosphere of this pedestrian-only village."
      ]
    },
    nearbySideTrips: [
      { name: "Ramkot Viewpoint Hike", duration: "2 Hours", elevation: "1,150m", description: "Short hill walk to a spectacular vantage point overlooking the Marsyangdi river gorge." },
      { name: "Siddha Cave Exploration", duration: "3 Hours", elevation: "700m", description: "Guided descent into the massive cave with headlamps and expert caving guides." }
    ]
  },
  {
    slug: "tansen",
    name: "Tansen (Palpa)",
    region: "Lumbini Province",
    elevation: 1343,
    label: "Hidden Newari hill gem of medieval palaces & metalwork artisans",
    description:
      "A little-visited jewel perched on a Mahabharat range hilltop, Tansen is renowned for its ornate Rana-era palace, centuries-old Dhaka weaving tradition, and panoramic views of the Kali Gandaki gorge. Authentic cultural heritage without the tourist crowds — Nepal's best-kept secret.",
    lat: 27.8667,
    lng: 83.55,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80"
    ],
    bestSeason: ["All Year", "Autumn (Sep–Dec)", "Spring (Feb–May)"],
    trekSlugs: [],
    highlights: [
      "Tansen Durbar — the imposing Rana-era provincial palace",
      "Dhaka textile weaving — Nepal's most prized handloom tradition",
      "Ancient Amar Narayan Temple with exquisite erotic woodcarvings",
      "Shreenagar Hilltop panorama of Dhaulagiri, Annapurna & Kali Gandaki"
    ],
    attractions: [
      { name: "Tansen Durbar (Rana Palace)", type: "Historic Palace", description: "Grand provincial palace built in the 19th century Rana architectural style with imposing white-washed walls." },
      { name: "Amar Narayan Temple", type: "Hindu Temple", description: "Elegant 200-year-old pagoda temple dedicated to Vishnu with intricately carved erotic wooden struts." },
      { name: "Dhaka Weaving Workshops", type: "Living Art", description: "Watch master weavers produce Nepal's national fabric, the colorful Dhaka topi cloth, on wooden handlooms." },
      { name: "Shreenagar Hill Viewpoint", type: "Panoramic Viewpoint", description: "Hilltop park with breathtaking vistas of the Kali Gandaki gorge and a 200km Himalayan horizon." }
    ],
    accommodationTypes: [
      {
        type: "Hilltop Heritage Hotels",
        badge: "Cultural Gem",
        description: "Charming converted Newari and Rana-era guesthouses with period details and warm local hospitality.",
        amenities: ["Mountain Views", "Home-Cooked Meals", "Cultural Walking Tours"]
      }
    ],
    culturalHighlights: {
      ethnicGroups: ["Newar", "Magar"],
      overview: "Tansen is the last bastion of medieval Newari architecture outside the Kathmandu valley, with active metalwork guilds and vibrant Jatra festival processions.",
      etiquette: [
        "Ask permission before photographing artisans at work.",
        "Purchase authentic Dhaka textiles directly from weaving cooperatives."
      ]
    },
    nearbySideTrips: [
      { name: "Rani Mahal (Queen's Palace)", duration: "Half Day", elevation: "300m", description: "Nepal's 'mini Taj Mahal' — a stunning 19th-century palace perched on the banks of the Kali Gandaki river." },
      { name: "Ridi Bazaar Pilgrimage Town", duration: "Half Day", elevation: "500m", description: "Sacred confluence town on the Kali Gandaki where ancient Shaligram fossils are found." }
    ]
  },
  {
    slug: "nagarkot",
    name: "Nagarkot",
    region: "Kathmandu Valley",
    elevation: 2175,
    label: "Himalayan sunrise panorama rim above Kathmandu valley",
    description:
      "Perched on the eastern rim of the Kathmandu valley, Nagarkot is Nepal's most celebrated sunrise viewpoint. On clear mornings, the panoramic horizon stretches over 300km from Dhaulagiri in the west through Everest to Kanchenjunga in the east — the most extensive Himalayan vista accessible by road.",
    lat: 27.7172,
    lng: 85.5167,
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=80"
    ],
    bestSeason: ["Autumn (Oct–Dec)", "Spring (Feb–Apr)"],
    trekSlugs: [],
    highlights: [
      "300km Himalayan panorama from Dhaulagiri to Kanchenjunga",
      "Spectacular golden sunrise over the eastern peaks including Everest",
      "Easy 32km scenic day-hike to Dhulikhel and Bhaktapur",
      "Lush rhododendron and pine forest walking trails"
    ],
    attractions: [
      { name: "Nagarkot Tower Viewpoint", type: "Panoramic Tower", description: "The highest viewing tower on the rim with labeled peak identification boards spanning 8 Himalayan ranges." },
      { name: "Nagarkot to Dhulikhel Ridge Trek", type: "Day Hike", description: "Beautiful 5-hour ridge walk through farming hamlets and forest with continuous mountain views." },
      { name: "Changu Narayan Temple (UNESCO)", type: "Ancient Temple", description: "Nepal's oldest Hindu temple (5th century AD) reachable by a gentle downhill walk through terraced farmland." }
    ],
    accommodationTypes: [
      {
        type: "Mountain View Resorts",
        badge: "Sunrise Luxury",
        description: "Modern hilltop resorts with floor-to-ceiling windows facing the Himalayan panorama, perfect for dawn photography.",
        amenities: ["Panoramic Windows", "Sunrise Wake-up Calls", "Heated Rooms", "Mountain Dining"]
      },
      {
        type: "Boutique Hillside Lodges",
        badge: "Cozy Retreat",
        description: "Intimate lodges nestled in pine forests with wood-burning fireplaces and organic garden dining.",
        amenities: ["Fireplaces", "Organic Garden", "Forest Walks", "Free Wi-Fi"]
      }
    ],
    culturalHighlights: {
      ethnicGroups: ["Tamang", "Newar"],
      overview: "A quiet rural ridge community whose economy centers on hospitality, organic farming, and the extraordinary natural panorama it commands.",
      etiquette: [
        "Wake early — sunrise is the main event and typically occurs between 5:30-6:30 AM.",
        "Support local organic farms by purchasing fresh vegetables and honey."
      ]
    },
    nearbySideTrips: [
      { name: "Changu Narayan UNESCO Temple Walk", duration: "3 Hours", elevation: "1,600m", description: "Downhill walk through farmland to Nepal's oldest Hindu temple with exquisite 5th-century stone carvings." },
      { name: "Bhaktapur Ancient City Visit", duration: "Half Day", elevation: "1,401m", description: "Continue from Changu Narayan to the magnificent medieval city of Bhaktapur for pottery, pagodas, and King Curd." }
    ]
  }
];
