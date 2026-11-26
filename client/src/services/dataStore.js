import { treks as initialTreks } from "../data/demoTreks.js";
import { articles as initialArticles } from "../data/demoArticles.js";
import { destinations as initialDestinations } from "../data/demoDestinations.js";
import { regions as initialRegions } from "../data/demoRegions.js";
import { apiUrl, normalizeApiMedia } from "./api.js";

const TREKS_STORAGE_KEY = "agaaman_treks_data_v2";
const ARTICLES_STORAGE_KEY = "agaaman_articles_data_v2";
const BOOKINGS_STORAGE_KEY = "agaaman_bookings_data_v2";
const DEPARTURES_STORAGE_KEY = "agaaman_departures_data_v2";
const DESTINATIONS_STORAGE_KEY = "agaaman_destinations_data_v4";
const REGIONS_STORAGE_KEY = "agaaman_regions_data_v3";
const GUIDES_STORAGE_KEY = "agaaman_guides_data_v2";

export const initialGuides = [
  {
    id: "guide-altitude-rules",
    category: "altitude",
    categoryLabel: "Altitude & Acclimatization",
    title: "The 3 Ironclad Rules of High Altitude",
    summary: "Wilderness medicine protocols followed strictly by Agaaman expedition Sherpas above 3,000 meters.",
    type: "rules",
    rules: [
      { id: "r1", title: "Rule #1: Never Ascend With Symptoms", text: "If you have a headache, nausea, or dizziness, your rest day starts right now. Ascending higher with AMS can rapidly lead to life-threatening HAPE or HACE." },
      { id: "r2", title: "Rule #2: Descend If Symptoms Worsen", text: "If your symptoms do not improve after 24 hours of rest, or if they worsen, you must descend immediately by at least 500 to 1,000 vertical meters." },
      { id: "r3", title: "Rule #3: Never Leave an Ill Trekker Alone", text: "Altitude sickness impairs judgment, balance, and cognitive awareness. Always descend accompanied by a guide or companion with emergency oxygen." }
    ],
    updatedAt: "2026-04-15"
  },
  {
    id: "guide-acclimatization-tips",
    category: "altitude",
    categoryLabel: "Altitude & Acclimatization",
    title: "The Golden Rule: Climb High, Sleep Low",
    summary: "How gradual ascent profiles allow your red blood cells to adapt naturally without artificial suppression.",
    type: "article",
    content: "Above 3,000m (9,840ft), limit daily sleeping elevation gains to 300m–500m per night. Take dedicated rest days at key milestones (Namche Bazaar 3,440m and Dingboche 4,410m in Khumbu; Manang 3,519m in Annapurna). Hike higher in the afternoon, then descend to sleep.",
    updatedAt: "2026-04-18"
  },
  {
    id: "guide-permits-2026",
    category: "permits",
    categoryLabel: "Permits & TIMS 2026",
    title: "Nepal Trekking Permits & Mandatory Guide Regulations",
    summary: "Official Nepal Tourism Board guidelines: All foreign trekkers in national parks and conservation areas must trek with a licensed guide.",
    type: "article",
    content: "Since 2023 and updated for the 2026 season, solo independent trekking without a licensed guide is prohibited across all major national parks (Sagarmatha, Annapurna, Langtang, and Manaslu). TIMS cards and local municipality entry receipts are coordinated by registered agencies.",
    updatedAt: "2026-01-10"
  },
  {
    id: "guide-sherpa-culture",
    category: "culture",
    categoryLabel: "Teahouse & Sherpa Culture",
    title: "Sacred Mountain Etiquette & Teahouse Customs",
    summary: "Understanding the Buddhist ethos of the Khumbu, Gurung traditions, and how to respect fragile alpine communities.",
    type: "article",
    content: "Always walk clockwise around prayer walls, stupas, and chortens. Never sit on mani stones carved with sacred mantras. Greet local villagers with 'Tashi Delek' or 'Namaste' with both palms together. Avoid wasting food in teahouses—everything is carried up on human backs.",
    updatedAt: "2026-03-20"
  }
];

