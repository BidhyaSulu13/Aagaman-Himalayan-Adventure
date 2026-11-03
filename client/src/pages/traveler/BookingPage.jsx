import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  FileCheck,
  HeartHandshake,
  Lock,
  MapPin,
  Mountain,
  Phone,
  Printer,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { api } from "../../services/api.js";
import { NotFoundPage } from "../public/MiscPages.jsx";
import "./TripBooking.css";

export function BookingPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();

  const trekSlug = slug || searchParams.get("trip") || "everest-base-camp";

  // Dynamic trek and departure data from MongoDB
  const [trek, setTrek] = useState(null);
  const [departures, setDepartures] = useState([]);
  const [loading, setLoading] = useState(true);

  // Booking Form State
  const [travelers, setTravelers] = useState(2);
  const [selectedDate, setSelectedDate] = useState(
    searchParams.get("date") ||
      new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [selectedDepartureId, setSelectedDepartureId] = useState("");
  const [depositOption, setDepositOption] = useState("deposit"); // "deposit" (20%) | "full" (100%)

  // Add-ons
  const [addons, setAddons] = useState({
    singleRoom: false, // +$250 total
    extraPorter: false, // +$180 total
    airportTransfer: true, // +$45 total
    gearRental: false, // +$35 / pax
    heliReturn: false, // +$650 / pax
  });

  // Lead Traveler Details (Clean defaults, never hardcoded demo accounts)
  const [travelerInfo, setTravelerInfo] = useState({
    fullName: user?.name || "",
    email: user?.email || "",
    phone: user?.profile?.phone || "",
    country: user?.profile?.nationality || "",
    passportNumber: "",
    dietary: "Standard",
    emergencyName: user?.profile?.emergencyContact?.name || "",
    emergencyPhone: user?.profile?.emergencyContact?.phone || "",
    specialRequests: "",
  });

  const [agreedTerms, setAgreedTerms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Fetch Trek and Departures dynamically from MongoDB
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    api.treks
      .getBySlug(trekSlug)
      .then((res) => {
        if (!isMounted) return;
        if (res.success && res.trek) {
          setTrek(res.trek);
          if (Array.isArray(res.departures)) {
            setDepartures(res.departures);
            if (res.departures.length > 0 && !searchParams.get("date")) {
              setSelectedDepartureId(res.departures[0]._id);
              setSelectedDate(
                new Date(res.departures[0].startDate).toISOString().split("T")[0]
              );
            }
          }
        }
      })
      .catch((_err) => {
        // Fallback fetch all treks to find match
        api.treks.getAll({ limit: 100 }).then((allRes) => {
          if (!isMounted) return;
          const found = allRes?.treks?.find((t) => t.slug === trekSlug);
          if (found) setTrek(found);
        }).catch(() => {});
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [trekSlug, searchParams]);

  // Update traveler details when user state loads
  useEffect(() => {
    if (user) {
      setTravelerInfo((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.profile?.phone || "",
        country: prev.country || user.profile?.nationality || "",
      }));
    }
  }, [user]);

  if (loading) {
    return (
      <div className="booking-page-wrap" style={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <div style={{ textAlign: "center" }}>
          <Mountain size={42} style={{ margin: "0 auto 16px", color: "#ea580c", animation: "spin 3s linear infinite" }} />
          <h2 style={{ fontSize: "20px", color: "#0f172a" }}>Loading expedition booking details...</h2>
        </div>
      </div>
    );
  }

  if (!trek) return <NotFoundPage />;

  // Dynamic Tiered Price Calculation
  const baseRate = trek.price || 1890;
  let paxMultiplier = 1.0;
  if (travelers === 1) paxMultiplier = 1.2;
  else if (travelers <= 4) paxMultiplier = 1.1;
  else if (travelers <= 9) paxMultiplier = 1.05;
  else paxMultiplier = 1.0;

  const perPersonPrice = Math.round(baseRate * paxMultiplier);
  const trekSubtotal = perPersonPrice * travelers;

  // Addons total
  let addonsTotal = 0;
  if (addons.singleRoom) addonsTotal += 250;
  if (addons.extraPorter) addonsTotal += 180;
  if (addons.airportTransfer) addonsTotal += 45;
  if (addons.gearRental) addonsTotal += 35 * travelers;
  if (addons.heliReturn) addonsTotal += 650 * travelers;

  const grandTotal = trekSubtotal + addonsTotal;
  const depositAmount = Math.round(grandTotal * 0.2);
  const balanceAmount = grandTotal - depositAmount;

  const toggleAddon = (key) => {
    setAddons((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleBookingSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    if (!travelerInfo.fullName || !travelerInfo.email) {
      notify("Please provide lead traveler full name and email.");
      return;
    }

    if (!agreedTerms) {
      notify("Please accept the booking terms and cancellation policy.");
      return;
    }

    // Departure date validation: must be future date
    const selectedDateTime = new Date(selectedDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (isNaN(selectedDateTime.getTime()) || selectedDateTime < today) {
      notify("Selected departure date must be in the future.");
      return;
    }

    setSubmitting(true);

    const bookingPayload = {
      departureId: selectedDepartureId || undefined,
      trekSlug: trek.slug,
      trekId: trek._id,
      travelers: Number(travelers),
      startDate: selectedDate,
      addons,
      notes: travelerInfo.specialRequests || "",
      travelerDetails: [
        {
          fullName: travelerInfo.fullName,
          email: travelerInfo.email,
          phone: travelerInfo.phone,
          passportNumber: travelerInfo.passportNumber,
          nationality: travelerInfo.country,
          dietaryRequirements: travelerInfo.dietary,
          emergencyContact: travelerInfo.emergencyName
            ? `${travelerInfo.emergencyName} (${travelerInfo.emergencyPhone})`
            : "",
        },
      ],
    };

    try {
      const response = await api.bookings.create(bookingPayload);
      if (response && response.success && response.booking) {
        setConfirmedBooking(response.booking);
        notify(response.message || "Expedition reservation submitted successfully!");
      } else {
        throw new Error(response.message || "Failed to submit booking reservation.");
      }
    } catch (error) {
      notify(error.message || "Could not register booking reservation. Please check seat capacity.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─────────────────────────────────────────────
  // RECEIPT VIEW: STATUS "PENDING", PAYMENT "PENDING"
  // ─────────────────────────────────────────────
  if (confirmedBooking) {
    const b = confirmedBooking;
    return (
      <div className="booking-page-wrap">
        <div className="booking-receipt-surface" style={{ maxWidth: "680px", margin: "40px auto", padding: "36px", background: "#ffffff", borderRadius: "16px", boxShadow: "0 20px 40px rgba(15,23,42,0.08)" }}>
          <div className="receipt-icon-bubble" style={{ width: "64px", height: "64px", borderRadius: "50%", background: "#fef3c7", color: "#d97706", display: "grid", placeItems: "center", margin: "0 auto 20px" }}>
            <Clock size={36} />
          </div>

          <h2 style={{ textAlign: "center", fontSize: "26px", fontWeight: 800, color: "#0f172a", marginBottom: "8px" }}>
            Expedition Reservation Received
          </h2>
          <p style={{ color: "#64748b", margin: "0 auto 20px", maxWidth: "520px", textAlign: "center", lineHeight: 1.6 }}>
            Your booking request has been submitted to the Agaaman expedition desk. An official confirmation invoice and payment gateway link are being dispatched to your email.
          </p>

          <div style={{ display: "flex", justifyContent: "center", gap: "12px", marginBottom: "28px", flexWrap: "wrap" }}>
            <span style={{ background: "#fef3c7", color: "#92400e", fontWeight: 700, padding: "6px 14px", borderRadius: "9999px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Clock size={14} /> Status: {b.bookingStatus || "Pending"}
            </span>
            <span style={{ background: "#e0f2fe", color: "#0369a1", fontWeight: 700, padding: "6px 14px", borderRadius: "9999px", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Lock size={14} /> Payment: {b.paymentStatus || "Pending"}
            </span>
            <span style={{ background: "#f1f5f9", color: "#334155", fontWeight: 700, padding: "6px 14px", borderRadius: "9999px", fontSize: "13px" }}>
              Ref: {b.bookingReference}
            </span>
          </div>

          <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "20px", border: "1px solid #e2e8f0", marginBottom: "28px" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14.5px" }}>
              <tbody>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "10px 0", color: "#64748b" }}>Expedition:</td>
                  <td style={{ padding: "10px 0", fontWeight: 700, color: "#0f172a", textAlign: "right" }}>{trek.title}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "10px 0", color: "#64748b" }}>Departure Date:</td>
                  <td style={{ padding: "10px 0", fontWeight: 600, color: "#0f172a", textAlign: "right" }}>{selectedDate}</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "10px 0", color: "#64748b" }}>Participants:</td>
                  <td style={{ padding: "10px 0", fontWeight: 600, color: "#0f172a", textAlign: "right" }}>{b.numberOfTravelers || travelers} Travelers</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "10px 0", color: "#64748b" }}>Lead Contact:</td>
                  <td style={{ padding: "10px 0", color: "#0f172a", textAlign: "right" }}>{travelerInfo.fullName} ({travelerInfo.email})</td>
                </tr>
                <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <td style={{ padding: "10px 0", color: "#64748b" }}>Total Cost:</td>
                  <td style={{ padding: "10px 0", fontWeight: 800, color: "#0f172a", textAlign: "right", fontSize: "17px" }}>
                    ${(b.totalAmount || grandTotal).toLocaleString()} USD
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: "10px 0", color: "#64748b" }}>Advance Deposit Due (20%):</td>
                  <td style={{ padding: "10px 0", fontWeight: 700, color: "#ea580c", textAlign: "right" }}>
                    ${Math.round((b.totalAmount || grandTotal) * 0.2).toLocaleString()} USD
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div style={{ background: "#fef9c3", borderLeft: "4px solid #f59e0b", padding: "14px 18px", borderRadius: "8px", fontSize: "13px", color: "#854d0e", marginBottom: "28px" }}>
            <strong>Payment Verification Policy:</strong> In compliance with mountaineering regulations, reservations remain in "Pending" status until verified and processed via our secure payment gateway. Never send funds outside official Agaaman invoices.
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              type="button"
              className="calc-submit-btn"
              onClick={() => window.print()}
              style={{ background: "#083c34", padding: "12px 20px" }}
            >
              <Printer size={16} /> Print Confirmation
            </button>
            <Link
              to={`/dashboard?tab=bookings&booking=${encodeURIComponent(b.bookingReference)}`}
              state={!user ? {
                guestBooking: {
                  bookingReference: b.bookingReference,
                  bookingStatus: b.bookingStatus,
                  paymentStatus: b.paymentStatus,
                  trekTitle: b.trek?.title || trek.title,
                  trekSlug: b.trek?.slug || trek.slug,
                  startDate: b.departure?.startDate || selectedDate,
                  numberOfTravelers: b.numberOfTravelers || travelers,
                  totalAmount: b.totalAmount || grandTotal,
                  currency: b.currency || "USD",
                },
              } : undefined}
              className="calc-submit-btn"
              style={{ background: "#ea580c", padding: "12px 24px" }}
            >
              {user ? "View Booking in Dashboard" : "View Booking Details"}
            </Link>
            <Link
              to="/treks"
              className="card-cta-btn btn-details"
              style={{ padding: "12px 20px" }}
            >
              Explore Other Treks
            </Link>
          </div>
          <p style={{ margin: "20px 0 0", color: "#64748b", textAlign: "center", fontSize: "13px" }}>
            Keep your booking reference. After your trek is completed, you can{" "}
            <Link to="/review/request" className="text-link">request a review link</Link>{" "}
            without creating an account.
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────
  // BOOKING FORM VIEW
  // ─────────────────────────────────────────────
  return (
    <div className="booking-page-wrap">
      {/* Hero Banner with Trek Context */}
      <section className="booking-hero-banner">
        <div className="booking-banner-inner">
          <div className="booking-breadcrumbs">
            <Link to="/">Home</Link> <span>›</span>
            <Link to="/treks">Treks</Link> <span>›</span>
            <Link to={`/treks/${trek.slug}`}>{trek.title}</Link> <span>›</span>
            <span>Reserve Departure</span>
          </div>

          <div className="booking-banner-title-row">
            <div>
              <h1>Book Expedition: {trek.title}</h1>
              <div className="booking-banner-meta">
                <span className="booking-meta-pill">
                  <MapPin size={14} /> {trek.region}, Nepal
                </span>
                <span className="booking-meta-pill">
                  <Calendar size={14} /> {trek.duration} Days
                </span>
                <span className="booking-meta-pill">
                  <Mountain size={14} /> Max {trek.maximumElevation || trek.elevation}m
                </span>
                <span className="booking-meta-pill">
                  <ShieldCheck size={14} /> Certified Sherpa Led
                </span>
              </div>
            </div>
            <Link
              to={`/treks/${trek.slug}`}
              className="calc-submit-btn"
              style={{ background: "rgba(255,255,255,0.15)", fontSize: "13px", padding: "8px 16px" }}
            >
              <ArrowLeft size={14} /> View Details
            </Link>
          </div>
        </div>
      </section>

      {/* Main Workspace: Left Booking Form, Right Live Calculator */}
      <div className="booking-workspace">
        <form onSubmit={handleBookingSubmit} className="booking-steps-column">
          {/* STEP 1: DEPARTURE & TRAVELERS */}
          <div className="booking-section-card">
            <div className="section-step-head">
              <span className="step-num-bubble">1</span>
              <div>
                <h2>Expedition Dates & Participants</h2>
                <p>Choose an upcoming fixed departure or set your custom starting date.</p>
              </div>
            </div>

            <div className="book-form-grid">
              <div className="book-field">
                <label>Number of Participants (1–20) *</label>
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Solo Trekker" : "Trekkers"}
                      {num >= 5 ? " (Tiered Group Discount Applied)" : ""}
                    </option>
                  ))}
                </select>
              </div>

              <div className="book-field">
                <label>Departure Date *</label>
                <input
                  type="date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setSelectedDepartureId("");
                  }}
                  required
                />
              </div>

              {departures.length > 0 && (
                <div className="book-field full">
                  <label>Or Join Scheduled Guaranteed Departure:</label>
                  <select
                    value={selectedDepartureId}
                    onChange={(e) => {
                      const dep = departures.find((d) => d._id === e.target.value);
                      if (dep) {
                        setSelectedDepartureId(dep._id);
                        setSelectedDate(
                          new Date(dep.startDate).toISOString().split("T")[0]
                        );
                      } else {
                        setSelectedDepartureId("");
                      }
                    }}
                  >
                    <option value="">-- Custom Selected Date ({selectedDate}) --</option>
                    {departures.map((d) => {
                      const seatsLeft = Math.max(0, d.capacity - (d.bookedCount || 0));
                      return (
                        <option key={d._id} value={d._id}>
                          {new Date(d.startDate).toDateString()} to{" "}
                          {new Date(d.endDate).toDateString()} · {d.status} (${d.price}/pax ·{" "}
                          {seatsLeft} seats remaining)
                        </option>
                      );
                    })}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* STEP 2: ADD-ON SERVICES */}
          <div className="booking-section-card">
            <div className="section-step-head">
              <span className="step-num-bubble">2</span>
              <div>
                <h2>Optional Add-On Services</h2>
                <p>Enhance your comfort with private rooms, dedicated porters, or scenic helicopter transfers.</p>
              </div>
            </div>

            <div className="addons-grid">
              <label className={`addon-card-item${addons.singleRoom ? " is-selected" : ""}`}>
                <div className="addon-info-left">
                  <input
                    type="checkbox"
                    checked={addons.singleRoom}
                    onChange={() => toggleAddon("singleRoom")}
                  />
                  <div>
                    <div className="addon-text-title">Single Room / Private Lodge Supplement</div>
                    <div className="addon-text-desc">Private room guarantee in Kathmandu hotel & mountain lodges along the trail</div>
                  </div>
                </div>
                <span className="addon-price-tag">+$250 total</span>
              </label>

              <label className={`addon-card-item${addons.extraPorter ? " is-selected" : ""}`}>
                <div className="addon-info-left">
                  <input
                    type="checkbox"
                    checked={addons.extraPorter}
                    onChange={() => toggleAddon("extraPorter")}
                  />
                  <div>
                    <div className="addon-text-title">Dedicated Private Sherpa Porter</div>
                    <div className="addon-text-desc">Dedicated porter carrying up to 25kg solely for your gear and photography kits</div>
                  </div>
                </div>
                <span className="addon-price-tag">+$180 total</span>
              </label>

              <label className={`addon-card-item${addons.airportTransfer ? " is-selected" : ""}`}>
                <div className="addon-info-left">
                  <input
                    type="checkbox"
                    checked={addons.airportTransfer}
                    onChange={() => toggleAddon("airportTransfer")}
                  />
                  <div>
                    <div className="addon-text-title">Private Deluxe Airport Transfer</div>
                    <div className="addon-text-desc">Private chauffeur pickup and drop directly at Kathmandu International Airport</div>
                  </div>
                </div>
                <span className="addon-price-tag">+$45 total</span>
              </label>

              <label className={`addon-card-item${addons.gearRental ? " is-selected" : ""}`}>
                <div className="addon-info-left">
                  <input
                    type="checkbox"
                    checked={addons.gearRental}
                    onChange={() => toggleAddon("gearRental")}
                  />
                  <div>
                    <div className="addon-text-title">4-Season Sleeping Bag & Down Jacket Rental</div>
                    <div className="addon-text-desc">Sanitized -20°C high-altitude down sleeping bag and expedition feather jacket</div>
                  </div>
                </div>
                <span className="addon-price-tag">+$35 / pax</span>
              </label>

              <label className={`addon-card-item${addons.heliReturn ? " is-selected" : ""}`}>
                <div className="addon-info-left">
                  <input
                    type="checkbox"
                    checked={addons.heliReturn}
                    onChange={() => toggleAddon("heliReturn")}
                  />
                  <div>
                    <div className="addon-text-title">Scenic Mountain Helicopter Return Flight</div>
                    <div className="addon-text-desc">Fly direct back to Kathmandu over the Himalayas and skip the arduous return hike</div>
                  </div>
                </div>
                <span className="addon-price-tag">+$650 / pax</span>
              </label>
            </div>
          </div>

          {/* STEP 3: LEAD TRAVELER & EMERGENCY DETAILS */}
          <div className="booking-section-card">
            <div className="section-step-head">
              <span className="step-num-bubble">3</span>
              <div>
                <h2>Primary Trekker & Medical Details</h2>
                <p>Required for Sagarmatha/ACAP national park permits, flight tickets, and TIMS cards.</p>
              </div>
            </div>

            <div className="book-form-grid">
              <div className="book-field">
                <label>Full Name (as in Passport) *</label>
                <input
                  type="text"
                  value={travelerInfo.fullName}
                  onChange={(e) => setTravelerInfo({ ...travelerInfo, fullName: e.target.value })}
                  placeholder="e.g. Johnathan Doe"
                  required
                />
              </div>

              <div className="book-field">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={travelerInfo.email}
                  onChange={(e) => setTravelerInfo({ ...travelerInfo, email: e.target.value })}
                  placeholder="e.g. trekker@example.com"
                  required
                />
              </div>

              <div className="book-field">
                <label>Phone / WhatsApp Number *</label>
                <input
                  type="tel"
                  value={travelerInfo.phone}
                  onChange={(e) => setTravelerInfo({ ...travelerInfo, phone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>

              <div className="book-field">
                <label>Country of Nationality *</label>
                <input
                  type="text"
                  value={travelerInfo.country}
                  onChange={(e) => setTravelerInfo({ ...travelerInfo, country: e.target.value })}
                  placeholder="e.g. United States, United Kingdom, etc."
                  required
                />
              </div>

              <div className="book-field">
                <label>Passport Number (Optional now)</label>
                <input
                  type="text"
                  value={travelerInfo.passportNumber}
                  onChange={(e) => setTravelerInfo({ ...travelerInfo, passportNumber: e.target.value })}
                  placeholder="For national park permits"
                />
              </div>

              <div className="book-field">
                <label>Dietary Preference</label>
                <select
                  value={travelerInfo.dietary}
                  onChange={(e) => setTravelerInfo({ ...travelerInfo, dietary: e.target.value })}
                >
                  <option value="Standard">Standard / Omnivore</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Gluten-Free">Gluten-Free</option>
                  <option value="Halal">Halal</option>
                </select>
              </div>

              <div className="book-field">
                <label>Emergency Contact Name *</label>
                <input
                  type="text"
                  value={travelerInfo.emergencyName}
                  onChange={(e) => setTravelerInfo({ ...travelerInfo, emergencyName: e.target.value })}
                  placeholder="Relative or next of kin"
                  required
                />
              </div>

              <div className="book-field">
                <label>Emergency Contact Phone *</label>
                <input
                  type="tel"
                  value={travelerInfo.emergencyPhone}
                  onChange={(e) => setTravelerInfo({ ...travelerInfo, emergencyPhone: e.target.value })}
                  placeholder="+1 (555) 000-0000"
                  required
                />
              </div>

              <div className="book-field full">
                <label>Medical Conditions, Fitness Notes or Special Requests</label>
                <textarea
                  rows={3}
                  value={travelerInfo.specialRequests}
                  onChange={(e) => setTravelerInfo({ ...travelerInfo, specialRequests: e.target.value })}
                  placeholder="Any allergies, previous high-altitude experience, or questions for our Sherpa team..."
                />
              </div>
            </div>
          </div>

          {/* STEP 4: PAYMENT STRUCTURE & POLICIES */}
          <div className="booking-section-card">
            <div className="section-step-head">
              <span className="step-num-bubble">4</span>
              <div>
                <h2>Payment Structure & Policies</h2>
                <p>Secure your reservation today with a 20% advance deposit. The balance is settled upon arrival in Kathmandu.</p>
              </div>
            </div>

            <div className="deposit-options-grid">
              <div
                className={`deposit-radio-card${depositOption === "deposit" ? " is-active" : ""}`}
                onClick={() => setDepositOption("deposit")}
              >
                <div className="deposit-card-top">
                  <span className="deposit-title">Pay 20% Advance Deposit</span>
                  <input
                    type="radio"
                    name="depositOption"
                    checked={depositOption === "deposit"}
                    onChange={() => setDepositOption("deposit")}
                  />
                </div>
                <strong style={{ fontSize: "20px", color: "#ea580c" }}>
                  ${depositAmount.toLocaleString()}
                </strong>
                <span className="deposit-sub">Remaining balance (${balanceAmount.toLocaleString()}) settled upon arrival</span>
              </div>

              <div
                className={`deposit-radio-card${depositOption === "full" ? " is-active" : ""}`}
                onClick={() => setDepositOption("full")}
              >
                <div className="deposit-card-top">
                  <span className="deposit-title">Pay 100% Full Payment</span>
                  <input
                    type="radio"
                    name="depositOption"
                    checked={depositOption === "full"}
                    onChange={() => setDepositOption("full")}
                  />
                </div>
                <strong style={{ fontSize: "20px", color: "#0f172a" }}>
                  ${grandTotal.toLocaleString()}
                </strong>
                <span className="deposit-sub">Zero balance due upon arrival in Kathmandu</span>
              </div>
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", color: "#475569", cursor: "pointer", marginTop: "16px" }}>
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                style={{ marginTop: "3px", accentColor: "#ea580c" }}
                required
              />
              <span>
                I agree to the <Link to="/terms" target="_blank" style={{ color: "#ea580c", fontWeight: 600 }}>Booking Terms</Link>, <Link to="/privacy" target="_blank" style={{ color: "#ea580c", fontWeight: 600 }}>Cancellation Policy</Link>, and acknowledge that high-altitude travel requires valid medical evacuation insurance.
              </span>
            </label>
          </div>
        </form>

        {/* RIGHT COLUMN: DYNAMIC PRICING CALCULATOR */}
        <aside className="booking-calc-sticky">
          <div className="calc-header">
            <h3>Trip Cost Summary</h3>
            <p>{trek.title} · {trek.duration} Days</p>
          </div>

          <div className="calc-body">
            <div className="calc-line-item">
              <span>Base Rate per Person:</span>
              <strong>${perPersonPrice.toLocaleString()}</strong>
            </div>

            <div className="calc-line-item">
              <span>Participants:</span>
              <span>{travelers} PAX</span>
            </div>

            <div className="calc-line-item">
              <span>Expedition Subtotal:</span>
              <strong>${trekSubtotal.toLocaleString()}</strong>
            </div>

            {addonsTotal > 0 && (
              <div className="calc-line-item">
                <span>Selected Add-Ons:</span>
                <strong style={{ color: "#ea580c" }}>+${addonsTotal.toLocaleString()}</strong>
              </div>
            )}

            <div className="calc-divider" />

            <div className="calc-total-box">
              <span className="calc-total-label">Total Expedition Cost:</span>
              <span className="calc-total-amount">${grandTotal.toLocaleString()}</span>
            </div>

            <div className="calc-deposit-banner">
              <span>Deposit Due (20%):</span>
              <strong>${depositAmount.toLocaleString()}</strong>
            </div>

            <div className="calc-line-item" style={{ fontSize: "12.5px" }}>
              <span>Balance in Kathmandu (80%):</span>
              <span>${balanceAmount.toLocaleString()}</span>
            </div>

            <button
              type="button"
              className="calc-submit-btn"
              onClick={handleBookingSubmit}
              disabled={submitting}
            >
              {submitting ? "Submitting Request..." : `Submit Reservation ($${depositAmount.toLocaleString()})`}
            </button>

            <div className="calc-trust-strip">
              <div className="calc-trust-item">
                <Check size={14} /> <span>Status starts as Pending for seat check</span>
              </div>
              <div className="calc-trust-item">
                <Check size={14} /> <span>Free Cancellation up to 30 Days before</span>
              </div>
              <div className="calc-trust-item">
                <Check size={14} /> <span>100% Sherpa Led Departures</span>
              </div>
              <div className="calc-trust-item">
                <Lock size={14} /> <span>SSL 256-Bit Encrypted Data Integrity</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default BookingPage;
