import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  DollarSign,
  Heart,
  Luggage,
  MapPin,
  Mountain,
  Plane,
  Send,
  ShieldCheck,
  Sliders,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useTreks } from "../../hooks/useDataStore.js";
import { dataStore } from "../../services/dataStore.js";
import { api } from "../../services/api.js";
import "./TripBooking.css";

export function CustomizeTripPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const treks = useTreks();
  const { user } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();

  const currentSlug = slug || searchParams.get("trip") || "everest-base-camp";
  const selectedTrek = treks.find((t) => t.slug === currentSlug) || treks[0];

  // Customization Form State
  const [selectedTrekSlug, setSelectedTrekSlug] = useState(selectedTrek?.slug || "");
  const [startDate, setStartDate] = useState("2026-05-18");
  const [duration, setDuration] = useState(selectedTrek?.duration || 14);
  const [travelers, setTravelers] = useState(2);
  const [tier, setTier] = useState("deluxe"); // "standard" | "deluxe" | "luxury"
  const [pacing, setPacing] = useState("standard"); // "relaxed" | "standard" | "active"
  const [guidePreference, setGuidePreference] = useState("senior"); // "senior" | "female" | "climbing"

  // Addon preferences
  const [wantsHelicopter, setWantsHelicopter] = useState(false);
  const [wantsExtraPorters, setWantsExtraPorters] = useState(false);
  const [wantsCityTours, setWantsCityTours] = useState(true);

  // Contact info
  const [contact, setContact] = useState({
    name: user?.name || "Alex Thorne",
    email: user?.email || "traveler@agaaman.com",
    phone: "+1 415 555 0192",
    country: "United States",
    budgetRange: "$1,800 - $2,500 / person",
    wishlist: "We would like to add an extra photography rest day around Namche Bazaar, and possibly fly back by helicopter from Gorak Shep if weather permits.",
  });

  const [submitting, setSubmitting] = useState(false);
  const [confirmedInquiry, setConfirmedInquiry] = useState(null);

  const trekObj = treks.find((t) => t.slug === selectedTrekSlug) || selectedTrek;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      type: "customization",
      trekSlug: trekObj?.slug || "custom-expedition",
      trekTitle: `Customized: ${trekObj?.title || "Himalayan Expedition"}`,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      country: contact.country,
      startDate,
      duration: Number(duration),
      travelers: Number(travelers),
      tier,
      pacing,
      guidePreference,
      preferences: {
        wantsHelicopter,
        wantsExtraPorters,
        wantsCityTours,
      },
      budgetRange: contact.budgetRange,
      notes: contact.wishlist,
      totalAmount: Math.round((trekObj?.price || 1890) * travelers * (tier === "luxury" ? 1.4 : tier === "deluxe" ? 1.15 : 1)),
      bookingStatus: "Requested",
      paymentStatus: "Pending Quotation",
    };

    try {
      if (api.bookings && api.bookings.create) {
        await api.bookings.create(payload).catch(() => {});
      }
    } catch {}

    const saved = dataStore.addBooking(payload);
    window.dispatchEvent(new Event("agaaman_data_changed"));
    setConfirmedInquiry(saved);
    notify("Custom trip proposal request submitted! A senior guide will review and reply within 4 hours.");
    setSubmitting(false);
  };

  if (confirmedInquiry) {
    return (
      <div className="booking-page-wrap">
        <div className="booking-receipt-surface">
          <div className="receipt-icon-bubble" style={{ background: "#fff7ed", color: "#ea580c" }}>
            <Sparkles size={40} />
          </div>
          <h2>Custom Trip Request Received!</h2>
          <p style={{ color: "#64748b", margin: "0 auto", maxWidth: "500px" }}>
            Our Himalayan expedition planners and senior Sherpa guides have received your tailored itinerary requirements.
          </p>

          <div className="receipt-ref-badge">
            Reference: {confirmedInquiry.bookingReference || confirmedInquiry.id}
          </div>

          <table className="receipt-details-table">
            <tbody>
              <tr>
                <td>Expedition Base:</td>
                <td>{trekObj?.title}</td>
              </tr>
              <tr>
                <td>Target Start Date:</td>
                <td>{startDate} ({duration} Days)</td>
              </tr>
              <tr>
                <td>Group Size:</td>
                <td>{travelers} Travelers</td>
              </tr>
              <tr>
                <td>Experience Tier:</td>
                <td style={{ textTransform: "capitalize" }}>{tier} Class Pacing</td>
              </tr>
              <tr>
                <td>Lead Contact:</td>
                <td>{contact.name} ({contact.email})</td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "24px" }}>
            <Link to="/" className="calc-submit-btn" style={{ background: "#083c34", padding: "12px 24px" }}>
              Return to Home
            </Link>
            <Link to={`/treks/${trekObj?.slug}`} className="calc-submit-btn" style={{ padding: "12px 24px" }}>
              Explore Trek Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page-wrap">
      {/* Header Banner */}
      <section className="booking-hero-banner">
        <div className="booking-banner-inner">
          <div className="booking-breadcrumbs">
            <Link to="/">Home</Link> <span>›</span>
            <Link to="/treks">Nepal Treks</Link> <span>›</span>
            <span>Customize Trip</span>
          </div>

          <div className="booking-banner-title-row">
            <div>
              <h1>Tailor Your Custom Himalayan Expedition</h1>
              <p style={{ color: "#cbd5e1", maxWidth: "640px", fontSize: "14.5px", margin: "4px 0 0 0" }}>
                Every mountain journey should be unique. Customize routes, adjust daily walking pacing, upgrade lodge tiers, or schedule private helicopter returns with our mountain-born Sherpa leaders.
              </p>
            </div>
            <Link to={`/treks/${trekObj?.slug}`} className="calc-submit-btn" style={{ background: "rgba(255,255,255,0.1)", fontSize: "13px", padding: "8px 16px" }}>
              <ArrowLeft size={14} /> Back to Trek
            </Link>
          </div>
        </div>
      </section>

      {/* Form Workspace */}
      <div className="booking-workspace" style={{ maxWidth: "1080px", gridTemplateColumns: "1fr 340px" }}>
        <form onSubmit={handleSubmit} className="booking-steps-column">
          {/* SECTION 1: ROUTE & DATES */}
          <div className="booking-section-card">
            <div className="section-step-head">
              <span className="step-num-bubble" style={{ background: "#083c34" }}>1</span>
              <div>
                <h2>Select Trek & Target Schedule</h2>
                <p>Choose the base trail or let us know which region you want to explore.</p>
              </div>
            </div>

            <div className="book-form-grid">
              <div className="book-field full">
                <label>Trek Base Package *</label>
                <select
                  value={selectedTrekSlug}
                  onChange={(e) => {
                    setSelectedTrekSlug(e.target.value);
                    const found = treks.find((t) => t.slug === e.target.value);
                    if (found) setDuration(found.duration);
                  }}
                  required
                >
                  {treks.map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.title} ({t.region} · {t.duration} Days · Max {t.elevation}m)
                    </option>
                  ))}
                </select>
              </div>

              <div className="book-field">
                <label>Preferred Start Date *</label>
                <input
                  type="date"
                  value={startDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                />
              </div>

              <div className="book-field">
                <label>Desired Duration (Days) *</label>
                <input
                  type="number"
                  min={4}
                  max={45}
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  required
                />
              </div>

              <div className="book-field">
                <label>Number of Trekkers (PAX) *</label>
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 20].map((n) => (
                    <option key={n} value={n}>
                      {n} {n === 1 ? "Solo Trekker" : "Trekkers"}
                    </option>
                  ))}
                </select>
              </div>

              <div className="book-field">
                <label>Estimated Budget per Person</label>
                <select
                  value={contact.budgetRange}
                  onChange={(e) => setContact({ ...contact, budgetRange: e.target.value })}
                >
                  <option value="$1,200 - $1,800">$1,200 - $1,800 / person</option>
                  <option value="$1,800 - $2,500">$1,800 - $2,500 / person</option>
                  <option value="$2,500 - $3,500">$2,500 - $3,500 / person</option>
                  <option value="$3,500+ Luxury">$3,500+ Luxury Helicopter Expedition</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 2: EXPERIENCE & LODGING TIER */}
          <div className="booking-section-card">
            <div className="section-step-head">
              <span className="step-num-bubble" style={{ background: "#083c34" }}>2</span>
              <div>
                <h2>Accommodation & Comfort Tier</h2>
                <p>Customize your stay style along the trekking route.</p>
              </div>
            </div>

            <div className="deposit-options-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
              <div
                className={`deposit-radio-card${tier === "standard" ? " is-active" : ""}`}
                onClick={() => setTier("standard")}
              >
                <span className="deposit-title">Standard</span>
                <span className="deposit-sub">Authentic cozy teahouses & warm dining stoves</span>
              </div>

              <div
                className={`deposit-radio-card${tier === "deluxe" ? " is-active" : ""}`}
                onClick={() => setTier("deluxe")}
              >
                <span className="deposit-title">Deluxe</span>
                <span className="deposit-sub">Private attached bathrooms & heated blankets</span>
              </div>

              <div
                className={`deposit-radio-card${tier === "luxury" ? " is-active" : ""}`}
                onClick={() => setTier("luxury")}
              >
                <span className="deposit-title">Luxury Heli</span>
                <span className="deposit-sub">Yeti Mountain Homes & Helicopter transfers</span>
              </div>
            </div>

            <div className="addons-grid" style={{ marginTop: "16px" }}>
              <label className={`addon-card-item${wantsHelicopter ? " is-selected" : ""}`}>
                <div className="addon-info-left">
                  <input
                    type="checkbox"
                    checked={wantsHelicopter}
                    onChange={(e) => setWantsHelicopter(e.target.checked)}
                  />
                  <div>
                    <div className="addon-text-title">Include Scenic Helicopter Evacuation / Return</div>
                    <div className="addon-text-desc">Direct aerial flight from high elevation back to Kathmandu valley</div>
                  </div>
                </div>
              </label>

              <label className={`addon-card-item${wantsCityTours ? " is-selected" : ""}`}>
                <div className="addon-info-left">
                  <input
                    type="checkbox"
                    checked={wantsCityTours}
                    onChange={(e) => setWantsCityTours(e.target.checked)}
                  />
                  <div>
                    <div className="addon-text-title">Kathmandu UNESCO World Heritage Guided Day Tour</div>
                    <div className="addon-text-desc">Private guide & transport to Swayambhunath, Pashupatinath & Boudhanath</div>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* SECTION 3: YOUR CONTACT DETAILS & SPECIAL WISHLIST */}
          <div className="booking-section-card">
            <div className="section-step-head">
              <span className="step-num-bubble" style={{ background: "#083c34" }}>3</span>
              <div>
                <h2>Your Information & Itinerary Wishlist</h2>
                <p>Tell us what would make this journey unforgettable for you and your group.</p>
              </div>
            </div>

            <div className="book-form-grid">
              <div className="book-field">
                <label>Your Full Name *</label>
                <input
                  type="text"
                  value={contact.name}
                  onChange={(e) => setContact({ ...contact, name: e.target.value })}
                  required
                />
              </div>

              <div className="book-field">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => setContact({ ...contact, email: e.target.value })}
                  required
                />
              </div>

              <div className="book-field">
                <label>Phone / WhatsApp *</label>
                <input
                  type="tel"
                  value={contact.phone}
                  onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                  required
                />
              </div>

              <div className="book-field">
                <label>Country *</label>
                <input
                  type="text"
                  value={contact.country}
                  onChange={(e) => setContact({ ...contact, country: e.target.value })}
                  required
                />
              </div>

              <div className="book-field full">
                <label>Special Requests, Custom Stops or Questions</label>
                <textarea
                  rows={4}
                  value={contact.wishlist}
                  onChange={(e) => setContact({ ...contact, wishlist: e.target.value })}
                  placeholder="Tell us about your fitness level, side trips (Gokyo Lakes, Chola Pass), photography interests, or dietary requirements..."
                />
              </div>
            </div>

            <button
              type="submit"
              className="calc-submit-btn"
              disabled={submitting}
              style={{ marginTop: "20px" }}
            >
              <Send size={16} />
              {submitting ? "Submitting Custom Proposal..." : "Request Tailored Itinerary & Quotation"}
            </button>
          </div>
        </form>

        {/* Sidebar Info */}
        <aside className="booking-calc-sticky">
          <div className="calc-header" style={{ background: "#0b1320" }}>
            <h3>Bespoke Trip Planning</h3>
            <p>100% Tailored to Your Schedule</p>
          </div>

          <div className="calc-body">
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", fontSize: "13.5px", color: "#334155" }}>
              <div style={{ display: "flex", gap: "10px" }}>
                <Mountain size={18} style={{ color: "#ea580c", flexShrink: 0 }} />
                <span>Custom routes crafted by certified Sherpa mountain leaders.</span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <Clock size={18} style={{ color: "#ea580c", flexShrink: 0 }} />
                <span>Fast response with detailed quote & PDF within 4 hours.</span>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <ShieldCheck size={18} style={{ color: "#10b981", flexShrink: 0 }} />
                <span>Zero rescue record and full acclimatization safety protocols.</span>
              </div>
            </div>

            <div className="calc-divider" />

            <div style={{ background: "#fffaf5", border: "1px solid #fed7aa", padding: "14px", borderRadius: "10px" }}>
              <strong style={{ display: "block", fontSize: "14px", color: "#9a3412", marginBottom: "4px" }}>
                Prefer Direct WhatsApp Chat?
              </strong>
              <p style={{ fontSize: "12.5px", color: "#7c2d12", margin: "0 0 10px 0" }}>
                Message our senior expedition manager directly for instant answers.
              </p>
              <a
                href="https://wa.me/9779851029894"
                target="_blank"
                rel="noopener noreferrer"
                className="calc-submit-btn"
                style={{ background: "#10b981", fontSize: "13.5px", padding: "10px", textDecoration: "none" }}
              >
                Chat on WhatsApp (+977 9851029894)
              </a>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default CustomizeTripPage;