const initialDepartures = [
  {
    id: "dep-1",
    trekSlug: "everest-base-camp",
    trekTitle: "Everest Base Camp & Kala Patthar",
    startDate: "2026-05-10",
    endDate: "2026-05-23",
    price: 1598,
    originalPrice: 1890,
    availableSeats: 6,
    totalSeats: 12,
    status: "Guaranteed",
  },
  {
    id: "dep-2",
    trekSlug: "everest-base-camp",
    trekTitle: "Everest Base Camp & Kala Patthar",
    startDate: "2026-05-24",
    endDate: "2026-06-06",
    price: 1598,
    originalPrice: 1890,
    availableSeats: 3,
    totalSeats: 12,
    status: "Filling Fast",
  },
  {
    id: "dep-3",
    trekSlug: "annapurna-sanctuary",
    trekTitle: "Annapurna Sanctuary & Poon Hill",
    startDate: "2026-05-15",
    endDate: "2026-05-24",
    price: 1180,
    originalPrice: 1340,
    availableSeats: 6,
    totalSeats: 10,
    status: "Guaranteed",
  },
  {
    id: "dep-4",
    trekSlug: "langtang-valley",
    trekTitle: "Langtang Valley & Kyanjin Ri",
    startDate: "2026-05-18",
    endDate: "2026-05-25",
    price: 850,
    originalPrice: 980,
    availableSeats: 5,
    totalSeats: 8,
    status: "Available",
  },
  {
    id: "dep-5",
    trekSlug: "manaslu-circuit",
    trekTitle: "Manaslu Circuit & Larkya La Pass",
    startDate: "2026-06-01",
    endDate: "2026-06-15",
    price: 1480,
    originalPrice: 1680,
    availableSeats: 3,
    totalSeats: 8,
    status: "Guaranteed",
  },
];

const initialBookings = [
  {
    id: "BK-2026-9021",
    bookingReference: "BK-2026-9021",
    trekSlug: "everest-base-camp",
    trekTitle: "Everest Base Camp & Kala Patthar",
    name: "Alex Thorne",
    email: "traveler@agaaman.com",
    phone: "+1 415 555 0192",
    country: "United States",
    travelers: 2,
    startDate: "2026-05-10",
    totalAmount: 3196,
    bookingStatus: "Confirmed",
    status: "Confirmed",
    paymentStatus: "Paid",
    createdAt: "2026-10-25T10:30:00Z",
    notes: "Vegetarian meals preferred. Arriving 2 days early in Kathmandu.",
  },
  {
    id: "BK-2026-9022",
    bookingReference: "BK-2026-9022",
    trekSlug: "annapurna-sanctuary",
    trekTitle: "Annapurna Sanctuary & Poon Hill",
    name: "Marcus Lindqvist",
    email: "marcus.l@nordic.se",
    phone: "+46 70 123 4567",
    country: "Sweden",
    travelers: 1,
    startDate: "2026-05-15",
    totalAmount: 1180,
    bookingStatus: "Requested",
    status: "Requested",
    paymentStatus: "Pending",
    createdAt: "2026-10-28T14:15:00Z",
    notes: "Need sleeping bag and trekking pole rental in Pokhara.",
  },
];

function getStored(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error("Storage error:", e);
    return fallback;
  }
}

function setStored(key, value) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("agaaman_data_changed"));
  } catch (e) {
    console.error("Storage save error:", e);
  }
}

