export const treks = [
  {
    slug: "everest-base-camp",
    title: "Everest Base Camp & Kala Patthar",
    region: "Khumbu",
    location: "Khumbu · Sagarmatha National Park, Nepal",
    duration: 14,
    difficulty: "Challenging",
    elevation: 5364,
    elevationFt: 17598,
    distance: "130 km / 81 mi",
    price: 1890,
    rating: 4.95,
    reviewCount: 168,
    season: ["Spring", "Autumn"],
    scenery: ["High peaks", "Glaciers", "Sherpa Heritage"],
    interests: ["High Altitude", "Photography", "Culture"],
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1500&q=85",
    imageAlt: "The towering snow-covered pyramid of Mount Everest beneath a crystal morning sky",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1500&q=85",
        alt: "Panoramic view of Everest, Lhotse, and Nuptse from Kala Patthar",
        caption: "Sunrise touching the highest pinnacle on Earth at Kala Patthar (5,545m)"
      },
      {
        url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=85",
        alt: "The natural amphitheatre of Namche Bazaar tucked into the mountain bowl",
        caption: "Namche Bazaar (3,440m) — the historic trading hub and Sherpa capital"
      },
      {
        url: "https://images.unsplash.com/photo-1579618218290-24a26f63a708?auto=format&fit=crop&w=1200&q=85",
        alt: "Suspension bridge adorned with colorful prayer flags crossing deep river gorge",
        caption: "Crossing the iconic Hillary Suspension Bridge high above the rushing Dudh Koshi"
      },
      {
        url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=85",
        alt: "Everest Base Camp with colorful expedition tents against the Khumbu Icefall",
        caption: "At the foot of the world's roof: Everest Base Camp (5,364m)"
      }
    ],
    description:
      "Follow the historic stone footsteps through pine-scented valleys, sacred monasteries, and dramatic suspension bridges into the inner sanctum of the world's tallest peaks.",
    introduction:
      "This isn't merely a high-altitude hike; it's a rite of passage. Walk beside yak caravans, receive blessings in centuries-old gompas, and spend cozy evenings sipping ginger lemon honey tea beside wood-burning teahouse stoves as the Himalayan alpenglow fades into a sky flooded with stars.",
    routeOverview: [
      "Kathmandu (1,400m)",
      "Lukla (2,860m)",
      "Phakding (2,610m)",
      "Namche Bazaar (3,440m)",
      "Tengboche (3,860m)",
      "Dingboche (4,410m)",
      "Lobuche (4,940m)",
      "Gorak Shep (5,164m)",
      "Everest Base Camp (5,364m)",
      "Kala Patthar (5,545m)"
    ],
    itinerary: [
      {
        day: "01",
        title: "Arrive in Kathmandu · Cultural Welcome",
        from: "Tribhuvan International Airport (1,400m)",
        to: "Kathmandu Hotel, Thamel",
        stay: "Traditional Heritage Hotel, Kathmandu",
        distance: "Transfer only",
        hours: "45 mins drive",
        elevation: "1,400 m",
        details:
          "Touch down in the vibrant Kathmandu valley. Meet your lead Sherpa guide for a gear check, detailed briefing on altitude safety, and enjoy an authentic welcome dinner."
      },
      {
        day: "02",
        title: "Mountain Flight to Lukla · Trek into Phakding",
        from: "Lukla Airport (2,860m)",
        to: "Phakding (2,610m)",
        stay: "Mountain Breeze Teahouse, Phakding",
        distance: "7.8 km / 4.8 mi",
        hours: "3–4 hrs",
        elevation: "2,610 m (-250 m net descent)",
        details:
          "Experience the thrilling 35-minute mountain flight into Lukla. Meet our friendly local porters, tie your bootlaces, and trace the roaring Dudh Koshi river through pine forests and carved mani stones."
      },
      {
        day: "03",
        title: "Climb through Sagarmatha Gorge to Namche Bazaar",
        from: "Phakding (2,610m)",
        to: "Namche Bazaar (3,440m)",
        stay: "Khumbu Lodge, Namche Bazaar",
        distance: "10.5 km / 6.5 mi",
        hours: "5–6 hrs",
        elevation: "3,440 m (+830 m climb)",
        details:
          "Cross the dramatic Hillary Suspension Bridge strung high above the turquoise river. Make the steady zigzag climb through rhododendron woods to reach Namche, catching your first glimpse of Everest through the trees."
      },
      {
        day: "04",
        title: "Acclimatization Day · Hotel Everest View & Khumjung",
        from: "Namche Bazaar (3,440m)",
        to: "Everest View Hotel (3,880m) & return",
        stay: "Khumbu Lodge, Namche Bazaar",
        distance: "5.5 km / 3.4 mi round-trip",
        hours: "4 hrs",
        elevation: "3,880 m peak (sleep at 3,440 m)",
        details:
          "The golden rule: 'Climb high, sleep low'. Hike up to the legendary Hotel Everest View for hot tea and a panoramic vista of Ama Dablam, Thamserku, and Everest before exploring the Hillary school in Khumjung."
      },
      {
        day: "05",
        title: "Trek to Tengboche Monastery",
        from: "Namche Bazaar (3,440m)",
        to: "Tengboche (3,860m)",
        stay: "Tengboche Guesthouse, Tengboche",
        distance: "9.2 km / 5.7 mi",
        hours: "5 hrs",
        elevation: "3,860 m (+420 m)",
        details:
          "Contour along high valley bluffs before descending to the river at Phunki Thenga. Climb through birch forest to Tengboche, where monks chant evening prayers against the dramatic backdrop of Ama Dablam."
      },
      {
        day: "06",
        title: "Upper Valley Ascent to Dingboche",
        from: "Tengboche (3,860m)",
        to: "Dingboche (4,410m)",
        stay: "Valley View Teahouse, Dingboche",
        distance: "11 km / 6.8 mi",
        hours: "5–6 hrs",
        elevation: "4,410 m (+550 m)",
        details:
          "Pass ancient stone chortens and cross the Imja Khola into Pangboche. Leaving the tree line behind, step into the wide windswept alpine valley surrounded by rock and snow."
      },
      {
        day: "07",
        title: "Dingboche Acclimatization · Nangkartshang Peak",
        from: "Dingboche (4,410m)",
        to: "Nangkartshang Viewpoint (5,083m) & return",
        stay: "Valley View Teahouse, Dingboche",
        distance: "4.5 km round-trip",
        hours: "4 hrs",
        elevation: "5,083 m peak (sleep at 4,410 m)",
        details:
          "A crucial altitude conditioning day. Hike up the steep ridge of Nangkartshang Peak for jaw-dropping views of Makalu (5th highest peak in the world), Island Peak, and the immense south face of Lhotse."
      },
      {
        day: "08",
        title: "Thokla Pass Memorials to Lobuche",
        from: "Dingboche (4,410m)",
        to: "Lobuche (4,940m)",
        stay: "Eco Lodge, Lobuche",
        distance: "8.5 km / 5.3 mi",
        hours: "4–5 hrs",
        elevation: "4,940 m (+530 m)",
        details:
          "Walk across the alpine tundra of Dughla, then climb the steep Thokla Pass to pay quiet respects at the heartfelt stone memorials dedicated to climbers who lost their lives on Everest."
      },
      {
        day: "09",
        title: "Gorak Shep & Everest Base Camp (5,364m)",
        from: "Lobuche (4,940m)",
        to: "Everest Base Camp (5,364m) via Gorak Shep",
        stay: "Himalayan Lodge, Gorak Shep (5,164m)",
        distance: "14 km / 8.7 mi round-trip",
        hours: "7–8 hrs",
        elevation: "5,364 m (+424 m)",
        details:
          "The crowning milestone. Trek over the rolling lateral moraine of the Khumbu Glacier to Gorak Shep, drop daypacks, and push onward to Everest Base Camp. Stand before the monumental Khumbu Icefall."
      },
      {
        day: "10",
        title: "Kala Patthar Sunrise (5,545m) & Descend to Pheriche",
        from: "Gorak Shep (5,164m)",
        to: "Pheriche (4,240m) via Kala Patthar",
        stay: "Edelweiss Teahouse, Pheriche",
        distance: "13 km / 8 mi",
        hours: "6–7 hrs",
        elevation: "5,545 m summit (-1,305 m descent)",
        details:
          "Begin at pre-dawn by headlamp to summit Kala Patthar. Watch golden dawn rays illuminate Mount Everest, Pumori, and Nuptse in a 360-degree spectacle. Afterwards, descend to richer oxygen in Pheriche."
      },
      {
        day: "11–12",
        title: "Descending the Valley · Namche to Lukla",
        from: "Pheriche (4,240m)",
        to: "Lukla (2,860m) over 2 days",
        stay: "Sherpa Teahouse, Lukla",
        distance: "32 km / 20 mi total",
        hours: "5–6 hrs per day",
        elevation: "2,860 m",
        details:
          "Breathe deeper as each step brings you down into the warmer, greener forest zones. Share laughter and a celebratory farewell dinner with your Sherpa guides and porters in Lukla."
      },
      {
        day: "13–14",
        title: "Fly to Kathmandu & Departure",
        from: "Lukla Airport",
        to: "Kathmandu & Homeward Bound",
        stay: "Heritage Hotel, Kathmandu",
        distance: "Flight & transfers",
        hours: "35 min flight",
        elevation: "1,400 m",
        details:
          "Catch the early morning flight back to Kathmandu. Spend the afternoon exploring the colorful bazaars of Thamel or relaxing in a quiet garden cafe before your onward flight home."
      }
    ],
    highlights: [
      "Standing at 5,364m beneath the colossal, grinding Khumbu Icefall",
      "Panoramic sunrise over Mount Everest, Lhotse, and Nuptse from Kala Patthar (5,545m)",
      "Traditional Buddhist blessing at the 100-year-old Tengboche Monastery",
      "Experiencing authentic Sherpa hospitality, warm teahouse stoves, and local mountain culture",
      "Crossing iconic high suspension bridges fluttering with Tibetan prayer flags"
    ],
    included: [
      "Licensed English-speaking certified Sherpa Mountain Guide (first-aid certified)",
      "Local Sherpa Porters (1 porter for 2 trekkers, carrying up to 20kg)",
      "Sagarmatha National Park entry permit & Khumbu Pasang Lhamu municipality fee",
      "TIMS (Trekkers' Information Management System) registration card",
      "Domestic round-trip mountain flights (Kathmandu/Ramechhap ⇄ Lukla) with 15kg baggage",
      "All twin-share teahouse lodge accommodations on the trail (11 nights)",
      "2 nights charming heritage hotel accommodation in Kathmandu with breakfast",
      "3 hot meals daily on trek (Breakfast, Lunch, Dinner) + seasonal fresh fruit platter",
      "Daily pulse oximeter blood oxygen checks and altitude monitoring",
      "Traditional Nepali farewell dinner with cultural folk music"
    ],
    excluded: [
      "Nepal tourist entry visa ($50 for 30 days, payable upon arrival)",
      "International airfare to/from Kathmandu",
      "Mandatory high-altitude emergency medical & helicopter evacuation insurance",
      "Personal gear (down jacket, 4-season sleeping bag — available for rent at $2/day in Kathmandu)",
      "Trail incidental expenses: Hot bucket showers ($3–$5), Wi-Fi scratch cards, phone/powerbank charging ($2–$4)",
      "Bottled soft drinks, craft beers, and specialty barista coffees on trail",
      "Tips for local guide and porters (customary ~$150–$200 total per trekker)"
    ],
    expenses: {
      packageRate: 1890,
      permitsAndFlights: "Included in package",
      lodgingAndMeals: "Included in package",
      dailyIncidentalEstimate: "$15 – $25 per day on trail (showers, Wi-Fi, snacks)",
      gearRentalOption: "$2.00 / day for warm -20°C sleeping bag & down jacket",
      recommendedTipping: "$10–$15 / day divided among guide and porter team"
    },
    sherpaTip:
      "Bistarai, bistarai — slow and steady wins the mountain. Drink four liters of warm water or garlic soup every day, never rush up a slope, and listen to what your breath tells you."
  },
  {
    slug: "annapurna-sanctuary",
    title: "Annapurna Sanctuary & Base Camp",
    region: "Annapurna",
    location: "Annapurna Conservation Area · Kaski District, Nepal",
    duration: 11,
    difficulty: "Moderate",
    elevation: 4130,
    elevationFt: 13550,
    distance: "115 km / 71 mi",
    price: 1240,
    rating: 4.92,
    reviewCount: 142,
    season: ["Spring", "Autumn", "Winter"],
    scenery: ["High peaks", "Rhododendron Forest", "Deep Gorges"],
    interests: ["Culture", "Photography", "Wildlife"],
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1500&q=85",
    imageAlt: "Distant Annapurna Himalayan peaks catching soft early morning pink light",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1500&q=85",
        alt: "The majestic Annapurna South and Hiunchuli at sunrise",
        caption: "Early morning alpenglow spilling across the Annapurna range"
      },
      {
        url: "https://images.unsplash.com/photo-1585409677983-0f6c41ca0c3b?auto=format&fit=crop&w=1200&q=85",
        alt: "Sacred Machhapuchhre Fishtail peak rising above misty green foothills",
        caption: "The unclimbed holy peak of Machhapuchhre (Fishtail, 6,993m)"
      },
      {
        url: "https://images.unsplash.com/photo-1533240332313-0db49b459ad6?auto=format&fit=crop&w=1200&q=85",
        alt: "Stone paved village trail surrounded by blooming red rhododendron trees",
        caption: "Centuries-old stone stairways winding through Gurung village terraces"
      },
      {
        url: "https://images.unsplash.com/photo-1527004013197-933c4bb611b3?auto=format&fit=crop&w=1200&q=85",
        alt: "Trekkers standing in the snowy amphitheatre of Annapurna Base Camp",
        caption: "Inside the Sanctuary at ABC (4,130m) with 360-degree mountain walls"
      }
    ],
    description:
      "Walk from emerald terraced foothills and blooming rhododendron forests straight into a dramatic natural amphitheatre ringed by 8,000-meter giants.",
    introduction:
      "A trekker's dream that combines the gentleness of terraced Gurung villages with the sheer drama of high alpine amphitheaters. Enter the sacred sanctuary where every direction you look is a wall of soaring snow and ice.",
    routeOverview: [
      "Kathmandu (1,400m)",
      "Pokhara (820m)",
      "Ulleri (2,050m)",
      "Ghorepani (2,874m)",
      "Chhomrong (2,170m)",
      "Dovan (2,600m)",
      "Machhapuchhre Base Camp (3,700m)",
      "Annapurna Base Camp (4,130m)"
    ],
    itinerary: [
      {
        day: "01",
        title: "Arrive Kathmandu · Briefing & Preparation",
        from: "Kathmandu Airport (1,400m)",
        to: "Thamel Hotel",
        stay: "Boutique Hotel, Kathmandu",
        distance: "Transfer only",
        hours: "45 mins",
        elevation: "1,400 m",
        details: "Welcome to Nepal! Meet your team, go over the route through the Annapurna Sanctuary, and prepare gear."
      },
      {
        day: "02",
        title: "Scenic Drive or Flight to Lakeside Pokhara",
        from: "Kathmandu",
        to: "Pokhara Lakeside (820m)",
        stay: "Lakeside Resort, Pokhara",
        distance: "200 km highway or 25 min flight",
        hours: "6 hrs drive or 25 min flight",
        elevation: "820 m",
        details: "Travel west along rushing Himalayan rivers to Pokhara, nestled beneath the majestic Annapurnas on the shores of Phewa Lake."
      },
      {
        day: "03",
        title: "Drive to Nayapul & Trek to Ulleri",
        from: "Pokhara / Nayapul (1,070m)",
        to: "Ulleri (2,050m)",
        stay: "Hillside Lodge, Ulleri",
        distance: "11 km / 6.8 mi",
        hours: "5 hrs",
        elevation: "2,050 m (+980 m)",
        details: "Begin walking past river cascades and bamboo groves, ascending the celebrated stone steps of Ulleri into charming Gurung teahouses."
      },
      {
        day: "04",
        title: "Through Rhododendron Forests to Ghorepani",
        from: "Ulleri (2,050m)",
        to: "Ghorepani (2,874m)",
        stay: "Snowland Lodge, Ghorepani",
        distance: "9 km / 5.6 mi",
        hours: "4–5 hrs",
        elevation: "2,874 m (+824 m)",
        details: "Walk under mossy ancient rhododendron canopies that burst into crimson and pink blossoms during spring. Arrive at the high ridge of Ghorepani."
      },
      {
        day: "05",
        title: "Poon Hill Sunrise & Trek to Tadapani",
        from: "Ghorepani / Poon Hill (3,210m)",
        to: "Tadapani (2,630m)",
        stay: "Panorama Lodge, Tadapani",
        distance: "10 km / 6.2 mi",
        hours: "6 hrs",
        elevation: "3,210 m viewpoint",
        details: "Climb Poon Hill for dawn: watch the first sunbeams strike Dhaulagiri (8,167m) and Annapurna I (8,091m). Continue across forest ridges to Tadapani."
      },
      {
        day: "06",
        title: "Descend & Climb to Chhomrong",
        from: "Tadapani (2,630m)",
        to: "Chhomrong (2,170m)",
        stay: "Chhomrong Cottage, Chhomrong",
        distance: "11.5 km / 7.1 mi",
        hours: "5 hrs",
        elevation: "2,170 m",
        details: "Drop into the Kimrong Khola river canyon and climb stone terraces to Chhomrong, the gateway Gurung settlement overlooking Machhapuchhre."
      },
      {
        day: "07",
        title: "Into the Modi Khola Gorge to Dovan",
        from: "Chhomrong (2,170m)",
        to: "Dovan (2,600m)",
        stay: "Forest Lodge, Dovan",
        distance: "9 km / 5.6 mi",
        hours: "5 hrs",
        elevation: "2,600 m (+430 m)",
        details: "Descend 2,500 stone steps to Chhomrong Khola, cross the suspension bridge, and climb into bamboo forests where langur monkeys play."
      },
      {
        day: "08",
        title: "Machhapuchhre Base Camp (MBC)",
        from: "Dovan (2,600m)",
        to: "Machhapuchhre Base Camp (3,700m)",
        stay: "Fishtail Sanctuary Lodge, MBC",
        distance: "10 km / 6.2 mi",
        hours: "5–6 hrs",
        elevation: "3,700 m (+1,100 m)",
        details: "Leave the gorge and enter the open gateway to the Sanctuary. Gaze right up into the sheer vertical walls of Machhapuchhre."
      },
      {
        day: "09",
        title: "Annapurna Base Camp (ABC - 4,130m) Sunrise",
        from: "MBC (3,700m)",
        to: "Annapurna Base Camp (4,130m)",
        stay: "Base Camp Lodge, ABC",
        distance: "4 km / 2.5 mi",
        hours: "2.5 hrs",
        elevation: "4,130 m (+430 m)",
        details: "A gentle morning walk into the inner sanctum. Surrounded 360 degrees by Annapurna I, Annapurna South, Hiunchuli, and Gangapurna."
      },
      {
        day: "10–11",
        title: "Descend to Jhinu Danda Hot Springs & Return",
        from: "ABC (4,130m)",
        to: "Pokhara via Jhinu Danda",
        stay: "Pokhara Hotel",
        distance: "28 km over 2 days",
        hours: "6 hrs per day",
        elevation: "820 m in Pokhara",
        details: "Retrace steps downhill through the Modi valley. Soak tired legs in the natural riverside hot springs of Jhinu Danda before returning to Pokhara."
      }
    ],
    highlights: [
      "Standing inside the natural mountain amphitheatre of Annapurna Base Camp (4,130m)",
      "Unmatched 360-degree views of Annapurna I (8,091m), Annapurna South, and Hiunchuli",
      "Celebrated sunrise over Dhaulagiri and Annapurna from Poon Hill (3,210m)",
      "Soaking in natural outdoor riverside hot springs at Jhinu Danda",
      "Experiencing warm hospitality in traditional Gurung and Magar hillside villages"
    ],
    included: [
      "Govt. certified licensed Himalayan guide with comprehensive wilderness training",
      "Support porters (1 porter for 2 trekkers, max 20kg)",
      "ACAP (Annapurna Conservation Area Project) permit and TIMS card",
      "Round-trip transport between Kathmandu and Pokhara (tourist coach or flight upgrade)",
      "Private jeep transfer from Pokhara to trailhead and return",
      "All teahouse lodge accommodations during trek (8 nights)",
      "2 nights lakeside hotel accommodation in Pokhara with breakfast",
      "3 wholesome meals daily on trek + morning ginger tea & evening fresh fruit",
      "Entry to Jhinu Danda natural riverside hot springs"
    ],
    excluded: [
      "International flights and Nepal tourist visa",
      "Travel & emergency high-altitude medical evacuation insurance",
      "Personal gear rental (available in Pokhara or Kathmandu)",
      "Extra snacks, drinks, hot bucket showers, and electronic charging",
      "Guide and porter gratuity"
    ],
    expenses: {
      packageRate: 1240,
      permitsAndFlights: "ACAP & TIMS included",
      lodgingAndMeals: "All lodges & 3 meals included",
      dailyIncidentalEstimate: "$10 – $18 per day (hot showers, tea, Wi-Fi)",
      gearRentalOption: "$1.50 / day for warm sleeping bag & trekking poles",
      recommendedTipping: "$8–$12 / day shared among team"
    },
    sherpaTip:
      "Take your time ascending from Dovan to MBC. The air gets noticeably thinner once you leave the bamboo forest. Keep your head warm and enjoy the evening fire!"
  },
  {
    slug: "langtang-valley",
    title: "Langtang Valley & Kyanjin Ri",
    region: "Langtang",
    location: "Langtang National Park · Rasuwa District, Nepal",
    duration: 8,
    difficulty: "Moderate",
    elevation: 4984,
    elevationFt: 16351,
    distance: "72 km / 45 mi",
    price: 860,
    rating: 4.88,
    reviewCount: 96,
    season: ["Spring", "Autumn"],
    scenery: ["High peaks", "Tamang Culture", "Glacial Meadows"],
    interests: ["Culture", "Photography", "Quiet Trails"],
    image:
      "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1500&q=85",
    imageAlt: "Alpine mountain valley rising toward a line of pristine snowy peaks in Langtang",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1500&q=85",
        alt: "Langtang Lirung towering over wide alpine pastures",
        caption: "Langtang Lirung (7,227m) dominating the head of the valley"
      },
      {
        url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=1200&q=85",
        alt: "Kyanjin Gompa village with grazing yaks and prayer flags",
        caption: "Kyanjin Gompa (3,860m) surrounded by ancient moraines and cheese factories"
      },
      {
        url: "https://images.unsplash.com/photo-1517824806704-9040b037703b?auto=format&fit=crop&w=1200&q=85",
        alt: "Rushing turquoise glacial waters of the Langtang Khola",
        caption: "Tracing the glacial rapids through pine, oak, and rhododendron woods"
      },
      {
        url: "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?auto=format&fit=crop&w=1200&q=85",
        alt: "Summit cairn of Kyanjin Ri overlooking jagged Himalayan ice walls",
        caption: "Standing at the summit of Kyanjin Ri (4,773m) facing Tibetan frontier peaks"
      }
    ],
    description:
      "A quieter, deeply spiritual Himalayan valley journey through Tamang communities, sacred forests, and the wide-open high alpine meadows of Kyanjin.",
    introduction:
      "Closest to Kathmandu yet worlds away in serenity. Rebuilt with inspiring resilience after the 2015 earthquake, Langtang is a valley of warm smiles, artisanal yak cheese, ancient monasteries, and wild mountain beauty.",
    routeOverview: [
      "Kathmandu (1,400m)",
      "Syabrubesi (1,550m)",
      "Lama Hotel (2,480m)",
      "Langtang Village (3,430m)",
      "Kyanjin Gompa (3,860m)",
      "Kyanjin Ri / Tserko Ri (4,773m - 4,984m)"
    ],
    itinerary: [
      {
        day: "01",
        title: "Scenic Overland Drive from Kathmandu to Syabrubesi",
        from: "Kathmandu (1,400m)",
        to: "Syabrubesi (1,550m)",
        stay: "River View Lodge, Syabrubesi",
        distance: "122 km drive",
        hours: "6–7 hrs drive",
        elevation: "1,550 m",
        details: "Drive north through terraced countryside and the ridge town of Dhunche, entering Langtang National Park."
      },
      {
        day: "02",
        title: "Trek through River Gorge to Lama Hotel",
        from: "Syabrubesi (1,550m)",
        to: "Lama Hotel (2,480m)",
        stay: "Sherpa Teahouse, Lama Hotel",
        distance: "11.3 km / 7 mi",
        hours: "5–6 hrs",
        elevation: "2,480 m (+930 m)",
        details: "Follow the Langtang Khola river gorge, crossing suspension bridges under mossy oak, maple, and bamboo forests where red pandas live."
      },
      {
        day: "03",
        title: "Ascend to Langtang Village",
        from: "Lama Hotel (2,480m)",
        to: "Langtang Village (3,430m)",
        stay: "Peaceful Lodge, Langtang",
        distance: "14 km / 8.7 mi",
        hours: "5–6 hrs",
        elevation: "3,430 m (+950 m)",
        details: "As the canyon broadens, the forest yields to high meadows. Pass the memorial chorten of Old Langtang and stay in the rebuilt Tamang village."
      },
      {
        day: "04",
        title: "Trek to Kyanjin Gompa",
        from: "Langtang Village (3,430m)",
        to: "Kyanjin Gompa (3,860m)",
        stay: "Yak Hotel, Kyanjin Gompa",
        distance: "6.8 km / 4.2 mi",
        hours: "3–4 hrs",
        elevation: "3,860 m (+430 m)",
        details: "A leisurely morning trek passing water-driven prayer wheels and long carved mani walls. Taste fresh yak cheese at the famous Swiss-built dairy."
      },
      {
        day: "05",
        title: "Kyanjin Ri or Tserko Ri Summit Day",
        from: "Kyanjin Gompa (3,860m)",
        to: "Kyanjin Ri (4,773m) or Tserko Ri (4,984m)",
        stay: "Yak Hotel, Kyanjin Gompa",
        distance: "8 km round-trip",
        hours: "5–7 hrs",
        elevation: "4,773m / 4,984 m peak",
        details: "Early climb up the steep switchbacks of Kyanjin Ri. Behold the immense amphitheatre of Langtang Lirung, Kinshung, and glaciers flowing into Tibet."
      },
      {
        day: "06–08",
        title: "Descend to Syabrubesi & Return to Kathmandu",
        from: "Kyanjin Gompa",
        to: "Kathmandu via Syabrubesi",
        stay: "Kathmandu Hotel",
        distance: "32 km trek + drive",
        hours: "Downhill trek & 6 hrs drive",
        elevation: "1,400 m in Kathmandu",
        details: "Retrace your steps down the serene valley with quick descents, driving back to Kathmandu for a farewell celebration."
      }
    ],
    highlights: [
      "Ascending Kyanjin Ri (4,773m) for panoramic vistas of Langtang Lirung and Tibetan peaks",
      "Sampling fresh organic alpine yak cheese at the historic Kyanjin cheese factory",
      "Rich Tamang Tibetan-influenced culture, ornate wooden architecture, and sacred gompas",
      "Spotting rare wildlife in Langtang National Park including musk deer, monal, and red pandas",
      "Less crowded trails offering genuine peace and intimate conversations with local teahouse owners"
    ],
    included: [
      "Govt. certified Sherpa / Tamang licensed mountain guide",
      "Porters for luggage transportation (1 porter per 2 trekkers)",
      "Langtang National Park entry permit and TIMS registration card",
      "Private overland transportation (Kathmandu ⇄ Syabrubesi ⇄ Kathmandu)",
      "All teahouse lodge accommodations during the trek (5 nights)",
      "All meals on the trek (Breakfast, Lunch, Dinner with tea/coffee)",
      "Comprehensive medical first aid kit"
    ],
    excluded: [
      "Nepal tourist visa & international airfare",
      "Travel and medical evacuation insurance",
      "Personal gear and clothing",
      "Hot showers, Wi-Fi, and electronics charging fees in teahouses",
      "Gratuities for guide and porters"
    ],
    expenses: {
      packageRate: 860,
      permitsAndFlights: "Permits and overland transport included",
      lodgingAndMeals: "Lodges & 3 meals included",
      dailyIncidentalEstimate: "$8 – $15 per day",
      gearRentalOption: "$1.50 / day for sleeping bag",
      recommendedTipping: "$8–$10 / day shared"
    },
    sherpaTip:
      "Langtang cheese tastes incredible melted into your evening dal bhat or flatbread. Take time to sit with the elders at Kyanjin Gompa and listen to their stories."
  },
  {
    slug: "manaslu-circuit",
    title: "Manaslu Circuit & Larkya La Pass",
    region: "Manaslu",
    location: "Manaslu Conservation Area · Gorkha District, Nepal",
    duration: 16,
    difficulty: "Challenging",
    elevation: 5106,
    elevationFt: 16752,
    distance: "177 km / 110 mi",
    price: 2150,
    rating: 4.97,
    reviewCount: 84,
    season: ["Spring", "Autumn"],
    scenery: ["Remote Wilderness", "High Passes", "Tibetan Culture"],
    interests: ["Remote", "Challenging", "High Altitude"],
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1500&q=85",
    imageAlt: "A remote untouched mountain landscape with layered ridgelines around Mount Manaslu",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1500&q=85",
        alt: "The awe-inspiring double peak of Mount Manaslu, the Mountain of the Spirit",
        caption: "Mount Manaslu (8,163m) — the eighth highest mountain in the world"
      },
      {
        url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=85",
        alt: "Dramatic cantilevered suspension bridge in the deep Budhi Gandaki gorge",
        caption: "Carved cliffs and daring suspension footbridges over the roaring Budhi Gandaki"
      },
      {
        url: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?auto=format&fit=crop&w=1200&q=85",
        alt: "Samagaun village with ancient Tibetan stone houses and mountain backdrop",
        caption: "Samagaun (3,530m) — pure Tibetan culture untouched by modern commercialism"
      },
      {
        url: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=1200&q=85",
        alt: "Trekkers crossing the snowy summit ridge of Larkya La Pass at dawn",
        caption: "Crossing the dramatic Larkya La Pass (5,106m) into the Annapurna basin"
      }
    ],
    description:
      "Circle the monumental Manaslu massif through remote restricted valleys, ancient Tibetan villages, and cross the formidable Larkya La Pass on a guided expedition.",
    introduction:
      "Considered the ultimate alternative to the crowded circuits. A true wilderness expedition requiring restricted area permits, where medieval Tibetan lifestyle survives intact along the ancient salt trading route to Tibet.",
    routeOverview: [
      "Kathmandu (1,400m)",
      "Machha Khola (900m)",
      "Jagat (1,410m)",
      "Deng (1,800m)",
      "Namrung (2,660m)",
      "Samagaun (3,530m)",
      "Samdo (3,860m)",
      "Dharamsala (4,480m)",
      "Larkya La Pass (5,106m)",
      "Bhimtang (3,720m)"
    ],
    itinerary: [
      {
        day: "01–02",
        title: "Overland Drive into Gorkha & Trailhead",
        from: "Kathmandu",
        to: "Machha Khola (900m)",
        stay: "Riverside Lodge, Machha Khola",
        distance: "160 km jeep drive",
        hours: "8–9 hrs drive",
        elevation: "900 m",
        details: "Travel through historical Gorkha district along rugged dirt roads following the Budhi Gandaki river to start the trek."
      },
      {
        day: "03–05",
        title: "Deep River Gorges: Jagat to Deng & Namrung",
        from: "Machha Khola (900m)",
        to: "Namrung (2,660m)",
        stay: "Village Guesthouse, Namrung",
        distance: "38 km over 3 days",
        hours: "6 hrs per day",
        elevation: "2,660 m",
        details: "Ascend carved cliff faces, cross cantilevered bridges, pass through the checkpoint at Jagat, and enter Nubri Tibetan cultural territory."
      },
      {
        day: "06–08",
        title: "Upper Nubri Valley to Samagaun",
        from: "Namrung (2,660m)",
        to: "Samagaun (3,530m)",
        stay: "Mount Manaslu Lodge, Samagaun",
        distance: "21 km over 2 days",
        hours: "5 hrs per day",
        elevation: "3,530 m",
        details: "Wide alpine pastures unfold beneath the colossal north face of Manaslu. Explore Pungyen Gompa and ancient Birendra Lake."
      },
      {
        day: "09–10",
        title: "Acclimatization & Tibetan Border at Samdo",
        from: "Samagaun (3,530m)",
        to: "Samdo (3,860m)",
        stay: "Yak Lodge, Samdo",
        distance: "8 km",
        hours: "3.5 hrs",
        elevation: "3,860 m",
        details: "Walk to Samdo, the highest permanent village on the circuit, just miles from the Tibetan border. Rest and acclimatize thoroughly."
      },
      {
        day: "11",
        title: "Ascent to High Camp (Dharamsala)",
        from: "Samdo (3,860m)",
        to: "Dharamsala / Larkya Phedi (4,480m)",
        stay: "Mountain Shelter, Dharamsala",
        distance: "7 km",
        hours: "4 hrs",
        elevation: "4,480 m (+620 m)",
        details: "Climb past old trade market sites onto the barren moraine. Early dinner and rest before tomorrow's big pass."
      },
      {
        day: "12",
        title: "Crossing the Larkya La Pass (5,106m) to Bhimtang",
        from: "Dharamsala (4,480m)",
        to: "Bhimtang (3,720m) via Larkya La (5,106m)",
        stay: "Valley View Lodge, Bhimtang",
        distance: "16 km",
        hours: "8–9 hrs",
        elevation: "5,106 m pass (-1,386 m descent)",
        details: "Step into the frozen dawn by 4:00 AM. Cross lateral glacial moraines to reach the prayer-flag-strewn pass. Marvel at Himlung Himal, Cheo Himal, and Annapurna II."
      },
      {
        day: "13–16",
        title: "Descend into Annapurna Basin & Return",
        from: "Bhimtang (3,720m)",
        to: "Kathmandu via Dharapani & Besisahar",
        stay: "Heritage Hotel, Kathmandu",
        distance: "35 km trek + drive",
        hours: "Trek & jeep travel",
        elevation: "1,400 m in Kathmandu",
        details: "Follow the Dudh Khola down through rhododendron forests into Dharapani, joining the Annapurna road for the drive back to Kathmandu."
      }
    ],
    highlights: [
      "Conquering the snow-clad Larkya La Pass (5,106m) with views across the Tibetan plateau",
      "Close-up encounters with Mount Manaslu (8,163m), the 8th highest summit on earth",
      "Authentic, uncommercialized Tibetan Nubri culture and centuries-old monasteries",
      "Remote wilderness trails requiring special restricted permits (minimum 2 trekkers + guide)",
      "Dramatic geological changes from subtropical river gorges to glaciated high alpine passes"
    ],
    included: [
      "Govt. licensed senior trekking guide and experienced porter crew",
      "Special Manaslu Restricted Area Permit (RAP), MCAP, and ACAP permits",
      "TIMS registration and all local administrative fees",
      "Private 4WD Scorpio jeep transport (Kathmandu ⇄ Machha Khola / Dharapani)",
      "All teahouse lodge accommodations during the trek (13 nights)",
      "2 nights Kathmandu hotel accommodation with breakfast",
      "3 meals daily on trek (Breakfast, Lunch, Dinner with hot drinks)",
      "Pulse oximeter for daily acclimatization monitoring"
    ],
    excluded: [
      "Nepal tourist visa and international flights",
      "Mandatory high-altitude emergency rescue and travel insurance",
      "Personal trekking gear and warm sleeping bag",
      "Personal expenses (hot showers, device charging, battery packs, snacks)",
      "Guide and porter tips"
    ],
    expenses: {
      packageRate: 2150,
      permitsAndFlights: "Restricted permits & 4WD jeep transfers included",
      lodgingAndMeals: "Lodges & 3 meals included",
      dailyIncidentalEstimate: "$12 – $20 per day on trail",
      gearRentalOption: "$2.00 / day for warm gear in Kathmandu",
      recommendedTipping: "$10–$15 / day shared"
    },
    sherpaTip:
      "Crossing Larkya La requires grit and an early start. Pack microspikes in your daypack, keep your water bottle inside your jacket so it doesn't freeze, and step with confidence."
  },
  {
    slug: "poon-hill",
    title: "Poon Hill & Ghorepani Sunrise",
    region: "Annapurna",
    location: "Lower Annapurna · Myagdi & Kaski Districts, Nepal",
    duration: 5,
    difficulty: "Easy",
    elevation: 3210,
    elevationFt: 10531,
    distance: "48 km / 30 mi",
    price: 520,
    rating: 4.89,
    reviewCount: 215,
    season: ["Spring", "Autumn", "Winter"],
    scenery: ["High peaks", "Rhododendron Forest", "Sunrise Panorama"],
    interests: ["Culture", "Photography", "Family Friendly"],
    image:
      "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1500&q=85",
    imageAlt: "Golden sunrise spilling over layered mountain ridgelines at Poon Hill",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1500&q=85",
        alt: "Sunrise hitting the peaks of Dhaulagiri and Annapurna from Poon Hill",
        caption: "Golden hour over the Annapurna and Dhaulagiri ranges from Poon Hill (3,210m)"
      },
      {
        url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=85",
        alt: "The blue rooftops of Ghorepani village tucked against the forested hillside",
        caption: "Ghorepani village — famous for its blue roofs, warm bakeries, and Gurung teahouses"
      },
      {
        url: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=85",
        alt: "Lush mossy rhododendron trees in bloom",
        caption: "Walking beneath world-famous blooming rhododendron canopies in spring"
      },
      {
        url: "https://images.unsplash.com/photo-1516214104703-d870798883c5?auto=format&fit=crop&w=1200&q=85",
        alt: "Dhaulagiri giant in pure crystalline light",
        caption: "Dhaulagiri I (8,167m) towering above the Kali Gandaki gorge"
      }
    ],
    description:
      "A shorter foothill walk through ancient rhododendron forests to a celebrated sunrise outlook over the Annapurna and Dhaulagiri mountain massifs.",
    introduction:
      "The quintessential introduction to Himalayan trekking. Gentle, culturally rich, and requiring no prior mountaineering experience, this trek offers world-class sunrise views without extreme altitude risks.",
    routeOverview: [
      "Pokhara (820m)",
      "Tikhedhunga / Ulleri (2,050m)",
      "Ghorepani (2,874m)",
      "Poon Hill (3,210m)",
      "Ghandruk (1,940m)",
      "Pokhara (820m)"
    ],
    itinerary: [
      {
        day: "01",
        title: "Drive from Pokhara to Nayapul · Trek to Ulleri",
        from: "Pokhara (820m)",
        to: "Ulleri (2,050m)",
        stay: "Super View Lodge, Ulleri",
        distance: "11 km / 6.8 mi",
        hours: "4–5 hrs",
        elevation: "2,050 m",
        details: "Drive from Pokhara to Nayapul and begin along the Modi Khola before climbing the stone steps of Ulleri village."
      },
      {
        day: "02",
        title: "Trek through Rhododendron Woods to Ghorepani",
        from: "Ulleri (2,050m)",
        to: "Ghorepani (2,874m)",
        stay: "Sunny Lodge, Ghorepani",
        distance: "9 km / 5.6 mi",
        hours: "4 hrs",
        elevation: "2,874 m (+824 m)",
        details: "Enjoy a scenic climb under fairy-tale forest canopies, listening to babbling mountain brooks until reaching Ghorepani."
      },
      {
        day: "03",
        title: "Poon Hill Sunrise & Trek to Tadapani",
        from: "Ghorepani (2,874m)",
        to: "Tadapani (2,630m) via Poon Hill (3,210m)",
        stay: "Himalayan View Lodge, Tadapani",
        distance: "10 km / 6.2 mi",
        hours: "5–6 hrs",
        elevation: "3,210 m viewpoint",
        details: "Wake before dawn to climb Poon Hill. Watch sunrise set fire to Dhaulagiri, Annapurna I, and Machhapuchhre."
      },
      {
        day: "04",
        title: "Trek to Heritage Village of Ghandruk",
        from: "Tadapani (2,630m)",
        to: "Ghandruk (1,940m)",
        stay: "Gurung Heritage Teahouse, Ghandruk",
        distance: "8 km / 5 mi",
        hours: "3.5 hrs",
        elevation: "1,940 m",
        details: "A relaxed walk down into Ghandruk, the cultural epicenter of Gurung traditions, slate-roofed homes, and local museums."
      },
      {
        day: "05",
        title: "Descend to Nayapul & Drive to Pokhara",
        from: "Ghandruk (1,940m)",
        to: "Pokhara Lakeside (820m)",
        stay: "Hotel in Pokhara",
        distance: "6 km walk + 1.5 hr drive",
        hours: "2.5 hrs walk",
        elevation: "820 m",
        details: "Descend gentle valley paths to Nayapul and catch private transport back to Lakeside Pokhara for a relaxing lakeside dinner."
      }
    ],
    highlights: [
      "Witnessing iconic golden sunrise from Poon Hill (3,210m) over Dhaulagiri and Annapurna",
      "Wandering through the largest rhododendron forest in the Himalayas",
      "Experiencing traditional Gurung culture, slate-roofed homes, and warm hospitality in Ghandruk",
      "Low risk of altitude sickness — perfect for beginners, solo travelers, and families",
      "Fresh apple pies and cozy bakery evenings in Ghorepani"
    ],
    included: [
      "Licensed English-speaking professional guide",
      "Experienced porter (1 for 2 trekkers)",
      "Annapurna Conservation Area Project (ACAP) permit and TIMS card",
      "Private car/van transport from Pokhara to Nayapul and return",
      "4 nights comfortable teahouse lodge accommodations",
      "All meals on trek (Breakfast, Lunch, Dinner) + hot tea",
      "Medical first aid kit"
    ],
    excluded: [
      "Pokhara hotel accommodations before/after trek",
      "Travel insurance",
      "Personal gear and clothing",
      "Hot showers, Wi-Fi, and electronic device charging fees",
      "Tips for guide and porter"
    ],
    expenses: {
      packageRate: 520,
      permitsAndFlights: "ACAP & TIMS included",
      lodgingAndMeals: "All lodges & 3 meals included",
      dailyIncidentalEstimate: "$6 – $12 per day",
      gearRentalOption: "$1.00 / day for poles and sleeping bag",
      recommendedTipping: "$6–$8 / day shared"
    },
    sherpaTip:
      "Wear warm layers and gloves for the 45-minute early morning walk to Poon Hill. Once the sun crests the peaks, the temperature rises rapidly!"
  },
  {
    slug: "gokyo-lakes",
    title: "Gokyo Lakes & Gokyo Ri",
    region: "Khumbu",
    location: "Khumbu · Sagarmatha National Park, Nepal",
    duration: 12,
    difficulty: "Challenging",
    elevation: 5357,
    elevationFt: 17575,
    distance: "110 km / 68 mi",
    price: 1690,
    rating: 4.96,
    reviewCount: 124,
    season: ["Spring", "Autumn"],
    scenery: ["Turquoise Glacial Lakes", "Ngozumpa Glacier", "High Peaks"],
    interests: ["Photography", "Remote", "High Altitude"],
    image:
      "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1500&q=85",
    imageAlt: "Pristine turquoise alpine glacial lake nestled beneath snowy Himalayan peaks",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1500&q=85",
        alt: "The vibrant turquoise waters of the third sacred Gokyo Lake",
        caption: "Gokyo Lake (Dudh Pokhari, 4,750m) reflecting snowy peaks"
      },
      {
        url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=1200&q=85",
        alt: "Looking over the immense Ngozumpa Glacier from Gokyo Ri",
        caption: "Ngozumpa Glacier — the longest glacier in the entire Himalayas"
      },
      {
        url: "https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?auto=format&fit=crop&w=1200&q=85",
        alt: "Stone lodges on the shore of Gokyo lake with dusting of fresh snow",
        caption: "Tranquil stone lodges of Gokyo village beside the glacial waters"
      },
      {
        url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=85",
        alt: "Panorama of Everest, Lhotse, Makalu, and Cho Oyu from Gokyo Ri summit",
        caption: "Four 8,000m giants in one sweeping panorama from Gokyo Ri (5,357m)"
      }
    ],
    description:
      "Explore a quieter Khumbu route to the turquoise glacial lakes below Gokyo Ri, overlooking the colossal Ngozumpa Glacier and four 8,000-meter giants.",
    introduction:
      "Many Himalayan veterans consider Gokyo to surpass Everest Base Camp in visual majesty. Standing on Gokyo Ri, you behold Cho Oyu, Everest, Lhotse, and Makalu lined up across an endless icy horizon above six sacred emerald lakes.",
    routeOverview: [
      "Lukla (2,860m)",
      "Namche Bazaar (3,440m)",
      "Dole (4,200m)",
      "Machhermo (4,470m)",
      "Gokyo (4,750m)",
      "Gokyo Ri (5,357m)"
    ],
    itinerary: [
      {
        day: "01–03",
        title: "Fly to Lukla & Acclimatize in Namche",
        from: "Lukla (2,860m)",
        to: "Namche Bazaar (3,440m)",
        stay: "Khumbu Lodge, Namche",
        distance: "18 km over 2 days",
        hours: "4–5 hrs per day",
        elevation: "3,440 m",
        details: "Enter the Khumbu valley, trace the Dudh Koshi, and take essential acclimatization hikes around Namche Bazaar."
      },
      {
        day: "04",
        title: "Branch onto the Quiet Gokyo Valley to Dole",
        from: "Namche Bazaar (3,440m)",
        to: "Dole (4,200m)",
        stay: "Dole Mountain Lodge, Dole",
        distance: "11 km / 6.8 mi",
        hours: "5–6 hrs",
        elevation: "4,200 m (+760 m)",
        details: "Turn off the main Everest highway onto quiet ridgeways. Climb through birch forests to Mong La before descending into Dole."
      },
      {
        day: "05",
        title: "Ascend the High Valley to Machhermo",
        from: "Dole (4,200m)",
        to: "Machhermo (4,470m)",
        stay: "Namgyal Lodge, Machhermo",
        distance: "7 km / 4.3 mi",
        hours: "4 hrs",
        elevation: "4,470 m (+270 m)",
        details: "Contour high above the valley floor with magnificent vistas of Cho Oyu. Attend the daily high-altitude medical briefing in Machhermo."
      },
      {
        day: "06",
        title: "Trek past the Sacred Lakes to Gokyo",
        from: "Machhermo (4,470m)",
        to: "Gokyo Village (4,750m)",
        stay: "Gokyo Resort, Gokyo",
        distance: "8.5 km / 5.3 mi",
        hours: "4–5 hrs",
        elevation: "4,750 m (+280 m)",
        details: "Pass the first and second emerald glacial lakes before reaching the village of Gokyo on the shore of the third lake (Dudh Pokhari)."
      },
      {
        day: "07",
        title: "Gokyo Ri Summit (5,357m) & Scoundrel's Viewpoint",
        from: "Gokyo (4,750m)",
        to: "Gokyo Ri (5,357m) & return",
        stay: "Gokyo Resort, Gokyo",
        distance: "6 km round-trip",
        hours: "4–5 hrs",
        elevation: "5,357 m summit",
        details: "Climb Gokyo Ri for sunrise: marvel at four of the world's 14 eight-thousanders — Everest, Lhotse, Makalu, and Cho Oyu."
      },
      {
        day: "08–12",
        title: "Descend to Lukla & Fly to Kathmandu",
        from: "Gokyo (4,750m)",
        to: "Kathmandu via Lukla",
        stay: "Heritage Hotel, Kathmandu",
        distance: "45 km trek + flight",
        hours: "5 hrs per day",
        elevation: "1,400 m in Kathmandu",
        details: "Descend at a leisurely pace through Phortse or Dole, celebrating completion in Lukla before flying back to Kathmandu."
      }
    ],
    highlights: [
      "Standing on Gokyo Ri (5,357m) with unobstructed panoramas of 4 eight-thousanders",
      "Six sacred high-altitude glacial lakes shimmering in vivid turquoise hues",
      "Overlooking the immense Ngozumpa Glacier, the largest in the Nepal Himalaya",
      "Significantly less crowded trails than the classic Everest Base Camp route",
      "Cozy teahouses perched right on the lakeshore"
    ],
    included: [
      "Experienced certified Sherpa mountain guide",
      "Sherpa porters (1 porter for 2 trekkers)",
      "Sagarmatha National Park entry permit and TIMS card",
      "Domestic flights (Kathmandu/Ramechhap ⇄ Lukla ⇄ Kathmandu)",
      "All twin-share teahouse lodge accommodations on trek (9 nights)",
      "2 nights Kathmandu hotel accommodation with breakfast",
      "3 meals daily on trek (Breakfast, Lunch, Dinner) + fresh fruit and tea"
    ],
    excluded: [
      "Nepal tourist entry visa and international flights",
      "High altitude travel and helicopter evacuation insurance",
      "Personal trekking gear and warm sleeping bag",
      "Hot showers, Wi-Fi cards, and device charging",
      "Tips for guide and porter team"
    ],
    expenses: {
      packageRate: 1690,
      permitsAndFlights: "Permits & Lukla mountain flights included",
      lodgingAndMeals: "Lodges & 3 meals included",
      dailyIncidentalEstimate: "$15 – $22 per day",
      gearRentalOption: "$2.00 / day for warm sleeping bag",
      recommendedTipping: "$10–$14 / day shared"
    },
    sherpaTip:
      "The reflection on Gokyo Lake is purest before 9:00 AM before the valley wind stirs the water. Wake early, step outside, and watch the peaks mirrored upside down in glass."
  },
  {
    slug: "gosainkunda-lakes",
    title: "Gosainkunda Sacred Lakes",
    region: "Langtang",
    location: "Langtang National Park · Rasuwa District, Nepal",
    duration: 7,
    difficulty: "Moderate",
    elevation: 4380,
    elevationFt: 14370,
    distance: "55 km / 34 mi",
    price: 780,
    rating: 4.91,
    reviewCount: 78,
    season: ["Spring", "Autumn"],
    scenery: ["Sacred Alpine Lakes", "Rhododendron Ridges", "High Passes"],
    interests: ["Culture", "Pilgrimage", "Quiet Trails"],
    image:
      "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1500&q=85",
    imageAlt: "High alpine sacred lake surrounded by rugged craggy mountain ridges",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1500&q=85",
        alt: "The sacred glacial waters of Gosainkunda Lake surrounded by rocky mountain spurs",
        caption: "Gosainkunda Sacred Lake (4,380m) — revered by both Hindus and Buddhists"
      },
      {
        url: "https://images.unsplash.com/photo-1508873696983-2df5293cb32b?auto=format&fit=crop&w=1200&q=85",
        alt: "Sunlight glistening over the cluster of glacial lakes at Lauribina Pass",
        caption: "Bhairav Kunda and Saraswati Kunda clustered along the high ridge"
      },
      {
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
        alt: "Lauribina Yak viewpoint looking out across the Annapurna and Ganesh Himal",
        caption: "Lauribina Yak ridge offering sweeping views from Ganesh Himal to Annapurna"
      },
      {
        url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1200&q=85",
        alt: "Misty rhododendron forests clinging to dramatic Himalayan hillside",
        caption: "Walking through ancient mossy oak and rhododendron woodlands"
      }
    ],
    description:
      "A revered pilgrimage route to pristine holy alpine lakes cradled in the high ridges of Langtang, offering dramatic panoramas of Ganesh Himal and Langtang Lirung.",
    introduction:
      "Legend tells that Lord Shiva thrust his holy trident into the mountainside to create Gosainkunda. Trekkers journey through rich Tamang villages and high alpine scrub to sit beside these glassy, sacred blue waters.",
    routeOverview: [
      "Kathmandu (1,400m)",
      "Dhunche (1,960m)",
      "Chandanbari / Sing Gompa (3,330m)",
      "Lauribina (3,910m)",
      "Gosainkunda Lakes (4,380m)",
      "Surya Peak (5,145m)"
    ],
    itinerary: [
      {
        day: "01",
        title: "Overland Drive from Kathmandu to Dhunche",
        from: "Kathmandu (1,400m)",
        to: "Dhunche (1,960m)",
        stay: "Rasuwa Lodge, Dhunche",
        distance: "115 km drive",
        hours: "6 hrs drive",
        elevation: "1,960 m",
        details: "Drive north across the Trishuli valley to Dhunche, the administrative headquarters of Rasuwa."
      },
      {
        day: "02",
        title: "Climb through Pine Forest to Sing Gompa",
        from: "Dhunche (1,960m)",
        to: "Chandanbari / Sing Gompa (3,330m)",
        stay: "Sing Gompa Teahouse",
        distance: "8 km",
        hours: "4–5 hrs",
        elevation: "3,330 m (+1,370 m)",
        details: "Ascend steadily through pine and rhododendron woods. Visit the historic monastery and local yak cheese factory."
      },
      {
        day: "03",
        title: "Ridge Walk to Lauribina Viewpoint",
        from: "Sing Gompa (3,330m)",
        to: "Lauribina (3,910m)",
        stay: "Lauribina Viewpoint Lodge",
        distance: "6.5 km",
        hours: "3–4 hrs",
        elevation: "3,910 m (+580 m)",
        details: "Climb out of the tree line onto the exposed ridge of Lauribina Yak. Enjoy sunset over the Ganesh and Manaslu ranges."
      },
      {
        day: "04",
        title: "Sacred Gosainkunda Lakes (4,380m)",
        from: "Lauribina (3,910m)",
        to: "Gosainkunda Lake (4,380m)",
        stay: "Lakeside Teahouse, Gosainkunda",
        distance: "5 km",
        hours: "3 hrs",
        elevation: "4,380 m (+470 m)",
        details: "Pass Saraswati Kunda and Bhairav Kunda into the sacred bowl of Gosainkunda. Take time for contemplation beside the holy lake."
      },
      {
        day: "05",
        title: "Explore Surya Peak & High Ridges",
        from: "Gosainkunda (4,380m)",
        to: "Surya Peak Viewpoint (4,750m) & return",
        stay: "Lakeside Teahouse, Gosainkunda",
        distance: "6 km round-trip",
        hours: "4 hrs",
        elevation: "4,750 m",
        details: "Hike up toward the Lauribina Pass and Surya Peak for bird's-eye views across the Tibetan borderlands."
      },
      {
        day: "06–07",
        title: "Descend to Dhunche & Return to Kathmandu",
        from: "Gosainkunda (4,380m)",
        to: "Kathmandu via Dhunche",
        stay: "Heritage Hotel, Kathmandu",
        distance: "20 km walk + drive",
        hours: "Downhill trek & 6 hrs drive",
        elevation: "1,400 m in Kathmandu",
        details: "Rapid descent through Sing Gompa to Dhunche, followed by a comfortable private drive back to Kathmandu."
      }
    ],
    highlights: [
      "Visiting the sacred high-altitude alpine lake of Gosainkunda (4,380m)",
      "Unrivaled sunsets from Lauribina overlooking Ganesh Himal, Manaslu, and Langtang",
      "Touring the local cheese dairy and Buddhist monastery at Sing Gompa",
      "Deeply peaceful spiritual ambiance without heavy tourist congestion",
      "Short 7-day duration easily fitting compact travel schedules"
    ],
    included: [
      "Certified local mountain guide",
      "Porters (1 for 2 trekkers)",
      "Langtang National Park permit and TIMS registration",
      "Private overland vehicle transport from Kathmandu to Dhunche and back",
      "All teahouse lodge accommodations on trek (5 nights)",
      "All meals on trek (Breakfast, Lunch, Dinner with hot drinks)"
    ],
    excluded: [
      "Kathmandu accommodations and meals",
      "Emergency evacuation and medical insurance",
      "Hot showers and device battery charging",
      "Tips for guide and porter"
    ],
    expenses: {
      packageRate: 780,
      permitsAndFlights: "Permits & private overland transfer included",
      lodgingAndMeals: "All lodges & 3 meals included",
      dailyIncidentalEstimate: "$8 – $14 per day",
      gearRentalOption: "$1.50 / day for warm gear",
      recommendedTipping: "$7–$10 / day shared"
    },
    sherpaTip:
      "Because you gain altitude fairly quickly from Dhunche to Lauribina, sleep at Sing Gompa and don't rush. The cheese from Sing Gompa makes an incredible trail snack!"
  },
  {
    slug: "annapurna-circuit",
    title: "Annapurna Circuit & Thorong La Pass",
    region: "Annapurna",
    location: "Manang & Mustang Districts, Annapurna Range, Nepal",
    duration: 15,
    difficulty: "Challenging",
    elevation: 5416,
    elevationFt: 17769,
    distance: "160 km / 99 mi",
    price: 1580,
    rating: 4.94,
    reviewCount: 172,
    season: ["Spring", "Autumn"],
    scenery: ["Desert Canyons", "High Pass", "Subtropical Terraces"],
    interests: ["Epic Crossing", "High Altitude", "Culture"],
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1500&q=85",
    imageAlt: "Sweeping view of arid Tibetan plateau valleys against jagged snow peaks on the Annapurna Circuit",
    gallery: [
      {
        url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1500&q=85",
        alt: "The immense sweep of the Annapurna Circuit passing from lush valleys to arid plateau",
        caption: "The ever-shifting geography of the classic Annapurna Circuit"
      },
      {
        url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=85",
        alt: "Crossing the high snowy pass of Thorong La with Tibetan prayer flags",
        caption: "At the summit of Thorong La Pass (5,416m) — the highest point of the circuit"
      },
      {
        url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=85",
        alt: "Manang valley stone houses with drying crops and prayer wheels",
        caption: "Manang village (3,540m) nestled against the glaciers of Annapurna III and Gangapurna"
      },
      {
        url: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1200&q=85",
        alt: "Muktinath holy temple in the arid Mustang valley",
        caption: "Muktinath sacred shrine (3,800m) where sacred natural gas flames burn on water"
      }
    ],
    description:
      "The definitive Himalayan journey through shifting microclimates, from lush green subtropical hills to the windswept Tibetan plateau and over the 5,416m Thorong La Pass.",
    introduction:
      "Recognized globally as one of the world's premier classic treks. Start among waterfalls and banana groves in the lower valley, ascend through pine forests into the Tibetan Buddhist realm of Manang, and cross the legendary Thorong La into sacred Mustang.",
    routeOverview: [
      "Kathmandu (1,400m)",
      "Besisahar / Chame (2,670m)",
      "Pisang (3,200m)",
      "Manang (3,540m)",
      "Yak Kharka (4,050m)",
      "Thorong Phedi (4,525m)",
      "Thorong La Pass (5,416m)",
      "Muktinath (3,760m)",
      "Jomsom / Pokhara (820m)"
    ],
    itinerary: [
      {
        day: "01–03",
        title: "Drive to Chame & Trek to Pisang",
        from: "Kathmandu",
        to: "Upper Pisang (3,300m)",
        stay: "Pisang Peak Lodge, Pisang",
        distance: "Jeep drive + 14 km trek",
        hours: "Jeep + 5 hrs trek",
        elevation: "3,300 m",
        details: "Overland drive to Chame before climbing through fragrant pine forests beneath the colossal curved rock face of Paungda Danda."
      },
      {
        day: "04–06",
        title: "Upper Trail to Manang & Acclimatization",
        from: "Upper Pisang (3,300m)",
        to: "Manang (3,540m)",
        stay: "Tilicho Hotel, Manang",
        distance: "19 km over 2 days",
        hours: "6 hrs",
        elevation: "3,540 m",
        details: "Take the high trail via Ghyaru for breathtaking vistas of Annapurna II and IV. Spend a rest day in Manang exploring Gangapurna Lake."
      },
      {
        day: "07–09",
        title: "Yak Kharka to Thorong High Camp",
        from: "Manang (3,540m)",
        to: "Thorong High Camp (4,850m)",
        stay: "High Camp Lodge",
        distance: "16 km over 2 days",
        hours: "4 hrs per day",
        elevation: "4,850 m (+1,310 m)",
        details: "Ascend past grazing yaks to Yak Kharka, continuing to Thorong High Camp perched on the steep approach to the pass."
      },
      {
        day: "10",
        title: "Conquer Thorong La Pass (5,416m) to Muktinath",
        from: "Thorong High Camp (4,850m)",
        to: "Muktinath (3,760m) via Thorong La",
        stay: "Bob Marley Lodge, Muktinath",
        distance: "14 km",
        hours: "8–9 hrs",
        elevation: "5,416 m pass (-1,656 m descent)",
        details: "Begin in the freezing dark at 4:30 AM. Reach the prayer flags of Thorong La as the morning sun illuminates Dhaulagiri. Descend to the holy shrine of Muktinath."
      },
      {
        day: "11–15",
        title: "Descend Kali Gandaki Gorge to Pokhara & Kathmandu",
        from: "Muktinath (3,760m)",
        to: "Kathmandu via Jomsom & Pokhara",
        stay: "Boutique Hotel, Pokhara & Kathmandu",
        distance: "Overland transfers & flight",
        hours: "Varied",
        elevation: "820 m in Pokhara",
        details: "Travel through the deepest river gorge in the world (Kali Gandaki), relax by the lake in Pokhara, and return to Kathmandu."
      }
    ],
    highlights: [
      "Crossing Thorong La Pass at 5,416m (17,769ft), one of the world's highest trekking passes",
      "Witnessing extreme ecological transitions from subtropical rice paddies to semi-arid Tibetan plateaus",
      "Exploring the historic Buddhist enclaves and ancient monasteries of Manang and Braga",
      "Visiting the sacred multi-faith pilgrimage temple of Muktinath",
      "Resting beside serene Phewa Lake in Pokhara after crossing the pass"
    ],
    included: [
      "Licensed English-speaking certified mountain guide",
      "Experienced porters (1 porter for 2 trekkers, 20kg max)",
      "Annapurna Conservation Area Project (ACAP) permit and TIMS card",
      "All ground transportation (private jeep/tourist bus)",
      "Domestic flight from Jomsom to Pokhara (or overland 4WD alternative)",
      "All teahouse lodge accommodations on the circuit (11 nights)",
      "2 nights hotel in Pokhara and 1 night in Kathmandu",
      "3 meals daily on trek (Breakfast, Lunch, Dinner) + fresh fruit"
    ],
    excluded: [
      "International flights and Nepal entry visa",
      "High altitude emergency evacuation insurance",
      "Personal trekking clothing and gear",
      "Incidentals (hot showers, charging, Wi-Fi, laundry)",
      "Guide and porter gratuities"
    ],
    expenses: {
      packageRate: 1580,
      permitsAndFlights: "Permits, ground transport & Jomsom-Pokhara flight included",
      lodgingAndMeals: "Lodges & 3 meals included",
      dailyIncidentalEstimate: "$12 – $20 per day",
      gearRentalOption: "$2.00 / day for warm gear",
      recommendedTipping: "$10–$14 / day shared"
    },
    sherpaTip:
      "Take the upper trail from Pisang through Ghyaru and Ngawal. It is steeper, but the panoramic views of the Annapurnas will leave you speechless."
  }
];

export const findTrek = (slug) => treks.find((trek) => trek.slug === slug);
