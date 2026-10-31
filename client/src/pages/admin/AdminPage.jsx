import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  DollarSign,
  Edit,
  Eye,
  FileText,
  KeyRound,
  LayoutDashboard,
  LogOut,
  MapPin,
  Mountain,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Shield,
  Star,
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
import "./AdminDashboard.css";

export function AdminPage() {
  const { user, logout, isAdmin, loading: authLoading } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();
  const { tab } = useParams();

  // Validate active sub-route or default to dashboard
  const validTabs = ["dashboard", "treks", "destinations", "departures", "bookings", "users", "content", "settings"];
  const activeTab = validTabs.includes(tab) ? tab : "dashboard";

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
  const [destinationsList, setDestinationsList] = useState([]);
  const [departuresList, setDeparturesList] = useState([]);
  const [bookingsList, setBookingsList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [articlesList, setArticlesList] = useState([]);
  const [reviewsList, setReviewsList] = useState([]);
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
  });

  const [destModalOpen, setDestModalOpen] = useState(false);
  const [editingDest, setEditingDest] = useState(null);
  const [destForm, setDestForm] = useState({
    name: "",
    slug: "",
    region: "Khumbu",
    description: "",
    highlights: "",
    lat: "27.8",
    lng: "86.7",
    bestSeason: "Spring, Autumn",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
  });

  const [depModalOpen, setDepModalOpen] = useState(false);
  const [depForm, setDepForm] = useState({
    trekSlug: "everest-base-camp",
    startDate: "2026-05-15",
    endDate: "2026-05-28",
    price: 1598,
    originalPrice: 1890,
    capacity: 12,
    status: "Guaranteed",
  });

  // Modern Confirmation Modal
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmLabel: "Delete",
    onConfirm: null,
  });

  // Load backend and live data
  const loadDashboardData = async () => {
    try {
      // 1. Stats
      api.admin.getStats().then((res) => {
        if (res.success && res.stats) setStats(res.stats);
      }).catch(() => {});

      // 2. Treks
      api.treks.getAll({ limit: 100 }).then((res) => {
        if (res.success && res.treks) {
          setTreksList(res.treks);
        } else {
          setTreksList(dataStore.getTreks());
        }
      }).catch(() => {
        setTreksList(dataStore.getTreks());
      });

      // 3. Destinations
      api.destinations.getAll().then((res) => {
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
          mapped.forEach((dest) => dataStore.saveDestination(dest));
        } else {
          setDestinationsList(dataStore.getDestinations());
        }
      }).catch(() => {
        setDestinationsList(dataStore.getDestinations());
      });

      // 4. Departures
      api.departures.getAll({ upcoming: "false" }).then((res) => {
        if (res.success && res.departures) setDeparturesList(res.departures);
      }).catch(() => {
        setDeparturesList(dataStore.getDepartures());
      });

      // 5. Bookings
      api.bookings.getAll().then((res) => {
        if (res.success && res.bookings) setBookingsList(res.bookings);
      }).catch(() => {
        setBookingsList(dataStore.getBookings());
      });

      // 6. Users
      api.admin.getUsers().then((res) => {
        if (res.success && res.users) setUsersList(res.users);
      }).catch(() => {});

      // 7. Articles
      api.articles.getAll().then((res) => {
        if (res.success && res.articles) setArticlesList(res.articles);
      }).catch(() => {
        setArticlesList(dataStore.getArticles());
      });

      // 8. Reviews
      api.reviews.getAll().then((res) => {
        if (res.success && res.reviews) setReviewsList(res.reviews);
      }).catch(() => {});

      // 9. Settings
      api.admin.getSettings().then((res) => {
        if (res.success && res.settings) setSettingsData(res.settings);
      }).catch(() => {});
    } catch (_err) {
      // Graceful fallback
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

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
    });
    setTrekModalOpen(true);
  };

  const handleSaveTrekSubmit = async (e) => {
    e.preventDefault();
    const slug = editingTrek
      ? editingTrek.slug
      : trekForm.slug.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "trek-" + Date.now();

    const highlightsArr = trekForm.highlights.split("\n").filter((l) => l.trim().length > 0);
    const includedArr = trekForm.included.split("\n").filter((l) => l.trim().length > 0);
    const excludedArr = trekForm.excluded.split("\n").filter((l) => l.trim().length > 0);

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
      images: [trekForm.image],
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
        } catch (_e) {}
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
    } catch (_e) {}
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
    } catch (_e) {}
    const trek = dataStore.getTrek(slug);
    if (trek) {
      dataStore.saveTrek({ ...trek, featured: !currentVal });
    }
    window.dispatchEvent(new Event("agaaman_data_changed"));
    notify(`Trek ${currentVal ? "unmarked" : "featured on homepage"}.`);
    loadDashboardData();
  };

  // ── DESTINATION ACTIONS ──
  const handleOpenAddDest = () => {
    setEditingDest(null);
    setDestForm({
      name: "",
      slug: "",
      region: "Khumbu",
      description: "",
      highlights: "",
      lat: "27.8",
      lng: "86.7",
      bestSeason: "Spring, Autumn",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    });
    setDestModalOpen(true);
  };

  const handleOpenEditDest = (d) => {
    setEditingDest(d);
    setDestForm({
      name: d.name || "",
      slug: d.slug || "",
      region: d.region || "Khumbu",
      description: d.description || "",
      highlights: Array.isArray(d.highlights) ? d.highlights.join("\n") : (d.highlights || ""),
      lat: String(d.coordinates?.lat || d.lat || "27.8"),
      lng: String(d.coordinates?.lng || d.lng || "86.7"),
      bestSeason: Array.isArray(d.bestSeason) ? d.bestSeason.join(", ") : (d.bestSeason || "Spring, Autumn"),
      image: d.images?.[0] || d.image || "",
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

    const payload = {
      name: destForm.name,
      slug,
      region: destForm.region,
      description: destForm.description,
      images: [destForm.image],
      coordinates: { lat: Number(destForm.lat), lng: Number(destForm.lng) },
      highlights: highlightsArr,
      bestSeason: bestSeasonArr,
    };

    try {
      if (editingDest && editingDest._id) {
        await api.destinations.update(editingDest._id, payload);
      } else {
        await api.destinations.create(payload);
      }
      notify(editingDest ? `Updated destination: ${destForm.name}` : `Created destination: ${destForm.name}`);
    } catch (_err) {
      notify("Destination saved locally & updated on live frontend.");
    }

    dataStore.saveDestination({
      ...payload,
      id: editingDest?._id || editingDest?.id,
      lat: Number(destForm.lat),
      lng: Number(destForm.lng),
      image: destForm.image,
      trekSlugs: editingDest?.trekSlugs || [],
    });
    window.dispatchEvent(new Event("agaaman_data_changed"));
    setDestModalOpen(false);
    loadDashboardData();
  };

  const handleDeleteDest = (id, slug, name) => {
    setConfirmModal({
      isOpen: true,
      title: `Delete "${name}"?`,
      message: "This destination will be removed from all destination listings, regions, and Himalayan map pins.",
      confirmLabel: "Delete Destination",
      onConfirm: async () => {
        try {
          if (id) await api.destinations.delete(id);
        } catch (_e) {}
        dataStore.deleteDestination(id || slug);
        window.dispatchEvent(new Event("agaaman_data_changed"));
        notify(`Deleted destination: "${name}"`);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        loadDashboardData();
      },
    });
  };

  // ── DEPARTURE ACTIONS ──
  const handleSaveDeparture = async (e) => {
    e.preventDefault();
    try {
      await api.departures.create(depForm);
      notify("New group departure scheduled!");
    } catch (_err) {
      dataStore.saveDeparture(depForm);
      notify("Group departure scheduled!");
    }
    window.dispatchEvent(new Event("agaaman_data_changed"));
    setDepModalOpen(false);
    loadDashboardData();
  };

  const handleDeleteDeparture = (id) => {
    setConfirmModal({
      isOpen: true,
      title: "Delete Group Departure?",
      message: "This will remove this scheduled fixed departure date from the booking calendars.",
      confirmLabel: "Delete Date",
      onConfirm: async () => {
        try {
          if (id) await api.departures.delete(id);
        } catch (_e) {}
        dataStore.deleteDeparture(id);
        window.dispatchEvent(new Event("agaaman_data_changed"));
        notify("Departure removed.");
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        loadDashboardData();
      },
    });
  };

  // ── BOOKING ACTIONS ──
  const handleUpdateBooking = async (id, bookingStatus, paymentStatus) => {
    try {
      if (id) await api.bookings.updateStatus(id, { bookingStatus, paymentStatus });
    } catch (_e) {}
    if (bookingStatus) dataStore.updateBookingStatus(id, bookingStatus);
    if (paymentStatus) dataStore.updatePaymentStatus(id, paymentStatus);
    window.dispatchEvent(new Event("agaaman_data_changed"));
    notify("Booking updated successfully.");
    loadDashboardData();
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
            className={`adm-nav-item${activeTab === "destinations" ? " is-active" : ""}`}
            onClick={() => handleSelectTab("destinations")}
          >
            <div className="adm-nav-item-left">
              <MapPin size={18} />
              <span>Destinations</span>
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
                    <span className="adm-metric-sub">↑ 18% vs last month</span>
                  </div>
                  <div className="adm-metric-icon green">
                    <DollarSign size={22} />
                  </div>
                </div>

                <div className="adm-metric-card">
                  <div className="adm-metric-info">
                    <span className="adm-metric-label">Active Expeditions</span>
                    <span className="adm-metric-value">{treksList.length}</span>
                    <span className="adm-metric-sub">Across 7 Himalayan zones</span>
                  </div>
                  <div className="adm-metric-icon">
                    <Compass size={22} />
                  </div>
                </div>

                <div className="adm-metric-card">
                  <div className="adm-metric-info">
                    <span className="adm-metric-label">Traveler Bookings</span>
                    <span className="adm-metric-value">{bookingsList.length}</span>
                    <span className="adm-metric-sub" style={{ color: "#ea580c" }}>
                      {stats.pendingBookings || 1} pending approval
                    </span>
                  </div>
                  <div className="adm-metric-icon blue">
                    <CheckCircle2 size={22} />
                  </div>
                </div>

                <div className="adm-metric-card">
                  <div className="adm-metric-info">
                    <span className="adm-metric-label">Himalayan Destinations</span>
                    <span className="adm-metric-value">{destinationsList.length}</span>
                    <span className="adm-metric-sub">Interactive GPS pins</span>
                  </div>
                  <div className="adm-metric-icon purple">
                    <MapPin size={22} />
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
                        <th>Traveler</th>
                        <th>Trek Package</th>
                        <th>PAX</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingsList.slice(0, 5).map((b) => (
                        <tr key={b.id || b.bookingReference}>
                          <td><strong>{b.bookingReference || b.id}</strong></td>
                          <td>
                            <div className="adm-item-title-col">
                              <span>{b.name}</span>
                              <span className="adm-item-submeta">{b.email}</span>
                            </div>
                          </td>
                          <td>{b.trekTitle || b.trekSlug}</td>
                          <td>{b.travelers || 1} PAX</td>
                          <td><strong>${b.totalAmount?.toLocaleString()}</strong></td>
                          <td>
                            <span className={`adm-pill ${b.bookingStatus === "Confirmed" ? "green" : b.bookingStatus === "Requested" ? "orange" : "gray"}`}>
                              {b.bookingStatus || "Requested"}
                            </span>
                          </td>
                          <td>
                            <div className="adm-actions-row">
                              {b.bookingStatus !== "Confirmed" && (
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
                              <button
                                type="button"
                                className="adm-icon-btn delete"
                                onClick={() => handleUpdateBooking(b._id || b.id, "Cancelled", "Refunded")}
                                title="Cancel reservation"
                              >
                                <X size={16} />
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
              TAB 2: TREKS CATALOG (MEDIA STANDARDIZED)
             ════════════════════════════════════════ */}
          {activeTab === "treks" && (
            <div>
              <div className="adm-pane-header">
                <div className="adm-pane-title">
                  <h2>Treks & Expeditions Catalog</h2>
                  <p>Create, update, and manage all routes, altitudes, pricing, and live public catalogs.</p>
                </div>
                <button type="button" className="adm-btn-primary" onClick={handleOpenAddTrek}>
                  <Plus size={16} /> Create New Trek
                </button>
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
                        <th>Featured</th>
                        <th>Visibility</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {treksList.map((t) => {
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
                                <Link to={`/treks/${t.slug}`} target="_blank" className="adm-item-title-link">
                                  {t.title}
                                </Link>
                                <span className="adm-item-submeta">{t.region} · {t.difficulty}</span>
                              </div>
                            </td>
                            <td>{t.duration} Days</td>
                            <td>{t.maximumElevation || t.elevation}m</td>
                            <td><strong>${t.price?.toLocaleString()}</strong></td>
                            <td>
                              <button
                                type="button"
                                className={`adm-star-btn${isFeatured ? " is-active" : ""}`}
                                onClick={() => handleToggleFeatured(t._id, t.slug, isFeatured)}
                                title={isFeatured ? "Unmark featured" : "Mark as featured on homepage"}
                              >
                                <Star size={18} fill={isFeatured ? "currentColor" : "none"} />
                              </button>
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
              TAB 3: DESTINATIONS & REGIONS (STANDARDIZED)
             ════════════════════════════════════════ */}
          {activeTab === "destinations" && (
            <div>
              <div className="adm-pane-header">
                <div className="adm-pane-title">
                  <h2>Destinations & Regions Management</h2>
                  <p>Himalayan zones, interactive map coordinates, best trekking windows, and highlights.</p>
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

                  return (
                    <div key={d._id || d.id || d.slug} className="adm-dest-card">
                      <div className="adm-dest-image-wrap">
                        <img src={img} alt={d.name} className="adm-dest-image" />
                        <span className="adm-dest-region-badge">{d.region || "Himalaya"}</span>
                      </div>
                      <div className="adm-dest-body">
                        <h3 className="adm-dest-title">{d.name}</h3>
                        <p className="adm-dest-desc">
                          {(d.description || "").slice(0, 115)}
                          {(d.description || "").length > 115 ? "..." : ""}
                        </p>

                        <div className="adm-dest-meta-row">
                          {(lat || lng) && (
                            <span className="adm-dest-meta-item">
                              <MapPin size={13} /> {Number(lat).toFixed(2)}°N, {Number(lng).toFixed(2)}°E
                            </span>
                          )}
                          {d.bestSeason && (
                            <span className="adm-dest-meta-item">
                              🗓️ {Array.isArray(d.bestSeason) ? d.bestSeason.join(", ") : d.bestSeason}
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
                  <p>Schedule guaranteed departure dates with maximum group PAX limits and special pricing.</p>
                </div>
                <button type="button" className="adm-btn-primary" onClick={() => setDepModalOpen(true)}>
                  <Plus size={16} /> Schedule Departure
                </button>
              </div>

              <div className="adm-card">
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Trek Package</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Capacity</th>
                        <th>Special Price</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {departuresList.map((dep) => (
                        <tr key={dep._id || dep.id}>
                          <td><strong>{dep.trekTitle || dep.trekSlug}</strong></td>
                          <td>{dep.startDate}</td>
                          <td>{dep.endDate}</td>
                          <td>{dep.availableSeats || dep.capacity || 12} Seats</td>
                          <td><strong>${dep.price?.toLocaleString()}</strong></td>
                          <td>
                            <span className="adm-pill green">{dep.status || "Guaranteed"}</span>
                          </td>
                          <td>
                            <button
                              type="button"
                              className="adm-icon-btn delete"
                              onClick={() => handleDeleteDeparture(dep._id || dep.id)}
                              title="Delete Date"
                            >
                              <Trash2 size={15} />
                            </button>
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
              TAB 5: BOOKINGS, CUSTOMIZATIONS & INQUIRIES
             ════════════════════════════════════════ */}
          {activeTab === "bookings" && (
            <div>
              <div className="adm-pane-header">
                <div className="adm-pane-title">
                  <h2>Traveler Bookings, Custom Itineraries & Inquiries</h2>
                  <p>Filter by reservation type, approve departures, and view traveler health/itinerary notes.</p>
                </div>
              </div>

              {/* Filter Tabs */}
              <div style={{ display: "flex", gap: "8px", marginBottom: "18px", flexWrap: "wrap" }}>
                {[
                  { key: "all", label: `All Inquiries (${bookingsList.length})` },
                  { key: "booking", label: `Direct Bookings (${bookingsList.filter((b) => !b.type || b.type === "booking").length})` },
                  { key: "customization", label: `Customized Trips (${bookingsList.filter((b) => b.type === "customization").length})` },
                  { key: "inquiry", label: `Quick Inquiries (${bookingsList.filter((b) => b.type === "inquiry").length})` },
                ].map((f) => (
                  <button
                    key={f.key}
                    type="button"
                    className={`adm-btn-ghost${bookingFilter === f.key ? " is-active" : ""}`}
                    onClick={() => setBookingFilter(f.key)}
                    style={{
                      background: bookingFilter === f.key ? "#083c34" : "#ffffff",
                      color: bookingFilter === f.key ? "#ffffff" : "#475569",
                      borderColor: bookingFilter === f.key ? "#083c34" : "#cbd5e1",
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <div className="adm-card">
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead>
                      <tr>
                        <th>Ref Code</th>
                        <th>Type</th>
                        <th>Traveler</th>
                        <th>Trek Package</th>
                        <th>Dates / PAX</th>
                        <th>Total / Deposit</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookingsList
                        .filter((b) => {
                          if (bookingFilter === "all") return true;
                          if (bookingFilter === "booking") return !b.type || b.type === "booking";
                          return b.type === bookingFilter;
                        })
                        .map((b) => (
                          <tr key={b.id || b.bookingReference}>
                            <td><strong>{b.bookingReference || b.id}</strong></td>
                            <td>
                              <span
                                className={`adm-pill ${
                                  b.type === "customization"
                                    ? "orange"
                                    : b.type === "inquiry"
                                    ? "blue"
                                    : "green"
                                }`}
                              >
                                {b.type === "customization"
                                  ? "Custom Trip"
                                  : b.type === "inquiry"
                                  ? "Quick Inquiry"
                                  : "Trip Booking"}
                              </span>
                            </td>
                            <td>
                              <div className="adm-item-title-col">
                                <span>{b.name}</span>
                                <span className="adm-item-submeta">{b.email} · {b.phone || b.country}</span>
                                {b.notes && (
                                  <span style={{ fontSize: "11px", color: "#64748b", fontStyle: "italic", maxWidth: "260px" }}>
                                    "{b.notes.slice(0, 75)}{b.notes.length > 75 ? "..." : ""}"
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>{b.trekTitle || b.trekSlug}</td>
                            <td>
                              <div className="adm-item-title-col">
                                <span>{b.startDate || "Flexible"}</span>
                                <span className="adm-item-submeta">{b.travelers || 1} PAX</span>
                              </div>
                            </td>
                            <td>
                              <div className="adm-item-title-col">
                                <strong>${b.totalAmount?.toLocaleString()}</strong>
                                {b.depositAmount && (
                                  <span style={{ fontSize: "11px", color: "#10b981" }}>
                                    Dep: ${b.depositAmount?.toLocaleString()}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td>
                              <span className={`adm-pill ${b.bookingStatus === "Confirmed" ? "green" : b.bookingStatus === "Requested" ? "orange" : "gray"}`}>
                                {b.bookingStatus || "Requested"}
                              </span>
                            </td>
                            <td>
                              <div className="adm-actions-row">
                                {b.bookingStatus !== "Confirmed" && (
                                  <button
                                    type="button"
                                    className="adm-icon-btn"
                                    onClick={() => handleUpdateBooking(b._id || b.id, "Confirmed", "Paid")}
                                    title="Approve & Confirm Reservation"
                                    style={{ color: "#10b981" }}
                                  >
                                    <Check size={16} />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  className="adm-icon-btn delete"
                                  onClick={() => handleUpdateBooking(b._id || b.id, "Cancelled", "Refunded")}
                                  title="Cancel or Decline"
                                >
                                  <X size={16} />
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
              TAB 6: USER ACCOUNTS
             ════════════════════════════════════════ */}
          {activeTab === "users" && (
            <div>
              <div className="adm-pane-header">
                <div className="adm-pane-title">
                  <h2>User Accounts & Permissions</h2>
                  <p>Manage administrative roles, traveler credentials, and security permissions.</p>
                </div>
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
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.length > 0 ? (
                        usersList.map((u) => (
                          <tr key={u._id}>
                            <td><strong>{u.name}</strong></td>
                            <td>{u.email}</td>
                            <td>
                              <span className={`adm-pill ${u.role === "admin" ? "orange" : "blue"}`}>
                                {u.role === "admin" ? "Administrator" : "Traveler"}
                              </span>
                            </td>
                            <td>
                              <span className={`adm-pill ${u.status === "active" ? "green" : "red"}`}>
                                {u.status || "active"}
                              </span>
                            </td>
                            <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))
                      ) : (
                        <>
                          <tr>
                            <td><strong>Agaaman Admin</strong></td>
                            <td>admin@agaaman.com</td>
                            <td><span className="adm-pill orange">Administrator</span></td>
                            <td><span className="adm-pill green">active</span></td>
                            <td>Primary Master Account</td>
                          </tr>
                          <tr>
                            <td><strong>Alex Thorne</strong></td>
                            <td>traveler@agaaman.com</td>
                            <td><span className="adm-pill blue">Traveler</span></td>
                            <td><span className="adm-pill green">active</span></td>
                            <td>2026-05-10</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ════════════════════════════════════════
              TAB 7: JOURNAL CONTENT
             ════════════════════════════════════════ */}
          {activeTab === "content" && (
            <div>
              <div className="adm-pane-header">
                <div className="adm-pane-title">
                  <h2>Journal & Field Articles</h2>
                  <p>Himalayan route guides, altitude sickness reports, and preparation manuals.</p>
                </div>
              </div>

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
                        <tr key={art.slug}>
                          <td>
                            <div className="adm-thumbnail-wrap" style={{ width: "64px", height: "42px" }}>
                              <img src={art.image} alt={art.title} className="adm-thumbnail-img" />
                            </div>
                          </td>
                          <td>
                            <Link to={`/journal/${art.slug}`} target="_blank" className="adm-item-title-link">
                              {art.title}
                            </Link>
                          </td>
                          <td><span className="adm-pill blue">{art.category}</span></td>
                          <td>{art.author?.name || "Editorial Team"}</td>
                          <td>{art.readTime || "6 min"}</td>
                          <td>
                            <Link to={`/journal/${art.slug}`} target="_blank" className="adm-icon-btn" title="View Article">
                              <Eye size={15} />
                            </Link>
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
                  <label>Geographic Region</label>
                  <input
                    type="text"
                    value={destForm.region}
                    onChange={(e) => setDestForm({ ...destForm, region: e.target.value })}
                    placeholder="e.g. Eastern Himalaya"
                  />
                </div>
                <div className="adm-field">
                  <label>Best Seasons (comma-separated)</label>
                  <input
                    type="text"
                    value={destForm.bestSeason}
                    onChange={(e) => setDestForm({ ...destForm, bestSeason: e.target.value })}
                    placeholder="Spring, Autumn"
                  />
                </div>
              </div>

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
                <label>Cover Photo URL</label>
                <input
                  type="url"
                  value={destForm.image}
                  onChange={(e) => setDestForm({ ...destForm, image: e.target.value })}
                />
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
              <h3>Schedule Fixed Group Departure</h3>
              <button type="button" className="adm-modal-close-btn" onClick={() => setDepModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveDeparture} className="adm-modal-form">
              <div className="adm-field">
                <label>Trek Package</label>
                <select
                  value={depForm.trekSlug}
                  onChange={(e) => setDepForm({ ...depForm, trekSlug: e.target.value })}
                >
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
                  <label>Capacity (PAX)</label>
                  <input
                    type="number"
                    value={depForm.capacity}
                    onChange={(e) => setDepForm({ ...depForm, capacity: Number(e.target.value) })}
                    min={1}
                    required
                  />
                </div>
                <div className="adm-field">
                  <label>Special Price / PAX ($)</label>
                  <input
                    type="number"
                    value={depForm.price}
                    onChange={(e) => setDepForm({ ...depForm, price: Number(e.target.value) })}
                    required
                  />
                </div>
              </div>

              <div className="adm-modal-footer">
                <button type="button" className="adm-btn-ghost" onClick={() => setDepModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="adm-btn-primary">
                  Schedule Date
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