// Background sync with MongoDB backend
async function syncFromBackend() {
  if (typeof window === "undefined") return;
  try {
    // Sync Treks
    const treksRes = await fetch(apiUrl("/treks?limit=50"), { credentials: "include" });
    if (treksRes.ok) {
      const data = normalizeApiMedia(await treksRes.json());
      if (data.success && Array.isArray(data.treks) && data.treks.length > 0) {
        const mapped = data.treks.map((t) => ({
          ...t,
          image: t.images && t.images[0] ? t.images[0] : t.image,
          elevation: t.maximumElevation || t.elevation,
          description: t.shortDescription || t.description,
        }));
        setStored(TREKS_STORAGE_KEY, mapped);
      }
    }

    // Sync Departures
    const depRes = await fetch(apiUrl("/departures"), { credentials: "include" });
    if (depRes.ok) {
      const data = normalizeApiMedia(await depRes.json());
      if (data.success && Array.isArray(data.departures) && data.departures.length > 0) {
        const mappedDeps = data.departures.map((d) => ({
          id: d._id || d.id,
          trekSlug: d.trek?.slug || d.trekSlug,
          trekTitle: d.trek?.title || d.trekTitle,
          startDate: typeof d.startDate === "string" ? d.startDate.slice(0, 10) : d.startDate,
          endDate: typeof d.endDate === "string" ? d.endDate.slice(0, 10) : d.endDate,
          price: d.price,
          originalPrice: d.originalPrice,
          availableSeats: d.availableSeats !== undefined ? d.availableSeats : d.capacity - (d.bookedCount || 0),
          totalSeats: d.capacity,
          status: d.status,
        }));
        setStored(DEPARTURES_STORAGE_KEY, mappedDeps);
      }
    }

    // Sync Articles
    const artRes = await fetch(apiUrl("/articles"), { credentials: "include" });
    if (artRes.ok) {
      const data = normalizeApiMedia(await artRes.json());
      if (data.success && Array.isArray(data.articles) && data.articles.length > 0) {
        const mappedArts = data.articles.map((a) => ({
          ...a,
          image: a.coverImage || a.image,
          read: a.readTime || a.read,
        }));
        setStored(ARTICLES_STORAGE_KEY, mappedArts);
      }
    }

    // Sync Destinations
    const destRes = await fetch(apiUrl("/destinations"), { credentials: "include" });
    if (destRes.ok) {
      const data = normalizeApiMedia(await destRes.json());
      if (data.success && Array.isArray(data.destinations) && data.destinations.length > 0) {
        const mappedDests = data.destinations.map((d) => {
          const matchInitial = initialDestinations.find((init) => init.slug === d.slug);
          return {
            id: d._id || d.id,
            slug: d.slug,
            name: d.name,
            region: d.region,
            elevation: Number(d.elevation || matchInitial?.elevation || 0),
            label: d.label || matchInitial?.label || d.name,
            description: d.description || matchInitial?.description || "",
            lat: d.coordinates?.lat || d.lat || matchInitial?.lat || 27.8,
            lng: d.coordinates?.lng || d.lng || matchInitial?.lng || 86.7,
            image: d.images?.[0] || d.image || matchInitial?.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
            images: Array.isArray(d.images) && d.images.length > 0 ? d.images : (matchInitial?.images || [d.image || matchInitial?.image]),
            trekSlugs: d.trekSlugs || matchInitial?.trekSlugs || [],
            highlights: d.highlights || matchInitial?.highlights || [],
            bestSeason: d.bestSeason || matchInitial?.bestSeason || ["Spring", "Autumn"],
            attractions: d.attractions && d.attractions.length > 0 ? d.attractions : (matchInitial?.attractions || []),
            accommodationTypes: d.accommodationTypes && d.accommodationTypes.length > 0 ? d.accommodationTypes : (matchInitial?.accommodationTypes || []),
            culturalHighlights: d.culturalHighlights?.overview ? d.culturalHighlights : (matchInitial?.culturalHighlights || { ethnicGroups: [], overview: "", etiquette: [] }),
            nearbySideTrips: d.nearbySideTrips && d.nearbySideTrips.length > 0 ? d.nearbySideTrips : (matchInitial?.nearbySideTrips || []),
          };
        });

        // Keep all initial rich destinations that aren't on the backend yet
        const combined = [...mappedDests];
        initialDestinations.forEach((init) => {
          if (!combined.some((c) => c.slug === init.slug)) {
            combined.push(init);
          }
        });
        setStored(DESTINATIONS_STORAGE_KEY, combined);
      }
    }
  } catch (err) {
    // Network or server start in progress; gracefully keep local state
  }
}

// Trigger initial sync
if (typeof window !== "undefined") {
  syncFromBackend();
}

