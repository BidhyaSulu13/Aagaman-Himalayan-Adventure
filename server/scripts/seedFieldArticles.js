import "dotenv/config";
import { connectDB } from "../src/config/db.js";
import { Article } from "../src/models/Article.js";
import { User } from "../src/models/User.js";

const adminArticles = [
  {
    slug: "tea-and-welcome-in-a-himalayan-home",
    title: "A Cup of Tea and a Himalayan Welcome",
    category: "Himalayan Culture & Life",
    summary: "A small cup of tea can open a window into hospitality, daily life, and the many communities along Nepal’s mountain trails.",
    coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1500&q=85",
    content: `Hospitality in the mountains is often shared in simple ways: a warm drink, a place beside the stove, and time to ask how the trail has been. Tea traditions differ across Nepal’s regions and households, shaped by local ingredients, climate, and family custom.\n\nTake your cue from your hosts. Accepting a drink with both hands, asking before photographing people, and learning a greeting are thoughtful ways to begin a conversation. A teahouse is also someone’s home and workplace, so patience and respect matter as much as good manners.`,
  },
  {
    slug: "reading-the-mani-walls-with-respect",
    title: "Reading the Mani Walls with Respect",
    category: "Himalayan Culture & Life",
    summary: "Stone inscriptions and prayer wheels are part of living Buddhist practice. Learn how to pass these sacred places respectfully.",
    coverImage: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1500&q=85",
    content: `Mani walls are built from stones inscribed with sacred phrases. They are not trail decorations: they hold religious meaning for the communities who care for them. On many routes, walkers traditionally pass a mani wall and chorten on the left, following the direction of ritual circumambulation.\n\nMove slowly near these sites, do not climb or sit on structures, and avoid touching or rearranging inscribed stones. If a local custom is unfamiliar, watch quietly or ask your guide. Respectful travel starts with recognizing that the trail passes through places where people pray and live.`,
  },
  {
    slug: "mountain-villages-through-the-seasons",
    title: "Mountain Villages Through the Seasons",
    category: "Himalayan Culture & Life",
    summary: "Village life follows planting, herding, school, and festival calendars as closely as it follows the weather.",
    coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1500&q=85",
    content: `A trekking route is also a route through working communities. In lower valleys, fields and orchards change with the agricultural calendar. Higher settlements balance trade, schooling, livestock, and tourism across short summers and long winters.\n\nTravelers can support this rhythm by buying local services, carrying reusable essentials, and leaving paths and water sources clean. Ask before entering private courtyards or taking portraits. A village is not a stage set; it is home, workplace, and community.`,
  },
  {
    slug: "what-a-teahouse-meal-tells-you",
    title: "What a Teahouse Meal Tells You",
    category: "Himalayan Culture & Life",
    summary: "Local menus reflect altitude, supply routes, and the practical realities of cooking far from the road.",
    coverImage: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1500&q=85",
    content: `A teahouse kitchen works with what can be grown nearby, carried in, or stored safely. Menus become simpler at higher elevations because every ingredient has traveled a long way. Dal bhat, soups, potatoes, and noodles are common because they are filling and practical for long walking days.\n\nOrdering local food when available helps reduce transport pressure and supports the people who host trekkers. Tell your guide about dietary needs early, and give kitchens time: meals are often prepared fresh for several guests using limited fuel and equipment.`,
  },
  {
    slug: "how-guides-build-a-steady-acclimatization-plan",
    title: "How Guides Build a Steady Acclimatization Plan",
    category: "Behind the Adventure",
    summary: "A safe itinerary is shaped by elevation gain, rest opportunities, group pace, and the judgment of experienced local staff.",
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1500&q=85",
    content: `A mountain itinerary is more than a list of overnight stops. Guides consider how quickly the route gains elevation, where the group can rest, the condition of the trail, and how each traveler is responding. Acclimatization days create room to adjust rather than forcing a fixed schedule.\n\nThe plan can change with weather, health, or trail conditions. Follow your guide’s pace, report symptoms early, and understand that turning around may be the safest decision. Good expedition planning leaves space for sound decisions on the mountain.`,
  },
  {
    slug: "the-work-behind-a-well-run-teahouse-trek",
    title: "The Work Behind a Well-Run Teahouse Trek",
    category: "Behind the Adventure",
    summary: "Guides, porters, lodge teams, and coordinators make a multi-day trek feel seamless through many small acts of preparation.",
    coverImage: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1500&q=85",
    content: `Before a group leaves each morning, the team checks the route, weather, water, and timing for the day. Porters organize loads, lodge hosts prepare rooms and meals, and guides keep track of the group’s pace and changing needs. Coordination continues after the walking ends.\n\nA fair trek treats every member of that team with respect. Ask your operator about safe load limits, appropriate equipment, insurance, and clear working conditions. The quality of a journey includes how the people who support it are treated.`,
  },
  {
    slug: "why-mountain-weather-changes-the-plan",
    title: "Why Mountain Weather Can Change the Plan",
    category: "Behind the Adventure",
    summary: "Cloud, wind, snow, and visibility can reshape the safest route or departure time, even when the forecast looked settled.",
    coverImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1500&q=85",
    content: `Weather in the Himalaya can vary sharply between valleys and ridgelines. A clear morning does not guarantee a pass will remain safe through the afternoon. Guides watch cloud build-up, wind, snowfall, and local reports, then compare those signs with the group’s condition and the route ahead.\n\nA delay or route change is a normal part of responsible mountain travel. Keep an extra layer accessible, protect electronics from moisture, and avoid treating a summit or pass as a deadline. Flexibility gives the team better options when conditions shift.`,
  },
  {
    slug: "from-booking-to-trailhead-the-expedition-checklist",
    title: "From Booking to Trailhead: The Expedition Checklist",
    category: "Behind the Adventure",
    summary: "Permits, transport, room plans, and equipment checks connect the booking desk to the first step on the trail.",
    coverImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1500&q=85",
    content: `A smooth start depends on details completed well before departure. Teams confirm permits and identification, check transport timing, review the group’s equipment, and make sure the route plan fits the season. Travelers can help by sharing accurate details and asking questions before arrival.\n\nKeep copies of essential documents, arrive with broken-in footwear, and confirm what is included in your trip. For permit rules and entry requirements, rely on current official guidance and your operator’s latest instructions because requirements can change.`,
  },
  {
    slug: "from-rhododendron-forests-to-alpine-meadows",
    title: "From Rhododendron Forests to Alpine Meadows",
    category: "Nature & Exploration",
    summary: "A day’s walk can cross several ecological zones, each with its own plants, climate, and pace of life.",
    coverImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1500&q=85",
    content: `Nepal’s trekking routes rise through changing habitats. Lower slopes may hold subtropical forest and farmland; higher trails pass temperate forests, rhododendron stands, and open alpine meadows. The transition is gradual, and small changes in shade, moisture, and exposure shape what can grow.\n\nWalk on established paths to protect fragile ground, especially above the tree line where plants recover slowly. Notice the landscape without collecting flowers, seeds, or stones. A careful observer leaves the route as they found it.`,
  },
  {
    slug: "watching-himalayan-birds-without-disturbing-them",
    title: "Watching Himalayan Birds Without Disturbing Them",
    category: "Nature & Exploration",
    summary: "Patient observation and quiet movement make it easier to notice birds along Nepal’s forest and high-altitude trails.",
    coverImage: "https://images.unsplash.com/photo-1444464666168-49d633b86797?auto=format&fit=crop&w=1500&q=85",
    content: `Birdlife changes with elevation and habitat. Forest edges, river corridors, and open slopes each offer different chances to observe wildlife. Early hours are often rewarding, but the best approach is simply to slow down and listen.\n\nUse binoculars rather than approaching nests or feeding animals. Keep voices low, avoid playback calls, and never leave food behind. A guide can help identify species while explaining how seasonal conditions affect what you may see.`,
  },
  {
    slug: "rivers-glaciers-and-the-valleys-between",
    title: "Rivers, Glaciers, and the Valleys Between",
    category: "Nature & Exploration",
    summary: "The rivers on a Himalayan trek connect snow and ice above with farms and settlements far below.",
    coverImage: "https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&w=1500&q=85",
    content: `Mountain rivers respond to snowmelt, monsoon rain, and the shape of the land. From a trail bridge, it is possible to see how water has cut through rock and carried sediment down-valley. The same river may look very different after a night of rain or during the drier months.\n\nStay behind barriers and away from unstable banks. Do not wash with soap directly in streams, and carry waste back to a proper disposal point. Clean water is essential to people and ecosystems along the route.`,
  },
  {
    slug: "leave-no-trace-on-a-high-mountain-trail",
    title: "Leave No Trace on a High Mountain Trail",
    category: "Nature & Exploration",
    summary: "Small choices about waste, water, and wildlife help keep busy trekking routes healthy for the communities who depend on them.",
    coverImage: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1500&q=85",
    content: `The most useful mountain habit is to bring less waste onto the trail. Refill a reusable bottle where safe water is available, decline unnecessary packaging, and carry wrappers until you reach a suitable bin. Never leave batteries, wipes, or food scraps behind.\n\nGive wildlife space and keep to established paths. Choose locally run lodges and follow your guide’s advice around water sources and protected areas. Responsible travel is a collection of ordinary decisions made consistently, not a single gesture.`,
  },
];

