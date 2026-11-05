import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  Archive,
  ArchiveRestore,
  ArrowLeft,
  Calendar,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock,
  Compass,
  DollarSign,
  Edit,
  Eye,
  FileText,
  Filter,
  Heart,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Mountain,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  TrendingUp,
  UserCheck,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { api } from "../../services/api.js";
import { dataStore } from "../../services/dataStore.js";
import { getDepartureAvailableSeats, getDepartureStatus } from "../../services/departures.js";
import "./AdminDashboard.css";

function hasDepartureEnded(endDate) {
  if (!endDate) return false;
  const endOfDeparture = new Date(endDate);
  endOfDeparture.setUTCHours(23, 59, 59, 999);
  return endOfDeparture <= new Date();
}

export function AdminPage() {
  const { user, logout, isAdmin, loading: authLoading } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();
  const { tab } = useParams();

  // Validate active sub-route or default to dashboard
  const validTabs = ["dashboard", "treks", "regions", "destinations", "departures", "bookings", "booking", "favorites", "contacts", "users", "content", "guides", "settings"];
  const activeTab = tab === "booking" ? "bookings" : validTabs.includes(tab) ? tab : "dashboard";
  const [contentSubTab, setContentSubTab] = useState("articles"); // "articles" | "reviews"

  // Auth Guard
  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      navigate("/admin/login", { replace: true });
    }
  }, [user, isAdmin, authLoading, navigate]);

  // Live data states
  const [stats, setStats] = useState({
    totalUsers: 2,
    totalTreks: 8,
    totalDestinations: 4,
    totalDepartures: 5,
    totalBookings: 2,
    pendingBookings: 1,
    confirmedBookings: 1,
    totalRevenue: 3196,
  });

  const [treksList, setTreksList] = useState([]);
  const [regionsList, setRegionsList] = useState(() => dataStore.getRegions());
  const [destinationsList, setDestinationsList] = useState(() => dataStore.getDestinations());
  const [departuresList, setDeparturesList] = useState([]);
  const [departuresLoading, setDeparturesLoading] = useState(false);
  const [departureLoadError, setDepartureLoadError] = useState("");
  const [departureLoadNotice, setDepartureLoadNotice] = useState("");
  const [departureSummary, setDepartureSummary] = useState(null);
  const [bookingsList, setBookingsList] = useState([]);
  const [favoritesList, setFavoritesList] = useState([]);
  const [favoritesTotal, setFavoritesTotal] = useState(0);
  const [favoritesError, setFavoritesError] = useState("");
  const [contactMessagesList, setContactMessagesList] = useState([]);
  const [contactMessagesError, setContactMessagesError] = useState("");
  const [contactMessagesLoading, setContactMessagesLoading] = useState(true);
  const [usersList, setUsersList] = useState([]);
  const [articlesList, setArticlesList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [articleForm, setArticleForm] = useState({
    title: "",
    slug: "",
    summary: "",
    content: "",
    coverImage: "",
    author: "",
    category: "Field Notes",
    readTime: "6 min read",
    publicationStatus: "Draft",
  });
  const [guidesList, setGuidesList] = useState(() => dataStore.getGuides());
  const [regionModalOpen, setRegionModalOpen] = useState(false);
  const [editingRegion, setEditingRegion] = useState(null);
  const [regionForm, setRegionForm] = useState({
    name: "",
    slug: "",
    label: "",
    tagline: "",
    description: "",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
    maxElevation: 5400,
    lat: "28.0",
    lng: "85.0",
    bestSeason: "Spring, Autumn",
    highlights: "",
    gradingList: "Challenging, Strenuous, Moderate, Easy",
    permits: "Conservation Area Entry Permit, TIMS Card",
  });
  const [guideModalOpen, setGuideModalOpen] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  const [guideForm, setGuideForm] = useState({
    title: "",
    category: "altitude",
    categoryLabel: "Altitude & Acclimatization",
    type: "article",
    summary: "",
    content: "",
    rules: [{ id: "r1", title: "", text: "" }],
  });
  const [settingsData, setSettingsData] = useState({
    siteName: "Agaaman: A Himalayan Adventure",
    contactEmail: "info@agaaman.com",
    contactPhone: "+977 9851029894",
    address: "Thamel, Kathmandu, Nepal",
    currency: "USD",
    depositPercent: 20,
    freeCancellationDays: 30,
    emergencyHelpline: "+977 9851029894",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [bookingFilter, setBookingFilter] = useState("all"); // "all" | "booking" | "customization" | "inquiry"

  // Modals state
  const [trekModalOpen, setTrekModalOpen] = useState(false);
  const [editingTrek, setEditingTrek] = useState(null);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [trekForm, setTrekForm] = useState({
    title: "",
    slug: "",
    region: "Khumbu",
    location: "Khumbu · Sagarmatha National Park, Nepal",
    duration: 14,
    elevation: 5364,
    difficulty: "Challenging",
    price: 1890,
    featured: false,
    published: true,
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    description: "Follow the historic stone footsteps into the inner sanctum of the world's tallest peaks.",
    introduction: "Guided by local mountain-born Sherpas.",
    highlights: "Kala Patthar panoramic sunrise\nTengboche Monastery blessing\nNamche Bazaar Sherpa capital",
    included: "All airport transfers in private vehicle\nKathmandu to Lukla flights\nSagarmatha permits\nLead Sherpa guide and porters",
    excluded: "International flights\nHigh-altitude travel insurance\nPersonal gear",
    itineraryText: "Day 01: Arrive in Kathmandu | 1,400m | Touch down in Kathmandu valley. Meet lead Sherpa guide.\nDay 02: Flight to Lukla & Trek to Phakding | 2,610m | Mountain flight into Lukla and trek along Dudh Koshi.\nDay 03: Trek to Namche Bazaar | 3,440m | Cross Hillary suspension bridge into the Sherpa capital.",
    galleryText: "",
    minGroupSize: 1,
    groupCapacity: 12,
    transportation: "",
    accommodation: "",
    meals: "",
    tripType: "",
  });

  const [destModalOpen, setDestModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState(null);
  const [destForm, setDestForm] = useState({
    name: "",
    slug: "",
    region: "Everest Region",
    elevation: 0,
    trekSlugs: [],
    description: "",
    highlights: "",
    lat: "27.8",
    lng: "86.7",
    bestSeason: "Spring, Autumn",
    image: "",
    attractionsText: "",
    stayTypesText: "",
    cultureText: "",
    ethnicGroups: "",
    etiquetteText: "",
    sideTripsText: "",
  });

  const [depModalOpen, setDepModalOpen] = useState(false);
  const [editingDeparture, setEditingDeparture] = useState(null);
  const [depForm, setDepForm] = useState({
    trekSlug: "",
    startDate: "",
    endDate: "",
    bookingClosingDate: "",
    price: 0,
    originalPrice: "",
    capacity: 12,
    minGroupSize: 1,
    status: "Available",
    published: true,
  });
  const [departureSearch, setDepartureSearch] = useState("");
  const [departureStatusFilter, setDepartureStatusFilter] = useState("all");
  const [departureDateFrom, setDepartureDateFrom] = useState("");
  const [departureDateTo, setDepartureDateTo] = useState("");

  // Modern Confirmation Modal
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "Delete",
    onConfirm: null,
  });

  // Dynamic status & breakdown states
  const [statusBreakdown, setStatusBreakdown] = useState([]);
  const [paymentBreakdown, setPaymentBreakdown] = useState([]);
  const [trendsList, setTrendsList] = useState([]);

  // Bookings search & filter states
  const [bookingSearch, setBookingSearch] = useState("");
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");
  const [bookingPaymentFilter, setBookingPaymentFilter] = useState("all");
  const [bookingTrekFilter, setBookingTrekFilter] = useState("all");
  const [viewingBooking, setViewingBooking] = useState(null);
  const [editingBooking, setEditingBooking] = useState(null);
  const [editBookingForm, setEditBookingForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    nationality: "",
    travelers: 1,
    departureId: "",
    totalAmount: 0,
    bookingStatus: "Pending",
    paymentStatus: "Pending",
    notes: "",
  });

  // User management search & filter states
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userStatusFilter, setUserStatusFilter] = useState("all");

  // Review moderation filter state
  const [reviewFilter, setReviewFilter] = useState("all");
  const [reviewVerificationFilter, setReviewVerificationFilter] = useState("all");
  const [reviewTrekFilter, setReviewTrekFilter] = useState("all");
  const [reviewSearch, setReviewSearch] = useState("");

  // Trek search & archive filter states
  const [trekSearch, setTrekSearch] = useState("");
  const [trekArchiveFilter, setTrekArchiveFilter] = useState("all");

  const loadDepartures = async () => {
    setDeparturesLoading(true);
    setDepartureLoadError("");
    setDepartureLoadNotice("");
    try {
      const response = await api.departures.getAdminAll({ upcoming: "false" });
      if (!response.success || !Array.isArray(response.departures)) {
        throw new Error("The departure schedule could not be loaded.");
      }
      setDeparturesList(response.departures);
      if (response.adminFallback) {
        setDepartureLoadNotice("Showing published departures. Restart the API server to load draft schedules.");
      }
    } catch (error) {
      setDepartureLoadError(error.message || "The departure schedule could not be loaded.");
    } finally {
      setDeparturesLoading(false);
    }
  };

  // Load backend and live data
  const loadDashboardData = async () => {
    try {
      // 0. Regions from API (must come first so region dropdowns populate correctly)
      api.regions
        .getAll()
        .then((res) => {
          if (res.success && res.regions && res.regions.length > 0) {
            // Normalize to the shape dataStore expects
            const normalized = res.regions.map((r) => ({
              id: r._id || r.id,
              _id: r._id || r.id,
              slug: r.slug,
              name: r.name,
              label: r.label || r.name,
              tagline: r.tagline || "",
              description: r.description || "",
              image: r.image || "",
              coordinates: r.coordinates || { lat: 28.0, lng: 85.0 },
              maxElevation: r.maxElevation ?? 5400,
              bestSeason: r.bestSeason || [],
              highlights: r.highlights || [],
              gradingList: r.gradingList || [],
              permits: r.permits || [],
            }));
            // Sync into dataStore so Header/other components pick it up too
            normalized.forEach((reg) => dataStore.saveRegion(reg, { persist: false }));
            setRegionsList(normalized);
          }
        })
        .catch(() => {
          // Keep dataStore fallback
          setRegionsList(dataStore.getRegions());
        });

      // 1. Stats & Dynamic Breakdowns
      api.admin
        .getStats()
        .then((res) => {
          if (res.success && res.stats) {
            setStats(res.stats);
            if (res.statusBreakdown) setStatusBreakdown(res.statusBreakdown);
            if (res.paymentBreakdown) setPaymentBreakdown(res.paymentBreakdown);
            if (res.trends) setTrendsList(res.trends);
          }
        })
        .catch(() => {});

      // 2. Treks (including archived packages)
      api.treks
        .getAll({ includeArchived: "true", limit: 100 })
        .then((res) => {
          if (res.success && res.treks) {
            setTreksList(res.treks);
          } else {
            setTreksList(dataStore.getTreks());
          }
        })
        .catch(() => {
          setTreksList(dataStore.getTreks());
        });

      // 3. Destinations
      api.destinations
        .getAll()
        .then((res) => {
          if (res.success && res.destinations && res.destinations.length > 0) {
            setDestinationsList(res.destinations);
            const mapped = res.destinations.map((d) => ({
              id: d._id || d.id,
              slug: d.slug,
              name: d.name,
              region: d.region,
              label: d.label || d.name,
              description: d.description,
              lat: d.coordinates?.lat || 27.8,
              lng: d.coordinates?.lng || 86.7,
              image: d.images?.[0] || d.image || "",
              trekSlugs: d.trekSlugs || [],
              highlights: d.highlights || [],
              bestSeason: d.bestSeason || ["Spring", "Autumn"],
            }));
            mapped.forEach((dest) => dataStore.saveDestination(dest, { persist: false }));
          } else {
            setDestinationsList(dataStore.getDestinations());
          }
        })
        .catch(() => {
          setDestinationsList(dataStore.getDestinations());
        });

      // 4. Departures
      loadDepartures();

      api.departures
        .getSummary()
        .then((res) => {
          if (res.success && res.summary) setDepartureSummary(res.summary);
        })
        .catch(() => setDepartureSummary(null));

      // 5. Bookings
      api.bookings
        .getAll({ limit: 100 })
        .then((res) => {
          if (res.success && res.bookings) setBookingsList(res.bookings);
        })
        .catch(() => {
          setBookingsList(dataStore.getBookings());
        });

      api.favorites
        .getAdminAll()
        .then((res) => {
          if (!res.success || !Array.isArray(res.favorites)) {
            throw new Error("The favorites response was invalid.");
          }
          setFavoritesList(res.favorites);
          setFavoritesTotal(Number(res.totalSavedTreks) || 0);
          setFavoritesError("");
        })
        .catch((error) => {
          setFavoritesList([]);
          setFavoritesError(error.message || "Unable to load traveler favorites.");
        });

      setContactMessagesLoading(true);
      api.contactMessages
        .getAll()
        .then((res) => {
          if (!res.success || !Array.isArray(res.messages)) {
            throw new Error("The contact-message response was invalid.");
          }
          setContactMessagesError("");
          setContactMessagesList(res.messages);
          setContactMessagesLoading(false);
        })
        .catch((error) => {
          setContactMessagesList([]);
          setContactMessagesError(error.message || "Unable to load contact messages.");
          setContactMessagesLoading(false);
        });

      // 7. Users
      api.admin
        .getUsers()
        .then((res) => {
          if (res.success && res.users) setUsersList(res.users);
        })
        .catch(() => {});

      // 7. Articles
      api.articles
        .getAdminAll()
        .then((res) => {
          if (res.success && res.articles) setArticlesList(res.articles);
        })
        .catch(() => {
          setArticlesList(dataStore.getArticles());
        });

      // 8. Reviews
      api.reviews
        .getAll()
        .then((res) => {
          if (res.success && res.reviews) setReviewsList(res.reviews);
        })
        .catch(() => {});

      // 9. Settings
      api.admin
        .getSettings()
        .then((res) => {
          if (res.success && res.settings) setSettingsData(res.settings);
        })
        .catch(() => {});
    } catch (_err) {
      // Graceful fallback
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      loadDepartures();
    }
  }, [authLoading, user, isAdmin]);

  // ── NAVIGATION SUB-ROUTE SWITCHER ──
  const handleSelectTab = (tabKey) => {
    navigate(`/admin/${tabKey}`);
  };

  // ── TREK ACTIONS ──
  const handleOpenAddTrek = () => {
    setEditingTrek(null);
    setTrekForm({
      title: "",
      slug: "",
      region: "Khumbu",
      location: "Khumbu · Sagarmatha National Park, Nepal",
      duration: 14,
      elevation: 5364,
      difficulty: "Challenging",
      price: 1890,
      featured: false,
      published: true,
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
      description: "Follow the historic stone footsteps into the inner sanctum of the world's tallest peaks.",
      introduction: "Guided by local mountain-born Sherpas.",
      highlights: "Kala Patthar panoramic sunrise\nTengboche Monastery blessing\nNamche Bazaar Sherpa capital",
      included: "Licensed English-speaking certified Sherpa Mountain Guide\nLocal Sherpa Porters (1 porter for 2 trekkers)\nSagarmatha National Park entry permit & TIMS card\nDomestic mountain flights with 15kg baggage allowance\nAll teahouse lodge accommodations on trail\nAll hot meals (Breakfast, Lunch, Dinner) during trek",
      excluded: "Nepal tourist entry visa ($50 for 30 days)\nInternational airfare to/from Kathmandu\nMandatory travel & helicopter evacuation insurance\nPersonal gear (sleeping bag & down jacket rental available)\nTrail incidental expenses (hot showers, charging, Wi-Fi)",
      itineraryText: "Arrive in Kathmandu · Cultural Welcome | 1,400m | Touch down in Kathmandu valley. Meet lead Sherpa guide.\nMountain Flight to Lukla · Trek to Phakding | 2,610m | Mountain flight into Lukla and trek along Dudh Koshi.\nClimb through Sagarmatha Gorge to Namche | 3,440m | Cross Hillary suspension bridge into the Sherpa capital.\nAcclimatization Day · Hotel Everest View | 3,880m | Hike up to Everest View Hotel for panoramic vista.",
      galleryText: "",
      minGroupSize: 1,
      groupCapacity: 12,
      transportation: "",
      accommodation: "",
      meals: "",
      tripType: "",
    });
    setTrekModalOpen(true);
  };

  const handleOpenEditTrek = (t) => {
    setEditingTrek(t);
    const itinString = Array.isArray(t.itinerary)
      ? t.itinerary
        .map((item) => {
          if (typeof item === "object") {
            return `${item.title || item.day || ""} | ${item.elevation || ""} | ${item.details || ""}`;
          }
          return String(item);
        })
        .join("\n")
      : "";

    setTrekForm({
      title: t.title || "",
      slug: t.slug || "",
      region: t.region || "Khumbu",
      location: t.location || `${t.region}, Nepal`,
      duration: t.duration || 14,
      elevation: t.maximumElevation || t.elevation || 5000,
      difficulty: t.difficulty || "Moderate",
      price: t.price || 1500,
      featured: Boolean(t.featured),
      published: t.published !== undefined ? Boolean(t.published) : true,
      image: t.image || t.images?.[0] || "",
      description: t.shortDescription || t.description || "",
      introduction: t.fullDescription || t.introduction || "",
      highlights: Array.isArray(t.highlights) ? t.highlights.join("\n") : (t.highlights || ""),
      included: Array.isArray(t.included || t.inclusions) ? (t.included || t.inclusions).join("\n") : (t.included || ""),
      excluded: Array.isArray(t.excluded || t.exclusions) ? (t.excluded || t.exclusions).join("\n") : (t.excluded || ""),
      itineraryText: itinString,
      galleryText: (
        Array.isArray(t.gallery) && t.gallery.length > 0
          ? t.gallery.map((photo) => (typeof photo === "string" ? photo : photo.url))
          : (t.images || []).filter((url) => url && url !== (t.image || t.images?.[0]))
      ).filter(Boolean).join("\n"),
      minGroupSize: t.minGroupSize ?? 1,
      groupCapacity: t.groupCapacity ?? 12,
      transportation: t.transportation || "",
      accommodation: t.accommodation || "",
      meals: t.meals || "",
      tripType: t.tripType || "",
    });
    setTrekModalOpen(true);
  };

  const handleUploadTrekGallery = async (event) => {
    const input = event.currentTarget;
    const files = input.files;
    if (!files?.length) return;
    setGalleryUploading(true);
    try {
      const response = await api.uploads.trekImages(files);
      const urls = response.images.map((image) => image.url);
      setTrekForm((current) => ({
        ...current,
        galleryText: [current.galleryText, ...urls].filter(Boolean).join("\n"),
      }));
      notify(`${urls.length} trek ${urls.length === 1 ? "photo" : "photos"} uploaded.`);
    } catch (error) {
      notify(error.message || "Unable to upload trek photos.");
    } finally {
      setGalleryUploading(false);
      input.value = "";
    }
  };

  const handleSaveTrekSubmit = async (e) => {
    e.preventDefault();
    if (galleryUploading) {
      notify("Wait for the gallery upload to finish before saving this trek.");
      return;
    }
    if (Number(trekForm.minGroupSize) > Number(trekForm.groupCapacity)) {
      notify("Maximum group size cannot be smaller than the minimum group size.");
      return;
    }
    const slug = editingTrek
      ? editingTrek.slug
      : trekForm.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "trek-" + Date.now();

    const highlightsArr = trekForm.highlights.split("\n").filter((l) => l.trim().length > 0);
    const includedArr = trekForm.included.split("\n").filter((l) => l.trim().length > 0);
    const excludedArr = trekForm.excluded.split("\n").filter((l) => l.trim().length > 0);
    const galleryArr = trekForm.galleryText
      .split("\n")
      .map((url) => url.trim())
      .filter(Boolean)
      .map((url) => ({ url, alt: `${trekForm.title} trekking photo`, caption: "" }));

    const parsedItinerary = trekForm.itineraryText
      ? trekForm.itineraryText
        .split("\n")
        .filter((line) => line.trim().length > 0)
        .map((line, idx) => {
          const parts = line.split("|").map((p) => p.trim());
          return {
            day: String(idx + 1).padStart(2, "0"),
            title: parts[0] || `Day ${idx + 1}`,
            elevation: parts[1] || "",
            details: parts[2] || parts[0] || "",
          };
        })
      : editingTrek?.itinerary || [];

    const payload = {
      title: trekForm.title,
      slug,
      region: trekForm.region,
      location: trekForm.location,
      duration: Number(trekForm.duration),
      maximumElevation: Number(trekForm.elevation),
      difficulty: trekForm.difficulty,
      price: Number(trekForm.price),
      featured: Boolean(trekForm.featured),
      published: Boolean(trekForm.published),
      images: [trekForm.image, ...galleryArr.map((photo) => photo.url)].filter(Boolean),
      gallery: galleryArr,
      minGroupSize: Number(trekForm.minGroupSize) || 1,
      groupCapacity: Number(trekForm.groupCapacity) || 12,
      transportation: trekForm.transportation.trim(),
      accommodation: trekForm.accommodation.trim(),
      meals: trekForm.meals.trim(),
      tripType: trekForm.tripType.trim(),
      shortDescription: trekForm.description,
      fullDescription: trekForm.introduction,
      highlights: highlightsArr,
      inclusions: includedArr,
      exclusions: excludedArr,
      included: includedArr,
      excluded: excludedArr,
      itinerary: parsedItinerary,
    };

    try {
      if (editingTrek && editingTrek._id) {
        await api.treks.update(editingTrek._id, payload);
      } else {
        await api.treks.create(payload);
      }
      notify(editingTrek ? `Updated: ${trekForm.title}` : `Created: ${trekForm.title}`);
    } catch (_err) {
      notify("Trek saved locally & updated on live frontend.");
    }

    // Always update local dataStore and broadcast to frontend
    dataStore.saveTrek({
      ...payload,
      image: trekForm.image,
      elevation: payload.maximumElevation,
      description: payload.shortDescription,
      included: includedArr,
      excluded: excludedArr,
      itinerary: parsedItinerary,
    });
    window.dispatchEvent(new Event("agaaman_data_changed"));
    setTrekModalOpen(false);
    loadDashboardData();
  };

  const handleDeleteTrek = (id, slug, title) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete "${title}"?`,
      message: "This will permanently remove this trek from the catalog, map routes, and search results.",
      confirmLabel: "Delete Trek",
      onConfirm: async () => {
        try {
          if (id) await api.treks.delete(id);
        } catch (_e) { }
        dataStore.deleteTrek(slug);
        window.dispatchEvent(new Event("agaaman_data_changed"));
        notify(`Deleted "${title}"`);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        loadDashboardData();
      },
    });
  };

  const handleTogglePublish = async (id, slug, currentVal) => {
    try {
      if (id) await api.treks.togglePublish(id);
    } catch (_e) { }
    const trek = dataStore.getTrek(slug);
    if (trek) {
      dataStore.saveTrek({ ...trek, published: !currentVal });
    }
    window.dispatchEvent(new Event("agaaman_data_changed"));
    notify(`Trek ${currentVal ? "hidden" : "published live"}.`);
    loadDashboardData();
  };

  const handleToggleFeatured = async (id, slug, currentVal) => {
    try {
      if (id) await api.treks.toggleFeatured(id);
    } catch (_e) { }
    const trek = dataStore.getTrek(slug);
    if (trek) {
      dataStore.saveTrek({ ...trek, featured: !currentVal });
    }
    window.dispatchEvent(new Event("agaaman_data_changed"));
    notify(`Trek ${currentVal ? "unmarked" : "featured on homepage"}.`);
    loadDashboardData();
  };

  // ── REGION ACTIONS ──
  const handleOpenAddRegion = () => {
    setEditingRegion(null);
    setRegionForm({
      name: "",
      slug: "",
      label: "",
      tagline: "",
      description: "",
      image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80",
      maxElevation: 5400,
      lat: "28.0",
      lng: "85.0",
      bestSeason: "Spring, Autumn",
      highlights: "",
      gradingList: "Challenging, Strenuous, Moderate, Easy",
      permits: "Conservation Area Entry Permit, TIMS Card",
    });
    setRegionModalOpen(true);
  };

  const handleOpenEditRegion = (r) => {
    setEditingRegion(r);
    setRegionForm({
      name: r.name || "",
      slug: r.slug || "",
      label: r.label || r.name || "",
      tagline: r.tagline || "",
      description: r.description || "",
      image: r.image || "",
      maxElevation: r.maxElevation || 5400,
      lat: String(r.coordinates?.lat || r.lat || "28.0"),
      lng: String(r.coordinates?.lng || r.lng || "85.0"),
      bestSeason: Array.isArray(r.bestSeason) ? r.bestSeason.join(", ") : (r.bestSeason || "Spring, Autumn"),
      highlights: Array.isArray(r.highlights) ? r.highlights.join("\n") : (r.highlights || ""),
      gradingList: Array.isArray(r.gradingList) ? r.gradingList.join(", ") : (r.gradingList || "Challenging, Strenuous, Moderate, Easy"),
      permits: Array.isArray(r.permits) ? r.permits.join(", ") : (r.permits || ""),
    });
    setRegionModalOpen(true);
  };

  const handleSaveRegionSubmit = async (e) => {
    e.preventDefault();
    const slug = regionForm.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      || regionForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      || `region-${Date.now()}`;

    const highlightsArr = regionForm.highlights.split("\n").filter((l) => l.trim().length > 0);
    const bestSeasonArr = regionForm.bestSeason.split(",").map((s) => s.trim()).filter(Boolean);
    const gradingArr = regionForm.gradingList.split(",").map((s) => s.trim()).filter(Boolean);
    const permitsArr = regionForm.permits.split(",").map((s) => s.trim()).filter(Boolean);

    const payload = {
      name: regionForm.name,
      slug,
      label: regionForm.label || regionForm.name,
      tagline: regionForm.tagline,
      description: regionForm.description,
      image: regionForm.image,
      coordinates: { lat: Number(regionForm.lat), lng: Number(regionForm.lng) },
      maxElevation: Number(regionForm.maxElevation || 5400),
      bestSeason: bestSeasonArr,
      highlights: highlightsArr,
      gradingList: gradingArr,
      permits: permitsArr,
    };

    try {
      if (editingRegion?._id) {
        await api.regions.update(editingRegion._id, payload);
        notify(`✅ Updated region: ${regionForm.name}`);
      } else {
        await api.regions.create(payload);
        notify(`✅ Created region: ${regionForm.name}`);
      }
    } catch (err) {
      notify(`⚠️ ${err?.message || "Failed to save region — check server connection."}`);
      return; // Don't close modal on error
    }

    // Reload from API to get proper _id fields
    try {
      const freshRes = await api.regions.getAll();
      if (freshRes.success && freshRes.regions) {
        const normalized = freshRes.regions.map((r) => ({
          id: r._id || r.id,
          _id: r._id || r.id,
          slug: r.slug,
          name: r.name,
          label: r.label || r.name,
          tagline: r.tagline || "",
          description: r.description || "",
          image: r.image || "",
          coordinates: r.coordinates || { lat: 28.0, lng: 85.0 },
          maxElevation: r.maxElevation ?? 5400,
          bestSeason: r.bestSeason || [],
          highlights: r.highlights || [],
          gradingList: r.gradingList || [],
          permits: r.permits || [],
        }));
        normalized.forEach((reg) => dataStore.saveRegion(reg, { persist: false }));
        setRegionsList(normalized);
      }
    } catch (_e) {
      setRegionsList(dataStore.getRegions());
    }

    window.dispatchEvent(new Event("agaaman_data_changed"));
    setRegionModalOpen(false);
  };

  const handleDeleteRegion = (idOrSlug, name, slug) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Region: "${name}"?`,
      message: "Are you sure you want to remove this mountain territory? Associated trails and destinations will remain intact.",
      confirmLabel: "Delete Region",
      onConfirm: async () => {
        try {
          if (/^[a-f0-9]{24}$/i.test(String(idOrSlug))) {
            await api.regions.delete(idOrSlug);
          }
          dataStore.deleteRegion(idOrSlug || slug, { persist: false });
          if (slug && slug !== idOrSlug) dataStore.deleteRegion(slug, { persist: false });
          notify(`✅ Deleted region: "${name}"`);
        } catch (err) {
          notify(`⚠️ ${err?.message || "Failed to delete region"}`);
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          return;
        }
        // Reload from API
        try {
          const freshRes = await api.regions.getAll();
          if (freshRes.success && freshRes.regions) {
            const normalized = freshRes.regions.map((r) => ({
              id: r._id || r.id, _id: r._id || r.id, slug: r.slug,
              name: r.name, label: r.label || r.name,
            }));
            normalized.forEach((reg) => dataStore.saveRegion(reg, { persist: false }));
            setRegionsList(normalized.length ? normalized : dataStore.getRegions());
          } else {
            setRegionsList(dataStore.getRegions());
          }
        } catch (_e) {
          setRegionsList(dataStore.getRegions());
        }
        window.dispatchEvent(new Event("agaaman_data_changed"));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // ── DESTINATION ACTIONS ──
  const handleOpenAddDest = () => {
    setEditingDest(null);
    setDestForm({
      name: "",
      slug: "",
      region: regionsList[0]?.name || "Everest Region",
      elevation: 0,
      trekSlugs: [],
      description: "",
      highlights: "",
      lat: "27.8",
      lng: "86.7",
      bestSeason: "Spring, Autumn",
      image: "",
      attractionsText: "",
      stayTypesText: "",
      cultureText: "",
      ethnicGroups: "",
      etiquetteText: "",
      sideTripsText: "",
    });
    setDestModalOpen(true);
  };

  const handleOpenEditDest = (d) => {
    setEditingDest(d);
    const culture = d.culturalHighlights || {};
    setDestForm({
      name: d.name || "",
      slug: d.slug || "",
      region: d.region || "Everest Region",
      elevation: d.elevation || 0,
      trekSlugs: Array.isArray(d.trekSlugs) ? d.trekSlugs : [],
      description: d.description || "",
      highlights: Array.isArray(d.highlights) ? d.highlights.join("\n") : (d.highlights || ""),
      lat: String(d.coordinates?.lat || d.lat || "27.8"),
      lng: String(d.coordinates?.lng || d.lng || "86.7"),
      bestSeason: Array.isArray(d.bestSeason) ? d.bestSeason.join(", ") : (d.bestSeason || "Spring, Autumn"),
      image: d.images?.[0] || d.image || "",
      attractionsText: (d.attractions || []).map((a) => `${a.name} | ${a.type || "Landmark"} | ${a.description || ""}`).join("\n"),
      stayTypesText: (d.accommodationTypes || []).map((s) => `${s.type} | ${s.badge || ""} | ${s.description || ""}`).join("\n"),
      cultureText: culture.overview || "",
      ethnicGroups: (culture.ethnicGroups || []).join(", "),
      etiquetteText: (culture.etiquette || []).join("\n"),
      sideTripsText: (d.nearbySideTrips || []).map((t) => `${t.name} | ${t.duration || ""} | ${t.elevation || ""} | ${t.description || ""}`).join("\n"),
    });
    setDestModalOpen(true);
  };

  const handleSaveDestSubmit = async (e) => {
    e.preventDefault();
    const slug = editingDest
      ? editingDest.slug
      : destForm.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
      destForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") ||
      "dest-" + Date.now();

    const highlightsArr = destForm.highlights.split("\n").filter((l) => l.trim().length > 0);
    const bestSeasonArr = destForm.bestSeason.split(",").map((s) => s.trim()).filter(Boolean);

    // Parse rich fields from text boxes (pipe-separated)
    const attractions = destForm.attractionsText
      .split("\n")
      .filter((l) => l.trim())
      .map((l) => { const [name, type, description] = l.split("|").map((s) => s.trim()); return { name: name || l, type: type || "Landmark", description: description || "" }; });

    const accommodationTypes = destForm.stayTypesText
      .split("\n")
      .filter((l) => l.trim())
      .map((l) => { const [type, badge, description] = l.split("|").map((s) => s.trim()); return { type: type || l, badge, description: description || "", amenities: [] }; });

    const culturalHighlights = {
      ethnicGroups: destForm.ethnicGroups.split(",").map((s) => s.trim()).filter(Boolean),
      overview: destForm.cultureText,
      etiquette: destForm.etiquetteText.split("\n").filter((l) => l.trim()),
    };

    const nearbySideTrips = destForm.sideTripsText
      .split("\n")
      .filter((l) => l.trim())
      .map((l) => { const [name, duration, elevation, description] = l.split("|").map((s) => s.trim()); return { name: name || l, duration, elevation, description: description || "" }; });

    const payload = {
      name: destForm.name,
      slug,
      region: destForm.region,
      elevation: Number(destForm.elevation || 0),
      description: destForm.description,
      images: [destForm.image],
      coordinates: { lat: Number(destForm.lat), lng: Number(destForm.lng) },
      highlights: highlightsArr,
      bestSeason: bestSeasonArr,
      attractions,
      accommodationTypes,
      culturalHighlights,
      nearbySideTrips,
      trekSlugs: destForm.trekSlugs || [],
    };

    try {
      if (editingDest && editingDest._id) {
        await api.destinations.update(editingDest._id, payload);
      } else {
        await api.destinations.create(payload);
      }
      notify(editingDest ? `Updated destination: ${destForm.name}` : `Created destination: ${destForm.name}`);
    } catch (err) {
      notify(err.message || "Failed to save destination.");
      return;
    }

    dataStore.saveDestination({
      ...payload,
      id: editingDest?._id || editingDest?.id,
      lat: Number(destForm.lat),
      lng: Number(destForm.lng),
      image: destForm.image,
    }, { persist: false });
    setDestinationsList(dataStore.getDestinations());
    window.dispatchEvent(new Event("agaaman_data_changed"));
    setDestModalOpen(false);
    loadDashboardData();
  };

  // ── GUIDE ACTIONS ──
  const handleOpenAddGuide = () => {
    setEditingGuide(null);
    setGuideForm({
      title: "",
      category: "altitude",
      categoryLabel: "Altitude & Acclimatization",
      type: "article",
      summary: "",
      content: "",
      rules: [{ id: "r1", title: "", text: "" }],
    });
    setGuideModalOpen(true);
  };

  const handleOpenEditGuide = (g) => {
    setEditingGuide(g);
    setGuideForm({
      title: g.title || "",
      category: g.category || "altitude",
      categoryLabel: g.categoryLabel || "Altitude & Acclimatization",
      type: g.type || "article",
      summary: g.summary || "",
      content: g.content || "",
      rules: g.rules && g.rules.length > 0 ? g.rules : [{ id: "r1", title: "", text: "" }],
    });
    setGuideModalOpen(true);
  };

  const handleSaveGuide = (e) => {
    e.preventDefault();
    const id = editingGuide ? editingGuide.id : "guide-" + Date.now();
    const categoryLabels = {
      altitude: "Altitude & Acclimatization",
      permits: "Permits & TIMS 2026",
      packing: "Interactive Gear Checklist",
      seasons: "Seasons & Weather",
      culture: "Teahouse & Sherpa Culture",
      faq: "Trail FAQs",
    };
    const saved = dataStore.saveGuide({
      ...guideForm,
      id,
      categoryLabel: categoryLabels[guideForm.category] || guideForm.categoryLabel,
    });
    setGuidesList(dataStore.getGuides());
    window.dispatchEvent(new Event("agaaman_data_changed"));
    notify(editingGuide ? `Guide updated: "${guideForm.title}"` : `Guide created: "${guideForm.title}"`);
    setGuideModalOpen(false);
  };

  const handleDeleteGuide = (id, title) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Guide: "${title}"?`,
      message: "This guide article will be removed from the Trekking Guide page immediately.",
      confirmLabel: "Delete Guide",
      onConfirm: () => {
        dataStore.deleteGuide(id);
        setGuidesList(dataStore.getGuides());
        window.dispatchEvent(new Event("agaaman_data_changed"));
        notify(`Deleted guide: "${title}"`);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleDeleteDest = (id, slug, name) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete "${name}"?`,
      message: "This destination will be removed from all destination listings, regions, and Himalayan map pins.",
      confirmLabel: "Delete Destination",
      onConfirm: async () => {
        try {
          if (!id) throw new Error("Destination ID is missing.");
          await api.destinations.delete(id);
        } catch (err) {
          notify(err.message || "Failed to delete destination.");
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          return;
        }
        dataStore.deleteDestination(id || slug, { persist: false });
        if (slug && slug !== id) dataStore.deleteDestination(slug, { persist: false });
        window.dispatchEvent(new Event("agaaman_data_changed"));
        notify(`Deleted destination: "${name}"`);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        loadDashboardData();
      },
    });
  };

  // ── DEPARTURE ACTIONS ──
  const handleOpenAddDeparture = () => {
    setEditingDeparture(null);
    setDepForm({
      trekSlug: treksList[0]?.slug || "",
      startDate: "",
      endDate: "",
      bookingClosingDate: "",
      price: Number(treksList[0]?.price || 0),
      originalPrice: "",
      capacity: 12,
      minGroupSize: 1,
      status: "Available",
      published: true,
    });
    setDepModalOpen(true);
  };

  const handleOpenEditDeparture = (departure) => {
    setEditingDeparture(departure);
    setDepForm({
      trekSlug: departure.trek?.slug || departure.trekSlug || "",
      startDate: departure.startDate ? new Date(departure.startDate).toISOString().slice(0, 10) : "",
      endDate: departure.endDate ? new Date(departure.endDate).toISOString().slice(0, 10) : "",
      bookingClosingDate: departure.bookingClosingDate
        ? new Date(departure.bookingClosingDate).toISOString().slice(0, 10)
        : "",
      price: Number(departure.price || 0),
      originalPrice: departure.originalPrice ?? "",
      capacity: Number(departure.capacity || 1),
      minGroupSize: Number(departure.minGroupSize || 1),
      status: departure.status || "Available",
      published: departure.published !== false,
    });
    setDepModalOpen(true);
  };

  const handleSaveDeparture = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...depForm,
        capacity: Number(depForm.capacity),
        minGroupSize: Number(depForm.minGroupSize),
        price: Number(depForm.price),
        originalPrice: depForm.originalPrice === "" ? null : Number(depForm.originalPrice),
        bookingClosingDate: depForm.bookingClosingDate || null,
      };
      if (editingDeparture?._id) {
        await api.departures.update(editingDeparture._id, payload);
        notify("Group departure updated.");
      } else {
        await api.departures.create(payload);
        notify("New group departure scheduled!");
      }
    } catch (err) {
      notify(err.message || "Failed to save group departure.");
      return;
    }
    window.dispatchEvent(new Event("agaaman_data_changed"));
    setDepModalOpen(false);
    setEditingDeparture(null);
    loadDashboardData();
  };

  const handleDepartureUpdate = async (departure, changes, actionLabel) => {
    try {
      const response = await api.departures.update(departure._id || departure.id, changes);
      const notifications = response.notifications;
      notify(
        actionLabel === "cancelled" && notifications
          ? notifications.failed === null
            ? "Departure cancelled. Notification delivery could not be verified; check the server logs."
            : `Departure cancelled. ${notifications.sent} traveler notification(s) sent${notifications.failed ? `; ${notifications.failed} failed` : ""}.`
          : `Departure ${actionLabel}.`
      );
      loadDashboardData();
    } catch (error) {
      notify(error.message || `Unable to ${actionLabel.toLowerCase()} departure.`);
    }
  };

  const handleCancelDeparture = (departure) => {
    setConfirmModal({
      isOpen: true,
      title: "Cancel this departure?",
      message: "The departure will no longer accept new bookings. Its bookings and history will be preserved.",
      confirmLabel: "Cancel Departure",
      onConfirm: async () => {
        await handleDepartureUpdate(departure, { status: "Cancelled" }, "cancelled");
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const handleDeleteDeparture = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Group Departure?",
      message: "This will remove this scheduled fixed departure date from the booking calendars.",
      confirmLabel: "Delete Date",
      onConfirm: async () => {
        try {
          if (!id) throw new Error("Departure ID is missing.");
          await api.departures.delete(id);
        } catch (err) {
          notify(err.message || "Failed to delete departure.");
          setConfirmModal((prev) => ({ ...prev, isOpen: false }));
          return;
        }
        dataStore.deleteDeparture(id);
        window.dispatchEvent(new Event("agaaman_data_changed"));
        notify("Departure removed.");
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        loadDashboardData();
      },
    });
  };

  const handleOpenAddArticle = () => {
    setEditingArticle(null);
    setArticleForm({
      title: "",
      slug: "",
      summary: "",
      content: "",
      coverImage: "",
      author: user?.name || "",
      category: "Field Notes",
      readTime: "6 min read",
      publicationStatus: "Draft",
    });
    setArticleModalOpen(true);
  };

  const handleOpenEditArticle = (article) => {
    setEditingArticle(article);
    setArticleForm({
      title: article.title || "",
      slug: article.slug || "",
      summary: article.summary || "",
      content: article.content || "",
      coverImage: article.coverImage || article.image || "",
      author: typeof article.author === "string" ? article.author : article.author?.name || "",
      category: article.category || "Field Notes",
      readTime: article.readTime || article.read || "6 min read",
      publicationStatus: article.publicationStatus || "Draft",
    });
    setArticleModalOpen(true);
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    const slug = articleForm.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
      || articleForm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const payload = { ...articleForm, slug };
    try {
      if (editingArticle?._id) {
        await api.articles.update(editingArticle._id, payload);
        notify(`Article updated: "${payload.title}"`);
      } else {
        await api.articles.create(payload);
        notify(`Article created: "${payload.title}"`);
      }
      setArticleModalOpen(false);
      setEditingArticle(null);
    } catch (err) {
      notify(err.message || "Failed to save article.");
      return;
    }
    try {
      const response = await api.articles.getAdminAll();
      if (response.success) setArticlesList(response.articles || []);
    } catch (err) {
      notify(`Article saved, but the list could not be refreshed: ${err.message}`);
    }
  };

  const handleDeleteArticle = (article) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete article "${article.title}"?`,
      message: "This article will be removed from the public journal.",
      confirmLabel: "Delete Article",
      onConfirm: async () => {
        try {
          await api.articles.delete(article._id);
          setArticlesList((current) => current.filter((item) => item._id !== article._id));
          notify("Article deleted.");
        } catch (err) {
          notify(err.message || "Failed to delete article.");
        }
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // ── BOOKING ACTIONS (FULL CRUD) ──
  const handleUpdateBooking = async (id, bookingStatus, paymentStatus) => {
    try {
      if (id) await api.bookings.updateStatus(id, { bookingStatus, paymentStatus });
      notify(`Booking status set to '${bookingStatus}'.`);
      loadDashboardData();
    } catch (err) {
      notify(err.message || "Failed to update booking status.");
    }
  };

  const handleOpenEditBooking = (b) => {
    const lead = b.travelerDetails?.[0] || {};
    setEditingBooking(b);
    setEditBookingForm({
      fullName: lead.fullName || b.name || "",
      email: lead.email || b.email || "",
      phone: lead.phone || b.phone || "",
      nationality: lead.nationality || b.country || "",
      travelers: b.numberOfTravelers || b.travelers || 1,
      departureId: b.departure?._id || b.departure?.id || b.departure || "",
      totalAmount: b.totalAmount || 0,
      bookingStatus: b.bookingStatus || "Pending",
      paymentStatus: b.paymentStatus || "Pending",
      notes: b.notes || "",
    });
  };

  const handleSaveEditBooking = async (e) => {
    e.preventDefault();
    if (!editingBooking) return;
    try {
      const bId = editingBooking._id || editingBooking.id;
      const payload = {
        numberOfTravelers: Number(editBookingForm.travelers),
        totalAmount: Number(editBookingForm.totalAmount),
        bookingStatus: editBookingForm.bookingStatus,
        paymentStatus: editBookingForm.paymentStatus,
        notes: editBookingForm.notes,
        travelerDetails: [
          {
            fullName: editBookingForm.fullName,
            email: editBookingForm.email,
            phone: editBookingForm.phone,
            nationality: editBookingForm.nationality,
            dietaryRequirements: editingBooking.travelerDetails?.[0]?.dietaryRequirements || "None",
            emergencyContact: editingBooking.travelerDetails?.[0]?.emergencyContact || "",
          },
        ],
      };
      if (editBookingForm.departureId) {
        payload.departureId = editBookingForm.departureId;
      }
      await api.bookings.update(bId, payload);
      notify(`Booking ${editingBooking.bookingReference || bId} updated successfully.`);
      setEditingBooking(null);
      loadDashboardData();
    } catch (err) {
      notify(err.message || "Failed to update booking.");
    }
  };

  const handleDeleteBooking = (id, refCode) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete Booking "${refCode || id}"?`,
      message: "This will permanently remove this customer reservation and safely restore departure group capacity.",
      confirmLabel: "Delete Booking",
      onConfirm: async () => {
        try {
          if (id) await api.bookings.delete(id);
          notify(`Deleted booking ${refCode || id}`);
        } catch (err) {
          notify(err.message || "Failed to delete booking.");
        }
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        loadDashboardData();
      },
    });
  };

  // ── TREK SOFT-ARCHIVE & FEATURED ORDER ACTIONS ──
  const handleToggleArchiveTrek = async (id, slug, title, isCurrentlyArchived) => {
    try {
      if (id) await api.treks.toggleArchive(id);
      notify(`Trek "${title}" is now ${isCurrentlyArchived ? "restored to active" : "soft-archived"}.`);
      loadDashboardData();
    } catch (err) {
      notify(err.message || "Failed to toggle archive status.");
    }
  };

  const handleUpdateFeaturedOrder = async (id, featured, order) => {
    try {
      if (id) await api.rankings.setFeatured(id, { featured, featuredOrder: Number(order) });
      notify("Featured ranking order saved.");
      loadDashboardData();
    } catch (err) {
      notify(err.message || "Failed to update featured order.");
    }
  };

  // ── USER MANAGEMENT ACTIONS ──
  const handleToggleUserRole = async (id, currentRole, name) => {
    const newRole = currentRole === "admin" ? "traveler" : "admin";
    try {
      await api.admin.updateUserRole(id, newRole);
      notify(`Changed ${name}'s role to '${newRole}'.`);
      loadDashboardData();
    } catch (err) {
      notify(err.message || "Failed to update user role.");
    }
  };

  const handleToggleUserStatus = async (id, currentStatus, name) => {
    const newStatus = currentStatus === "active" ? "suspended" : "active";
    try {
      await api.admin.updateUserStatus(id, newStatus);
      notify(`User ${name} is now '${newStatus}'.`);
      loadDashboardData();
    } catch (err) {
      notify(err.message || "Failed to update user status.");
    }
  };

  const handleDeleteUser = (id, email) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete User "${email}"?`,
      message: "Are you sure you want to permanently delete this user account? This cannot be undone.",
      confirmLabel: "Delete User",
      onConfirm: async () => {
        try {
          await api.admin.deleteUser(id);
          notify(`Deleted user account: ${email}`);
        } catch (err) {
          notify(err.message || "Failed to delete user account.");
        }
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        loadDashboardData();
      },
    });
  };

  // ── REVIEWS MODERATION ACTIONS ──
  const handleModerateReview = async (id, moderationStatus) => {
    try {
      await api.reviews.moderate(id, moderationStatus);
      notify(`Review moderation updated to '${moderationStatus}'. Trek rating recalculated.`);
      loadDashboardData();
    } catch (err) {
      notify(err.message || "Failed to update review moderation.");
    }
  };

  const handleDeleteReview = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Customer Review?",
      message: "Are you sure you want to permanently remove this review? Trek aggregate ratings will recalculate automatically.",
      confirmLabel: "Delete Review",
      onConfirm: async () => {
        try {
          await api.reviews.delete(id);
          notify("Review removed and trek rating recalculated.");
        } catch (err) {
          notify(err.message || "Failed to delete review.");
        }
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        loadDashboardData();
      },
    });
  };

  // ── SETTINGS ACTIONS ──
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.admin.updateSettings(settingsData);
      notify("System settings saved.");
    } catch {
      notify("Settings saved locally.");
    }
  };

  if (!user || !isAdmin) {
    return null;
  }

  const filteredDepartures = departuresList.filter((departure) => {
    const trekName = departure.trek?.title || departure.trekTitle || departure.trekSlug || "";
    const date = new Date(departure.startDate);
    const from = departureDateFrom ? new Date(`${departureDateFrom}T00:00:00.000Z`) : null;
    const to = departureDateTo ? new Date(`${departureDateTo}T23:59:59.999Z`) : null;
    return (
      (!departureSearch || trekName.toLowerCase().includes(departureSearch.trim().toLowerCase())) &&
      (!from || date >= from) &&
      (!to || date <= to) &&
      (departureStatusFilter === "all" ||
        getDepartureStatus(departure) === departureStatusFilter ||
        departure.status === departureStatusFilter)
    );
  });

  return (
    <div className="adm-layout">
      {/* ════════════════════════════════════════════
          1. ELEGANT MINIMALIST SIDEBAR
         ════════════════════════════════════════════ */}
      <aside className="adm-sidebar">
        <div className="adm-sidebar-header">
          <Link to="/" className="adm-brand-link" title="Open live public site">
            <div className="adm-brand-icon">
              <Mountain size={20} />
            </div>
            <div className="adm-brand-text">
              <span className="adm-brand-name">Agaaman</span>
              <span className="adm-brand-badge">Admin Console</span>
            </div>
          </Link>
        </div>

        <nav className="adm-sidebar-nav">
          <span className="adm-nav-category">Overview</span>
          <button
            type="button"
            className={`adm-nav-item${activeTab === "dashboard" ? " is-active" : ""}`}
            onClick={() => handleSelectTab("dashboard")}
          >
            <div className="adm-nav-item-left">
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </div>
          </button>

          <span className="adm-nav-category">Expeditions & Content</span>
          <button
            type="button"
            className={`adm-nav-item${activeTab === "treks" ? " is-active" : ""}`}
            onClick={() => handleSelectTab("treks")}
          >
            <div className="adm-nav-item-left">
              <Compass size={18} />
              <span>Treks & Trails</span>
            </div>
            <span className="adm-badge-count">{treksList.length}</span>
          </button>

          <button
            type="button"
            className={`adm-nav-item${activeTab === "regions" ? " is-active" : ""}`}
            onClick={() => handleSelectTab("regions")}
          >
            <div className="adm-nav-item-left">
              <Compass size={18} />
              <span>Regions & Zones</span>
            </div>
            <span className="adm-badge-count">{regionsList.length}</span>
          </button>

          <button
            type="button"
            className={`adm-nav-item${activeTab === "destinations" ? " is-active" : ""}`}
            onClick={() => handleSelectTab("destinations")}
          >
            <div className="adm-nav-item-left">
              <MapPin size={18} />
              <span>Destinations & Hubs</span>
            </div>
            <span className="adm-badge-count">{destinationsList.length}</span>
          </button>

          <button
            type="button"
            className={`adm-nav-item${activeTab === "departures" ? " is-active" : ""}`}
            onClick={() => handleSelectTab("departures")}
          >
            <div className="adm-nav-item-left">
              <Calendar size={18} />
              <span>Group Departures</span>
            </div>
            <span className="adm-badge-count">{departuresList.length}</span>
          </button>

          <button
            type="button"
            className={`adm-nav-item${activeTab === "content" ? " is-active" : ""}`}
            onClick={() => handleSelectTab("content")}
          >
            <div className="adm-nav-item-left">
              <FileText size={18} />
              <span>Journal & Reviews</span>
            </div>
            <span className={`adm-badge-count${(stats.pendingReviews || reviewsList.filter((r) => r.moderationStatus === "pending").length) > 0 ? " has-pending" : ""}`}>
              {articlesList.length + reviewsList.length}
            </span>
          </button>

          <button
            type="button"
            className={`adm-nav-item${activeTab === "guides" ? " is-active" : ""}`}
            onClick={() => handleSelectTab("guides")}
          >
            <div className="adm-nav-item-left">
              <Mountain size={18} />
              <span>Trail Guides</span>
            </div>
            <span className="adm-badge-count">{guidesList.length}</span>
          </button>

          <span className="adm-nav-category">Operations</span>
          <button
            type="button"
            className={`adm-nav-item${activeTab === "bookings" ? " is-active" : ""}`}
            onClick={() => handleSelectTab("bookings")}
          >
            <div className="adm-nav-item-left">
              <CheckCircle2 size={18} />
              <span>Bookings</span>
            </div>
            <span className={`adm-badge-count${stats.pendingBookings > 0 ? " has-pending" : ""}`}>
              {bookingsList.length}
            </span>
          </button>

          <button
            type="button"
            className={`adm-nav-item${activeTab === "favorites" ? " is-active" : ""}`}
            onClick={() => handleSelectTab("favorites")}
          >
            <div className="adm-nav-item-left">
              <Heart size={18} />
              <span>Traveler Favorites</span>
            </div>
            <span className="adm-badge-count">{favoritesTotal}</span>
          </button>

          <button
            type="button"
            className={`adm-nav-item${activeTab === "contacts" ? " is-active" : ""}`}
            onClick={() => handleSelectTab("contacts")}
          >
            <div className="adm-nav-item-left">
              <Mail size={18} />
              <span>Contact Messages</span>
            </div>
            <span className={`adm-badge-count${contactMessagesList.some((message) => message.status === "New") ? " has-pending" : ""}`}>
              {contactMessagesList.length}
            </span>
          </button>

          <button
            type="button"
            className={`adm-nav-item${activeTab === "users" ? " is-active" : ""}`}
            onClick={() => handleSelectTab("users")}
          >
            <div className="adm-nav-item-left">
              <Users size={18} />
              <span>User Accounts</span>
            </div>
            <span className="adm-badge-count">{usersList.length || 2}</span>
          </button>

          <button
            type="button"
            className={`adm-nav-item${activeTab === "settings" ? " is-active" : ""}`}
            onClick={() => handleSelectTab("settings")}
          >
            <div className="adm-nav-item-left">
              <Settings size={18} />
              <span>Settings</span>
            </div>
          </button>
        </nav>

        {/* Sidebar Footer User Info */}
        <div className="adm-sidebar-footer">
          <div className="adm-user-snippet">
            <div className="adm-user-avatar">
              {user.name ? user.name[0].toUpperCase() : "A"}
            </div>
            <div className="adm-user-details">
              <span className="adm-user-name">{user.name || "Administrator"}</span>
              <span className="adm-user-role">Super Admin</span>
            </div>
          </div>
          <button
            type="button"
            className="adm-logout-btn"
            onClick={() => {
              logout();
              navigate("/admin/login");
            }}
            title="Sign out of Admin"
          >
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* ════════════════════════════════════════════
          2. TOP HEADER & MAIN WORKSPACE
         ════════════════════════════════════════════ */}
      <main className="adm-main">
        {/* Top bar */}
        <header className="adm-topbar">
          <div className="adm-topbar-left">
            <div className="adm-breadcrumbs">
              <Link to="/admin/dashboard" className="adm-breadcrumb-root">Admin</Link>
              <span className="adm-breadcrumb-sep">/</span>
              <span className="adm-breadcrumb-current">{activeTab}</span>
            </div>
          </div>

          <div className="adm-topbar-right">
            <button
              type="button"
              className="adm-icon-btn"
              onClick={loadDashboardData}
              title="Refresh console data"
            >
              <RefreshCw size={15} />
            </button>
            <Link to="/" target="_blank" className="adm-live-site-btn">
              <Eye size={15} />
              <span>Live Public Site ↗</span>
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <div className="adm-body">
          {/* ════════════════════════════════════════
              TAB 1: DASHBOARD OVERVIEW
             ════════════════════════════════════════ */}
          {activeTab === "dashboard" && (
            <div>
              <div className="adm-pane-header">
                <div className="adm-pane-title">
                  <h2>Executive Overview</h2>
                  <p>Real-time analytics, revenue, booking inquiries, and expedition status.</p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="button" className="adm-btn-primary" onClick={handleOpenAddTrek}>
                    <Plus size={16} /> New Trek Package
                  </button>
                  <button type="button" className="adm-btn-primary" style={{ background: "#0284c7" }} onClick={handleOpenAddDest}>
                    <Plus size={16} /> Add Destination
                  </button>
                </div>
              </div>

              {/* Metric Cards Grid */}
              <div className="adm-metrics-grid">
                <div className="adm-metric-card">
                  <div className="adm-metric-info">
                    <span className="adm-metric-label">Confirmed Revenue</span>
                    <span className="adm-metric-value">${stats.totalRevenue?.toLocaleString()}</span>
                    <span className="adm-metric-sub">↑ Real-time verified gateway volume</span>
                  </div>
                  <div className="adm-metric-icon green">
                    <DollarSign size={22} />
                  </div>
                </div>

                <div className="adm-metric-card">
                  <div className="adm-metric-info">
                    <span className="adm-metric-label">Active Expeditions</span>
                    <span className="adm-metric-value">{stats.activeTreks ?? treksList.filter((t) => !t.isArchived).length}</span>
                    <span className="adm-metric-sub" style={{ color: stats.archivedTreks > 0 ? "#64748b" : "#10b981" }}>
                      {stats.archivedTreks ?? treksList.filter((t) => t.isArchived).length} soft-archived
                    </span>
                  </div>
                  <div className="adm-metric-icon">
                    <Compass size={22} />
                  </div>
                </div>

                <div className="adm-metric-card">
                  <div className="adm-metric-info">
                    <span className="adm-metric-label">Traveler Bookings</span>
                    <span className="adm-metric-value">{stats.totalBookings ?? bookingsList.length}</span>
                    <span className="adm-metric-sub" style={{ color: (stats.pendingBookings || 0) > 0 ? "#ea580c" : "#10b981" }}>
                      {stats.pendingBookings || bookingsList.filter((b) => (b.bookingStatus || "Pending").toLowerCase() === "pending").length} pending confirmation
                    </span>
                  </div>
                  <div className="adm-metric-icon blue">
                    <CheckCircle2 size={22} />
                  </div>
                </div>

                <div className="adm-metric-card">
                  <div className="adm-metric-info">
                    <span className="adm-metric-label">Registered Users</span>
                    <span className="adm-metric-value">{stats.totalUsers ?? usersList.length}</span>
                    <span className="adm-metric-sub">Admin & Traveler accounts</span>
                  </div>
                  <div className="adm-metric-icon purple">
                    <Users size={22} />
                  </div>
                </div>
              </div>

              <div className="adm-card" style={{ marginBottom: "28px" }}>
                <div className="adm-card-header">
                  <h3>Fixed Departure Overview</h3>
                  <button type="button" className="adm-btn-ghost" onClick={() => handleSelectTab("departures")}>
                    Manage Departures →
                  </button>
                </div>
                {departureSummary ? (
                  <>
                    <div className="adm-metrics-grid">
                      {[
                        ["Upcoming", departureSummary.totalUpcoming],
                        ["Open", departureSummary.open],
                        ["Fully Booked", departureSummary.fullyBooked],
                        ["Seats Booked", departureSummary.totalBookedSeats],
                        ["Seats Remaining", departureSummary.remainingSeats],
                        ["Completed", departureSummary.completed],
                        ["Cancelled", departureSummary.cancelled],
                      ].map(([label, value]) => (
                        <div className="adm-metric-card" key={label}>
                          <div className="adm-metric-info">
                            <span className="adm-metric-label">{label}</span>
                            <span className="adm-metric-value">{Number(value || 0).toLocaleString()}</span>
                          </div>
                          <div className="adm-metric-icon blue"><Calendar size={20} /></div>
                        </div>
                      ))}
                    </div>

                    {departureSummary.lowDepartureTreks?.length > 0 && (
                      <div role="status" style={{ margin: "16px 0", padding: "12px 16px", border: "1px solid #fed7aa", borderRadius: "8px", background: "#fff7ed", color: "#9a3412" }}>
                        <strong>Departure schedule alert:</strong> These published treks have fewer than two bookable upcoming departures:{" "}
                        {departureSummary.lowDepartureTreks.map((trek) => trek.title).join(", ")}.
                      </div>
                    )}

                    <h4>Next Published Departures</h4>
                    {departureSummary.upcomingDepartures?.length ? (
                      <div className="adm-table-wrap">
                        <table className="adm-table">
                          <thead>
                            <tr><th>Trek</th><th>Departure</th><th>Return</th><th>Status</th><th>Seats</th></tr>
                          </thead>
                          <tbody>
                            {departureSummary.upcomingDepartures.map((departure) => (
                              <tr key={departure._id}>
                                <td>{departure.trek?.title || "Trek"}</td>
                                <td>{new Date(departure.startDate).toLocaleDateString()}</td>
                                <td>{new Date(departure.endDate).toLocaleDateString()}</td>
                                <td><span className="adm-pill">{departure.lifecycleStatus}</span></td>
                                <td>{departure.availableSeats} / {departure.capacity}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : <p>No published upcoming departures.</p>}
                  </>
                ) : <p role="status">Departure summary is unavailable. Refresh to try again.</p>}
              </div>

              {/* Dynamic Status & Payment Breakdown */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", marginBottom: "28px" }}>
                <div className="adm-card" style={{ margin: 0, padding: "18px 22px" }}>
                  <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                    Live Booking Status Breakdown
                  </h4>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {[
                      { key: "Pending", color: "orange" },
                      { key: "Confirmed", color: "green" },
                      { key: "Completed", color: "blue" },
                      { key: "Cancelled", color: "red" },
                    ].map(({ key, color }) => {
                      const count = bookingsList.filter((b) => (b.bookingStatus || "Pending").toLowerCase() === key.toLowerCase()).length;
                      return (
                        <div key={key} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f8fafc", padding: "6px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                          <span className={`adm-pill ${color}`} style={{ fontSize: "11px" }}>{key}</span>
                          <strong style={{ fontSize: "15px", color: "#0f172a" }}>{count}</strong>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="adm-card" style={{ margin: 0, padding: "18px 22px" }}>
                  <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                    Live Payment Status Breakdown
                  </h4>
                  <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    {[
                      { key: "Pending", color: "orange" },
                      { key: "Paid", color: "green" },
                      { key: "Refunded", color: "red" },
                    ].map(({ key, color }) => {
                      const count = bookingsList.filter((b) => (b.paymentStatus || "Pending").toLowerCase() === key.toLowerCase()).length;
                      return (
                        <div key={key} style={{ display: "flex", alignItems: "center", gap: "8px", background: "#f8fafc", padding: "6px 14px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                          <span className={`adm-pill ${color}`} style={{ fontSize: "11px" }}>{key}</span>
                          <strong style={{ fontSize: "15px", color: "#0f172a" }}>{count}</strong>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Recent Bookings Table */}
              <div className="adm-card">
                <div className="adm-card-header">
                  <h3>Recent Traveler Reservations</h3>
                  <button
                    type="button"
                    className="adm-btn-ghost"
                    onClick={() => handleSelectTab("bookings")}
                  >
                    View All Bookings →
                  </button>
                </div>
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Booking Ref</th>
                        <th>Lead Traveler</th>
                        <th>Trek Package</th>
                        <th>PAX</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingsList.slice(0, 5).map((b) => {
                        const lead = b.travelerDetails?.[0] || {};
                        const leadName = lead.fullName || b.name || "Customer";
                        const leadEmail = lead.email || b.email || "";
                        const trekTitle = b.trek?.title || b.trekTitle || b.trekSlug || "Himalayan Expedition";
                        const pax = b.numberOfTravelers || b.travelers || 1;
                        const bStatus = b.bookingStatus || "Pending";

                        return (
                          <tr key={b._id || b.id || b.bookingReference}>
                            <td><strong>{b.bookingReference || b.id || b._id}</strong></td>
                            <td>
                              <div className="adm-item-title-col">
                                <span>{leadName}</span>
                                <span className="adm-item-submeta">{leadEmail}</span>
                              </div>
                            </td>
                            <td>{trekTitle}</td>
                            <td>{pax} PAX</td>
                            <td><strong>${b.totalAmount?.toLocaleString()}</strong></td>
                            <td>
                              <span className={`adm-pill ${bStatus === "Confirmed" ? "green" : bStatus === "Completed" ? "blue" : bStatus === "Cancelled" ? "red" : "orange"}`}>
                                {bStatus}
                              </span>
                            </td>
                            <td>
                              <div className="adm-actions-row">
                                <button
                                  type="button"
                                  className="adm-icon-btn"
                                  onClick={() => setViewingBooking(b)}
                                  title="View Full Booking Dossier"
                                >
                                  <Eye size={15} />
                                </button>
                                {bStatus !== "Confirmed" && (
                                  <button
                                    type="button"
                                    className="adm-icon-btn"
                                    onClick={() => handleUpdateBooking(b._id || b.id, "Confirmed", "Paid")}
                                    title="Approve & Confirm"
                                    style={{ color: "#10b981" }}
                                  >
                                    <Check size={16} />
                                  </button>
                                )}
                                {bStatus !== "Cancelled" && (
                                  <button
                                    type="button"
                                    className="adm-icon-btn delete"
                                    onClick={() => handleUpdateBooking(b._id || b.id, "Cancelled", "Refunded")}
                                    title="Cancel reservation"
                                  >
                                    <X size={16} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════
              TAB 2: TREKS CATALOG (MEDIA STANDARDIZED)
             ════════════════════════════════════════ */}
          {activeTab === "treks" && (
            <div>
              <div className="adm-pane-header">
                <div className="adm-pane-title">
                  <h2>Treks & Expeditions Catalog</h2>
                  <p>Create, edit, soft-archive, manage pricing, discounts, capacity, and live public catalogs.</p>
                </div>
                <button type="button" className="adm-btn-primary" onClick={handleOpenAddTrek}>
                  <Plus size={16} /> Create New Trek
                </button>
              </div>

              {/* Treks Filter Toolbar */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "18px", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ position: "relative", flex: 1, minWidth: "220px", maxWidth: "420px" }}>
                  <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input
                    type="text"
                    placeholder="Search treks by title, region..."
                    value={trekSearch}
                    onChange={(e) => setTrekSearch(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px 8px 36px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px" }}
                  />
                </div>
                <select
                  value={trekArchiveFilter}
                  onChange={(e) => setTrekArchiveFilter(e.target.value)}
                  style={{ padding: "8px 14px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px", background: "#ffffff", color: "#334155" }}
                >
                  <option value="all">All Packages ({treksList.length})</option>
                  <option value="active">Active Only ({treksList.filter((t) => !t.isArchived).length})</option>
                  <option value="archived">Archived Only ({treksList.filter((t) => t.isArchived).length})</option>
                </select>
              </div>

              <div className="adm-card">
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Photo</th>
                        <th>Trek Title & Zone</th>
                        <th>Duration</th>
                        <th>Max Altitude</th>
                        <th>Base Price</th>
                        <th>Featured & Order</th>
                        <th>Visibility</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {treksList
                        .filter((t) => {
                          if (trekSearch.trim()) {
                            const q = trekSearch.toLowerCase();
                            const title = (t.title || "").toLowerCase();
                            const region = (t.region || "").toLowerCase();
                            if (!title.includes(q) && !region.includes(q)) return false;
                          }
                          if (trekArchiveFilter === "active" && t.isArchived) return false;
                          if (trekArchiveFilter === "archived" && !t.isArchived) return false;
                          return true;
                        })
                        .map((t) => {
                          const img = t.image || t.images?.[0] || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80";
                          const isFeatured = Boolean(t.featured);
                          const isPublished = t.published !== undefined ? Boolean(t.published) : true;

                          return (
                            <tr key={t._id || t.slug}>
                              <td>
                                <div className="adm-thumbnail-wrap">
                                  <img src={img} alt={t.title} className="adm-thumbnail-img" />
                                </div>
                              </td>
                              <td>
                                <div className="adm-item-title-col">
                                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <Link to={`/treks/${t.slug}`} target="_blank" className="adm-item-title-link">
                                      {t.title}
                                    </Link>
                                    {t.isArchived && (
                                      <span className="adm-pill red" style={{ fontSize: "10px", padding: "1px 6px" }}>
                                        Archived
                                      </span>
                                    )}
                                  </div>
                                  <span className="adm-item-submeta">{t.region} · {t.difficulty}</span>
                                </div>
                              </td>
                              <td>{t.duration} Days</td>
                              <td>{t.maximumElevation || t.elevation}m</td>
                              <td><strong>${t.price?.toLocaleString()}</strong></td>
                              <td>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  <button
                                    type="button"
                                    className={`adm-star-btn${isFeatured ? " is-active" : ""}`}
                                    onClick={() => handleToggleFeatured(t._id, t.slug, isFeatured)}
                                    title={isFeatured ? "Unmark featured" : "Mark as featured on homepage"}
                                  >
                                    <Star size={18} fill={isFeatured ? "currentColor" : "none"} />
                                  </button>
                                  <input
                                    type="number"
                                    min={0}
                                    defaultValue={t.featuredOrder || 0}
                                    onBlur={(e) => handleUpdateFeaturedOrder(t._id, isFeatured, e.target.value)}
                                    title="Manual featured order index (lower = appears first)"
                                    style={{ width: "48px", padding: "3px 4px", fontSize: "12px", border: "1px solid #cbd5e1", borderRadius: "4px", textAlign: "center" }}
                                  />
                                </div>
                              </td>
                              <td>
                                <button
                                  type="button"
                                  className={`adm-pill ${isPublished ? "green" : "gray"}`}
                                  onClick={() => handleTogglePublish(t._id, t.slug, isPublished)}
                                  style={{ border: "none", cursor: "pointer" }}
                                >
                                  {isPublished ? "Published" : "Draft / Hidden"}
                                </button>
                              </td>
                              <td>
                                <div className="adm-actions-row">
                                  <button
                                    type="button"
                                    className="adm-icon-btn"
                                    onClick={() => handleToggleArchiveTrek(t._id, t.slug, t.title, Boolean(t.isArchived))}
                                    title={t.isArchived ? "Restore to active catalog" : "Soft-archive package"}
                                    style={{ color: t.isArchived ? "#10b981" : "#64748b" }}
                                  >
                                    {t.isArchived ? <ArchiveRestore size={15} /> : <Archive size={15} />}
                                  </button>
                                  <button
                                    type="button"
                                    className="adm-icon-btn"
                                    onClick={() => handleOpenEditTrek(t)}
                                    title="Edit Trek Details"
                                  >
                                    <Edit size={15} />
                                  </button>
                                  <button
                                    type="button"
                                    className="adm-icon-btn delete"
                                    onClick={() => handleDeleteTrek(t._id, t.slug, t.title)}
                                    title="Delete Trek"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                  <Link
                                    to={`/treks/${t.slug}`}
                                    target="_blank"
                                    className="adm-icon-btn"
                                    title="View on site"
                                  >
                                    <Eye size={15} />
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════
              TAB 2.5: REGIONS & ZONES (TERRITORIES)
             ════════════════════════════════════════ */}
          {activeTab === "regions" && (
            <div>
              <div className="adm-pane-header">
                <div className="adm-pane-title">
                  <h2>Himalayan Regions Management</h2>
                  <p>Dedicated mountain territories (Everest, Annapurna, Langtang, Manaslu, Mustang) powering regional portals and navigation.</p>
                </div>
                <button type="button" className="adm-btn-primary" onClick={handleOpenAddRegion}>
                  <Plus size={16} /> Add Region
                </button>
              </div>

              <div className="adm-dest-grid">
                {regionsList.map((r) => {
                  const img = r.image || "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80";
                  const regionTreksCount = treksList.filter((t) => (t.region || "").toLowerCase().includes(r.name.toLowerCase().replace(" region", ""))).length;

                  return (
                    <div key={r._id || r.id || r.slug} className="adm-dest-card">
                      <div className="adm-dest-image-wrap">
                        <img src={img} alt={r.name} className="adm-dest-image" />
                        <span className="adm-dest-region-badge">{r.maxElevation > 0 ? `Max ${r.maxElevation.toLocaleString()}m` : "High Altitude"}</span>
                      </div>
                      <div className="adm-dest-body">
                        <h3 className="adm-dest-title">{r.name}</h3>
                        <p className="adm-dest-desc" style={{ color: "#083c34", fontWeight: "600", fontSize: "12px", marginBottom: "4px" }}>
                          {r.tagline || r.label}
                        </p>
                        <p className="adm-dest-desc">
                          {(r.description || "").slice(0, 115)}
                          {(r.description || "").length > 115 ? "..." : ""}
                        </p>

                        <div className="adm-dest-meta-row">
                          <span className="adm-dest-meta-item">
                            <Compass size={13} /> {regionTreksCount} Expeditions
                          </span>
                          {r.bestSeason && (
                            <span className="adm-dest-meta-item">
                              🗓️ {Array.isArray(r.bestSeason) ? r.bestSeason.join(", ") : r.bestSeason}
                            </span>
                          )}
                        </div>

                        <div className="adm-dest-actions">
                          <Link to={`/regions/${r.slug || r.id}`} target="_blank" className="adm-btn-ghost" style={{ fontSize: "12px", padding: "5px 12px" }}>
                            Preview Portal ↗
                          </Link>
                          <div className="adm-actions-row">
                            <button
                              type="button"
                              className="adm-icon-btn"
                              onClick={() => handleOpenEditRegion(r)}
                              title="Edit Region"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              type="button"
                              className="adm-icon-btn delete"
                              onClick={() => handleDeleteRegion(r._id || r.id, r.name, r.slug)}
                              title="Delete Region"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════
              TAB 3: DESTINATIONS & STAGING HUBS
             ════════════════════════════════════════ */}
          {activeTab === "destinations" && (
            <div>
              <div className="adm-pane-header">
                <div className="adm-pane-title">
                  <h2>Destinations & Staging Settlements</h2>
                  <p>Towns, villages, and trailheads (Pokhara, Namche Bazaar, Lukla, Manang, Kathmandu, etc.) with cultural highlights and linked treks.</p>
                </div>
                <button type="button" className="adm-btn-primary" onClick={handleOpenAddDest}>
                  <Plus size={16} /> Add Destination
                </button>
              </div>

              {/* Standardized Responsive Card Grid with 16:9 Photos */}
              <div className="adm-dest-grid">
                {destinationsList.map((d) => {
                  const lat = d.coordinates?.lat || d.lat;
                  const lng = d.coordinates?.lng || d.lng;
                  const img = d.images?.[0] || d.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80";
                  const trekCount = (d.trekSlugs || []).length;

                  return (
                    <div key={d._id || d.id || d.slug} className="adm-dest-card">
                      <div className="adm-dest-image-wrap">
                        <img src={img} alt={d.name} className="adm-dest-image" />
                        <span className="adm-dest-region-badge">{d.elevation > 0 ? `${d.elevation.toLocaleString()}m` : (d.region || "Himalaya")}</span>
                      </div>
                      <div className="adm-dest-body">
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                          <h3 className="adm-dest-title" style={{ margin: 0 }}>{d.name}</h3>
                          <span style={{ fontSize: "11px", fontWeight: "600", color: "#083c34", background: "#f0fdf4", padding: "2px 8px", borderRadius: "100px" }}>
                            {d.region || "Nepal"}
                          </span>
                        </div>
                        <p className="adm-dest-desc">
                          {(d.description || "").slice(0, 115)}
                          {(d.description || "").length > 115 ? "..." : ""}
                        </p>

                        <div className="adm-dest-meta-row">
                          <span className="adm-dest-meta-item">
                            <Compass size={13} /> {trekCount} Linked Treks
                          </span>
                          {(lat || lng) && (
                            <span className="adm-dest-meta-item">
                              <MapPin size={13} /> {Number(lat).toFixed(2)}°N, {Number(lng).toFixed(2)}°E
                            </span>
                          )}
                        </div>

                        <div className="adm-dest-actions">
                          <Link to={`/destinations/${d.slug}`} target="_blank" className="adm-btn-ghost" style={{ fontSize: "12px", padding: "5px 12px" }}>
                            Preview ↗
                          </Link>
                          <div className="adm-actions-row">
                            <button
                              type="button"
                              className="adm-icon-btn"
                              onClick={() => handleOpenEditDest(d)}
                              title="Edit Destination"
                            >
                              <Edit size={15} />
                            </button>
                            <button
                              type="button"
                              className="adm-icon-btn delete"
                              onClick={() => handleDeleteDest(d._id || d.id, d.slug, d.name)}
                              title="Delete Destination"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════
              TAB 4: GROUP DEPARTURES
             ════════════════════════════════════════ */}
          {activeTab === "departures" && (
            <div>
              <div className="adm-pane-header">
                <div className="adm-pane-title">
                  <h2>Fixed Group Departures</h2>
                  <p>Create and manage one fixed date per group departure.</p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button type="button" className="adm-btn-ghost" onClick={loadDepartures} disabled={departuresLoading}>
                    <RefreshCw size={16} /> {departuresLoading ? "Refreshing..." : "Refresh"}
                  </button>
                  <button type="button" className="adm-btn-primary" onClick={handleOpenAddDeparture}>
                    <Plus size={16} /> Schedule Departure
                  </button>
                </div>
              </div>
              {departureLoadError && (
                <p className="adm-help-text" role="alert" style={{ color: "#b91c1c" }}>
                  {departureLoadError} Use Refresh to try again.
                </p>
              )}
              {departureLoadNotice && (
                <p className="adm-help-text" role="status">{departureLoadNotice}</p>
              )}
              <p className="adm-help-text">
                Remaining seats update automatically as reservations are made. Published dates appear on the matching trek page.
              </p>

              <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ position: "relative", flex: 1, minWidth: "220px", maxWidth: "360px" }}>
                  <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input
                    type="search"
                    value={departureSearch}
                    onChange={(event) => setDepartureSearch(event.target.value)}
                    placeholder="Search trek package..."
                    style={{ width: "100%", padding: "8px 12px 8px 36px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px" }}
                  />
                </div>
                <label>From <input type="date" value={departureDateFrom} onChange={(event) => setDepartureDateFrom(event.target.value)} style={{ padding: "8px", border: "1px solid #cbd5e1", borderRadius: "8px" }} /></label>
                <label>To <input type="date" value={departureDateTo} onChange={(event) => setDepartureDateTo(event.target.value)} style={{ padding: "8px", border: "1px solid #cbd5e1", borderRadius: "8px" }} /></label>
                <select
                  value={departureStatusFilter}
                  onChange={(event) => setDepartureStatusFilter(event.target.value)}
                  style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px", background: "#ffffff", color: "#334155" }}
                >
                  <option value="all">All lifecycle statuses</option>
                  {["Draft", "Open", "Limited Seats", "Fully Booked", "Guaranteed", "Closed", "In Progress", "Completed", "Cancelled"].map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="adm-card">
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Trek Package</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Booking Closes</th>
                        <th>Seats Available</th>
                        <th>Special Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDepartures.map((dep) => (
                        <tr key={dep._id || dep.id}>
                          <td><strong>{dep.trek?.title || dep.trekTitle || dep.trekSlug || "Trek"}</strong></td>
                          <td>{dep.startDate ? new Date(dep.startDate).toLocaleDateString() : "—"}</td>
                          <td>{dep.endDate ? new Date(dep.endDate).toLocaleDateString() : "—"}</td>
                          <td>{dep.bookingClosingDate ? new Date(dep.bookingClosingDate).toLocaleDateString() : "—"}</td>
                          <td>
                            {getDepartureAvailableSeats(dep)} left of {dep.capacity || 0}
                            {getDepartureAvailableSeats(dep) === 0 && " · Unavailable"}
                            {dep.minGroupSize > 1 && <small> · min. {dep.minGroupSize}</small>}
                          </td>
                          <td><strong>${dep.price?.toLocaleString()}</strong></td>
                          <td>
                            <span className={`adm-pill ${["Closed", "Cancelled", "Completed", "Fully Booked"].includes(getDepartureStatus(dep)) ? "red" : "green"}`}>
                              {getDepartureStatus(dep)}
                            </span>
                          </td>
                          <td>
                            <div className="adm-actions-row">
                              <button type="button" className="adm-btn-ghost" onClick={() => handleDepartureUpdate(dep, { published: dep.published === false }, dep.published === false ? "published" : "unpublished")}>
                                {dep.published === false ? "Publish" : "Unpublish"}
                              </button>
                              <button type="button" className="adm-btn-ghost" onClick={() => handleDepartureUpdate(dep, { status: dep.status === "Guaranteed" ? "Available" : "Guaranteed" }, dep.status === "Guaranteed" ? "unmarked guaranteed" : "marked guaranteed")}>
                                {dep.status === "Guaranteed" ? "Unmark Guaranteed" : "Guarantee"}
                              </button>
                              {!["Closed", "Cancelled", "Completed"].includes(dep.lifecycleStatus) && (
                                <button type="button" className="adm-btn-ghost" onClick={() => handleDepartureUpdate(dep, { status: "Closed" }, "closed")}>Close</button>
                              )}
                              {!["Cancelled", "Completed"].includes(dep.lifecycleStatus) && (
                                <button type="button" className="adm-btn-ghost" onClick={() => handleCancelDeparture(dep)}>Cancel</button>
                              )}
                              <button type="button" className="adm-icon-btn" onClick={() => handleOpenEditDeparture(dep)} title="Edit Departure">
                                <Edit size={15} />
                              </button>
                              <button
                                type="button"
                                className="adm-icon-btn delete"
                                onClick={() => handleDeleteDeparture(dep._id || dep.id)}
                                title="Delete Date"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {!departureLoadError && !departuresLoading && filteredDepartures.length === 0 && (
                        <tr>
                          <td colSpan={8}>No group departures match the selected filters.</td>
                        </tr>
                      )}
                      {departuresLoading && (
                        <tr>
                          <td colSpan={8}>Loading group departures...</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════
              TAB 5: BOOKINGS MANAGEMENT CONTROL CENTER
             ════════════════════════════════════════ */}
          {activeTab === "bookings" && (
            <div>
              <div className="adm-pane-header">
                <div className="adm-pane-title">
                  <h2>Traveler Bookings & Reservations</h2>
                  <p>Search and manage reservations. Confirm a booking first; after its departure end date passes, mark it completed to unlock the traveler’s review form.</p>
                </div>
              </div>

              {/* Dynamic Search & Multi-Filter Control Toolbar */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ position: "relative", flex: 1, minWidth: "240px", maxWidth: "400px" }}>
                  <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input
                    type="text"
                    placeholder="Search by ID, name, email, phone..."
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px 8px 36px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px" }}
                  />
                </div>

                <select
                  value={bookingStatusFilter}
                  onChange={(e) => setBookingStatusFilter(e.target.value)}
                  style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px", background: "#ffffff", color: "#334155" }}
                >
                  <option value="all">All Statuses ({bookingsList.length})</option>
                  <option value="Pending">Pending ({bookingsList.filter((b) => (b.bookingStatus || "Pending").toLowerCase() === "pending").length})</option>
                  <option value="Confirmed">Confirmed ({bookingsList.filter((b) => (b.bookingStatus || "").toLowerCase() === "confirmed").length})</option>
                  <option value="Completed">Completed ({bookingsList.filter((b) => (b.bookingStatus || "").toLowerCase() === "completed").length})</option>
                  <option value="Cancelled">Cancelled ({bookingsList.filter((b) => (b.bookingStatus || "").toLowerCase() === "cancelled").length})</option>
                </select>

                <select
                  value={bookingPaymentFilter}
                  onChange={(e) => setBookingPaymentFilter(e.target.value)}
                  style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px", background: "#ffffff", color: "#334155" }}
                >
                  <option value="all">All Payments</option>
                  <option value="Pending">Pending / Unpaid</option>
                  <option value="Paid">Paid</option>
                  <option value="Refunded">Refunded</option>
                  <option value="Failed">Failed</option>
                </select>

                <select
                  value={bookingTrekFilter}
                  onChange={(e) => setBookingTrekFilter(e.target.value)}
                  style={{ padding: "8px 12px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px", background: "#ffffff", color: "#334155", maxWidth: "220px" }}
                >
                  <option value="all">All Trek Packages</option>
                  {treksList.map((t) => (
                    <option key={t._id || t.slug} value={t._id || t.slug}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="adm-card">
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Booking Ref</th>
                        <th>Lead Traveler</th>
                        <th>Trek Package</th>
                        <th>Dates & PAX</th>
                        <th>Amount & Payment</th>
                        <th>Booking Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingsList
                        .filter((b) => {
                          if (bookingSearch.trim()) {
                            const q = bookingSearch.toLowerCase();
                            const lead = b.travelerDetails?.[0] || {};
                            const ref = (b.bookingReference || b.id || b._id || "").toLowerCase();
                            const name = (lead.fullName || b.name || "").toLowerCase();
                            const email = (lead.email || b.email || "").toLowerCase();
                            const phone = (lead.phone || b.phone || "").toLowerCase();
                            if (!ref.includes(q) && !name.includes(q) && !email.includes(q) && !phone.includes(q)) {
                              return false;
                            }
                          }
                          if (bookingStatusFilter !== "all") {
                            const bStatus = (b.bookingStatus || "Pending").toLowerCase();
                            if (bStatus !== bookingStatusFilter.toLowerCase()) return false;
                          }
                          if (bookingPaymentFilter !== "all") {
                            const pStatus = (b.paymentStatus || "Pending").toLowerCase();
                            if (pStatus !== bookingPaymentFilter.toLowerCase()) return false;
                          }
                          if (bookingTrekFilter !== "all") {
                            const bTrekId = b.trek?._id || b.trek?.id || b.trek || "";
                            const bTrekSlug = b.trek?.slug || b.trekSlug || "";
                            if (bTrekId !== bookingTrekFilter && bTrekSlug !== bookingTrekFilter) return false;
                          }
                          return true;
                        })
                        .map((b) => {
                          const lead = b.travelerDetails?.[0] || {};
                          const leadName = lead.fullName || b.name || "Customer";
                          const leadEmail = lead.email || b.email || "";
                          const leadPhone = lead.phone || b.phone || lead.nationality || b.country || "";
                          const trekTitle = b.trek?.title || b.trekTitle || b.trekSlug || "Himalayan Expedition";
                          const pax = b.numberOfTravelers || b.travelers || 1;
                          const bStatus = b.bookingStatus || "Pending";
                          const pStatus = b.paymentStatus || "Pending";
                          const canMarkCompleted =
                            bStatus === "Confirmed" &&
                            hasDepartureEnded(b.departure?.endDate || b.endDate);

                          let dateDisplay = "Flexible dates";
                          if (b.departure?.startDate) {
                            dateDisplay = `${new Date(b.departure.startDate).toLocaleDateString()} – ${new Date(b.departure.endDate).toLocaleDateString()}`;
                          } else if (b.startDate) {
                            dateDisplay = b.startDate;
                          }

                          return (
                            <tr key={b._id || b.id || b.bookingReference}>
                              <td><strong>{b.bookingReference || b.id || b._id}</strong></td>
                              <td>
                                <div className="adm-item-title-col">
                                  <span>{leadName}</span>
                                  <span className="adm-item-submeta">{leadEmail} {leadPhone ? `· ${leadPhone}` : ""}</span>
                                  {b.notes && (
                                    <span style={{ fontSize: "11px", color: "#64748b", fontStyle: "italic", maxWidth: "240px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                      "{b.notes}"
                                    </span>
                                  )}
                                </div>
                              </td>
                              <td>
                                <div className="adm-item-title-col">
                                  <span>{trekTitle}</span>
                                  {b.trek?.region && <span className="adm-item-submeta">{b.trek.region}</span>}
                                </div>
                              </td>
                              <td>
                                <div className="adm-item-title-col">
                                  <span>{dateDisplay}</span>
                                  <span className="adm-item-submeta">{pax} PAX</span>
                                </div>
                              </td>
                              <td>
                                <div className="adm-item-title-col">
                                  <strong>${b.totalAmount?.toLocaleString()}</strong>
                                  <span className={`adm-pill ${pStatus === "Paid" ? "green" : pStatus === "Refunded" ? "red" : "orange"}`} style={{ fontSize: "10px", padding: "1px 6px", alignSelf: "flex-start" }}>
                                    {pStatus}
                                  </span>
                                </div>
                              </td>
                              <td>
                                <span className={`adm-pill ${bStatus === "Confirmed" ? "green" : bStatus === "Completed" ? "blue" : bStatus === "Cancelled" ? "red" : "orange"}`}>
                                  {bStatus}
                                </span>
                              </td>
                              <td>
                                <div className="adm-actions-row">
                                  <button
                                    type="button"
                                    className="adm-icon-btn"
                                    onClick={() => setViewingBooking(b)}
                                    title="View Full Booking Dossier"
                                  >
                                    <Eye size={15} />
                                  </button>
                                  <button
                                    type="button"
                                    className="adm-icon-btn"
                                    onClick={() => handleOpenEditBooking(b)}
                                    title="Edit Booking & PAX Details"
                                  >
                                    <Edit size={15} />
                                  </button>
                                  {bStatus !== "Confirmed" && (
                                    <button
                                      type="button"
                                      className="adm-icon-btn"
                                      onClick={() => handleUpdateBooking(b._id || b.id, "Confirmed", "Paid")}
                                      title="Confirm Booking"
                                      style={{ color: "#10b981" }}
                                    >
                                      <Check size={16} />
                                    </button>
                                  )}
                                  {canMarkCompleted && (
                                    <button
                                      type="button"
                                      className="adm-icon-btn"
                                      aria-label={`Mark ${b.bookingReference} completed`}
                                      onClick={() => handleUpdateBooking(b._id || b.id, "Completed", pStatus || "Paid")}
                                      title="Mark Completed"
                                      style={{ color: "#0284c7" }}
                                    >
                                      <CheckCheck size={16} />
                                    </button>
                                  )}
                                  {bStatus !== "Cancelled" && (
                                    <button
                                      type="button"
                                      className="adm-icon-btn delete"
                                      onClick={() => handleUpdateBooking(b._id || b.id, "Cancelled", "Refunded")}
                                      title="Cancel Booking"
                                    >
                                      <X size={16} />
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    className="adm-icon-btn delete"
                                    onClick={() => handleDeleteBooking(b._id || b.id, b.bookingReference)}
                                    title="Delete Booking Record"
                                  >
                                    <Trash2 size={15} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === "favorites" && (
            <div>
              <div className="adm-pane-header">
                <div className="adm-pane-title">
                  <h2>Traveler Favorites</h2>
                  <p>Saved trek lists are private to each traveler account. This admin view shows who saved each trek.</p>
                </div>
              </div>
              {favoritesError ? (
                <div className="adm-card" role="alert" style={{ padding: "18px" }}>{favoritesError}</div>
              ) : (
                <div className="adm-card">
                  <div className="adm-table-wrap">
                    <table className="adm-table">
                      <thead>
                        <tr>
                          <th>Traveler</th>
                          <th>Email</th>
                          <th>Saved Treks</th>
                          <th>Last Updated</th>
                        </tr>
                      </thead>
                      <tbody>
                        {favoritesList.length === 0 ? (
                          <tr><td colSpan={4} className="adm-empty-cell">No signed-in travelers have saved treks yet.</td></tr>
                        ) : favoritesList.map((favorite) => (
                          <tr key={favorite._id}>
                            <td><strong>{favorite.user?.name || "Traveler"}</strong></td>
                            <td>{favorite.user?.email || "—"}</td>
                            <td>
                              <div className="adm-item-title-col">
                                {favorite.treks?.length ? favorite.treks.map((trek) => (
                                  <Link key={trek._id} to={`/treks/${trek.slug}`} target="_blank" rel="noreferrer">
                                    {trek.title}
                                  </Link>
                                )) : <span>No saved treks</span>}
                              </div>
                            </td>
                            <td>{favorite.updatedAt ? new Date(favorite.updatedAt).toLocaleString() : "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "contacts" && (
            <div>
              <div className="adm-pane-header">
                <div className="adm-pane-title">
                  <h2>Contact Messages</h2>
                  <p>Messages submitted through the public contact page, with follow-up status for your team.</p>
                </div>
              </div>
              <div className="adm-card">
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr><th>Received</th><th>Traveler</th><th>Type / Trip</th><th>Message</th><th>Status</th></tr>
                    </thead>
                    <tbody>
                      {contactMessagesLoading ? (
                        <tr><td colSpan={5} className="adm-empty-cell">Loading contact messages…</td></tr>
                      ) : contactMessagesList.length === 0 ? (
                        <tr><td colSpan={5} className="adm-empty-cell">{contactMessagesError || "No contact messages yet."}</td></tr>
                      ) : contactMessagesList.map((message) => (
                        <tr key={message._id}>
                          <td>{message.createdAt ? new Date(message.createdAt).toLocaleString() : "—"}</td>
                          <td>
                            <div className="adm-item-title-col">
                              <span>{message.name}</span>
                              <a className="adm-item-submeta" href={`mailto:${message.email}`}>{message.email}</a>
                              {message.phone && <span className="adm-item-submeta">{message.phone}</span>}
                            </div>
                          </td>
                          <td>
                            <strong>{message.category === "expedition_inquiry" ? "Expedition inquiry" : message.topic || "General inquiry"}</strong>
                            {message.trekTitle && (
                              <div className="adm-item-submeta">
                                <a href={`/treks/${message.trekSlug}`} target="_blank" rel="noreferrer">{message.trekTitle}</a>
                              </div>
                            )}
                            {message.travelers && <div className="adm-item-submeta">{message.travelers} traveler{message.travelers === 1 ? "" : "s"} · {message.travelMonth || "Date flexible"}</div>}
                            {message.country && <div className="adm-item-submeta">{message.country}</div>}
                          </td>
                          <td style={{ minWidth: "280px", maxWidth: "420px", whiteSpace: "pre-wrap" }}>{message.message}</td>
                          <td>
                            <select
                              aria-label={`Follow-up status for ${message.name}`}
                              value={message.status}
                              onChange={async (event) => {
                                const status = event.target.value;
                                try {
                                  const result = await api.contactMessages.updateStatus(message._id, status);
                                  setContactMessagesList((items) => items.map((item) => item._id === message._id ? result.message : item));
                                  notify("Contact message status updated.");
                                } catch (error) {
                                  notify(error.message || "Unable to update contact message status.");
                                }
                              }}
                            >
                              <option>New</option>
                              <option>In Progress</option>
                              <option>Resolved</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════
              TAB 6: USER ACCOUNTS & PERMISSIONS
             ════════════════════════════════════════ */}
          {activeTab === "users" && (
            <div>
              <div className="adm-pane-header">
                <div className="adm-pane-title">
                  <h2>User Accounts & Security Permissions</h2>
                  <p>Manage administrative roles, traveler credentials, security permissions, and access status.</p>
                </div>
              </div>

              {/* Users Filter Toolbar */}
              <div style={{ display: "flex", gap: "12px", marginBottom: "18px", flexWrap: "wrap", alignItems: "center" }}>
                <div style={{ position: "relative", flex: 1, minWidth: "220px", maxWidth: "380px" }}>
                  <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
                  <input
                    type="text"
                    placeholder="Search users by name, email..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px 8px 36px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px" }}
                  />
                </div>

                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  style={{ padding: "8px 14px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px", background: "#ffffff", color: "#334155" }}
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Administrators</option>
                  <option value="traveler">Travelers</option>
                </select>

                <select
                  value={userStatusFilter}
                  onChange={(e) => setUserStatusFilter(e.target.value)}
                  style={{ padding: "8px 14px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "13px", background: "#ffffff", color: "#334155" }}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="suspended">Suspended Only</option>
                </select>
              </div>

              <div className="adm-card">
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>User Name</th>
                        <th>Email Address</th>
                        <th>System Role</th>
                        <th>Account Status</th>
                        <th>Registered Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList
                        .filter((u) => {
                          if (userSearch.trim()) {
                            const q = userSearch.toLowerCase();
                            const name = (u.name || "").toLowerCase();
                            const email = (u.email || "").toLowerCase();
                            if (!name.includes(q) && !email.includes(q)) return false;
                          }
                          if (userRoleFilter !== "all" && u.role !== userRoleFilter) return false;
                          if (userStatusFilter !== "all" && (u.status || "active") !== userStatusFilter) return false;
                          return true;
                        })
                        .map((u) => {
                          const isAdm = u.role === "admin";
                          const isActive = (u.status || "active") === "active";

                          return (
                            <tr key={u._id || u.email}>
                              <td><strong>{u.name}</strong></td>
                              <td>{u.email}</td>
                              <td>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <span className={`adm-pill ${isAdm ? "orange" : "blue"}`}>
                                    {isAdm ? "Administrator" : "Traveler"}
                                  </span>
                                  <button
                                    type="button"
                                    className="adm-icon-btn"
                                    onClick={() => handleToggleUserRole(u._id, u.role, u.name)}
                                    title={`Switch to ${isAdm ? "traveler" : "admin"} role`}
                                    style={{ width: "26px", height: "26px" }}
                                  >
                                    <Shield size={13} />
                                  </button>
                                </div>
                              </td>
                              <td>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <span className={`adm-pill ${isActive ? "green" : "red"}`}>
                                    {isActive ? "active" : "suspended"}
                                  </span>
                                  <button
                                    type="button"
                                    className="adm-icon-btn"
                                    onClick={() => handleToggleUserStatus(u._id, u.status || "active", u.name)}
                                    title={`Toggle to ${isActive ? "suspended" : "active"}`}
                                    style={{ width: "26px", height: "26px" }}
                                  >
                                    <KeyRound size={13} />
                                  </button>
                                </div>
                              </td>
                              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                              <td>
                                <button
                                  type="button"
                                  className="adm-icon-btn delete"
                                  onClick={() => handleDeleteUser(u._id, u.email)}
                                  title="Permanently Delete User"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════
              TAB 7: JOURNAL EDITORIAL & CUSTOMER REVIEWS
             ════════════════════════════════════════ */}
          {activeTab === "content" && (
            <div>
              <div className="adm-pane-header">
                <div className="adm-pane-title">
                  <h2>Journal Editorial & Customer Reviews</h2>
                  <p>Manage Himalayan dispatch articles and moderate customer trek reviews driving the dynamic rating engine.</p>
                </div>
                {contentSubTab === "articles" && (
                  <button type="button" className="adm-btn-primary" onClick={handleOpenAddArticle}>
                    <Plus size={16} /> Add Journal Article
                  </button>
                )}
              </div>

              {/* Sub-tab Switcher: Articles vs Reviews */}
              <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <button
                  type="button"
                  className={`adm-btn-ghost${contentSubTab === "articles" ? " is-active" : ""}`}
                  onClick={() => setContentSubTab("articles")}
                  style={{
                    background: contentSubTab === "articles" ? "#083c34" : "#ffffff",
                    color: contentSubTab === "articles" ? "#ffffff" : "#475569",
                    borderColor: contentSubTab === "articles" ? "#083c34" : "#cbd5e1",
                    fontWeight: 600,
                  }}
                >
                  <FileText size={15} style={{ marginRight: "6px" }} /> Field Articles ({articlesList.length})
                </button>
                <button
                  type="button"
                  className={`adm-btn-ghost${contentSubTab === "reviews" ? " is-active" : ""}`}
                  onClick={() => setContentSubTab("reviews")}
                  style={{
                    background: contentSubTab === "reviews" ? "#083c34" : "#ffffff",
                    color: contentSubTab === "reviews" ? "#ffffff" : "#475569",
                    borderColor: contentSubTab === "reviews" ? "#083c34" : "#cbd5e1",
                    fontWeight: 600,
                  }}
                >
                  <Star size={15} style={{ marginRight: "6px" }} /> Customer Reviews ({reviewsList.length})
                  {reviewsList.filter((r) => (r.moderationStatus || "pending") === "pending").length > 0 && (
                    <span style={{ marginLeft: "6px", background: "#ea580c", color: "#fff", padding: "1px 6px", borderRadius: "10px", fontSize: "11px" }}>
                      {reviewsList.filter((r) => (r.moderationStatus || "pending") === "pending").length} pending
                    </span>
                  )}
                </button>
              </div>

              {contentSubTab === "articles" ? (
                <div className="adm-card">
                  <div className="adm-table-wrap">
                    <table className="adm-table">
                      <thead>
                        <tr>
                          <th>Thumbnail</th>
                          <th>Article Title</th>
                          <th>Category</th>
                          <th>Author</th>
                          <th>Read Time</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {articlesList.map((art) => (
                          <tr key={art._id || art.slug}>
                            <td>
                              <div className="adm-thumbnail-wrap" style={{ width: "64px", height: "42px" }}>
                                <img src={art.coverImage || art.image} alt={art.title} className="adm-thumbnail-img" />
                              </div>
                            </td>
                            <td>
                              {art.publicationStatus === "Published" ? (
                                <Link to={`/journal/${art.slug}`} target="_blank" className="adm-item-title-link">
                                  {art.title}
                                </Link>
                              ) : (
                                <strong>{art.title}</strong>
                              )}
                              <span className="adm-item-submeta">{art.publicationStatus || "Draft"}</span>
                            </td>
                            <td><span className="adm-pill blue">{art.category}</span></td>
                            <td>{typeof art.author === "string" ? art.author : art.author?.name || "Editorial Team"}</td>
                            <td>{art.readTime || "6 min read"}</td>
                            <td>
                              <div className="adm-actions-row">
                                {art.publicationStatus === "Published" && (
                                  <Link to={`/journal/${art.slug}`} target="_blank" className="adm-icon-btn" title="View Article">
                                    <Eye size={15} />
                                  </Link>
                                )}
                                <button type="button" className="adm-icon-btn" onClick={() => handleOpenEditArticle(art)} title="Edit Article">
                                  <Edit size={15} />
                                </button>
                                <button type="button" className="adm-icon-btn delete" onClick={() => handleDeleteArticle(art)} title="Delete Article">
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Reviews Moderation Filters */}
                  <div style={{ display: "flex", gap: "8px", marginBottom: "18px", flexWrap: "wrap" }}>
                    {[
                      { key: "all", label: `All Reviews (${reviewsList.length})` },
                      { key: "pending", label: `Pending Moderation (${reviewsList.filter((r) => (r.moderationStatus || "pending") === "pending").length})` },
                      { key: "approved", label: `Approved (${reviewsList.filter((r) => r.moderationStatus === "approved").length})` },
                      { key: "rejected", label: `Rejected (${reviewsList.filter((r) => r.moderationStatus === "rejected").length})` },
                    ].map((f) => (
                      <button
                        key={f.key}
                        type="button"
                        className={`adm-btn-ghost${reviewFilter === f.key ? " is-active" : ""}`}
                        onClick={() => setReviewFilter(f.key)}
                        style={{
                          background: reviewFilter === f.key ? "#083c34" : "#ffffff",
                          color: reviewFilter === f.key ? "#ffffff" : "#475569",
                          borderColor: reviewFilter === f.key ? "#083c34" : "#cbd5e1",
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                  <div className="adm-review-filters">
                    <input
                      type="search"
                      value={reviewSearch}
                      onChange={(event) => setReviewSearch(event.target.value)}
                      placeholder="Search trek, reviewer, email, or booking reference"
                      aria-label="Search reviews"
                    />
                    <select value={reviewVerificationFilter} onChange={(event) => setReviewVerificationFilter(event.target.value)} aria-label="Filter by verification">
                      <option value="all">Verified and unverified</option>
                      <option value="Verified Trekker">Verified trekkers</option>
                      <option value="Unverified">Unverified reviews</option>
                    </select>
                    <select value={reviewTrekFilter} onChange={(event) => setReviewTrekFilter(event.target.value)} aria-label="Filter by trek">
                      <option value="all">All treks</option>
                      {treksList.map((trek) => <option key={trek._id || trek.id} value={trek._id || trek.id}>{trek.title}</option>)}
                    </select>
                  </div>

                  <div className="adm-card">
                    <div className="adm-table-wrap">
                      <table className="adm-table">
                        <thead>
                          <tr>
                            <th>Trek Package</th>
                            <th>Reviewer</th>
                            <th>Rating</th>
                            <th>Review Content</th>
                            <th>Verification</th>
                            <th>Booking Reference</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reviewsList
                            .filter((r) => {
                              if (reviewFilter !== "all" && (r.moderationStatus || "pending") !== reviewFilter) return false;
                              const verificationStatus = r.verificationStatus || (r.booking ? "Verified Trekker" : "Unverified");
                              if (reviewVerificationFilter !== "all" && verificationStatus !== reviewVerificationFilter) return false;
                              if (reviewTrekFilter !== "all" && (r.trek?._id || r.trek) !== reviewTrekFilter) return false;
                              const search = reviewSearch.trim().toLowerCase();
                              if (!search) return true;
                              const searchable = [
                                r.trek?.title, r.trekTitle, r.name, r.user?.name, r.email, r.user?.email,
                                r.booking?.bookingReference, r.title, r.comment,
                              ].join(" ").toLowerCase();
                              return searchable.includes(search);
                            })
                            .map((r) => {
                              const trekTitle = r.trek?.title || r.trekTitle || "Himalayan Expedition";
                              const reviewerName = r.name || r.user?.name || "Customer";
                              const reviewerEmail = r.user?.email || r.email || "";
                              const modStatus = r.moderationStatus || "pending";
                              const ratingVal = Number(r.rating) || 5;

                              return (
                                <tr key={r._id}>
                                  <td><strong>{trekTitle}</strong></td>
                                  <td>
                                    <div className="adm-item-title-col">
                                      <span>{reviewerName}</span>
                                      {reviewerEmail && <span className="adm-item-submeta">{reviewerEmail}</span>}
                                    </div>
                                  </td>
                                  <td>
                                    <div style={{ display: "flex", gap: "2px", color: "#f59e0b" }}>
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          size={14}
                                          fill={star <= ratingVal ? "currentColor" : "none"}
                                          color="#f59e0b"
                                        />
                                      ))}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="adm-item-title-col" style={{ maxWidth: "320px" }}>
                                      {r.title && <strong>{r.title}</strong>}
                                      <span style={{ fontSize: "12.5px", color: "#475569" }}>
                                        {r.comment || r.content}
                                      </span>
                                      {r.photos?.length > 0 && (
                                        <div className="adm-review-photos">
                                          {r.photos.map((photo) => <a key={photo} href={photo} target="_blank" rel="noreferrer">View photo</a>)}
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                  <td><span className={`adm-pill ${(r.verificationStatus || (r.booking ? "Verified Trekker" : "Unverified")) === "Verified Trekker" ? "green" : "orange"}`}>{r.verificationStatus || (r.booking ? "Verified Trekker" : "Unverified")}</span></td>
                                  <td>
                                    {r.booking?.bookingReference || "—"}
                                    {r.booking?.bookingStatus && <span className="adm-item-submeta">{r.booking.bookingStatus}</span>}
                                    {r.booking?.numberOfTravelers && <span className="adm-item-submeta">{r.booking.numberOfTravelers} traveler{r.booking.numberOfTravelers === 1 ? "" : "s"} · ${Number(r.booking.totalAmount || 0).toLocaleString()}</span>}
                                  </td>
                                  <td>{new Date(r.createdAt || Date.now()).toLocaleDateString()}</td>
                                  <td>
                                    <span className={`adm-pill ${modStatus === "approved" ? "green" : modStatus === "rejected" ? "red" : "orange"}`}>
                                      {modStatus}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="adm-actions-row">
                                      {modStatus !== "approved" && (
                                        <button
                                          type="button"
                                          className="adm-icon-btn"
                                          onClick={() => handleModerateReview(r._id, "approved")}
                                          title="Approve review (recalculates trek ranking & ratings)"
                                          style={{ color: "#10b981" }}
                                        >
                                          <Check size={16} />
                                        </button>
                                      )}
                                      {modStatus !== "rejected" && (
                                        <button
                                          type="button"
                                          className="adm-icon-btn"
                                          onClick={() => handleModerateReview(r._id, "rejected")}
                                          title="Reject review"
                                          style={{ color: "#ea580c" }}
                                        >
                                          <X size={16} />
                                        </button>
                                      )}
                                      <button
                                        type="button"
                                        className="adm-icon-btn delete"
                                        onClick={() => handleDeleteReview(r._id)}
                                        title="Delete review"
                                      >
                                        <Trash2 size={15} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════════════════════════════════════════
              TAB 7: TRAIL GUIDES (DYNAMIC MANAGEMENT)
             ════════════════════════════════════════ */}
          {activeTab === "guides" && (
            <div>
              <div className="adm-pane-header">
                <div className="adm-pane-title">
                  <h2>Himalayan Field Manual & Trail Guides</h2>
                  <p>Manage altitude sickness protocols, seasonal advice, permit advisories, and cultural guides shown on the Trekking Guide page.</p>
                </div>
                <button type="button" className="adm-btn-primary" onClick={handleOpenAddGuide}>
                  <Plus size={16} /> Add Guide Article
                </button>
              </div>

              <div className="adm-card">
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Guide Title</th>
                        <th>Category</th>
                        <th>Format Type</th>
                        <th>Summary / Excerpt</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {guidesList.map((g) => (
                        <tr key={g.id}>
                          <td>
                            <strong>{g.title}</strong>
                          </td>
                          <td>
                            <span className="adm-pill green">{g.categoryLabel || g.category}</span>
                          </td>
                          <td>
                            <span className="adm-pill blue">{g.type || "article"}</span>
                          </td>
                          <td>
                            <span style={{ fontSize: "13px", color: "#64748b" }}>
                              {(g.summary || g.content || "").slice(0, 80)}
                              {(g.summary || g.content || "").length > 80 ? "..." : ""}
                            </span>
                          </td>
                          <td>
                            <div className="adm-actions-row">
                              <Link to="/trekking-guide" target="_blank" className="adm-icon-btn" title="View on site">
                                <Eye size={15} />
                              </Link>
                              <button
                                type="button"
                                className="adm-icon-btn"
                                onClick={() => handleOpenEditGuide(g)}
                                title="Edit Guide"
                              >
                                <Edit size={15} />
                              </button>
                              <button
                                type="button"
                                className="adm-icon-btn delete"
                                onClick={() => handleDeleteGuide(g.id, g.title)}
                                title="Delete Guide"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════
              TAB 8: SYSTEM SETTINGS
             ════════════════════════════════════════ */}
          {activeTab === "settings" && (
            <div>
              <div className="adm-pane-header">
                <div className="adm-pane-title">
                  <h2>System Configuration & Policies</h2>
                  <p>Adjust booking deposit requirements, emergency hotlines, and agency contact channels.</p>
                </div>
              </div>

              <div className="adm-card" style={{ maxWidth: "780px" }}>
                <form onSubmit={handleSaveSettings} className="adm-modal-form">
                  <div className="adm-form-row">
                    <div className="adm-field">
                      <label>Agency Brand Name</label>
                      <input
                        type="text"
                        value={settingsData.siteName}
                        onChange={(e) => setSettingsData({ ...settingsData, siteName: e.target.value })}
                        required
                      />
                    </div>
                    <div className="adm-field">
                      <label>Primary Contact Email</label>
                      <input
                        type="email"
                        value={settingsData.contactEmail}
                        onChange={(e) => setSettingsData({ ...settingsData, contactEmail: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="adm-form-row">
                    <div className="adm-field">
                      <label>Helpline / WhatsApp</label>
                      <input
                        type="text"
                        value={settingsData.contactPhone}
                        onChange={(e) => setSettingsData({ ...settingsData, contactPhone: e.target.value })}
                      />
                    </div>
                    <div className="adm-field">
                      <label>Physical Agency Office</label>
                      <input
                        type="text"
                        value={settingsData.address}
                        onChange={(e) => setSettingsData({ ...settingsData, address: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="adm-form-row">
                    <div className="adm-field">
                      <label>Deposit Percentage (%)</label>
                      <input
                        type="number"
                        min="10"
                        max="100"
                        value={settingsData.depositPercent}
                        onChange={(e) => setSettingsData({ ...settingsData, depositPercent: Number(e.target.value) })}
                      />
                    </div>
                    <div className="adm-field">
                      <label>Free Cancellation Window (Days)</label>
                      <input
                        type="number"
                        value={settingsData.freeCancellationDays}
                        onChange={(e) => setSettingsData({ ...settingsData, freeCancellationDays: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  <div style={{ marginTop: "12px" }}>
                    <button type="submit" className="adm-btn-primary">
                      Save System Configuration
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* ════════════════════════════════════════════
          3. MODALS (TREK, DESTINATION, DEPARTURE, CONFIRM)
         ════════════════════════════════════════════ */}

      {/* REGION MODAL */}
      {regionModalOpen && (
        <div className="adm-modal-backdrop">
          <div className="adm-modal-card">
            <div className="adm-modal-header">
              <h3>{editingRegion ? `Edit Region: ${editingRegion.name}` : "Add Himalayan Region"}</h3>
              <button type="button" className="adm-modal-close-btn" onClick={() => setRegionModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveRegionSubmit} className="adm-modal-form">
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Region Name *</label>
                  <input value={regionForm.name} onChange={(e) => setRegionForm({ ...regionForm, name: e.target.value })} required />
                </div>
                <div className="adm-field">
                  <label>URL Slug</label>
                  <input value={regionForm.slug} onChange={(e) => setRegionForm({ ...regionForm, slug: e.target.value })} placeholder="Auto-generated if blank" />
                </div>
              </div>
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Navigation Label</label>
                  <input value={regionForm.label} onChange={(e) => setRegionForm({ ...regionForm, label: e.target.value })} />
                </div>
                <div className="adm-field">
                  <label>Tagline</label>
                  <input value={regionForm.tagline} onChange={(e) => setRegionForm({ ...regionForm, tagline: e.target.value })} />
                </div>
              </div>
              <div className="adm-field">
                <label>Description *</label>
                <textarea rows={3} value={regionForm.description} onChange={(e) => setRegionForm({ ...regionForm, description: e.target.value })} required />
              </div>
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Cover Photo URL</label>
                  <input type="url" value={regionForm.image} onChange={(e) => setRegionForm({ ...regionForm, image: e.target.value })} />
                </div>
                <div className="adm-field">
                  <label>Maximum Elevation (m)</label>
                  <input type="number" min="0" value={regionForm.maxElevation} onChange={(e) => setRegionForm({ ...regionForm, maxElevation: Number(e.target.value) })} />
                </div>
              </div>
              {regionForm.image && (
                <img className="adm-image-preview" src={regionForm.image} alt={`${regionForm.name || "Region"} photo preview`} />
              )}
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Latitude</label>
                  <input type="number" step="0.001" value={regionForm.lat} onChange={(e) => setRegionForm({ ...regionForm, lat: e.target.value })} />
                </div>
                <div className="adm-field">
                  <label>Longitude</label>
                  <input type="number" step="0.001" value={regionForm.lng} onChange={(e) => setRegionForm({ ...regionForm, lng: e.target.value })} />
                </div>
              </div>
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Best Seasons (comma-separated)</label>
                  <input value={regionForm.bestSeason} onChange={(e) => setRegionForm({ ...regionForm, bestSeason: e.target.value })} />
                </div>
                <div className="adm-field">
                  <label>Trek Grades (comma-separated)</label>
                  <input value={regionForm.gradingList} onChange={(e) => setRegionForm({ ...regionForm, gradingList: e.target.value })} />
                </div>
              </div>
              <div className="adm-field">
                <label>Highlights (one per line)</label>
                <textarea rows={3} value={regionForm.highlights} onChange={(e) => setRegionForm({ ...regionForm, highlights: e.target.value })} />
              </div>
              <div className="adm-field">
                <label>Permits (comma-separated)</label>
                <input value={regionForm.permits} onChange={(e) => setRegionForm({ ...regionForm, permits: e.target.value })} />
              </div>
              <div className="adm-modal-footer">
                <button type="button" className="adm-btn-ghost" onClick={() => setRegionModalOpen(false)}>Cancel</button>
                <button type="submit" className="adm-btn-primary">{editingRegion ? "Save Region" : "Create Region"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TREK MODAL */}
      {trekModalOpen && (
        <div className="adm-modal-backdrop">
          <div className="adm-modal-card">
            <div className="adm-modal-header">
              <h3>{editingTrek ? `Edit Trek: ${editingTrek.title}` : "Create New Himalayan Trek"}</h3>
              <button type="button" className="adm-modal-close-btn" onClick={() => setTrekModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveTrekSubmit} className="adm-modal-form">
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Trek Title *</label>
                  <input
                    type="text"
                    value={trekForm.title}
                    onChange={(e) => setTrekForm({ ...trekForm, title: e.target.value })}
                    placeholder="e.g. Annapurna Circuit"
                    required
                  />
                </div>
                <div className="adm-field">
                  <label>URL Slug</label>
                  <input
                    type="text"
                    value={trekForm.slug}
                    onChange={(e) => setTrekForm({ ...trekForm, slug: e.target.value })}
                    placeholder="Auto-generated if blank"
                  />
                </div>
              </div>

              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Region</label>
                  <select
                    value={trekForm.region}
                    onChange={(e) => setTrekForm({ ...trekForm, region: e.target.value })}
                  >
                    <option value="Khumbu">Khumbu (Everest)</option>
                    <option value="Annapurna">Annapurna</option>
                    <option value="Langtang">Langtang</option>
                    <option value="Manaslu">Manaslu</option>
                    <option value="Makalu">Makalu</option>
                    <option value="Dhaulagiri">Dhaulagiri</option>
                    <option value="Dolpo">Dolpo</option>
                  </select>
                </div>
                <div className="adm-field">
                  <label>Location Specifics</label>
                  <input
                    type="text"
                    value={trekForm.location}
                    onChange={(e) => setTrekForm({ ...trekForm, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Duration (Days)</label>
                  <input
                    type="number"
                    value={trekForm.duration}
                    onChange={(e) => setTrekForm({ ...trekForm, duration: Number(e.target.value) })}
                    min={1}
                    required
                  />
                </div>
                <div className="adm-field">
                  <label>Maximum Elevation (Meters)</label>
                  <input
                    type="number"
                    value={trekForm.elevation}
                    onChange={(e) => setTrekForm({ ...trekForm, elevation: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Difficulty Grade</label>
                  <select
                    value={trekForm.difficulty}
                    onChange={(e) => setTrekForm({ ...trekForm, difficulty: e.target.value })}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Challenging">Challenging</option>
                    <option value="Demanding">Demanding / Strenuous</option>
                  </select>
                </div>
                <div className="adm-field">
                  <label>Base Price per PAX ($)</label>
                  <input
                    type="number"
                    value={trekForm.price}
                    onChange={(e) => setTrekForm({ ...trekForm, price: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="adm-field">
                <label>Cover Photo URL</label>
                <input
                  type="url"
                  value={trekForm.image}
                  onChange={(e) => setTrekForm({ ...trekForm, image: e.target.value })}
                />
              </div>

              <div className="adm-field">
              <label>Photo Gallery</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={handleUploadTrekGallery}
                disabled={galleryUploading}
              />
              <span className="adm-field-hint">
                {galleryUploading ? "Uploading photos..." : "Upload up to 12 JPEG, PNG, or WebP photos (8 MB each). These are shown on the public trek gallery."}
              </span>
              <textarea
                rows={4}
                value={trekForm.galleryText}
                onChange={(e) => setTrekForm({ ...trekForm, galleryText: e.target.value })}
                placeholder="Uploaded photo URLs appear here. Keep one image URL per line."
                aria-label="Trek gallery image URLs"
              />
              {trekForm.galleryText.split("\n").map((url) => url.trim()).filter(Boolean).length > 0 && (
                <div className="adm-gallery-preview">
                  {trekForm.galleryText.split("\n").map((url) => url.trim()).filter(Boolean).map((url) => (
                    <img key={url} src={url} alt="Trek gallery preview" />
                  ))}
                </div>
              )}
              </div>

              <div className="adm-form-row">
              <div className="adm-field">
                <label>Minimum Group Size</label>
                <input type="number" min={1} value={trekForm.minGroupSize} onChange={(e) => setTrekForm({ ...trekForm, minGroupSize: Number(e.target.value) })} />
              </div>
              <div className="adm-field">
                <label>Maximum Group Size</label>
                <input type="number" min={1} value={trekForm.groupCapacity} onChange={(e) => setTrekForm({ ...trekForm, groupCapacity: Number(e.target.value) })} />
              </div>
              </div>
              <div className="adm-form-row">
              <div className="adm-field">
                <label>Trip Type</label>
                <input type="text" value={trekForm.tripType} onChange={(e) => setTrekForm({ ...trekForm, tripType: e.target.value })} placeholder="e.g. Guided lodge trek" />
              </div>
              <div className="adm-field">
                <label>Transportation</label>
                <input type="text" value={trekForm.transportation} onChange={(e) => setTrekForm({ ...trekForm, transportation: e.target.value })} placeholder="Transport included in this trek" />
              </div>
              </div>
              <div className="adm-form-row">
              <div className="adm-field">
                <label>Accommodation</label>
                <input type="text" value={trekForm.accommodation} onChange={(e) => setTrekForm({ ...trekForm, accommodation: e.target.value })} placeholder="Lodging arranged for this trek" />
              </div>
              <div className="adm-field">
                <label>Meals</label>
                <input type="text" value={trekForm.meals} onChange={(e) => setTrekForm({ ...trekForm, meals: e.target.value })} placeholder="Meals provided during the trek" />
              </div>
              </div>

              <div className="adm-field">
                <label>Short Description *</label>
                <textarea
                  rows={2}
                  value={trekForm.description}
                  onChange={(e) => setTrekForm({ ...trekForm, description: e.target.value })}
                  required
                />
              </div>

              <div className="adm-field">
                <label>Key Highlights (One per line)</label>
                <textarea
                  rows={2}
                  value={trekForm.highlights}
                  onChange={(e) => setTrekForm({ ...trekForm, highlights: e.target.value })}
                />
              </div>

              <div className="adm-form-row">
                <div className="adm-field">
                  <label>What is Included (One per line)</label>
                  <textarea
                    rows={4}
                    value={trekForm.included}
                    onChange={(e) => setTrekForm({ ...trekForm, included: e.target.value })}
                    placeholder="Licensed Sherpa guide&#10;All national park permits&#10;Meals on trail"
                  />
                </div>
                <div className="adm-field">
                  <label>What is Excluded (One per line)</label>
                  <textarea
                    rows={4}
                    value={trekForm.excluded}
                    onChange={(e) => setTrekForm({ ...trekForm, excluded: e.target.value })}
                    placeholder="International flights&#10;Tourist visa fee&#10;Personal travel insurance"
                  />
                </div>
              </div>

              <div className="adm-field">
                <label>Day-by-Day Itinerary (Format per line: Title | Altitude | Day Story)</label>
                <textarea
                  rows={4}
                  value={trekForm.itineraryText}
                  onChange={(e) => setTrekForm({ ...trekForm, itineraryText: e.target.value })}
                  placeholder="Arrive in Kathmandu | 1,400m | Touch down in Kathmandu valley.&#10;Flight to Lukla & Trek to Phakding | 2,610m | Mountain flight into Lukla."
                />
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-btn-ghost" onClick={() => setTrekModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn-primary">
                  {editingTrek ? "Save Changes" : "Create Trek Package"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DESTINATION MODAL */}
      {destModalOpen && (
        <div className="adm-modal-backdrop">
          <div className="adm-modal-card">
            <div className="adm-modal-header">
              <h3>{editingDest ? `Edit: ${editingDest.name}` : "Add New Destination & Region"}</h3>
              <button type="button" className="adm-modal-close-btn" onClick={() => setDestModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveDestSubmit} className="adm-modal-form">
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Destination Name *</label>
                  <input
                    type="text"
                    value={destForm.name}
                    onChange={(e) => setDestForm({ ...destForm, name: e.target.value })}
                    placeholder="e.g. Khumbu Region"
                    required
                  />
                </div>
                <div className="adm-field">
                  <label>URL Slug</label>
                  <input
                    type="text"
                    value={destForm.slug}
                    onChange={(e) => setDestForm({ ...destForm, slug: e.target.value })}
                    placeholder="Auto-generated if blank"
                  />
                </div>
              </div>

              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Mountain Region Territory</label>
                  <select
                    value={destForm.region}
                    onChange={(e) => setDestForm({ ...destForm, region: e.target.value })}
                  >
                    {regionsList.map((r) => (
                      <option key={r.slug || r.id} value={r.name}>
                        {r.name}
                      </option>
                    ))}
                    <option value="Kathmandu Valley">Kathmandu Valley</option>
                    <option value="Eastern Himalaya">Eastern Himalaya</option>
                  </select>
                </div>
                <div className="adm-field">
                  <label>Altitude / Elevation (meters)</label>
                  <input
                    type="number"
                    value={destForm.elevation}
                    onChange={(e) => setDestForm({ ...destForm, elevation: Number(e.target.value) })}
                    placeholder="e.g. 3440"
                  />
                </div>
              </div>

              <div className="adm-field">
                <label>Linked Trek Routes (Select which expeditions pass through or stage from here)</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: "8px", maxHeight: "150px", overflowY: "auto", padding: "10px", background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "8px" }}>
                  {treksList.map((t) => {
                    const checked = (destForm.trekSlugs || []).includes(t.slug);
                    return (
                      <label key={t.slug} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", cursor: "pointer", color: "#334155" }}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => {
                            const cur = destForm.trekSlugs || [];
                            if (e.target.checked) {
                              setDestForm({ ...destForm, trekSlugs: [...cur, t.slug] });
                            } else {
                              setDestForm({ ...destForm, trekSlugs: cur.filter((s) => s !== t.slug) });
                            }
                          }}
                        />
                        <span>{t.title}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Best Seasons (comma-separated)</label>
                  <input
                    type="text"
                    value={destForm.bestSeason}
                    onChange={(e) => setDestForm({ ...destForm, bestSeason: e.target.value })}
                    placeholder="Spring, Autumn"
                  />
                </div>
                <div className="adm-field">
                  <label>Destination Photo URL (use a direct, licensed image link)</label>
                  <input
                    type="url"
                    value={destForm.image}
                    onChange={(e) => setDestForm({ ...destForm, image: e.target.value })}
                    required
                  />
                </div>
              </div>
              <a
                href={`https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${destForm.name || "Himalayan destination"} Nepal`)}`}
                target="_blank"
                rel="noreferrer"
                className="adm-item-title-link"
              >
                Search destination photos ↗
              </a>
              {destForm.image && (
                <div className="adm-image-preview-wrap">
                  <img className="adm-image-preview" src={destForm.image} alt={`${destForm.name || "Destination"} photo preview`} />
                  <span>This exact cover photo is saved with the destination and displayed on the public destination card.</span>
                </div>
              )}

              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Latitude (°N)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={destForm.lat}
                    onChange={(e) => setDestForm({ ...destForm, lat: e.target.value })}
                  />
                </div>
                <div className="adm-field">
                  <label>Longitude (°E)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={destForm.lng}
                    onChange={(e) => setDestForm({ ...destForm, lng: e.target.value })}
                  />
                </div>
              </div>

              <div className="adm-field">
                <label>Description *</label>
                <textarea
                  rows={3}
                  value={destForm.description}
                  onChange={(e) => setDestForm({ ...destForm, description: e.target.value })}
                  placeholder="Atmosphere, altitude profile, local culture..."
                  required
                />
              </div>

              <div className="adm-field">
                <label>Key Highlights (1 per line)</label>
                <textarea
                  rows={3}
                  value={destForm.highlights}
                  onChange={(e) => setDestForm({ ...destForm, highlights: e.target.value })}
                  placeholder="Home to Mount Everest (8,848m)&#10;Ancient Tengboche Monastery&#10;Vibrant Sherpa capital Namche Bazaar"
                />
              </div>

              <div className="adm-field">
                <label>Attractions & Landmarks (Format: Name | Category | Description per line)</label>
                <textarea
                  rows={3}
                  value={destForm.attractionsText}
                  onChange={(e) => setDestForm({ ...destForm, attractionsText: e.target.value })}
                  placeholder="Tengboche Monastery | Spiritual Center | Historic Buddhist monastery framed by Ama Dablam.&#10;Namche Bazaar | Cultural Hub | Vibrant mountain amphitheater with gear shops and bakeries."
                />
              </div>

              <div className="adm-field">
                <label>Accommodations (Format: Type | Badge | Description per line)</label>
                <textarea
                  rows={3}
                  value={destForm.stayTypesText}
                  onChange={(e) => setDestForm({ ...destForm, stayTypesText: e.target.value })}
                  placeholder="Standard Alpine Lodges | Common | Traditional timber teahouses with heated dining rooms.&#10;Luxury Comfort Lodges | Premium | En-suite bathrooms and electric blankets."
                />
              </div>

              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Ethnic Communities (comma separated)</label>
                  <input
                    type="text"
                    value={destForm.ethnicGroups}
                    onChange={(e) => setDestForm({ ...destForm, ethnicGroups: e.target.value })}
                    placeholder="Sherpa, Rai, Tamang"
                  />
                </div>
              </div>

              <div className="adm-field">
                <label>Cultural Heritage & Overview</label>
                <textarea
                  rows={2}
                  value={destForm.cultureText}
                  onChange={(e) => setDestForm({ ...destForm, cultureText: e.target.value })}
                  placeholder="Deeply rooted in Nyingma Tibetan Buddhism. Prayer flags, mani stones..."
                />
              </div>

              <div className="adm-field">
                <label>Etiquette Guidelines (1 per line)</label>
                <textarea
                  rows={2}
                  value={destForm.etiquetteText}
                  onChange={(e) => setDestForm({ ...destForm, etiquetteText: e.target.value })}
                  placeholder="Always walk clockwise around chortens and mani walls.&#10;Remove shoes before entering monastery prayer halls."
                />
              </div>

              <div className="adm-field">
                <label>Nearby Side Trips (Format: Name | Duration | Elevation | Highlights per line)</label>
                <textarea
                  rows={3}
                  value={destForm.sideTripsText}
                  onChange={(e) => setDestForm({ ...destForm, sideTripsText: e.target.value })}
                  placeholder="Khumjung & Hillary School | 3–4 hrs round trip | 3,790m | Famous Edmund Hillary School and monastery.&#10;Ama Dablam Base Camp | Full day hike | 4,600m | Direct foot of one of the world's most beautiful peaks."
                />
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-btn-ghost" onClick={() => setDestModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn-primary">
                  {editingDest ? "Save Changes" : "Create Destination"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DEPARTURE MODAL */}
      {depModalOpen && (
        <div className="adm-modal-backdrop">
          <div className="adm-modal-card">
            <div className="adm-modal-header">
              <h3>{editingDeparture ? "Edit Group Departure" : "Schedule Fixed Group Departure"}</h3>
              <button type="button" className="adm-modal-close-btn" onClick={() => { setDepModalOpen(false); setEditingDeparture(null); }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveDeparture} className="adm-modal-form">
              <div className="adm-field">
                <label>Trek Package *</label>
                <select
                  value={depForm.trekSlug}
                  onChange={(e) => setDepForm({ ...depForm, trekSlug: e.target.value })}
                  required
                >
                  <option value="" disabled>Select a trek</option>
                  {treksList.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={depForm.startDate}
                    onChange={(e) => setDepForm({ ...depForm, startDate: e.target.value })}
                    required
                  />
                </div>
                <div className="adm-field">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={depForm.endDate}
                    onChange={(e) => setDepForm({ ...depForm, endDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Total Group Capacity (travelers)</label>
                  <input
                    type="number"
                    value={depForm.capacity}
                    onChange={(e) => setDepForm({ ...depForm, capacity: Number(e.target.value) })}
                    min={1}
                    required
                  />
                </div>
                <div className="adm-field">
                  <label>Minimum Group Size</label>
                  <input
                    type="number"
                    value={depForm.minGroupSize}
                    onChange={(e) => setDepForm({ ...depForm, minGroupSize: Number(e.target.value) })}
                    min={1}
                    max={depForm.capacity}
                    required
                  />
                </div>
              </div>
              <p className="adm-help-text">Available seats are calculated from total capacity minus reserved seats.</p>

              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Special Price / PAX ($)</label>
                  <input
                    type="number"
                    value={depForm.price}
                    onChange={(e) => setDepForm({ ...depForm, price: Number(e.target.value) })}
                    min={0}
                    required
                  />
                </div>
                <div className="adm-field">
                  <label>Original Price / PAX ($)</label>
                  <input type="number" min="0" value={depForm.originalPrice} onChange={(e) => setDepForm({ ...depForm, originalPrice: e.target.value })} />
                </div>
              </div>
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Booking Closing Date</label>
                  <input
                    type="date"
                    value={depForm.bookingClosingDate}
                    max={depForm.startDate || undefined}
                    onChange={(e) => setDepForm({ ...depForm, bookingClosingDate: e.target.value })}
                  />
                </div>
                <div className="adm-field">
                  <label>Departure Status</label>
                  <select value={depForm.status} onChange={(e) => setDepForm({ ...depForm, status: e.target.value })}>
                    {["Available", "Guaranteed", "Filling Fast", "Closed", "Cancelled"].map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>
              </div>
              <div className="adm-form-row">
                <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px" }}>
                  <input
                    type="checkbox"
                    checked={depForm.published}
                    onChange={(e) => setDepForm({ ...depForm, published: e.target.checked })}
                  />
                  Publish this departure to travelers
                </label>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-btn-ghost" onClick={() => { setDepModalOpen(false); setEditingDeparture(null); }}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn-primary">
                  {editingDeparture ? "Save Departure" : "Schedule Date"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JOURNAL ARTICLE MODAL */}
      {articleModalOpen && (
        <div className="adm-modal-backdrop">
          <div className="adm-modal-card">
            <div className="adm-modal-header">
              <h3>{editingArticle ? `Edit Article: ${editingArticle.title}` : "Create Journal Article"}</h3>
              <button type="button" className="adm-modal-close-btn" onClick={() => setArticleModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSaveArticle} className="adm-modal-form">
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Title *</label>
                  <input value={articleForm.title} onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })} maxLength={200} required />
                </div>
                <div className="adm-field">
                  <label>Slug</label>
                  <input value={articleForm.slug} onChange={(e) => setArticleForm({ ...articleForm, slug: e.target.value })} placeholder="Auto-generated from title" />
                </div>
              </div>
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Category</label>
                  <input value={articleForm.category} onChange={(e) => setArticleForm({ ...articleForm, category: e.target.value })} />
                </div>
                <div className="adm-field">
                  <label>Author</label>
                  <input value={articleForm.author} onChange={(e) => setArticleForm({ ...articleForm, author: e.target.value })} />
                </div>
              </div>
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Read Time</label>
                  <input value={articleForm.readTime} onChange={(e) => setArticleForm({ ...articleForm, readTime: e.target.value })} />
                </div>
                <div className="adm-field">
                  <label>Publication Status</label>
                  <select value={articleForm.publicationStatus} onChange={(e) => setArticleForm({ ...articleForm, publicationStatus: e.target.value })}>
                    {["Draft", "Published", "Archived"].map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                </div>
              </div>
              <div className="adm-field">
                <label>Cover Photo URL *</label>
                <input type="url" value={articleForm.coverImage} onChange={(e) => setArticleForm({ ...articleForm, coverImage: e.target.value })} required />
              </div>
              {articleForm.coverImage && <img className="adm-image-preview" src={articleForm.coverImage} alt="Article cover preview" />}
              <div className="adm-field">
                <label>Summary *</label>
                <textarea rows={3} value={articleForm.summary} onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })} maxLength={500} required />
              </div>
              <div className="adm-field">
                <label>Article Content *</label>
                <textarea rows={12} value={articleForm.content} onChange={(e) => setArticleForm({ ...articleForm, content: e.target.value })} required />
              </div>
              <div className="adm-modal-footer">
                <button type="button" className="adm-btn-ghost" onClick={() => setArticleModalOpen(false)}>Cancel</button>
                <button type="submit" className="adm-btn-primary">{editingArticle ? "Save Article" : "Create Article"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GUIDE MODAL */}
      {guideModalOpen && (
        <div className="adm-modal-backdrop">
          <div className="adm-modal-card">
            <div className="adm-modal-header">
              <h3>{editingGuide ? `Edit Guide: ${editingGuide.title}` : "Add Trail Guide Article"}</h3>
              <button type="button" className="adm-modal-close-btn" onClick={() => setGuideModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveGuide} className="adm-modal-form">
              <div className="adm-field">
                <label>Guide Title *</label>
                <input
                  type="text"
                  value={guideForm.title}
                  onChange={(e) => setGuideForm({ ...guideForm, title: e.target.value })}
                  placeholder="e.g. 5 Hydration Secrets for High Passes"
                  required
                />
              </div>

              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Category Topic</label>
                  <select
                    value={guideForm.category}
                    onChange={(e) => setGuideForm({ ...guideForm, category: e.target.value })}
                  >
                    <option value="altitude">Altitude & Acclimatization</option>
                    <option value="permits">Permits & TIMS 2026</option>
                    <option value="packing">Interactive Gear Checklist</option>
                    <option value="seasons">Seasons & Weather</option>
                    <option value="culture">Teahouse & Sherpa Culture</option>
                    <option value="faq">Trail FAQs</option>
                  </select>
                </div>

                <div className="adm-field">
                  <label>Format Type</label>
                  <select
                    value={guideForm.type}
                    onChange={(e) => setGuideForm({ ...guideForm, type: e.target.value })}
                  >
                    <option value="article">Standard Article Card</option>
                    <option value="rules">Numbered Golden Rules</option>
                  </select>
                </div>
              </div>

              <div className="adm-field">
                <label>Short Summary / Subtitle</label>
                <input
                  type="text"
                  value={guideForm.summary}
                  onChange={(e) => setGuideForm({ ...guideForm, summary: e.target.value })}
                  placeholder="Quick takeaway for the card preview"
                />
              </div>

              <div className="adm-field">
                <label>Detailed Content / Advice *</label>
                <textarea
                  rows={5}
                  value={guideForm.content}
                  onChange={(e) => setGuideForm({ ...guideForm, content: e.target.value })}
                  placeholder="Practical advice, insider tips, medical rationale, or trail etiquette notes..."
                  required
                />
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-btn-ghost" onClick={() => setGuideModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn-primary">
                  {editingGuide ? "Update Guide" : "Publish to Trekking Guide"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW BOOKING DETAILS MODAL */}
      {viewingBooking && (
        <div className="adm-modal-backdrop">
          <div className="adm-modal-card" style={{ maxWidth: "680px" }}>
            <div className="adm-modal-header">
              <div>
                <h3 style={{ margin: "0 0 4px 0" }}>
                  Reservation Dossier: {viewingBooking.bookingReference || viewingBooking.id || viewingBooking._id}
                </h3>
                <span style={{ fontSize: "12px", color: "#64748b" }}>
                  Submitted on {new Date(viewingBooking.createdAt || Date.now()).toLocaleDateString()}
                </span>
              </div>
              <button type="button" className="adm-modal-close-btn" onClick={() => setViewingBooking(null)}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "20px", padding: "10px 0" }}>
              {/* Status Chips */}
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <div>
                  <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "3px" }}>Booking Status</span>
                  <span className={`adm-pill ${viewingBooking.bookingStatus === "Confirmed" ? "green" : viewingBooking.bookingStatus === "Completed" ? "blue" : viewingBooking.bookingStatus === "Cancelled" ? "red" : "orange"}`}>
                    {viewingBooking.bookingStatus || "Pending"}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "3px" }}>Payment Status</span>
                  <span className={`adm-pill ${viewingBooking.paymentStatus === "Paid" ? "green" : viewingBooking.paymentStatus === "Refunded" ? "red" : "orange"}`}>
                    {viewingBooking.paymentStatus || "Pending"}
                  </span>
                </div>
                {viewingBooking.paymentMethod && (
                  <div>
                    <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: "3px" }}>Payment Method</span>
                    <span className="adm-pill gray">{viewingBooking.paymentMethod}</span>
                  </div>
                )}
              </div>

              {/* Lead Traveler Dossier */}
              <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>
                  Lead Traveler Information
                </h4>
                {(() => {
                  const lead = viewingBooking.travelerDetails?.[0] || {};
                  return (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "13px" }}>
                      <div><strong>Full Name:</strong> {lead.fullName || viewingBooking.name || "N/A"}</div>
                      <div><strong>Email:</strong> {lead.email || viewingBooking.email || "N/A"}</div>
                      <div><strong>Phone:</strong> {lead.phone || viewingBooking.phone || "N/A"}</div>
                      <div><strong>Nationality:</strong> {lead.nationality || viewingBooking.country || "N/A"}</div>
                      <div><strong>Dietary:</strong> {lead.dietaryRequirements || "None specified"}</div>
                      <div><strong>Emergency Contact:</strong> {lead.emergencyContact || "None specified"}</div>
                    </div>
                  );
                })()}
              </div>

              {/* Additional Travelers if pax > 1 */}
              {viewingBooking.travelerDetails && viewingBooking.travelerDetails.length > 1 && (
                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                  <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>
                    Additional Expedition Participants ({viewingBooking.travelerDetails.length - 1})
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {viewingBooking.travelerDetails.slice(1).map((t, idx) => (
                      <div key={idx} style={{ padding: "8px", background: "#ffffff", borderRadius: "6px", border: "1px solid #cbd5e1", fontSize: "12.5px" }}>
                        <strong>Pax #{idx + 2}: {t.fullName || "Traveler"}</strong> · {t.nationality || "N/A"} · {t.dietaryRequirements || "Standard diet"}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expedition Package & Departure */}
              <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                <h4 style={{ margin: "0 0 10px 0", fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>
                  Expedition Itinerary & Schedule
                </h4>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "13px" }}>
                  <div><strong>Trek:</strong> {viewingBooking.trek?.title || viewingBooking.trekTitle || viewingBooking.trekSlug}</div>
                  <div><strong>Party Size:</strong> {viewingBooking.numberOfTravelers || viewingBooking.travelers || 1} Trekkers</div>
                  <div>
                    <strong>Departure Dates:</strong>{" "}
                    {viewingBooking.departure?.startDate
                      ? `${new Date(viewingBooking.departure.startDate).toLocaleDateString()} to ${new Date(viewingBooking.departure.endDate).toLocaleDateString()}`
                      : (viewingBooking.startDate || "Flexible")}
                  </div>
                  <div><strong>Total Invoice:</strong> <span style={{ color: "#059669", fontWeight: "700" }}>${viewingBooking.totalAmount?.toLocaleString()}</span></div>
                </div>
              </div>

              {/* Traveler Notes */}
              {viewingBooking.notes && (
                <div style={{ background: "#fffbeb", padding: "14px", borderRadius: "8px", border: "1px solid #fef3c7" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#b45309", display: "block", marginBottom: "4px" }}>
                    Special Requests & Medical/Altitude Notes:
                  </span>
                  <p style={{ margin: 0, fontSize: "13px", color: "#78350f" }}>{viewingBooking.notes}</p>
                </div>
              )}
            </div>

            <div className="adm-modal-footer" style={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex", gap: "8px" }}>
                {viewingBooking.bookingStatus !== "Confirmed" && (
                  <button
                    type="button"
                    className="adm-btn-primary"
                    style={{ background: "#10b981" }}
                    onClick={() => {
                      handleUpdateBooking(viewingBooking._id || viewingBooking.id, "Confirmed", "Paid");
                      setViewingBooking(null);
                    }}
                  >
                    Confirm & Mark Paid
                  </button>
                )}
                {viewingBooking.bookingStatus === "Confirmed" &&
                  hasDepartureEnded(viewingBooking.departure?.endDate) && (
                  <button
                    type="button"
                    className="adm-btn-primary"
                    style={{ background: "#0284c7" }}
                    onClick={() => {
                      handleUpdateBooking(viewingBooking._id || viewingBooking.id, "Completed", viewingBooking.paymentStatus || "Paid");
                      setViewingBooking(null);
                    }}
                  >
                    Mark Completed
                  </button>
                )}
                {viewingBooking.bookingStatus !== "Cancelled" && (
                  <button
                    type="button"
                    className="adm-btn-ghost"
                    style={{ color: "#ef4444", borderColor: "#fca5a5" }}
                    onClick={() => {
                      handleUpdateBooking(viewingBooking._id || viewingBooking.id, "Cancelled", "Refunded");
                      setViewingBooking(null);
                    }}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
              <button type="button" className="adm-btn-ghost" onClick={() => setViewingBooking(null)}>
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT BOOKING MODAL */}
      {editingBooking && (
        <div className="adm-modal-backdrop">
          <div className="adm-modal-card" style={{ maxWidth: "600px" }}>
            <div className="adm-modal-header">
              <h3>Edit Booking: {editingBooking.bookingReference || editingBooking.id || editingBooking._id}</h3>
              <button type="button" className="adm-modal-close-btn" onClick={() => setEditingBooking(null)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEditBooking} className="adm-modal-form">
              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Lead Traveler Full Name *</label>
                  <input
                    type="text"
                    value={editBookingForm.fullName}
                    onChange={(e) => setEditBookingForm({ ...editBookingForm, fullName: e.target.value })}
                    required
                  />
                </div>
                <div className="adm-field">
                  <label>Lead Traveler Email *</label>
                  <input
                    type="email"
                    value={editBookingForm.email}
                    onChange={(e) => setEditBookingForm({ ...editBookingForm, email: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={editBookingForm.phone}
                    onChange={(e) => setEditBookingForm({ ...editBookingForm, phone: e.target.value })}
                  />
                </div>
                <div className="adm-field">
                  <label>Nationality</label>
                  <input
                    type="text"
                    value={editBookingForm.nationality}
                    onChange={(e) => setEditBookingForm({ ...editBookingForm, nationality: e.target.value })}
                  />
                </div>
              </div>

              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Number of Trekkers (PAX)</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={editBookingForm.travelers}
                    onChange={(e) => setEditBookingForm({ ...editBookingForm, travelers: Number(e.target.value) })}
                    required
                  />
                </div>
                <div className="adm-field">
                  <label>Total Price ($ USD)</label>
                  <input
                    type="number"
                    min="0"
                    value={editBookingForm.totalAmount}
                    onChange={(e) => setEditBookingForm({ ...editBookingForm, totalAmount: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="adm-form-row">
                <div className="adm-field">
                  <label>Booking Status</label>
                  <select
                    value={editBookingForm.bookingStatus}
                    onChange={(e) => setEditBookingForm({ ...editBookingForm, bookingStatus: e.target.value })}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option
                      value="Completed"
                      disabled={editingBooking?.bookingStatus !== "Completed" && !(
                        editingBooking?.bookingStatus === "Confirmed" &&
                        hasDepartureEnded(editingBooking?.departure?.endDate)
                      )}
                    >
                      Completed
                    </option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <small className="adm-item-submeta">
                    Mark a confirmed booking completed after its departure has ended. The traveler can then submit a review from My Reviews.
                  </small>
                </div>
                <div className="adm-field">
                  <label>Payment Status</label>
                  <select
                    value={editBookingForm.paymentStatus}
                    onChange={(e) => setEditBookingForm({ ...editBookingForm, paymentStatus: e.target.value })}
                  >
                    <option value="Pending">Pending / Unpaid</option>
                    <option value="Paid">Paid</option>
                    <option value="Refunded">Refunded</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              <div className="adm-field">
                <label>Internal Administrator / Customer Notes</label>
                <textarea
                  rows={3}
                  value={editBookingForm.notes}
                  onChange={(e) => setEditBookingForm({ ...editBookingForm, notes: e.target.value })}
                  placeholder="Special permits arranged, room preferences, custom arrangements..."
                />
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-btn-ghost" onClick={() => setEditingBooking(null)}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn-primary">
                  Save Booking Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL */}
      {confirmModal.isOpen && (
        <div className="adm-modal-backdrop">
          <div className="adm-modal-card confirm-card">
            <div className="confirm-icon-wrap">
              <AlertTriangle size={26} />
            </div>
            <h4>{confirmModal.title}</h4>
            <p>{confirmModal.message}</p>
            <div className="confirm-card-actions">
              <button
                type="button"
                className="adm-btn-ghost"
                onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
              >
                Cancel
              </button>
              <button
                type="button"
                className="adm-btn-danger"
                onClick={confirmModal.onConfirm}
              >
                {confirmModal.confirmLabel || "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
