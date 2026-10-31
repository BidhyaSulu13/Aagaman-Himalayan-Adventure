import { useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  CreditCard,
  FileCheck,
  HeartHandshake,
  HelpCircle,
  Lock,
  Luggage,
  MapPin,
  Mountain,
  Phone,
  Plane,
  Printer,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { useDepartures, useTreks } from "../../hooks/useDataStore.js";
import { dataStore } from "../../services/dataStore.js";
import { api } from "../../services/api.js";
import { NotFoundPage } from "../public/MiscPages.jsx";
import "./TripBooking.css";

export function BookingPage() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const treks = useTreks();
  const allDepartures = useDepartures();
  const { user } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();

  // Find trek by slug or fallback to query param / first trek
  const trekSlug = slug || searchParams.get("trip") || "everest-base-camp";
  const trek = treks.find((t) => t.slug === trekSlug) || treks[0];

  const departures = allDepartures.filter((d) => d.trekSlug === trek?.slug);
  const initialDate = searchParams.get("date") || (departures[0]?.startDate || "2026-05-15");

  // Booking Form State
  const [travelers, setTravelers] = useState(2);
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [selectedDepartureId, setSelectedDepartureId] = useState(departures[0]?.id || "");
  const [depositOption, setDepositOption] = useState("deposit"); // "deposit" (20%) | "full" (100%)

  // Add-ons
  const [addons, setAddons] = useState({
    singleRoom: false, // +$250 total
    extraPorter: false, // +$180 total
    airportTransfer: true, // +$45 total
    gearRental: false, // +$35 / pax
    heliReturn: false, // +$650 / pax
  });

  // Traveler Details
  const [travelerInfo, setTravelerInfo] = useState({
    fullName: user?.name || "Alex Thorne",
    email: user?.email || "traveler@agaaman.com",
    phone: "+1 415 555 0192",
    country: "United States",
    passportNumber: "N81920482",
    dietary: "Vegetarian",
    emergencyName: "Sarah Thorne",
    emergencyPhone: "+1 415 555 0199",
    specialRequests: "Arriving 1 day early in Kathmandu; excited for morning photography at Kala Patthar.",
  });

  const [agreedTerms, setAgreedTerms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

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
    e.preventDefault();
    if (!agreedTerms) {
      notify("Please agree to the booking terms and cancellation policies.");
      return;
    }

    setSubmitting(true);
    const bookingPayload = {
      type: "booking",
      trekSlug: trek.slug,
      trekTitle: trek.title,
      name: travelerInfo.fullName,
      email: travelerInfo.email,
      phone: travelerInfo.phone,
      country: travelerInfo.country,
      passportNumber: travelerInfo.passportNumber,
      dietary: travelerInfo.dietary,
      emergencyContact: {
        name: travelerInfo.emergencyName,
        phone: travelerInfo.emergencyPhone,
      },
      startDate: selectedDate,
      travelers: Number(travelers),
      perPersonPrice,
      addons,
      addonsTotal,
      totalAmount: grandTotal,
      depositAmount,
      balanceAmount,
      depositOption,
      notes: travelerInfo.specialRequests,
      bookingStatus: "Confirmed",
      paymentStatus: depositOption === "full" ? "Paid" : "Deposit Paid",
    };

    try {
      if (api.bookings && api.bookings.create) {
        await api.bookings.create(bookingPayload).catch(() => {});
      }
    } catch {
      // Local storage fallback
    }

    const savedBooking = dataStore.addBooking(bookingPayload);
    window.dispatchEvent(new Event("agaaman_data_changed"));
    setConfirmedBooking(savedBooking);
    notify("Trip booking reservation confirmed successfully!");
    setSubmitting(false);
  };

  // ── RECEIPT CONFIRMATION VIEW ──
  if (confirmedBooking) {
    return (
      <div className="booking-page-wrap">
        <div className="booking-receipt-surface">
          <div className="receipt-icon-bubble">
            <CheckCircle2 size={40} />
          </div>
          <h2>Trip Reservation Confirmed!</h2>
          <p style={{ color: "#64748b", margin: "0 auto", maxWidth: "480px" }}>
            Thank you for booking with Agaaman Himalayan Adventure. Your mountain expedition is secured.
          </p>

          <div className="receipt-ref-badge">
            Reference: {confirmedBooking.bookingReference || confirmedBooking.id}
          </div>

          <table className="receipt-details-table">
            <tbody>
              <tr>
                <td>Expedition:</td>
                <td>{trek.title}</td>
              </tr>
              <tr>
                <td>Departure Date:</td>
                <td>{selectedDate}</td>
              </tr>
              <tr>
                <td>Group Size:</td>
                <td>{travelers} Travelers</td>
              </tr>
              <tr>
                <td>Lead Traveler:</td>
                <td>{travelerInfo.fullName} ({travelerInfo.email})</td>
              </tr>
              <tr>
                <td>Total Trip Cost:</td>
                <td>${grandTotal.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Deposit Confirmed:</td>
                <td style={{ color: "#10b981" }}>${depositAmount.toLocaleString()} (20% Paid)</td>
              </tr>
              <tr>
                <td>Balance Due in Kathmandu:</td>
                <td>${balanceAmount.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Emergency Contact:</td>
                <td>{travelerInfo.emergencyName} ({travelerInfo.emergencyPhone})</td>
              </tr>
            </tbody>
          </table>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", marginTop: "24px" }}>
            <button
              type="button"
              className="calc-submit-btn"
              onClick={() => window.print()}
              style={{ background: "#083c34", padding: "12px 20px" }}
            >
              <Printer size={16} /> Print Receipt
            </button>
            <Link
              to={`/treks/${trek.slug}`}
              className="calc-submit-btn"
              style={{ padding: "12px 24px" }}
            >
              Back to Trek Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-page-wrap">
      {/* Hero Banner with Trek Context */}
      <section className="booking-hero-banner">
        <div className="booking-banner-inner">
          <div className="booking-breadcrumbs">
            <Link to="/">Home</Link> <span>›</span>
            <Link to="/treks">Nepal Treks</Link> <span>›</span>
            <Link to={`/treks/${trek.slug}`}>{trek.title}</Link> <span>›</span>
            <span>Trip Booking</span>
          </div>

          <div className="booking-banner-title-row">
            <div>
              <h1>Book Your Journey: {trek.title}</h1>
              <div className="booking-banner-meta">
                <span className="booking-meta-pill">
                  <MapPin size={14} /> {trek.region}, Nepal
                </span>
                <span className="booking-meta-pill">
                  <Calendar size={14} /> {trek.duration} Days
                </span>
                <span className="booking-meta-pill">
                  <Mountain size={14} /> Max {trek.elevation}m
                </span>
                <span className="booking-meta-pill">
                  <ShieldCheck size={14} /> 100% Guaranteed Departures
                </span>
              </div>
            </div>
            <Link to={`/treks/${trek.slug}`} className="calc-submit-btn" style={{ background: "rgba(255,255,255,0.1)", fontSize: "13px", padding: "8px 16px" }}>
              <ArrowLeft size={14} /> View Itinerary
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
                <h2>Expedition Dates & Group Size</h2>
                <p>Choose an upcoming fixed departure or set your custom starting date.</p>
              </div>
            </div>

            <div className="book-form-grid">
              <div className="book-field">
                <label>Number of Travelers (PAX) *</label>
                <select
                  value={travelers}
                  onChange={(e) => setTravelers(Number(e.target.value))}
                  required
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18].map((num) => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? "Solo Traveler" : "Travelers"}
                      {num >= 5 ? " (Group Discount Applied)" : ""}
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
                  onChange={(e) => setSelectedDate(e.target.value)}
                  required
                />
              </div>

              {departures.length > 0 && (
                <div className="book-field full">
                  <label>Or Join Guaranteed Group Departure Date:</label>
                  <select
                    value={selectedDepartureId}
                    onChange={(e) => {
                      const dep = departures.find((d) => d.id === e.target.value);
                      if (dep) {
                        setSelectedDepartureId(dep.id);
                        setSelectedDate(dep.startDate);
                      }
                    }}
                  >
                    <option value="">-- Custom Selected Date ({selectedDate}) --</option>
                    {departures.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.startDate} to {d.endDate} · Guaranteed (${d.price}/PAX · {d.availableSeats} seats left)
                      </option>
                    ))}
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
                <p>Enhance your expedition comfort with extra porters, private lodges, or helicopter returns.</p>
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
                    <div className="addon-text-desc">Private room guarantee in Kathmandu hotel & teahouse lodges throughout the trek</div>
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
                    <div className="addon-text-desc">Dedicated porter carrying up to 25kg solely for your gear and photography equipment</div>
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
                    <div className="addon-text-title">Private Deluxe Airport Pickup & Drop</div>
                    <div className="addon-text-desc">Chauffeured vehicle transfer from Tribhuvan International Airport directly to hotel</div>
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
                    <div className="addon-text-desc">Clean, certified -20°C North Face down sleeping bag and expedition feather jacket</div>
                  </div>
                </div>
                <span className="addon-price-tag">+$35 / person</span>
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
                    <div className="addon-text-desc">Skip the return hike! Fly direct back to Kathmandu with breathtaking panoramic views</div>
                  </div>
                </div>
                <span className="addon-price-tag">+$650 / person</span>
              </label>
            </div>
          </div>

          {/* STEP 3: TRAVELER & EMERGENCY DETAILS */}
          <div className="booking-section-card">
            <div className="section-step-head">
              <span className="step-num-bubble">3</span>
              <div>
                <h2>Primary Traveler & Medical Details</h2>
                <p>We use this information to issue national park permits, flight tickets, and TIMS cards.</p>
              </div>
            </div>

            <div className="book-form-grid">
              <div className="book-field">
                <label>Full Name (as per Passport) *</label>
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
                  placeholder="john@example.com"
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
                  placeholder="United States, United Kingdom, etc."
                  required
                />
              </div>

              <div className="book-field">
                <label>Passport Number (Optional now)</label>
                <input
                  type="text"
                  value={travelerInfo.passportNumber}
                  onChange={(e) => setTravelerInfo({ ...travelerInfo, passportNumber: e.target.value })}
                  placeholder="Passport number for permits"
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
                <label>Emergency Contact Full Name *</label>
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

          {/* STEP 4: DEPOSIT & PAYMENT TERMS */}
          <div className="booking-section-card">
            <div className="section-step-head">
              <span className="step-num-bubble">4</span>
              <div>
                <h2>Payment Structure & Terms</h2>
                <p>Secure your reservation today with only a 20% advance deposit. The balance is settled upon arrival in Kathmandu.</p>
              </div>
            </div>

            <div className="deposit-options-grid">
              <div
                className={`deposit-radio-card${depositOption === "deposit" ? " is-active" : ""}`}
                onClick={() => setDepositOption("deposit")}
              >
                <div className="deposit-card-top">
                  <span className="deposit-title">Pay 20% Deposit Now</span>
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
                <span className="deposit-sub">Remaining balance (${balanceAmount.toLocaleString()}) paid in Kathmandu</span>
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
                <span className="deposit-sub">All fees covered in advance with zero balance on arrival</span>
              </div>
            </div>

            <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "13px", color: "#475569", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={agreedTerms}
                onChange={(e) => setAgreedTerms(e.target.checked)}
                style={{ marginTop: "3px", accentColor: "#ea580c" }}
                required
              />
              <span>
                I agree to the <Link to="/terms" target="_blank" style={{ color: "#ea580c", fontWeight: 600 }}>Booking Terms</Link>, <Link to="/privacy" target="_blank" style={{ color: "#ea580c", fontWeight: 600 }}>Cancellation Policy</Link>, and acknowledge that high-altitude travel requires travel insurance.
              </span>
            </label>
          </div>
        </form>

        {/* RIGHT COLUMN: DYNAMIC PRICING CALCULATOR */}
        <aside className="booking-calc-sticky">
          <div className="calc-header">
            <h3>Trip Cost Calculator</h3>
            <p>{trek.title} · {trek.duration} Days</p>
          </div>

          <div className="calc-body">
            <div className="calc-line-item">
              <span>Base Rate per Person:</span>
              <strong>${perPersonPrice.toLocaleString()}</strong>
            </div>

            <div className="calc-line-item">
              <span>Travelers:</span>
              <span>{travelers} PAX</span>
            </div>

            <div className="calc-line-item">
              <span>Expedition Subtotal:</span>
              <strong>${trekSubtotal.toLocaleString()}</strong>
            </div>

            {addonsTotal > 0 && (
              <div className="calc-line-item">
                <span>Selected Add-On Services:</span>
                <strong style={{ color: "#ea580c" }}>+${addonsTotal.toLocaleString()}</strong>
              </div>
            )}

            <div className="calc-divider" />

            <div className="calc-total-box">
              <span className="calc-total-label">Total Expedition Cost:</span>
              <span className="calc-total-amount">${grandTotal.toLocaleString()}</span>
            </div>

            <div className="calc-deposit-banner">
              <span>Deposit Due Today (20%):</span>
              <strong>${depositAmount.toLocaleString()}</strong>
            </div>

            <div className="calc-line-item" style={{ fontSize: "12.5px" }}>
              <span>Balance Due in Kathmandu (80%):</span>
              <span>${balanceAmount.toLocaleString()}</span>
            </div>

            <button
              type="button"
              className="calc-submit-btn"
              onClick={handleBookingSubmit}
              disabled={submitting}
            >
              {submitting ? "Processing..." : `Confirm Booking ($${depositAmount.toLocaleString()})`}
            </button>

            <div className="calc-trust-strip">
              <div className="calc-trust-item">
                <Check size={14} /> <span>Free Cancellation up to 30 Days before</span>
              </div>
              <div className="calc-trust-item">
                <Check size={14} /> <span>100% Guaranteed Departures</span>
              </div>
              <div className="calc-trust-item">
                <Check size={14} /> <span>Licensed Local Mountain Sherpas</span>
              </div>
              <div className="calc-trust-item">
                <Lock size={14} /> <span>256-Bit Encrypted Secure Booking</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default BookingPage;
