import { lazy, Suspense, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BedDouble,
  Bus,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Clock3,
  Coffee,
  Compass,
  Download,
  Eye,
  FileText,
  Footprints,
  Heart,
  HelpCircle,
  Info,
  MapPin,
  Maximize2,
  MessageSquare,
  Mountain,
  Navigation,
  Phone,
  Quote,
  Send,
  ShieldCheck,
  Sliders,
  Star,
  Users,
  Utensils,
  X,
} from "lucide-react";
import { Page } from "../../components/common/Page.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useFavorites } from "../../context/FavoritesContext.jsx";
import { useDepartures, useTreks } from "../../hooks/useDataStore.js";
import { dataStore } from "../../services/dataStore.js";
import { api } from "../../services/api.js";
import { NotFoundPage } from "./MiscPages.jsx";
import "./TrekDetailsUpgrade.css";

const HimalayanMap = lazy(() => import("../../components/maps/HimalayanMap.jsx"));

export function TrekDetailPage() {
  const { slug } = useParams();
  const treks = useTreks();
  const allDepartures = useDepartures();
  const trek = treks.find((t) => t.slug === slug);

  const { isSaved, toggleSaved } = useFavorites();
  const notify = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Gallery state
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Itinerary accordion state
  const [openDays, setOpenDays] = useState({ 0: true, 1: true });

  // Quick Inquiry Modal state
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "United States",
    travelers: 2,
    travelMonth: "October",
    message: "",
  });

  if (!trek) return <NotFoundPage />;

  const saved = isSaved(trek.slug);
  const departures = allDepartures.filter((d) => d.trekSlug === trek.slug);

  // Standardize high-res gallery
  const gallery =
    trek.gallery && trek.gallery.length >= 3
      ? trek.gallery
      : [
          {
            url: trek.image,
            alt: trek.imageAlt || trek.title,
            caption: `${trek.title} — High Himalayan vista & panoramic crest`,
          },
          {
            url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1500&q=85",
            alt: "Namche Bazaar Sherpa capital",
            caption: "Namche Bazaar (3,440m) amphitheatre & Sherpa trading capital",
          },
          {
            url: "https://images.unsplash.com/photo-1579618218290-24a26f63a708?auto=format&fit=crop&w=1500&q=85",
            alt: "Suspension bridge crossing mountain torrents",
            caption: "Hillary Suspension Bridge strung high above the turquoise river",
          },
          {
            url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=85",
            alt: "Everest Base Camp & Khumbu Glacier",
            caption: "Footsteps beneath the giants: glacial moraines & base camp flags",
          },
          {
            url: "https://images.unsplash.com/photo-1486911278573-0599a03978cf?auto=format&fit=crop&w=1500&q=85",
            alt: "High mountain monastery",
            caption: "Tengboche Monastery blessing under the sacred shadow of Ama Dablam",
          },
        ];

  // Group discounts tiers
  const basePrice = trek.price || 1890;
  const tiers = [
    { pax: "1 PAX", price: Math.round(basePrice * 1.2) },
    { pax: "2-4 PAX", price: Math.round(basePrice * 1.1) },
    { pax: "5-9 PAX", price: Math.round(basePrice * 1.05) },
    { pax: "10-18 PAX", price: basePrice },
  ];

  const scrollToSection = (id) => {
    setActiveTab(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -140;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  const toggleDay = (idx) => {
    setOpenDays((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  const expandAllDays = () => {
    const all = {};
    trek.itinerary?.forEach((_, i) => {
      all[i] = true;
    });
    setOpenDays(all);
  };

  const collapseAllDays = () => {
    setOpenDays({});
  };

  const prevPhoto = (e) => {
    if (e) e.stopPropagation();
    setActivePhotoIdx((prev) => (prev > 0 ? prev - 1 : gallery.length - 1));
  };

  const nextPhoto = (e) => {
    if (e) e.stopPropagation();
    setActivePhotoIdx((prev) => (prev < gallery.length - 1 ? prev + 1 : 0));
  };

  // Quick Inquiry submission
  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    setInquirySubmitting(true);

    const inquiryPayload = {
      type: "inquiry",
      trekSlug: trek.slug,
      trekTitle: trek.title,
      name: inquiryForm.name,
      email: inquiryForm.email,
      phone: inquiryForm.phone,
      country: inquiryForm.country,
      travelers: Number(inquiryForm.travelers),
      startDate: `Target: ${inquiryForm.travelMonth} 2026`,
      notes: inquiryForm.message,
      totalAmount: basePrice * Number(inquiryForm.travelers),
      bookingStatus: "Requested",
      paymentStatus: "Inquiry Only",
    };

    try {
      if (api.bookings && api.bookings.create) {
        await api.bookings.create(inquiryPayload).catch(() => {});
      }
    } catch {}

    dataStore.addBooking(inquiryPayload);
    window.dispatchEvent(new Event("agaaman_data_changed"));
    notify("Thank you! Your inquiry has been sent to our lead Sherpa guide team.");
    setInquirySubmitting(false);
    setInquiryModalOpen(false);
  };

  return (
    <Page className="detail-page-v2">
      {/* Sticky Tab Navigation Bar */}
      <nav className="detail-sticky-tab-bar" aria-label="Trek Page Sections">
        <div className="section-wrap tab-bar-inner">
          <div className="tab-links-scroll">
            {[
              ["overview", "Overview"],
              ["gallery", "Photo Gallery"],
              ["itinerary", "Itinerary"],
              ["fixed-departures", "Fixed Departures"],
              ["included-excluded", "Include & Exclude"],
              ["route-map", "Route Map"],
              ["trip-info", "Trip Info"],
              ["reviews", "Reviews"],
            ].map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={`sticky-tab-btn${activeTab === id ? " is-active" : ""}`}
                onClick={() => scrollToSection(id)}
              >
                {label}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="button"
              className="tab-book-btn"
              style={{ background: "transparent", color: "#083c34", border: "1px solid #cbd5e1" }}
              onClick={() => setInquiryModalOpen(true)}
            >
              Ask a Question
            </button>
            <Link to={`/booking/${trek.slug}`} className="tab-book-btn">
              Book Now
            </Link>
          </div>
        </div>
      </nav>

      {/* Breadcrumb row */}
      <div className="section-wrap detail-breadcrumb-row">
        <Link to="/">Home</Link> <span>›</span>
        <Link to="/treks">Nepal Trekking</Link> <span>›</span>
        <Link to={`/treks?region=${encodeURIComponent(trek.region)}`}>{trek.region} Trekking</Link> <span>›</span>
        <span className="current-crumb">{trek.title}</span>
      </div>

      <div className="section-wrap detail-layout-v2">
        {/* Main Column */}
        <main className="detail-left-col">
          {/* Main Title & Trust Badge */}
          <div style={{ marginBottom: "16px" }}>
            <h1 className="detail-heading-v2" style={{ marginBottom: "6px" }}>
              {trek.title}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13.5px", color: "#64748b" }}>
              <span style={{ color: "#10b981", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <ShieldCheck size={16} /> 100% Certified Local Sherpa Guidance
              </span>
              <span>·</span>
              <span>Zero Rescue Record</span>
              <span>·</span>
              <span style={{ color: "#ea580c", fontWeight: 600 }}>{trek.region} Region, Nepal</span>
            </div>
          </div>

          {/* ════════════════════════════════════════
              1. INTERACTIVE MAIN IMAGE GALLERY
             ════════════════════════════════════════ */}
          <div className="trek-hero-gallery-wrap" id="gallery">
            <div className="trek-hero-gallery-grid">
              {/* Main Showcase Image */}
              <div
                className="gallery-main-showcase"
                onClick={() => setLightboxOpen(true)}
              >
                <img
                  src={gallery[activePhotoIdx]?.url}
                  alt={gallery[activePhotoIdx]?.alt || trek.title}
                  className="gallery-main-img"
                />

                {/* Overlays */}
                <div className="gallery-main-overlay">
                  <div className="gallery-top-badges">
                    <span className="gallery-counter-pill">
                      Photo {activePhotoIdx + 1} of {gallery.length}
                    </span>
                    <button
                      type="button"
                      className="gallery-zoom-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxOpen(true);
                      }}
                    >
                      <Maximize2 size={14} /> Fullscreen Lightbox
                    </button>
                  </div>

                  <div className="gallery-bottom-caption">
                    <h4>{gallery[activePhotoIdx]?.caption}</h4>
                    <span>Click to inspect high-resolution mountain perspectives</span>
                  </div>
                </div>

                {/* Arrow Navigators */}
                <button
                  type="button"
                  className="gallery-nav-arrow prev"
                  onClick={prevPhoto}
                  aria-label="Previous photo"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  type="button"
                  className="gallery-nav-arrow next"
                  onClick={nextPhoto}
                  aria-label="Next photo"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              {/* Secondary Thumbnails Column */}
              <div className="gallery-thumb-column">
                {gallery.map((photo, idx) => (
                  <div
                    key={idx}
                    className={`gallery-thumb-item${activePhotoIdx === idx ? " is-active" : ""}`}
                    onClick={() => setActivePhotoIdx(idx)}
                    title={photo.caption}
                  >
                    <img src={photo.url} alt={photo.alt} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 9-Box Specs Grid */}
          <div className="specs-grid-9" id="overview">
            <div className="spec-box">
              <MapPin size={22} className="spec-icon" />
              <div className="spec-text">
                <span className="spec-label">Country/Region</span>
                <strong className="spec-val">Nepal / {trek.region}</strong>
              </div>
            </div>

            <div className="spec-box">
              <Calendar size={22} className="spec-icon" />
              <div className="spec-text">
                <span className="spec-label">Duration</span>
                <strong className="spec-val">{trek.duration} Days</strong>
              </div>
            </div>

            <div className="spec-box">
              <Mountain size={22} className="spec-icon" />
              <div className="spec-text">
                <span className="spec-label">Max Altitude</span>
                <strong className="spec-val">
                  {trek.elevation}m / {trek.elevationFt || Math.round(trek.elevation * 3.28084)}ft
                </strong>
              </div>
            </div>

            <div className="spec-box">
              <Footprints size={22} className="spec-icon" />
              <div className="spec-text">
                <span className="spec-label">Difficulty</span>
                <strong className="spec-val">{trek.difficulty}</strong>
              </div>
            </div>

            <div className="spec-box">
              <Users size={22} className="spec-icon" />
              <div className="spec-text">
                <span className="spec-label">Min. Group Size</span>
                <strong className="spec-val">1 PAX</strong>
              </div>
            </div>

            <div className="spec-box">
              <Bus size={22} className="spec-icon" />
              <div className="spec-text">
                <span className="spec-label">Transportation</span>
                <strong className="spec-val">Private Vehicle + Flight</strong>
              </div>
            </div>

            <div className="spec-box">
              <BedDouble size={22} className="spec-icon" />
              <div className="spec-text">
                <span className="spec-label">Accommodation</span>
                <strong className="spec-val">Heritage Hotel + Teahouse Lodges</strong>
              </div>
            </div>

            <div className="spec-box">
              <Utensils size={22} className="spec-icon" />
              <div className="spec-text">
                <span className="spec-label">Meals</span>
                <strong className="spec-val">All Meals (B + L + D)</strong>
              </div>
            </div>

            <div className="spec-box">
              <Compass size={22} className="spec-icon" />
              <div className="spec-text">
                <span className="spec-label">Trip Type</span>
                <strong className="spec-val">Trekking & Exploration</strong>
              </div>
            </div>
          </div>

          {/* Description & Narrative */}
          <div className="detail-narrative-box">
            <p className="narrative-p">{trek.description}</p>
            <p className="narrative-intro">{trek.introduction}</p>

            {trek.sherpaTip && (
              <div className="sherpa-note-banner">
                <Quote size={24} className="note-icon" />
                <p>"{trek.sherpaTip}"</p>
                <small>— Ang Norbu Sherpa, Senior Mountain Leader</small>
              </div>
            )}
          </div>

          {/* ════════════════════════════════════════
              2. PROFESSIONAL ITINERARY ACCORDION
             ════════════════════════════════════════ */}
          <div className="itinerary-modern-wrap" id="itinerary">
            <div className="itinerary-top-bar">
              <div className="itinerary-summary-chips">
                <span className="itinerary-summary-pill">
                  <Calendar size={14} style={{ color: "#ea580c" }} /> {trek.duration} Total Days
                </span>
                <span className="itinerary-summary-pill">
                  <Mountain size={14} style={{ color: "#0284c7" }} /> Max Elevation: {trek.elevation}m
                </span>
                {trek.distance && (
                  <span className="itinerary-summary-pill">
                    <Footprints size={14} style={{ color: "#10b981" }} /> {trek.distance}
                  </span>
                )}
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  className="itinerary-toggle-all-btn"
                  onClick={expandAllDays}
                >
                  Expand All Days
                </button>
                <button
                  type="button"
                  className="itinerary-toggle-all-btn"
                  onClick={collapseAllDays}
                >
                  Collapse All
                </button>
              </div>
            </div>

            <div className="itinerary-accordion-list">
              {trek.itinerary?.map((dayItem, idx) => {
                const isObj = !Array.isArray(dayItem);
                const dayNum = isObj ? dayItem.day : dayItem[0];
                const title = isObj ? dayItem.title : dayItem[1];
                const story = isObj ? dayItem.details : dayItem[2];
                const from = isObj ? dayItem.from : null;
                const to = isObj ? dayItem.to : null;
                const stay = isObj ? dayItem.stay : null;
                const hours = isObj ? dayItem.hours : null;
                const distance = isObj ? dayItem.distance : null;
                const elevation = isObj ? dayItem.elevation : null;
                const isOpen = openDays[idx];

                return (
                  <div key={idx} className={`itin-card${isOpen ? " is-open" : ""}`}>
                    <div className="itin-header" onClick={() => toggleDay(idx)}>
                      <div className="itin-header-left">
                        <span className="itin-day-badge">DAY {dayNum}</span>
                        <h4 className="itin-title-text">{title}</h4>
                      </div>

                      <div className="itin-header-right">
                        <div className="itin-quick-tags">
                          {elevation && (
                            <span className="itin-tag-alt">
                              <Mountain size={12} /> {elevation}
                            </span>
                          )}
                          {hours && (
                            <span className="itin-tag-time">
                              <Clock size={12} /> {hours}
                            </span>
                          )}
                        </div>
                        <ChevronDown size={18} className="itin-caret-icon" />
                      </div>
                    </div>

                    {isOpen && (
                      <div className="itin-body">
                        {(from || stay || hours || distance || elevation) && (
                          <div className="itin-meta-grid">
                            {from && to && (
                              <div className="itin-meta-item">
                                <Compass size={14} className="itin-meta-icon" />
                                <span><strong>Route:</strong> {from} ➔ {to}</span>
                              </div>
                            )}
                            {stay && (
                              <div className="itin-meta-item">
                                <BedDouble size={14} className="itin-meta-icon" />
                                <span><strong>Stay at:</strong> {stay}</span>
                              </div>
                            )}
                            {hours && (
                              <div className="itin-meta-item">
                                <Clock3 size={14} className="itin-meta-icon" />
                                <span><strong>Walking Time:</strong> {hours}</span>
                              </div>
                            )}
                            {distance && (
                              <div className="itin-meta-item">
                                <Footprints size={14} className="itin-meta-icon" />
                                <span><strong>Distance:</strong> {distance}</span>
                              </div>
                            )}
                          </div>
                        )}
                        <p className="itin-story-p">{story}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Fixed Departures */}
          <div className="fixed-departures-box" id="fixed-departures">
            <h3 className="section-subheading">Group Joining Dates & Fixed Departures</h3>
            <p className="departures-sub">
              Join an existing small group with guaranteed departures and save up to 20% with our group discount!
            </p>

            {departures.length > 0 ? (
              <div className="departures-table-wrap">
                <table className="departures-table">
                  <thead>
                    <tr>
                      <th>Departure Date</th>
                      <th>End Date</th>
                      <th>Status</th>
                      <th>Group Price</th>
                      <th>Available</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departures.map((dep) => (
                      <tr key={dep.id}>
                        <td><strong>{dep.startDate}</strong></td>
                        <td>{dep.endDate}</td>
                        <td>
                          <span className={`status-pill status-${dep.status.toLowerCase().replace(/\s+/g, "-")}`}>
                            {dep.status}
                          </span>
                        </td>
                        <td>
                          <div className="table-price">
                            <span className="orig-price">${dep.originalPrice || Math.round(dep.price * 1.15)}</span>
                            <strong>${dep.price}</strong>
                          </div>
                        </td>
                        <td>{dep.availableSeats || 6} / {dep.totalSeats || 12} seats</td>
                        <td>
                          <Link to={`/booking/${trek.slug}?date=${dep.startDate}`} className="table-join-btn">
                            Book This Date
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-departures-note">
                <Calendar size={22} />
                <p>Guaranteed 2026 departure dates are available upon request. Choose your preferred start date!</p>
                <Link to={`/booking/${trek.slug}`} className="button button-orange button-small">
                  Request Custom Dates
                </Link>
              </div>
            )}
          </div>

          {/* ════════════════════════════════════════
              3. INCLUSIONS & EXCLUSIONS
             ════════════════════════════════════════ */}
          <div className="inclusions-modern-wrap" id="included-excluded">
            <h3 className="section-subheading">What is Included & Excluded in the Cost</h3>
            <p style={{ color: "#64748b", fontSize: "14px", margin: "4px 0 16px 0" }}>
              Transparent pricing with no hidden trail costs. Detailed expenses breakdown guaranteed.
            </p>

            <div className="inclusions-modern-grid">
              {/* Included Card */}
              <div className="inc-card included-box">
                <div className="inc-card-header inc-head">
                  <div className="inc-badge-icon green">
                    <CheckCircle2 size={20} />
                  </div>
                  <h4>What is Included</h4>
                </div>
                <ul className="inc-card-list">
                  {(trek.included || [
                    "Certified licensed English-speaking Sherpa Mountain Guide",
                    "Dedicated support porters (1 porter for 2 trekkers, carrying up to 20kg)",
                    "All national park permits (Sagarmatha/ACAP) and TIMS cards",
                    "Domestic round-trip mountain flights with 15kg baggage allowance",
                    "All teahouse lodge twin-share accommodations during the trek",
                    "Kathmandu heritage hotel accommodation with organic breakfast",
                    "Three hot meals daily on trail (Breakfast, Lunch, Dinner) + fresh fruit",
                    "Pulse oximeter daily blood oxygen checks and altitude monitoring",
                    "Farewell celebration dinner in Kathmandu with folk music",
                  ]).map((item, idx) => (
                    <li key={idx} className="inc-card-item">
                      <span className="inc-bullet-icon check">
                        <Check size={12} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Excluded Card */}
              <div className="inc-card excluded-box">
                <div className="inc-card-header exc-head">
                  <div className="inc-badge-icon red">
                    <X size={20} />
                  </div>
                  <h4>What is Excluded</h4>
                </div>
                <ul className="inc-card-list">
                  {(trek.excluded || [
                    "Nepal tourist entry visa ($50 for 30 days, obtained upon arrival)",
                    "International flights to and from Kathmandu (Tribhuvan Airport)",
                    "Mandatory high-altitude emergency travel and helicopter evacuation insurance",
                    "Personal gear (down jacket, sleeping bag — available for rent at $2/day)",
                    "Trail incidental expenses (hot bucket showers, charging, Wi-Fi cards)",
                    "Bottled soft drinks, craft beers, and specialty espresso coffees on trail",
                    "Tips for local guide and porters (customary ~$150–$200 total per trekker)",
                  ]).map((item, idx) => (
                    <li key={idx} className="inc-card-item">
                      <span className="inc-bullet-icon cross">
                        <X size={12} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Route Map */}
          <div className="map-section-v2" id="route-map" style={{ marginTop: "40px" }}>
            <h3 className="section-subheading">Interactive Route Geography & GPS Coordinates</h3>
            <Suspense fallback={<div className="map-placeholder">Loading interactive map...</div>}>
              <HimalayanMap initialDestinationSlug={trek.region.toLowerCase()} />
            </Suspense>
          </div>
        </main>

        {/* Right Sticky Sidebar */}
        <aside className="detail-sidebar-v2">
          <div className="sidebar-booking-card-v2">
            {/* Price Row */}
            <div className="sidebar-v2-price-row">
              <span className="price-lead-text">Starting From</span>
              <div className="price-bold-display">
                <span className="currency-unit">US</span>
                <strong className="amount-num">${basePrice}</strong>
                <span className="per-person">/person</span>
              </div>
            </div>

            {/* Discount Announcement Badge */}
            <div className="group-discount-pill">
              <span className="pulse-orange-dot" />
              <span>GROUP DISCOUNT APPLIED (SAVE UP TO 20%)</span>
            </div>

            {/* Tiered Discount Table */}
            <div className="sidebar-group-table-wrap">
              <table className="sidebar-group-table">
                <thead>
                  <tr>
                    <th>Group Size</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {tiers.map((t, idx) => (
                    <tr key={idx}>
                      <td>{t.pax}</td>
                      <td><strong>${t.price}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Action Buttons */}
            <div className="sidebar-v2-buttons">
              <Link
                to={`/booking/${trek.slug}`}
                className="button button-orange button-full book-now-main-btn"
              >
                Book This Trip Now ➔
              </Link>

              <button
                type="button"
                className="button button-navy button-full"
                onClick={() => setInquiryModalOpen(true)}
              >
                <MessageSquare size={16} /> Quick Inquiry / Ask Question
              </button>
            </div>

            {/* Sub links */}
            <div className="sidebar-v2-sublinks">
              <Link to={`/treks/${trek.slug}/customize`} className="sublink-item">
                <Sliders size={15} /> Customize Itinerary
              </Link>
              <a
                href="#download"
                className="sublink-item"
                onClick={(e) => {
                  e.preventDefault();
                  window.print();
                }}
              >
                <Download size={15} /> Download PDF
              </a>
            </div>

            {/* Guarantee note */}
            <div className="sidebar-v2-guarantee">
              <ShieldCheck size={16} />
              <span>100% Guaranteed Departures · Licensed Sherpa Leaders</span>
            </div>
          </div>
        </aside>
      </div>

      {/* ════════════════════════════════════════
          4. LIGHTBOX ZOOM MODAL
         ════════════════════════════════════════ */}
      {lightboxOpen && (
        <div className="lightbox-modal-wrap" onClick={() => setLightboxOpen(false)}>
          <div className="lightbox-topbar" onClick={(e) => e.stopPropagation()}>
            <span style={{ fontSize: "14px", fontWeight: 600 }}>
              {activePhotoIdx + 1} / {gallery.length} · {gallery[activePhotoIdx]?.caption}
            </span>
            <button
              type="button"
              className="inquiry-close-btn"
              onClick={() => setLightboxOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <div className="lightbox-center-stage" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="lightbox-arrow-btn left" onClick={prevPhoto}>
              <ChevronLeft size={28} />
            </button>

            <img
              src={gallery[activePhotoIdx]?.url}
              alt={gallery[activePhotoIdx]?.alt}
              className="lightbox-active-img"
            />

            <button type="button" className="lightbox-arrow-btn right" onClick={nextPhoto}>
              <ChevronRight size={28} />
            </button>
          </div>

          <div className="lightbox-bottom-info" onClick={(e) => e.stopPropagation()}>
            <h3>{gallery[activePhotoIdx]?.caption}</h3>
            <p>{trek.title} · {trek.region} Region, Nepal</p>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          5. QUICK INQUIRY MODAL / POPOUT
         ════════════════════════════════════════ */}
      {inquiryModalOpen && (
        <div className="inquiry-modal-backdrop" onClick={() => setInquiryModalOpen(false)}>
          <div className="inquiry-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="inquiry-modal-header">
              <div className="inquiry-header-copy">
                <h3>Quick Expedition Inquiry</h3>
                <p>Have a question about {trek.title}? Ask our senior guides.</p>
              </div>
              <button
                type="button"
                className="inquiry-close-btn"
                onClick={() => setInquiryModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleInquirySubmit} className="inquiry-form">
              <div className="inquiry-form-row">
                <div className="inquiry-field">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    placeholder="Full name"
                    required
                  />
                </div>
                <div className="inquiry-field">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div className="inquiry-form-row">
                <div className="inquiry-field">
                  <label>WhatsApp / Mobile Phone *</label>
                  <input
                    type="tel"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    required
                  />
                </div>
                <div className="inquiry-field">
                  <label>Country of Residence</label>
                  <input
                    type="text"
                    value={inquiryForm.country}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, country: e.target.value })}
                    placeholder="e.g. United States"
                  />
                </div>
              </div>

              <div className="inquiry-form-row">
                <div className="inquiry-field">
                  <label>Approx. Number of Trekkers</label>
                  <select
                    value={inquiryForm.travelers}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, travelers: Number(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5, 6, 8, 10, 12, 15].map((n) => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? "Person" : "People"}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="inquiry-field">
                  <label>Target Travel Month</label>
                  <select
                    value={inquiryForm.travelMonth}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, travelMonth: e.target.value })}
                  >
                    {["March", "April", "May", "September", "October", "November", "December"].map((m) => (
                      <option key={m} value={m}>
                        {m} 2026
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="inquiry-field">
                <label>Your Question / Special Requirements *</label>
                <textarea
                  rows={4}
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  placeholder="Ask about altitude pacing, gear requirements, weather windows, or dietary accommodations..."
                  required
                />
              </div>

              <button
                type="submit"
                className="inquiry-submit-btn"
                disabled={inquirySubmitting}
              >
                <Send size={16} />
                {inquirySubmitting ? "Sending to Sherpa Team..." : "Submit Inquiry (Reply in 4 Hours)"}
              </button>
            </form>
          </div>
        </div>
      )}
    </Page>
  );
}

export default TrekDetailPage;