// Data Store API
export const dataStore = {
  // Treks
  getTreks() {
    return getStored(TREKS_STORAGE_KEY, initialTreks);
  },
  getTrek(slug) {
    const list = this.getTreks();
    return list.find((t) => t.slug === slug);
  },
  saveTrek(trekData) {
    const list = this.getTreks();
    const index = list.findIndex((t) => t.slug === trekData.slug);
    if (index >= 0) {
      list[index] = { ...list[index], ...trekData };
    } else {
      list.unshift(trekData);
    }
    setStored(TREKS_STORAGE_KEY, list);

    // Also persist to backend if possible
    fetch(apiUrl("/treks"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...trekData,
        shortDescription: trekData.description || trekData.shortDescription || trekData.title,
        fullDescription: trekData.introduction || trekData.fullDescription || trekData.description,
        maximumElevation: trekData.elevation || 5000,
        images: trekData.image ? [trekData.image] : [],
      }),
      credentials: "include",
    }).catch(() => {});

    return trekData;
  },
  deleteTrek(slug) {
    const list = this.getTreks().filter((t) => t.slug !== slug);
    setStored(TREKS_STORAGE_KEY, list);
  },
  resetTreks() {
    setStored(TREKS_STORAGE_KEY, initialTreks);
    syncFromBackend();
  },

  // Articles / Blogs
  getArticles() {
    return getStored(ARTICLES_STORAGE_KEY, initialArticles);
  },
  getArticle(slug) {
    return this.getArticles().find((a) => a.slug === slug);
  },
  saveArticle(articleData) {
    const list = this.getArticles();
    const index = list.findIndex((a) => a.slug === articleData.slug);
    if (index >= 0) {
      list[index] = { ...list[index], ...articleData };
    } else {
      list.unshift(articleData);
    }
    setStored(ARTICLES_STORAGE_KEY, list);
    return articleData;
  },
  deleteArticle(slug) {
    const list = this.getArticles().filter((a) => a.slug !== slug);
    setStored(ARTICLES_STORAGE_KEY, list);
  },

  // Bookings & Inquiries
  getBookings() {
    return getStored(BOOKINGS_STORAGE_KEY, initialBookings);
  },
  addBooking(booking) {
    const list = this.getBookings();
    const ref = "BK-2026-" + Math.floor(1000 + Math.random() * 9000);
    const newBooking = {
      id: ref,
      bookingReference: ref,
      createdAt: new Date().toISOString(),
      status: "Requested",
      bookingStatus: "Requested",
      paymentStatus: "Unpaid",
      ...booking,
    };
    list.unshift(newBooking);
    setStored(BOOKINGS_STORAGE_KEY, list);
    return newBooking;
  },
  updateBookingStatus(id, status) {
    const list = this.getBookings();
    const item = list.find((b) => b.id === id || b.bookingReference === id);
    if (item) {
      item.status = status;
      item.bookingStatus = status;
      setStored(BOOKINGS_STORAGE_KEY, list);
    }
  },
  updatePaymentStatus(id, paymentStatus) {
    const list = this.getBookings();
    const item = list.find((b) => b.id === id || b.bookingReference === id);
    if (item) {
      item.paymentStatus = paymentStatus;
      setStored(BOOKINGS_STORAGE_KEY, list);
    }
  },
  deleteBooking(id) {
    const list = this.getBookings().filter((b) => b.id !== id && b.bookingReference !== id);
    setStored(BOOKINGS_STORAGE_KEY, list);
  },

  // Departures
  getDepartures() {
    return getStored(DEPARTURES_STORAGE_KEY, initialDepartures);
  },
  saveDeparture(dep) {
    const list = this.getDepartures();
    const index = list.findIndex((d) => d.id === dep.id);
    if (index >= 0) {
      list[index] = { ...list[index], ...dep };
    } else {
      list.unshift({ ...dep, id: "dep-" + Date.now() });
    }
    setStored(DEPARTURES_STORAGE_KEY, list);
  },
  deleteDeparture(id) {
    const list = this.getDepartures().filter((d) => d.id !== id);
    setStored(DEPARTURES_STORAGE_KEY, list);
  },

  // Destinations (Real Towns / Settlements / Staging Hubs)
  getDestinations() {
    return getStored(DESTINATIONS_STORAGE_KEY, initialDestinations);
  },
  getDestination(slug) {
    const list = this.getDestinations();
    return list.find((d) => d.slug === slug || (d.name && d.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") === slug));
  },
  saveDestination(destData, { persist = true } = {}) {
    const list = this.getDestinations();
    const slug = destData.slug || (destData.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const item = {
      id: destData.id || destData._id || "dest-" + Date.now(),
      slug,
      name: destData.name,
      region: destData.region || "Everest Region",
      elevation: Number(destData.elevation || 0),
      label: destData.label || destData.name,
      description: destData.description || "",
      lat: Number(destData.lat || destData.coordinates?.lat || 27.8),
      lng: Number(destData.lng || destData.coordinates?.lng || 86.7),
      image: destData.image || (destData.images && destData.images[0]) || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      images: Array.isArray(destData.images) && destData.images.length > 0 ? destData.images : [destData.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80"],
      trekSlugs: Array.isArray(destData.trekSlugs) ? destData.trekSlugs : [],
      highlights: Array.isArray(destData.highlights) ? destData.highlights : (destData.highlights ? destData.highlights.split("\n").map(s => s.trim()).filter(Boolean) : []),
      bestSeason: Array.isArray(destData.bestSeason) ? destData.bestSeason : (destData.bestSeason ? destData.bestSeason.split(",").map(s => s.trim()).filter(Boolean) : ["Spring", "Autumn"]),
      attractions: Array.isArray(destData.attractions) ? destData.attractions : [],
      accommodationTypes: Array.isArray(destData.accommodationTypes) ? destData.accommodationTypes : [],
      culturalHighlights: destData.culturalHighlights || { ethnicGroups: [], overview: "", etiquette: [] },
      nearbySideTrips: Array.isArray(destData.nearbySideTrips) ? destData.nearbySideTrips : [],
    };

    const index = list.findIndex((d) => d.slug === slug || (destData.id && d.id === destData.id));
    if (index >= 0) {
      list[index] = { ...list[index], ...item };
    } else {
      list.unshift(item);
    }
    setStored(DESTINATIONS_STORAGE_KEY, list);

    if (persist) {
      // Also persist to backend
      fetch(apiUrl("/destinations"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: item.name,
          slug: item.slug,
          region: item.region,
          elevation: item.elevation,
          description: item.description,
          images: item.images,
          coordinates: { lat: item.lat, lng: item.lng },
          highlights: item.highlights,
          bestSeason: item.bestSeason,
          attractions: item.attractions,
          accommodationTypes: item.accommodationTypes,
          culturalHighlights: item.culturalHighlights,
          nearbySideTrips: item.nearbySideTrips,
          trekSlugs: item.trekSlugs,
        }),
        credentials: "include",
      }).catch(() => {});
    }

    return item;
  },
  deleteDestination(idOrSlug) {
    const list = this.getDestinations().filter(
      (d) => d.id !== idOrSlug && d.slug !== idOrSlug && d._id !== idOrSlug
    );
    setStored(DESTINATIONS_STORAGE_KEY, list);

    fetch(apiUrl(`/destinations/${encodeURIComponent(idOrSlug)}`), {
      method: "DELETE",
      credentials: "include",
    }).catch(() => {});
  },

  // Trekking Guides & Trail Rules
  getGuides() {
    return getStored(GUIDES_STORAGE_KEY, initialGuides);
  },
  getGuide(id) {
    const list = this.getGuides();
    return list.find((g) => g.id === id);
  },
  saveGuide(guideData) {
    const list = this.getGuides();
    const id = guideData.id || "guide-" + Date.now();
    const item = {
      ...guideData,
      id,
      updatedAt: new Date().toISOString().slice(0, 10),
    };
    const index = list.findIndex((g) => g.id === id);
    if (index >= 0) {
      list[index] = { ...list[index], ...item };
    } else {
      list.unshift(item);
    }
    setStored(GUIDES_STORAGE_KEY, list);
    return item;
  },
  deleteGuide(id) {
    const list = this.getGuides().filter((g) => g.id !== id);
    setStored(GUIDES_STORAGE_KEY, list);
  },

  // Regions (Dedicated Regional Territories)
  getRegions() {
    return getStored(REGIONS_STORAGE_KEY, initialRegions);
  },

  getRegion(slugOrId) {
    const cleanId = (slugOrId || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const regions = this.getRegions();
    const region = regions.find(
      (r) => r.id === cleanId || r.slug === cleanId || cleanId.includes(r.slug) || r.slug.includes(cleanId)
    );

    const dests = this.getDestinations();
    const allTreks = this.getTreks();

    // Match sub-destinations belonging to this region
    const subDestinations = dests.filter((d) => {
      const dReg = (d.region || "").toLowerCase();
      const rName = region ? region.name.toLowerCase() : cleanId;
      return (
        dReg.includes(rName.replace(" region", "")) ||
        rName.includes(dReg.replace(" region", "")) ||
        (region && dReg.includes(region.slug.replace("-region", "")))
      );
    });

    // Match treks in this region
    const matchingTreks = allTreks.filter((t) => {
      const reg = (t.region || "").toLowerCase();
      const loc = (t.location || "").toLowerCase();
      const title = (t.title || "").toLowerCase();
      const rName = region ? region.name.toLowerCase().replace(" region", "") : cleanId.replace("-region", "");
      return reg.includes(rName) || loc.includes(rName) || title.includes(rName);
    });

    // Categorized treks by grading / difficulty / duration
    const highGradeTreks = matchingTreks.filter((t) => (t.duration >= 13) || (t.elevation >= 5000) || (t.difficulty?.toLowerCase().includes("challenging") || t.difficulty?.toLowerCase().includes("strenuous")));
    const moderateGradeTreks = matchingTreks.filter((t) => (t.duration >= 7 && t.duration < 13 && t.elevation < 5000) || (t.difficulty?.toLowerCase().includes("moderate")));
    const easyGradeTreks = matchingTreks.filter((t) => t.duration < 7 || t.difficulty?.toLowerCase().includes("easy"));

    return {
      id: region ? region.id : cleanId,
      slug: region ? region.slug : cleanId,
      name: region ? region.name : (slugOrId.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())),
      label: region ? region.label : `${slugOrId.replace(/-/g, " ")} Region`,
      tagline: region?.tagline || "",
      description: region?.description || "",
      image: region?.image || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      coordinates: region?.coordinates || { lat: 28.0, lng: 85.0 },
      bestSeason: region?.bestSeason || ["Spring", "Autumn"],
      highlights: region?.highlights || [],
      maxElevation: region?.maxElevation || 5400,
      gradingList: region?.gradingList || ["Challenging", "Strenuous", "Moderate", "Easy"],
      permits: region?.permits || ["Conservation Area Entry Permit", "TIMS Card"],
      subDestinations,
      allTreks: matchingTreks,
      highGradeTreks,
      moderateGradeTreks,
      easyGradeTreks,
    };
  },

  saveRegion(regionData) {
    const list = this.getRegions();
    const slug = regionData.slug || (regionData.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const item = {
      id: regionData.id || regionData._id || slug,
      slug,
      name: regionData.name,
      label: regionData.label || regionData.name,
      tagline: regionData.tagline || "",
      description: regionData.description || "",
      image: regionData.image || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      coordinates: regionData.coordinates || { lat: Number(regionData.lat || 28.0), lng: Number(regionData.lng || 85.0) },
      bestSeason: Array.isArray(regionData.bestSeason) ? regionData.bestSeason : (regionData.bestSeason ? regionData.bestSeason.split(",").map(s => s.trim()) : ["Spring", "Autumn"]),
      highlights: Array.isArray(regionData.highlights) ? regionData.highlights : (regionData.highlights ? regionData.highlights.split("\n").map(s => s.trim()).filter(Boolean) : []),
      maxElevation: Number(regionData.maxElevation || 5400),
      gradingList: Array.isArray(regionData.gradingList) ? regionData.gradingList : ["Challenging", "Strenuous", "Moderate", "Easy"],
      permits: Array.isArray(regionData.permits) ? regionData.permits : [],
    };

    const index = list.findIndex((r) => r.slug === slug || (regionData.id && r.id === regionData.id));
    if (index >= 0) {
      list[index] = { ...list[index], ...item };
    } else {
      list.push(item);
    }
    setStored(REGIONS_STORAGE_KEY, list);

    // Also persist to backend
    fetch(apiUrl("/regions"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
      credentials: "include",
    }).catch(() => {});

    return item;
  },

  deleteRegion(idOrSlug) {
    const list = this.getRegions().filter(
      (r) => r.id !== idOrSlug && r.slug !== idOrSlug && r._id !== idOrSlug
    );
    setStored(REGIONS_STORAGE_KEY, list);

    fetch(apiUrl(`/regions/${encodeURIComponent(idOrSlug)}`), {
      method: "DELETE",
      credentials: "include",
    }).catch(() => {});
  },
};