const additionalArticles = [
  {
    slug: "greetings-and-small-gestures-on-nepal-trails",
    title: "Greetings and Small Gestures on Nepal’s Trails",
    category: "Himalayan Culture & Life",
    summary: "A few thoughtful habits help travelers meet hosts and neighbors with curiosity and respect.",
    coverImage: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=1500&q=85",
    content: `A greeting is often the simplest way to begin a respectful exchange. Learn a local greeting when you can, give people time to respond, and follow your guide’s lead when entering a home, monastery, or community space. Customs vary between regions and households, so curiosity works best when it is paired with humility.\n\nAsk before photographing people or private spaces. Keep voices low around places of worship, and avoid treating ceremonies as performances. These small choices make room for genuine conversation while leaving local people in control of how they share their lives.`,
  },
  {
    slug: "festival-days-and-the-mountain-calendar",
    title: "Festival Days and the Mountain Calendar",
    category: "Himalayan Culture & Life",
    summary: "Community festivals follow local calendars and bring families together through ritual, music, food, and shared work.",
    coverImage: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1500&q=85",
    content: `Festivals across Nepal reflect many languages, faiths, and local histories. The dates and customs can differ from one valley to another, and preparations often involve a whole community. A trek may coincide with a celebration, but access and participation are always guided by local wishes.\n\nIf invited to observe, ask where to stand and whether photography is welcome. Buy food or crafts from local sellers when appropriate, and do not interrupt rituals for a photograph. Respectful observation lets a celebration remain centered on the people for whom it matters.`,
  },
  {
    slug: "sharing-the-trail-with-yak-and-mule-caravans",
    title: "Sharing the Trail with Yak and Mule Caravans",
    category: "Himalayan Culture & Life",
    summary: "Pack animals remain part of everyday transport in many mountain regions; sharing narrow paths safely takes patience.",
    coverImage: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1500&q=85",
    content: `In places beyond the road network, animals carry food, building supplies, and household goods between settlements. Their handlers know the route and its tight turns. When a caravan approaches, listen to your guide and move to the uphill side where the path allows; never squeeze between an animal and a drop.\n\nGive the animals space, keep hands clear of loads, and avoid sudden movements. A few minutes of patience helps everyone pass safely and recognizes that the trail is a working route for local communities, not only a walking path for visitors.`,
  },
  {
    slug: "supporting-village-businesses-on-a-trek",
    title: "Supporting Village Businesses on a Trek",
    category: "Himalayan Culture & Life",
    summary: "Choosing locally run services and buying thoughtfully can help trekking income reach the communities along the route.",
    coverImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1500&q=85",
    content: `Mountain villages provide lodging, meals, transport, guiding, and small essentials to people on the trail. Choosing locally run services when they suit your route helps keep more visitor spending in the places that host travelers. Ask your operator how local staff and suppliers are included in the trip.\n\nBuy only what you can use, carry reusable items, and be fair when discussing prices. Responsible spending is not a substitute for good working conditions, but it can be part of a wider commitment to treating local businesses and workers with respect.`,
  },
  {
    slug: "how-a-guide-reads-the-trail-day",
    title: "How a Guide Reads the Trail Day",
    category: "Behind the Adventure",
    summary: "The day’s plan is shaped by the group, trail conditions, weather, and the choices available at each stop.",
    coverImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1500&q=85",
    content: `A guide’s work begins before the group sets out. They review the route, check local conditions, and consider the pace and needs of the people walking that day. On the trail they watch the group as closely as the terrain, adjusting breaks or timing when conditions call for it.\n\nTravelers can help by sharing how they feel early, carrying needed layers where they can reach them, and asking when a plan is unclear. The best decisions come from steady communication, not from trying to keep up at any cost.`,
  },
  {
    slug: "what-happens-before-the-first-step",
    title: "What Happens Before the First Step",
    category: "Behind the Adventure",
    summary: "A well-prepared departure connects permits, transport, accommodation, equipment, and clear traveler information.",
    coverImage: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=1500&q=85",
    content: `Before a trek begins, the operations team confirms names and documents, checks transport arrangements, and coordinates the first nights on the route. Guides review the itinerary with the group and make sure travelers understand what to expect from the walking days and available facilities.\n\nPreparation does not remove uncertainty from mountain travel. It gives the team a clear starting point and the information needed to respond when weather, health, or access changes the plan. Keep your documents secure and raise questions before leaving the road behind.`,
  },
  {
    slug: "the-quiet-logistics-of-a-teahouse-night",
    title: "The Quiet Logistics of a Teahouse Night",
    category: "Behind the Adventure",
    summary: "A warm meal and a place to rest depend on supplies, staff, weather, and the limits of high-altitude infrastructure.",
    coverImage: "https://images.unsplash.com/photo-1464278533981-50106e6176b1?auto=format&fit=crop&w=1500&q=85",
    content: `A teahouse night is supported by many tasks that are easy to overlook: preparing food, managing limited water and fuel, cleaning shared spaces, and receiving supplies carried from elsewhere. Conditions and facilities vary by village and season, especially at higher elevations.\n\nFollow the house’s guidance on water, heating, and waste. Use resources thoughtfully and allow staff time to prepare meals for a full dining room. Understanding these limits helps travelers appreciate the work behind a comfortable evening on the trail.`,
  },
  {
    slug: "building-flexibility-into-a-trek-itinerary",
    title: "Building Flexibility into a Trek Itinerary",
    category: "Behind the Adventure",
    summary: "A resilient itinerary leaves room for weather delays, rest, and careful decisions without treating a summit as a deadline.",
    coverImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1500&q=85",
    content: `A route plan is a useful guide, but mountain travel rarely follows a perfect timetable. Weather can delay flights or close a pass, and a traveler may need more time to rest. Planning with sensible buffers gives guides options when the original schedule no longer fits the conditions.\n\nAsk how the itinerary handles delays and what choices are available if the route changes. Carry essentials for an extra night when advised, and treat safe arrival as the measure of a good plan. Flexibility is part of preparation, not a failure of it.`,
  },
  {
    slug: "reading-the-forest-as-you-gain-height",
    title: "Reading the Forest as You Gain Height",
    category: "Nature & Exploration",
    summary: "Changes in tree shape, ground cover, and moisture offer clues to the altitude and exposure of a mountain trail.",
    coverImage: "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1500&q=85",
    content: `As a route climbs, temperature, wind, and moisture shift. Forest composition changes with them: broad-leaved species give way to different stands, and eventually trees become sparse where exposure and cold limit growth. These transitions are gradual and vary with slope, aspect, and local climate.\n\nNotice how the trail crosses sunny and shaded ground, but stay on established paths. Avoid collecting plants or disturbing deadwood, which supports forest life. A slow walk offers time to observe the landscape without leaving a trace.`,
  },
  {
    slug: "mountain-water-from-snowfield-to-village",
    title: "Mountain Water, from Snowfield to Village",
    category: "Nature & Exploration",
    summary: "Streams and springs connect high slopes to farms and settlements, making clean water a shared responsibility.",
    coverImage: "https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&w=1500&q=85",
    content: `Water on a mountain route may come from springs, streams, or systems managed by a lodge or community. Its source and treatment vary, so follow local advice and use purification where recommended. A clear-looking stream is not a guarantee that water is safe to drink untreated.\n\nKeep soap, fuel, and waste away from waterways. Refill containers at designated points and avoid taking more than you need. Clean water supports households, farms, and ecosystems far below the trail, so care for it at every stop.`,
  },
  {
    slug: "quiet-wildlife-observations-on-the-trail",
    title: "Quiet Wildlife Observations on the Trail",
    category: "Nature & Exploration",
    summary: "Patient, low-impact observation is the best way to notice wildlife without changing its behavior.",
    coverImage: "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1500&q=85",
    content: `Wildlife is easiest to miss when a group moves quickly or loudly. Pause at a respectful distance, use binoculars if available, and let animals decide whether to remain in view. A guide can help identify signs and explain why a species may be more visible at a particular time or elevation.\n\nDo not feed wildlife, approach nests, or use recorded calls to draw animals closer. Keep food secured and carry all waste out. A brief sighting is a privilege; leaving the animal undisturbed matters more than getting a photograph.`,
  },
  {
    slug: "monsoon-rain-and-trail-ecology",
    title: "Monsoon Rain and Trail Ecology",
    category: "Nature & Exploration",
    summary: "Seasonal rain renews forests and streams while also changing trail surfaces, slopes, and river conditions.",
    coverImage: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1500&q=85",
    content: `The monsoon is part of the natural cycle across much of Nepal. Rain supports vegetation and replenishes water, while steep terrain can become muddy and streams can rise quickly. Local conditions differ widely, so a route that is manageable one day may need extra care the next.\n\nUse a local guide’s current advice, wear footwear with reliable grip, and keep distance from swollen rivers and unstable slopes. Avoid shortcuts that widen erosion. Careful travel protects both people and the living landscape during a season of change.`,
  },
];

async function seedFieldArticles() {
  await connectDB();
  try {
    const admin = await User.findOne({ role: "admin" }).select("name avatar").lean();
    const author = {
      name: admin?.name || "Agaaman Editorial",
      role: "Agaaman Editorial",
      avatarUrl: admin?.avatar || "",
      isVerifiedTrekker: false,
    };
    let inserted = 0;
    for (const entry of [...adminArticles, ...additionalArticles]) {
      const article = {
        ...entry,
        type: "guide",
        status: "published",
        publicationStatus: "Published",
        publicationDate: new Date(),
        readTime: `${Math.max(4, Math.ceil(entry.content.split(/\s+/).length / 200))} min read`,
        author,
        isFeatured: false,
      };
      const result = await Article.updateOne({ slug: entry.slug }, { $setOnInsert: article }, { upsert: true });
      if (result.upsertedCount) inserted += 1;
    }
    console.log(`Added ${inserted} new admin Field Articles; existing matching slugs were preserved.`);
  } finally {
    await (await import("mongoose")).default.disconnect();
  }
}

seedFieldArticles().catch((error) => {
  console.error("Field Article seeding failed:", error.message);
  process.exitCode = 1;
});
