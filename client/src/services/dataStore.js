import { treks as initialTreks } from "../data/demoTreks.js";
import { articles as initialArticles } from "../data/demoArticles.js";
import { destinations as initialDestinations } from "../data/demoDestinations.js";

const TREKS_STORAGE_KEY = "agaaman_treks_data_v2";
const ARTICLES_STORAGE_KEY = "agaaman_articles_data_v2";
const BOOKINGS_STORAGE_KEY = "agaaman_bookings_data_v2";
const DEPARTURES_STORAGE_KEY = "agaaman_departures_data_v2";
const DESTINATIONS_STORAGE_KEY = "agaaman_destinations_data_v2";

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
    const treksRes = await fetch("/api/treks?limit=50");
    if (treksRes.ok) {
      const data = await treksRes.json();
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
    const depRes = await fetch("/api/departures");
    if (depRes.ok) {
      const data = await depRes.json();
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
    const artRes = await fetch("/api/articles");
    if (artRes.ok) {
      const data = await artRes.json();
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
    const destRes = await fetch("/api/destinations");
    if (destRes.ok) {
      const data = await destRes.json();
      if (data.success && Array.isArray(data.destinations) && data.destinations.length > 0) {
        const mappedDests = data.destinations.map((d) => ({
          id: d._id || d.id,
          slug: d.slug,
          name: d.name,
          region: d.region,
          label: d.label || d.name,
          description: d.description,
          lat: d.coordinates?.lat || d.lat || 27.8,
          lng: d.coordinates?.lng || d.lng || 86.7,
          image: d.images?.[0] || d.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
          trekSlugs: d.trekSlugs || [],
          highlights: d.highlights || [],
          bestSeason: d.bestSeason || ["Spring", "Autumn"],
        }));
        setStored(DESTINATIONS_STORAGE_KEY, mappedDests);
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
    fetch(`/api/treks`, {
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

  // Destinations
  getDestinations() {
    return getStored(DESTINATIONS_STORAGE_KEY, initialDestinations);
  },
  getDestination(slug) {
    const list = this.getDestinations();
    return list.find((d) => d.slug === slug);
  },
  saveDestination(destData) {
    const list = this.getDestinations();
    const slug = destData.slug || (destData.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const item = {
      id: destData.id || destData._id || "dest-" + Date.now(),
      slug,
      name: destData.name,
      region: destData.region || destData.name,
      label: destData.label || destData.name,
      description: destData.description || "",
      lat: Number(destData.lat || destData.coordinates?.lat || 27.8),
      lng: Number(destData.lng || destData.coordinates?.lng || 86.7),
      image: destData.image || (destData.images && destData.images[0]) || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      trekSlugs: destData.trekSlugs || [],
      highlights: destData.highlights || [],
      bestSeason: destData.bestSeason || ["Spring", "Autumn"],
    };

    const index = list.findIndex((d) => d.slug === slug || (destData.id && d.id === destData.id));
    if (index >= 0) {
      list[index] = { ...list[index], ...item };
    } else {
      list.unshift(item);
    }
    setStored(DESTINATIONS_STORAGE_KEY, list);

    // Also persist to backend
    fetch("/api/destinations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: item.name,
        slug: item.slug,
        region: item.region,
        description: item.description,
        images: [item.image],
        coordinates: { lat: item.lat, lng: item.lng },
        highlights: Array.isArray(item.highlights) ? item.highlights : [item.highlights],
        bestSeason: Array.isArray(item.bestSeason) ? item.bestSeason : [item.bestSeason],
      }),
      credentials: "include",
    }).catch(() => {});

    return item;
  },
  deleteDestination(idOrSlug) {
    const list = this.getDestinations().filter(
      (d) => d.id !== idOrSlug && d.slug !== idOrSlug && d._id !== idOrSlug
    );
    setStored(DESTINATIONS_STORAGE_KEY, list);

    fetch(`/api/destinations/${idOrSlug}`, {
      method: "DELETE",
      credentials: "include",
    }).catch(() => {});
  },

  // Dynamic Regions derived from Destinations and Treks
  getRegions() {
    const dests = this.getDestinations();
    const treks = this.getTreks();
    const regionMap = new Map();

    dests.forEach((d) => {
      const name = d.region || d.name;
      if (name) {
        const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        regionMap.set(id, {
          id,
          label: name.toLowerCase().includes("region") ? name : `${name} Region`,
          match: [d.name, d.slug, d.region].filter(Boolean),
        });
      }
    });

    treks.forEach((t) => {
      if (t.region) {
        const id = t.region.toLowerCase().replace(/[^a-z0-9]+/g, "-");
        if (!regionMap.has(id)) {
          regionMap.set(id, {
            id,
            label: t.region.toLowerCase().includes("region") ? t.region : `${t.region} Region`,
            match: [t.region],
          });
        }
      }
    });

    return Array.from(regionMap.values());
  },
};
