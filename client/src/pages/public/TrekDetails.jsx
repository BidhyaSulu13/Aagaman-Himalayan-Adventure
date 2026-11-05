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
import { api } from "../../services/api.js";
import {
  getDepartureAvailableSeats,
  getDepartureStatus,
  isDepartureBookable,
} from "../../services/departures.js";
import { NotFoundPage } from "./MiscPages.jsx";
import "./TrekDetailsUpgrade.css";

const HimalayanMap = lazy(() => import("../../components/maps/HimalayanMap.jsx"));

export function TrekDetailPage() {
  const { slug } = useParams();
  const [remoteTrek, setRemoteTrek] = useState(null);
  const [remoteDepartures, setRemoteDepartures] = useState(null);
  const [trekLoading, setTrekLoading] = useState(true);
  const [trekError, setTrekError] = useState("");
  const [trekNotFound, setTrekNotFound] = useState(false);
  const [trekReviews, setTrekReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState("");
  const trek = remoteTrek
    ? {
        ...remoteTrek,
        image: remoteTrek.image || remoteTrek.images?.[0] || "",
        elevation: remoteTrek.maximumElevation ?? remoteTrek.elevation,
        description: remoteTrek.shortDescription || remoteTrek.description || "",
        introduction: remoteTrek.fullDescription || remoteTrek.introduction || "",
        included: remoteTrek.included || remoteTrek.inclusions || [],
        excluded: remoteTrek.excluded || remoteTrek.exclusions || [],
      }
    : null;

  const { isSaved, toggleSaved } = useFavorites();
  const notify = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // Track unique view for ranking algorithm (24h deduplicated server-side)
  useEffect(() => {
    if (trek?._id || trek?.id) {
      api.rankings.trackView(trek._id || trek.id).catch(() => {});
    }
  }, [trek?._id, trek?.id]);

  // Gallery state
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setRemoteTrek(null);
    setRemoteDepartures(null);
    setTrekLoading(true);
    setTrekError("");
    setTrekNotFound(false);
    setTrekReviews([]);
    setReviewsError("");
    setActivePhotoIdx(0);
    setReviewsLoading(true);
    api.treks.getBySlug(slug)
      .then((response) => {
        if (!active) return;
        if (response.success && response.trek) {
          setRemoteTrek(response.trek);
          setRemoteDepartures(
            Array.isArray(response.departures)
              ? response.departures.map((departure) => ({ ...departure, trekSlug: slug }))
              : []
          );
          setTrekReviews(Array.isArray(response.reviews) ? response.reviews : []);
        } else {
          setTrekNotFound(true);
        }
      })
      .catch((error) => {
        if (active) {
          if (error.message.toLowerCase().includes("not found")) setTrekNotFound(true);
          else setTrekError(error.message || "Unable to load this trek.");
        }
      })
      .finally(() => {
        if (active) {
          setTrekLoading(false);
          setReviewsLoading(false);
        }
      });
    return () => { active = false; };
  }, [slug]);

  // Itinerary accordion state
  const [openDays, setOpenDays] = useState({ 0: true, 1: true });

  // Quick Inquiry Modal state
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquiryError, setInquiryError] = useState("");
  const [inquiryForm, setInquiryForm] = useState({
    name: "",
    email: "",
    phone: "",
    country: "United States",
    travelers: 2,
    travelMonth: `October ${new Date().getFullYear()}`,
    message: "",
  });
  const [reviewSort, setReviewSort] = useState("newest");
  const [reviewLinkForm, setReviewLinkForm] = useState({ bookingReference: "", email: "" });
  const [reviewLinkSubmitting, setReviewLinkSubmitting] = useState(false);
  const [reviewLinkMessage, setReviewLinkMessage] = useState("");
  const [reviewLinkError, setReviewLinkError] = useState("");

  if (trekLoading) {
    return <Page className="trek-detail-page"><p className="section-wrap" role="status">Loading trek details…</p></Page>;
  }
  if (trekError) {
    return <Page className="trek-detail-page"><p className="section-wrap" role="alert">{trekError}</p></Page>;
  }
  if (trekNotFound || !trek) return <NotFoundPage />;

  const saved = isSaved(trek.slug);
  const departures = (remoteDepartures || [])
    .filter((departure) => new Date(departure.startDate) >= new Date(new Date().setUTCHours(0, 0, 0, 0)));

  const coverImage = trek.image || trek.images?.[0] || "";
  const uploadedGallery = [
    ...(Array.isArray(trek.gallery) ? trek.gallery : []),
    ...(Array.isArray(trek.images) ? trek.images : []),
  ]
    .map((photo) => typeof photo === "string" ? { url: photo } : photo)
    .filter((photo) => photo?.url)
    .filter((photo, index, list) => list.findIndex((item) => item.url === photo.url) === index);
  if (coverImage && !uploadedGallery.some((photo) => photo.url === coverImage)) {
    uploadedGallery.unshift({ url: coverImage, alt: trek.imageAlt || trek.title });
  }
  const gallery = uploadedGallery.map((photo) => ({
    ...photo,
    alt: photo.alt || trek.title,
    caption: photo.caption || photo.alt || trek.title,
  }));
  const trekInclusions = Array.isArray(trek.included) ? trek.included : [];
  const trekExclusions = Array.isArray(trek.excluded) ? trek.excluded : [];

  // Group discounts tiers
  const basePrice = Number(trek.price) || 0;
  const groupCapacity = Math.max(Number(trek.groupCapacity) || 12, Number(trek.minGroupSize) || 1);
  const tiers = [
    { min: 1, max: 1, multiplier: 1.2 },
    { min: 2, max: 4, multiplier: 1.1 },
    { min: 5, max: 9, multiplier: 1.05 },
    { min: 10, max: groupCapacity, multiplier: 1 },
  ]
    .filter((tier) => tier.min <= groupCapacity)
    .map((tier) => ({
      pax: tier.min === Math.min(tier.max, groupCapacity)
        ? `${tier.min} ${tier.min === 1 ? "traveler" : "travelers"}`
        : `${tier.min}–${Math.min(tier.max, groupCapacity)} travelers`,
      price: Math.round(basePrice * tier.multiplier),
    }));
  const tripInfoItems = [
    ["Recommended seasons", (trek.recommendedSeason || trek.season || []).join?.(", ") || ""],
    ["Required permits", (trek.requiredPermits || trek.permits || []).join?.(", ") || ""],
    ["Maximum group size", trek.groupCapacity ? `${trek.groupCapacity} travelers` : ""],
    ["Distance", trek.distance || ""],
    ["Route", Array.isArray(trek.routeOverview) ? trek.routeOverview.join(" → ") : trek.routeOverview || ""],
  ].filter(([, value]) => value);
  const reviewAverage = trekReviews.length
    ? trekReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / trekReviews.length
    : 0;
  const sortedTrekReviews = [...trekReviews].sort((a, b) => reviewSort === "highest"
    ? Number(b.rating) - Number(a.rating) || new Date(b.createdAt) - new Date(a.createdAt)
    : new Date(b.createdAt) - new Date(a.createdAt));

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
    setInquiryError("");
    try {
      await api.contactMessages.create({
        category: "expedition_inquiry",
        trek: trek._id,
        trekSlug: trek.slug,
        trekTitle: trek.title,
        name: inquiryForm.name,
        email: inquiryForm.email,
        phone: inquiryForm.phone,
        country: inquiryForm.country,
        travelers: Number(inquiryForm.travelers),
        travelMonth: inquiryForm.travelMonth,
        message: inquiryForm.message,
        topic: "Expedition inquiry",
      });
      notify("Your expedition inquiry has been sent to our team.");
      setInquiryModalOpen(false);
      setInquiryForm((form) => ({ ...form, message: "" }));
    } catch (error) {
      setInquiryError(error.message || "Your inquiry could not be sent. Please try again.");
    } finally {
      setInquirySubmitting(false);
    }
  };

  const handleReviewLinkRequest = async (event) => {
    event.preventDefault();
    setReviewLinkSubmitting(true);
    setReviewLinkMessage("");
    setReviewLinkError("");
    try {
      const result = await api.reviews.requestVerification({ ...reviewLinkForm, trekSlug: trek.slug });
      setReviewLinkMessage(result.message);
    } catch (error) {
      setReviewLinkError(error.message || "We couldn't send a review link. Please try again.");
    } finally {
      setReviewLinkSubmitting(false);
    }
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
              <span>{trek.difficulty || "Trek"} · {trek.duration} days</span>
              <span>·</span>
              <span style={{ color: "#ea580c", fontWeight: 600 }}>{trek.region} Region, Nepal</span>
            </div>
          </div>

          {/* ════════════════════════════════════════
              1. INTERACTIVE MAIN IMAGE GALLERY
             ════════════════════════════════════════ */}
          <div className="trek-hero-gallery-wrap" id="gallery">
            {gallery.length > 0 ? (
            <div className={`trek-hero-gallery-grid${gallery.length === 1 ? " is-single" : ""}`}>
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
              {gallery.length > 1 && (
                <div className="gallery-thumb-column">
                  {gallery.map((photo, idx) => (
                    <button
                      type="button"
                      key={idx}
                      className={`gallery-thumb-item${activePhotoIdx === idx ? " is-active" : ""}`}
                      onClick={() => setActivePhotoIdx(idx)}
                      title={photo.caption}
                    >
                      <img src={photo.url} alt={photo.alt} />
                    </button>
                  ))}
                </div>
              )}
            </div>
            ) : (
              <div className="gallery-empty-state">Trek photos will be added by our team soon.</div>
            )}
          </div>

          <div className="specs-grid-9" id="overview">
            {[
              { label: "Country / Region", value: [trek.location, trek.region].filter(Boolean).join(" · ") || "Nepal", icon: MapPin },
              { label: "Duration", value: trek.duration ? `${trek.duration} days` : "", icon: Calendar },
              { label: "Maximum altitude", value: trek.elevation ? `${Number(trek.elevation).toLocaleString()} m` : "", icon: Mountain },
              { label: "Difficulty", value: trek.difficulty, icon: Footprints },
              { label: "Minimum group", value: trek.minGroupSize ? `${trek.minGroupSize} ${trek.minGroupSize === 1 ? "traveler" : "travelers"}` : "", icon: Users },
              { label: "Transportation", value: trek.transportation, icon: Bus },
              { label: "Accommodation", value: trek.accommodation, icon: BedDouble },
              { label: "Meals", value: trek.meals, icon: Utensils },
              { label: "Trip type", value: trek.tripType, icon: Compass },
            ].filter((item) => item.value).map(({ label, value, icon: Icon }) => (
              <div className="spec-box" key={label}>
                <Icon size={22} className="spec-icon" />
                <div className="spec-text">
                  <span className="spec-label">{label}</span>
                  <strong className="spec-val">{value}</strong>
                </div>
              </div>
            ))}
          </div>

          {/* Description & Narrative */}
          {(trek.description || trek.introduction) && (
          <div className="detail-narrative-box">
            {trek.description && <p className="narrative-p">{trek.description}</p>}
            {trek.introduction && <p className="narrative-intro">{trek.introduction}</p>}

            {trek.sherpaTip && (
              <div className="sherpa-note-banner">
                <Quote size={24} className="note-icon" />
                <p>"{trek.sherpaTip}"</p>
                <small>Trek note</small>
              </div>
            )}
          </div>
          )}

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
              {Array.isArray(trek.itinerary) && trek.itinerary.length > 0 ? trek.itinerary.map((dayItem, idx) => {
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
              }) : <p className="trek-content-empty">The day-by-day itinerary is being prepared. Contact us for the current route plan.</p>}
            </div>
          </div>

          {/* Fixed Departures */}
          <div className="fixed-departures-box" id="fixed-departures">
            <h3 className="section-subheading">Group Joining Dates & Fixed Departures</h3>
            <p className="departures-sub">
              Choose a scheduled departure below, or ask us about dates that work for your group.
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
                    {departures.map((dep) => {
                      const availableSeats = getDepartureAvailableSeats(dep);
                      const departureStatus = getDepartureStatus(dep);
                      const canBook = isDepartureBookable(dep);
                      return (
                      <tr key={dep._id || dep.id}>
                        <td><strong>{new Date(dep.startDate).toLocaleDateString()}</strong></td>
                        <td>{dep.endDate ? new Date(dep.endDate).toLocaleDateString() : "—"}</td>
                        <td>
                          <span className={`status-pill status-${departureStatus.toLowerCase().replace(/\s+/g, "-")}`}>
                            {departureStatus}
                          </span>
                        </td>
                        <td>
                          <div className="table-price">
                            {dep.originalPrice && <span className="orig-price">${dep.originalPrice}</span>}
                            <strong>${Number(dep.price).toLocaleString()}</strong>
                          </div>
                        </td>
                        <td>
                          ({availableSeats} seats left)
                          {dep.minGroupSize > 1 && <small> · min. group {dep.minGroupSize}</small>}
                        </td>
                        <td>
                          {canBook ? (
                            <Link to={`/booking/${trek.slug}?departureId=${encodeURIComponent(dep._id)}&date=${new Date(dep.startDate).toISOString().slice(0, 10)}`} className="table-join-btn">
                              Book This Date
                            </Link>
                          ) : <span>{departureStatus === "Fully Booked" ? "Fully Booked · Unavailable" : "Unavailable"}</span>}
                        </td>
                      </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="no-departures-note">
                <Calendar size={22} />
                <p>No scheduled group departures are listed at the moment. Contact us to arrange a date.</p>
                <Link to="/contact" className="button button-orange button-small">
                  Ask About Custom Dates
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
              Review what is covered by this trek before you book.
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
                  {trekInclusions.map((item, idx) => (
                    <li key={idx} className="inc-card-item">
                      <span className="inc-bullet-icon check">
                        <Check size={12} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                  {trekInclusions.length === 0 && <li className="inc-card-item">Details will be confirmed with your trip plan.</li>}
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
                  {trekExclusions.map((item, idx) => (
                    <li key={idx} className="inc-card-item">
                      <span className="inc-bullet-icon cross">
                        <X size={12} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                  {trekExclusions.length === 0 && <li className="inc-card-item">No exclusions have been listed yet. Please ask us before booking.</li>}
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

          <section className="trek-content-section" id="trip-info">
            <div className="trek-content-heading">
              <p className="eyebrow">Practical details</p>
              <h2>Trip information</h2>
            </div>
            {tripInfoItems.length ? (
              <dl className="trip-info-grid">
                {tripInfoItems.map(([label, value]) => (
                  <div className="trip-info-item" key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="trek-content-empty">Trip details are being updated. Contact us if you need specific information.</p>
            )}
            {Array.isArray(trek.highlights) && trek.highlights.length > 0 && (
              <div className="trip-highlights">
                <h3>Highlights</h3>
                <ul>{trek.highlights.map((highlight, index) => <li key={`${highlight}-${index}`}>{highlight}</li>)}</ul>
              </div>
            )}
          </section>

          <section className="trek-content-section trek-reviews-section" id="reviews">
            <div className="trek-content-heading trek-reviews-heading">
              <div>
                <p className="eyebrow">Approved traveler feedback</p>
                <h2>Traveler reviews</h2>
              </div>
              {trekReviews.length > 0 && (
                <div className="trek-review-average" aria-label={`${reviewAverage.toFixed(1)} out of 5 based on ${trekReviews.length} reviews`}>
                  <Star size={18} fill="currentColor" />
                  <strong>{reviewAverage.toFixed(1)}</strong>
                  <span>{trekReviews.length} approved {trekReviews.length === 1 ? "review" : "reviews"}</span>
                </div>
              )}
            </div>
            <label className="trek-review-sort">
              Sort reviews
              <select value={reviewSort} onChange={(event) => setReviewSort(event.target.value)}>
                <option value="newest">Newest first</option>
                <option value="highest">Highest rating</option>
              </select>
            </label>
            {reviewsLoading ? (
              <p className="trek-content-empty" role="status">Loading traveler reviews…</p>
            ) : reviewsError ? (
              <p className="trek-content-empty" role="alert">{reviewsError}</p>
            ) : sortedTrekReviews.length > 0 ? (
              <div className="trek-reviews-grid">
                {sortedTrekReviews.map((review) => (
                  <article className="trek-review-card" key={review._id}>
                    <div className="trek-review-card-stars" aria-label={`${review.rating} out of 5 stars`}>
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star key={index} size={16} fill={index < review.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                    {review.title && <h3>{review.title}</h3>}
                    <p>{review.comment}</p>
                    {review.photos?.length > 0 && (
                      <div className="trek-review-photos">
                        {review.photos.map((photo) => (
                          <a key={photo} href={photo} target="_blank" rel="noreferrer">
                            <img src={photo} alt={`Photo added by ${review.name || review.user?.name || "a traveler"}`} loading="lazy" />
                          </a>
                        ))}
                      </div>
                    )}
                    <div className="trek-review-byline">
                      <strong>{review.name || review.user?.name || "Traveler"}</strong>
                      <span>{review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ""}</span>
                    </div>
                    <span className={`trek-review-verification${review.verificationStatus === "Verified Trekker" ? " is-verified" : ""}`}>
                      {review.verificationStatus === "Verified Trekker"
                        ? <><ShieldCheck size={14} /> Verified trekker</>
                        : "Unverified traveler review"}
                    </span>
                  </article>
                ))}
              </div>
            ) : (
              <div className="trek-content-empty trek-no-reviews">
                <p>No approved reviews yet. Reviews are shared after travelers complete this trek.</p>
                <Link to={`/booking/${trek.slug}`} className="text-link">Plan this trek <ArrowRight size={15} /></Link>
              </div>
            )}
            <div className="public-review-workflows">
              <form className="public-review-form verified-review-form" onSubmit={handleReviewLinkRequest}>
                <h3>Completed this trek with us?</h3>
                <p>For a completed booking, request a secure review link using your booking reference and email. Review requests are checked against booking details; no traveler account is needed. You can also <Link to="/review/request">request a review link here</Link>.</p>
                <label>Booking reference
                  <input value={reviewLinkForm.bookingReference} onChange={(event) => setReviewLinkForm({ ...reviewLinkForm, bookingReference: event.target.value })} required />
                </label>
                <label>Booking email
                  <input type="email" value={reviewLinkForm.email} onChange={(event) => setReviewLinkForm({ ...reviewLinkForm, email: event.target.value })} required />
                </label>
                {reviewLinkError && <p className="public-form-error" role="alert">{reviewLinkError}</p>}
                {reviewLinkMessage && <p className="public-form-success" role="status">{reviewLinkMessage}</p>}
                <button className="button button-dark" type="submit" disabled={reviewLinkSubmitting}>
                  {reviewLinkSubmitting ? "Requesting link…" : "Email me a verified review link"}
                </button>
              </form>
            </div>
          </section>
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
            <div className="sidebar-group-pricing">
              <div className="sidebar-group-heading">
                <Users size={17} />
                <div><strong>Price by group size</strong><span>Per person · USD</span></div>
              </div>
              <div className="sidebar-group-tiers">
                {tiers.map((tier) => (
                  <div className="sidebar-group-tier" key={tier.pax}>
                    <span>{tier.pax}</span>
                    <strong>${tier.price.toLocaleString()}</strong>
                  </div>
                ))}
              </div>
              <p className="sidebar-group-note">Final total is confirmed when you choose dates and group size.</p>
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
              <span>{departures.length > 0 ? `${departures.length} upcoming departures listed` : "Ask about possible custom departure dates."}</span>
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
                <p>Have a question about {trek.title}? Send us an inquiry.</p>
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
                      <option key={m} value={`${m} ${new Date().getFullYear()}`}>
                        {m} {new Date().getFullYear()}
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

              {inquiryError && <p className="public-form-error" role="alert">{inquiryError}</p>}
              <button
                type="submit"
                className="inquiry-submit-btn"
                disabled={inquirySubmitting}
              >
                <Send size={16} />
                {inquirySubmitting ? "Sending inquiry..." : "Submit inquiry"}
              </button>
            </form>
          </div>
        </div>
      )}
    </Page>
  );
}

export default TrekDetailPage;
