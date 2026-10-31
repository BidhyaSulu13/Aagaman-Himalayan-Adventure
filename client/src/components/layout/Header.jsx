import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Calendar,
  ChevronDown,
  Clock,
  Compass,
  FileText,
  Flame,
  Heart,
  HeartHandshake,
  Lock,
  MapPin,
  Menu,
  Mountain,
  Package,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Sun,
  UserCheck,
  X
} from "lucide-react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import { useFavorites } from "../../context/FavoritesContext.jsx";
import { useTreks } from "../../hooks/useDataStore.js";

// Regions listed in Spade Himalaya style
const regionsList = [
  { id: "everest", label: "Everest Region", match: ["Khumbu", "Everest"] },
  { id: "annapurna", label: "Annapurna Region", match: ["Annapurna"] },
  { id: "langtang", label: "Langtang Region", match: ["Langtang"] },
  { id: "manaslu", label: "Manaslu Region", match: ["Manaslu"] },
  { id: "makalu", label: "Makalu Region", match: ["Makalu"] },
  { id: "dhaulagiri", label: "Dhaulagiri", match: ["Dhaulagiri"] },
  { id: "dolpo", label: "Dolpo Region", match: ["Dolpo"] },
];

const guideSublinks = [
  {
    title: "Altitude Safety & Acclimatization",
    desc: "Golden rules of AMS, hydration, and safe ascent.",
    icon: Mountain,
    to: "/trekking-guide",
  },
  {
    title: "Permits & TIMS 2026 Rules",
    desc: "ACAP, Sagarmatha, RAP, and mandatory guide rules.",
    icon: FileText,
    to: "/trekking-guide",
  },
  {
    title: "Interactive Gear Checklist",
    desc: "Full packing checklist with layering essentials.",
    icon: Package,
    to: "/trekking-guide",
  },
  {
    title: "Seasons & Weather Windows",
    desc: "Spring rhododendrons vs. crisp autumn skies.",
    icon: Sun,
    to: "/trekking-guide",
  },
  {
    title: "Teahouse & Sherpa Culture",
    desc: "Bukhari stoves, dal bhat power, and trail etiquette.",
    icon: HeartHandshake,
    to: "/trekking-guide",
  },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null); // 'treks' | 'guide' | null
  const [activeRegionId, setActiveRegionId] = useState("everest");
  const [mobileExpanded, setMobileExpanded] = useState({ treks: false, guide: false });
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState(() => new URLSearchParams(location.search).get("search") || "");
  const { savedTreks } = useFavorites();
  const { user } = useAuth();
  const reduceMotion = useReducedMotion();
  const navRef = useRef(null);
  const closeTimeoutRef = useRef(null);

  const treks = useTreks();

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  // Sync search query param
  useEffect(() => {
    setSearch(new URLSearchParams(location.search).get("search") || "");
  }, [location.search]);

  // Detect scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMouseEnter = (name) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setOpenDropdown(name);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 200);
  };

  // Get treks for currently active region in the mega-menu
  const currentRegion = regionsList.find((r) => r.id === activeRegionId) || regionsList[0];
  const regionTreks = treks.filter((t) => {
    return currentRegion.match.some((m) =>
      t.region?.toLowerCase().includes(m.toLowerCase()) ||
      t.location?.toLowerCase().includes(m.toLowerCase())
    );
  });

  // Group region treks by Grade based on duration
  const easyTreks = regionTreks.filter((t) => t.duration <= 6 || t.difficulty?.toLowerCase() === "easy");
  const moderateTreks = regionTreks.filter(
    (t) => (t.duration >= 7 && t.duration <= 12) || t.difficulty?.toLowerCase() === "moderate"
  );
  const highTreks = regionTreks.filter(
    (t) => t.duration >= 13 || t.difficulty?.toLowerCase() === "challenging" || t.elevation > 5000
  );

  return (
    <header className={`site-header spade-header${scrolled ? " is-scrolled" : ""}`}>
      <div className="header-inner" ref={navRef}>
        {/* Brand */}
        <Link className="brand" to="/" aria-label="Agaaman: A Himalayan Adventure">
          <div className="brand-logo-mark">
            <Mountain size={24} strokeWidth={2} />
          </div>
          <span className="brand-name">
            <span className="brand-title">Agaaman</span>
            <span className="brand-tagline">Himalayan Adventure</span>
          </span>
        </Link>

        {/* Mobile menu button */}
        <button
          className="icon-button mobile-menu-button"
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Main Nav */}
        <nav className={`main-nav spade-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
          {/* Home Link */}
          <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Home
          </NavLink>

          {/* 1. Nepal Treks Mega Menu Dropdown (Spade Himalaya Style) */}
          <div
            className={`nav-item-dropdown spade-dropdown${openDropdown === "treks" ? " is-open" : ""}`}
            onMouseEnter={() => handleMouseEnter("treks")}
            onMouseLeave={handleMouseLeave}
          >
            <div className="nav-dropdown-trigger-row">
              <NavLink
                to="/treks"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/treks")
                    ? "nav-link active has-dropdown"
                    : "nav-link has-dropdown"
                }
                onClick={(e) => {
                  if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    setMobileExpanded((prev) => ({ ...prev, treks: !prev.treks }));
                  }
                }}
              >
                <span>Nepal Treks</span>
                <ChevronDown size={15} className="dropdown-caret" />
              </NavLink>
            </div>

            {/* Spade Himalaya Style Two-Pane Mega Menu */}
            <AnimatePresence>
              {openDropdown === "treks" && (
                <motion.div
                  className="spade-mega-menu"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <div className="spade-mega-shell">
                    {/* Left Regions Sidebar */}
                    <aside className="spade-regions-sidebar">
                      {regionsList.map((reg) => {
                        const isSelected = activeRegionId === reg.id;
                        return (
                          <button
                            key={reg.id}
                            type="button"
                            className={`spade-region-tab${isSelected ? " is-active" : ""}`}
                            onMouseEnter={() => setActiveRegionId(reg.id)}
                            onClick={() => setActiveRegionId(reg.id)}
                          >
                            <span>{reg.label}</span>
                            <ArrowRight size={14} className="spade-tab-arrow" />
                          </button>
                        );
                      })}
                    </aside>

                    {/* Right Treks Content Pane with Grade Categories */}
                    <div className="spade-treks-panel">
                      <div className="spade-panel-header">
                        <h2>{currentRegion.label}</h2>
                        <span className="spade-panel-count">
                          {regionTreks.length > 0 ? `${regionTreks.length} Handcrafted Expeditions` : "Select a trail"}
                        </span>
                      </div>

                      {regionTreks.length === 0 ? (
                        <div className="spade-empty-region">
                          <Mountain size={28} />
                          <p>Custom expedition inquiries open for {currentRegion.label}. Contact our senior Sherpa guides.</p>
                          <Link to="/contact" className="button button-orange button-small" onClick={() => setOpenDropdown(null)}>
                            Inquire for {currentRegion.label}
                          </Link>
                        </div>
                      ) : (
                        <div className="spade-grades-wrapper">
                          {/* Grade 1: High / Challenging Grade (13+ Days) */}
                          {highTreks.length > 0 && (
                            <div className="spade-grade-block">
                              <div className="spade-grade-heading is-high">
                                <span className="grade-pill high-pill">High Grade</span>
                                <span className="grade-sub">13+ Days · High Altitude Passes & Base Camps</span>
                              </div>
                              <div className="spade-treks-grid">
                                {highTreks.map((trek) => (
                                  <Link
                                    key={trek.slug}
                                    to={`/treks/${trek.slug}`}
                                    className="spade-trek-card-link"
                                    onClick={() => setOpenDropdown(null)}
                                  >
                                    <span className="spade-trek-title">{trek.title}</span>
                                    <div className="spade-trek-details-row">
                                      <span className="trek-days-tag">{trek.duration} Days</span>
                                      <span className="trek-alt-tag">{trek.elevation?.toLocaleString()}m</span>
                                      <span className="trek-price-tag">From ${trek.price?.toLocaleString()}</span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Grade 2: Moderate Grade (7–12 Days) */}
                          {moderateTreks.length > 0 && (
                            <div className="spade-grade-block">
                              <div className="spade-grade-heading is-moderate">
                                <span className="grade-pill moderate-pill">Moderate Grade</span>
                                <span className="grade-sub">7–12 Days · Mountain Sanctuaries & High Meadows</span>
                              </div>
                              <div className="spade-treks-grid">
                                {moderateTreks.map((trek) => (
                                  <Link
                                    key={trek.slug}
                                    to={`/treks/${trek.slug}`}
                                    className="spade-trek-card-link"
                                    onClick={() => setOpenDropdown(null)}
                                  >
                                    <span className="spade-trek-title">{trek.title}</span>
                                    <div className="spade-trek-details-row">
                                      <span className="trek-days-tag">{trek.duration} Days</span>
                                      <span className="trek-alt-tag">{trek.elevation?.toLocaleString()}m</span>
                                      <span className="trek-price-tag">From ${trek.price?.toLocaleString()}</span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Grade 3: Easy Grade (1–6 Days) */}
                          {easyTreks.length > 0 && (
                            <div className="spade-grade-block">
                              <div className="spade-grade-heading is-easy">
                                <span className="grade-pill easy-pill">Easy Grade</span>
                                <span className="grade-sub">1–6 Days · Foothills, Sunrises & Gentle Pacing</span>
                              </div>
                              <div className="spade-treks-grid">
                                {easyTreks.map((trek) => (
                                  <Link
                                    key={trek.slug}
                                    to={`/treks/${trek.slug}`}
                                    className="spade-trek-card-link"
                                    onClick={() => setOpenDropdown(null)}
                                  >
                                    <span className="spade-trek-title">{trek.title}</span>
                                    <div className="spade-trek-details-row">
                                      <span className="trek-days-tag">{trek.duration} Days</span>
                                      <span className="trek-alt-tag">{trek.elevation?.toLocaleString()}m</span>
                                      <span className="trek-price-tag">From ${trek.price?.toLocaleString()}</span>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="spade-panel-footer">
                        <span>Looking for customized dates or private groups?</span>
                        <Link to={`/treks?region=${encodeURIComponent(currentRegion.label)}`} className="spade-view-region-btn" onClick={() => setOpenDropdown(null)}>
                          View All in {currentRegion.label} <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile View for Nepal Treks */}
            {menuOpen && mobileExpanded.treks && (
              <div className="mobile-accordion-content spade-mobile-accordion">
                <Link to="/treks" className="mobile-sublink is-parent" onClick={() => setMenuOpen(false)}>
                  All Nepal Treks Catalog →
                </Link>
                {treks.map((trek) => (
                  <Link
                    key={trek.slug}
                    to={`/treks/${trek.slug}`}
                    className="mobile-sublink"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span>{trek.title}</span>
                    <small>{trek.duration} Days · {trek.difficulty}</small>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 2. Trekking Guide Link & Dropdown */}
          <div
            className={`nav-item-dropdown${openDropdown === "guide" ? " is-open" : ""}`}
            onMouseEnter={() => handleMouseEnter("guide")}
            onMouseLeave={handleMouseLeave}
          >
            <div className="nav-dropdown-trigger-row">
              <NavLink
                to="/trekking-guide"
                className={({ isActive }) =>
                  isActive || location.pathname.startsWith("/trekking-guide")
                    ? "nav-link active has-dropdown"
                    : "nav-link has-dropdown"
                }
                onClick={(e) => {
                  if (window.innerWidth <= 1024) {
                    e.preventDefault();
                    setMobileExpanded((prev) => ({ ...prev, guide: !prev.guide }));
                  }
                }}
              >
                <span>Trek Guide</span>
                <ChevronDown size={15} className="dropdown-caret" />
              </NavLink>
            </div>

            {/* Guide Dropdown */}
            <AnimatePresence>
              {openDropdown === "guide" && (
                <motion.div
                  className="spade-guide-dropdown"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                >
                  <div className="guide-dropdown-header">
                    <BookOpen size={16} />
                    <span>Himalayan Field Manual & Preparation</span>
                  </div>
                  <div className="guide-dropdown-grid">
                    {guideSublinks.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.title}
                          to={item.to}
                          className="guide-dropdown-item"
                          onClick={() => setOpenDropdown(null)}
                        >
                          <span className="guide-item-icon">
                            <Icon size={18} />
                          </span>
                          <div className="guide-item-copy">
                            <strong>{item.title}</strong>
                            <p>{item.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                  <div className="guide-dropdown-footer">
                    <Link to="/trekking-guide" className="guide-footer-link" onClick={() => setOpenDropdown(null)}>
                      Open Full Trekking Guide <ArrowRight size={14} />
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {menuOpen && mobileExpanded.guide && (
              <div className="mobile-accordion-content">
                <Link to="/trekking-guide" className="mobile-sublink is-parent" onClick={() => setMenuOpen(false)}>
                  Open Complete Field Guide →
                </Link>
                {guideSublinks.map((item) => (
                  <Link key={item.title} to={item.to} className="mobile-sublink" onClick={() => setMenuOpen(false)}>
                    <span>{item.title}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* 3. Destinations Link */}
          <NavLink to="/destinations" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Destinations
          </NavLink>

          {/* 4. Journal / Field Notes */}
          <NavLink to="/journal" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Journal
          </NavLink>

          {/* 5. Contact Us */}
          <NavLink to="/contact" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Contact Us
          </NavLink>

          {/* Mobile Extra Links */}
          {user && user.role === "admin" ? (
            <Link className="mobile-extra-link" to="/admin/dashboard" style={{ color: "#ea580c", fontWeight: 700 }}>
              ⚡ Admin Dashboard ({user.name})
            </Link>
          ) : (
            <Link className="mobile-extra-link" to="/admin/login" style={{ color: "#ea580c", fontWeight: 600 }}>
              🔒 Admin Login
            </Link>
          )}
          <div className="mobile-actions">
            <Link to="/contact" className="button button-orange button-full">Plan Your Trip ↗</Link>
          </div>
        </nav>

        {/* Header Right Actions */}
        <div className="header-actions spade-actions">
          {/* Search Trigger */}
          <form
            className="header-search-form"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              const q = search.trim();
              navigate(q ? `/treks?search=${encodeURIComponent(q)}` : "/treks");
            }}
          >
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search treks..."
              aria-label="Search treks"
            />
            <button type="submit" aria-label="Submit search">
              <Search size={18} />
            </button>
          </form>

          {/* Saved Link */}
          <Link className="saved-link" to="/saved" aria-label={`Saved, ${savedTreks.length} treks`}>
            <Heart size={20} />
            {savedTreks.length > 0 && <span className="saved-count">{savedTreks.length}</span>}
          </Link>

          {/* Dedicated Admin Login / Console Link */}
          {user && user.role === "admin" ? (
            <Link to="/admin/dashboard" className="admin-portal-link is-admin-badge" title="Open Admin Console">
              <ShieldCheck size={16} />
              <span>Admin Console</span>
            </Link>
          ) : (
            <Link to="/admin/login" className="admin-portal-link is-admin-badge" title="Sign In to Admin Console">
              <Lock size={15} />
              <span>Admin Login</span>
            </Link>
          )}

          {/* Plan Your Trip Button (Spade Orange Style) */}
          <Link to="/contact" className="button button-orange header-cta-btn">
            <span>Plan Your Trip</span>
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>

      {/* Scrim for mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mobile-menu-scrim"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </header>
  );
}
