import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  DollarSign,
  Heart,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  MessageSquare,
  Mountain,
  Phone,
  Send,
  ShieldCheck,
  Star,
  User,
  XCircle,
} from "lucide-react";
import { Page } from "../../components/common/Page.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { api } from "../../services/api.js";

export function TravelerDashboard() {
  const { user, logout, updateProfile, changePassword } = useAuth();
  const notify = useToast();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview"); // overview | bookings | saved | requests | profile | settings
  const [bookings, setBookings] = useState([]);
  const [savedTreks, setSavedTreks] = useState([]);
  const [tripRequests, setTripRequests] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  // Cancellation modal state
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  // Profile Form state
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    phone: user?.profile?.phone || "",
    nationality: user?.profile?.nationality || "",
    bio: user?.profile?.bio || "",
    emergencyName: user?.profile?.emergencyContact?.name || "",
    emergencyPhone: user?.profile?.emergencyContact?.phone || "",
  });

  // Password Form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    setProfileForm({
      name: user.name || "",
      phone: user.profile?.phone || "",
      nationality: user.profile?.nationality || "",
      bio: user.profile?.bio || "",
      emergencyName: user.profile?.emergencyContact?.name || "",
      emergencyPhone: user.profile?.emergencyContact?.phone || "",
    });

    // Fetch traveler's bookings, saved treks, and trip requests
    Promise.allSettled([
      api.bookings.getMy(),
      api.favorites.get(),
      api.tripRequests.getMy(),
    ])
      .then(([bookingsRes, favsRes, requestsRes]) => {
        if (bookingsRes.status === "fulfilled" && bookingsRes.value?.success) {
          setBookings(bookingsRes.value.bookings || []);
        }
        if (favsRes.status === "fulfilled" && favsRes.value?.success) {
          setSavedTreks(favsRes.value.treks || []);
        }
        if (requestsRes.status === "fulfilled" && requestsRes.value?.success) {
          setTripRequests(requestsRes.value.tripRequests || []);
        }
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [user, navigate]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({
        name: profileForm.name,
        bio: profileForm.bio,
        phone: profileForm.phone,
        nationality: profileForm.nationality,
        emergencyContact: {
          name: profileForm.emergencyName,
          phone: profileForm.emergencyPhone,
        },
      });
      notify("Profile updated successfully!");
    } catch (err) {
      notify(err.message || "Failed to update profile.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      notify("New passwords do not match.");
      return;
    }
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      notify("Password changed successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      notify(err.message || "Password update failed.");
    }
  };

  const handleCancelBooking = async (e) => {
    e.preventDefault();
    if (!cancellingBookingId) return;

    try {
      await api.bookings.cancel(cancellingBookingId, cancelReason);
      notify("Booking cancellation processed.");
      setBookings((prev) =>
        prev.map((b) =>
          b._id === cancellingBookingId ? { ...b, bookingStatus: "Cancelled" } : b
        )
      );
      setCancellingBookingId(null);
      setCancelReason("");
    } catch (err) {
      notify(err.message || "Failed to process cancellation.");
    }
  };

  if (!user) return null;

  return (
    <Page className="traveler-dashboard-page">
      <div className="section-wrap dashboard-container">
        {/* Top Welcome Bar */}
        <div className="dashboard-welcome-banner">
          <div className="welcome-avatar-wrap">
            <img src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"} alt={user.name} />
          </div>
          <div className="welcome-text-wrap">
            <span className="welcome-tag">Traveler Portal</span>
            <h1>Namaste, <strong>{user.name}</strong></h1>
            <p>Welcome to your Himalayan expedition account. Manage bookings, trail permits, and saved routes.</p>
          </div>
          <div className="welcome-actions">
            {user.role === "admin" && (
              <Link to="/admin" className="button button-orange button-small">
                ⚡ Admin Dashboard
              </Link>
            )}
            <button
              type="button"
              className="button button-ghost button-small"
              onClick={async () => {
                await logout();
                navigate("/");
              }}
            >
              <LogOut size={16} /> Log Out
            </button>
          </div>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="dashboard-layout-grid">
          {/* Sidebar Nav */}
          <aside className="dashboard-nav-card">
            <nav className="dash-nav-list">
              <button
                type="button"
                className={`dash-nav-btn${activeTab === "overview" ? " is-active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <LayoutDashboard size={18} /> Overview
              </button>
              <button
                type="button"
                className={`dash-nav-btn${activeTab === "bookings" ? " is-active" : ""}`}
                onClick={() => setActiveTab("bookings")}
              >
                <Calendar size={18} /> My Bookings ({bookings.length})
              </button>
              <button
                type="button"
                className={`dash-nav-btn${activeTab === "saved" ? " is-active" : ""}`}
                onClick={() => setActiveTab("saved")}
              >
                <Heart size={18} /> Saved Treks ({savedTreks.length})
              </button>
              <button
                type="button"
                className={`dash-nav-btn${activeTab === "requests" ? " is-active" : ""}`}
                onClick={() => setActiveTab("requests")}
              >
                <Send size={18} /> Custom Requests ({tripRequests.length})
              </button>
              <button
                type="button"
                className={`dash-nav-btn${activeTab === "profile" ? " is-active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                <User size={18} /> Profile & Emergency
              </button>
              <button
                type="button"
                className={`dash-nav-btn${activeTab === "settings" ? " is-active" : ""}`}
                onClick={() => setActiveTab("settings")}
              >
                <KeyRound size={18} /> Account & Security
              </button>
            </nav>

            <div className="dash-helpline-box">
              <ShieldCheck size={24} className="helpline-icon" />
              <strong>24/7 Sherpa Support</strong>
              <p>In Kathmandu or on trail? Call our expedition desk:</p>
              <a href="tel:+9779851029894">+977 9851029894</a>
            </div>
          </aside>

          {/* Main Content Pane */}
          <main className="dashboard-content-card">
            {/* 1. OVERVIEW TAB */}
            {activeTab === "overview" && (
              <div className="dash-tab-pane">
                <h2>Account Overview</h2>
                <p className="dash-section-desc">Summary of your trekking preparations and reservations.</p>

                <div className="dash-stats-row">
                  <div className="dash-stat-box">
                    <span className="stat-label">Total Expeditions</span>
                    <strong className="stat-value">{bookings.length}</strong>
                    <small>{bookings.filter((b) => b.bookingStatus === "Confirmed").length} confirmed</small>
                  </div>
                  <div className="dash-stat-box">
                    <span className="stat-label">Saved Bucket List</span>
                    <strong className="stat-value">{savedTreks.length}</strong>
                    <small>High Himalayan routes</small>
                  </div>
                  <div className="dash-stat-box">
                    <span className="stat-label">Custom Inquiries</span>
                    <strong className="stat-value">{tripRequests.length}</strong>
                    <small>Sherpa-crafted itineraries</small>
                  </div>
                </div>

                {/* Recent Bookings in Overview */}
                <h3 className="dash-subheading">Active Trek Reservations</h3>
                {bookings.length === 0 ? (
                  <div className="dash-empty-state">
                    <Mountain size={36} />
                    <h4>No active trek bookings yet</h4>
                    <p>Ready to stand beneath the highest peaks in the world? Choose from our handcrafted departures.</p>
                    <Link to="/treks" className="button button-orange button-small">
                      Explore All Treks <ArrowRight size={15} />
                    </Link>
                  </div>
                ) : (
                  <div className="dash-bookings-list">
                    {bookings.slice(0, 3).map((b) => (
                      <div key={b._id || b.bookingReference} className="dash-booking-card">
                        <div className="booking-card-header">
                          <div>
                            <span className="booking-ref-badge">{b.bookingReference}</span>
                            <h4>{b.trek?.title || "Himalayan Expedition"}</h4>
                          </div>
                          <span className={`status-tag status-${(b.bookingStatus || "requested").toLowerCase().replace(/\s+/g, "-")}`}>
                            {b.bookingStatus}
                          </span>
                        </div>
                        <div className="booking-card-meta">
                          <span><Calendar size={14} /> Start: {b.departure?.startDate ? new Date(b.departure.startDate).toDateString() : "Flexible"}</span>
                          <span><User size={14} /> Travelers: {b.numberOfTravelers} PAX</span>
                          <span><DollarSign size={14} /> Total: ${b.totalAmount} USD</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 2. MY BOOKINGS TAB */}
            {activeTab === "bookings" && (
              <div className="dash-tab-pane">
                <div className="pane-header-flex">
                  <div>
                    <h2>My Bookings & Inquiries</h2>
                    <p className="dash-section-desc">Manage your reservations, view booking references, and submit cancellation requests.</p>
                  </div>
                  <Link to="/treks" className="button button-orange button-small">
                    Book Another Trek +
                  </Link>
                </div>

                {bookings.length === 0 ? (
                  <div className="dash-empty-state">
                    <Calendar size={36} />
                    <h4>No bookings found</h4>
                    <p>You have not made any trek reservations yet. Browse our fixed group departures or custom routes.</p>
                    <Link to="/treks" className="button button-orange button-small">Find a Trail</Link>
                  </div>
                ) : (
                  <div className="dash-bookings-list">
                    {bookings.map((b) => (
                      <div key={b._id || b.bookingReference} className="dash-booking-card">
                        <div className="booking-card-header">
                          <div>
                            <span className="booking-ref-badge">{b.bookingReference}</span>
                            <h4>{b.trek?.title || "Himalayan Journey"}</h4>
                          </div>
                          <div className="booking-status-badges">
                            <span className={`status-tag status-${(b.bookingStatus || "requested").toLowerCase().replace(/\s+/g, "-")}`}>
                              Booking: {b.bookingStatus}
                            </span>
                            <span className={`payment-tag pay-${(b.paymentStatus || "unpaid").toLowerCase()}`}>
                              Payment: {b.paymentStatus}
                            </span>
                          </div>
                        </div>

                        <div className="booking-card-meta">
                          <span><Calendar size={14} /> Start Date: {b.departure?.startDate ? new Date(b.departure.startDate).toDateString() : "Flexible"}</span>
                          <span><User size={14} /> Travelers: {b.numberOfTravelers}</span>
                          <span><DollarSign size={14} /> Total: ${b.totalAmount} USD</span>
                        </div>

                        {b.notes && (
                          <p className="booking-notes-preview"><strong>Notes:</strong> {b.notes}</p>
                        )}

                        <div className="booking-card-footer">
                          {b.trek?.slug && (
                            <Link to={`/treks/${b.trek.slug}`} className="view-trek-btn">
                              View Trek Page <ArrowRight size={14} />
                            </Link>
                          )}
                          {b.bookingStatus !== "Cancelled" && (
                            <button
                              type="button"
                              className="cancel-booking-btn"
                              onClick={() => {
                                setCancellingBookingId(b._id);
                                setCancelReason("");
                              }}
                            >
                              Request Cancellation
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 3. SAVED TREKS TAB */}
            {activeTab === "saved" && (
              <div className="dash-tab-pane">
                <h2>Saved Treks & Bucket List</h2>
                <p className="dash-section-desc">Handpicked routes you have saved for future expeditions.</p>

                {savedTreks.length === 0 ? (
                  <div className="dash-empty-state">
                    <Heart size={36} />
                    <h4>Your wishlist is empty</h4>
                    <p>Browse our catalog and tap the heart icon on any trek to save it to your account.</p>
                    <Link to="/treks" className="button button-orange button-small">Explore Treks</Link>
                  </div>
                ) : (
                  <div className="saved-treks-grid">
                    {savedTreks.map((trek) => (
                      <div key={trek._id || trek.slug} className="saved-trek-mini-card">
                        <img src={trek.images?.[0] || trek.image || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80"} alt={trek.title} />
                        <div className="saved-trek-mini-body">
                          <span className="mini-region">{trek.region}</span>
                          <h4>{trek.title}</h4>
                          <span className="mini-price">From ${trek.price} USD</span>
                          <Link to={`/treks/${trek.slug}`} className="button button-small button-orange">
                            Explore Route ↗
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 4. CUSTOM TRIP REQUESTS TAB */}
            {activeTab === "requests" && (
              <div className="dash-tab-pane">
                <div className="pane-header-flex">
                  <div>
                    <h2>Custom Trip Inquiries</h2>
                    <p className="dash-section-desc">Tailor-made itineraries submitted to our Sherpa operations team.</p>
                  </div>
                  <Link to="/contact" className="button button-orange button-small">New Request +</Link>
                </div>

                {tripRequests.length === 0 ? (
                  <div className="dash-empty-state">
                    <Send size={36} />
                    <h4>No custom trip inquiries</h4>
                    <p>Want a private departure with custom acclimatization days? Submit a request anytime.</p>
                    <Link to="/contact" className="button button-orange button-small">Create Custom Itinerary</Link>
                  </div>
                ) : (
                  <div className="requests-list">
                    {tripRequests.map((r) => (
                      <div key={r._id} className="request-card">
                        <div className="request-card-header">
                          <strong>Region: {r.preferredRegion}</strong>
                          <span className="request-status-pill">{r.requestStatus}</span>
                        </div>
                        <p><strong>Group Size:</strong> {r.groupSize} PAX · <strong>Experience:</strong> {r.experienceLevel}</p>
                        {r.specialRequirements && <p><strong>Details:</strong> {r.specialRequirements}</p>}
                        <small className="request-date">Submitted: {new Date(r.createdAt).toLocaleDateString()}</small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. PROFILE & EMERGENCY TAB */}
            {activeTab === "profile" && (
              <div className="dash-tab-pane">
                <h2>Profile & High Altitude Medical Info</h2>
                <p className="dash-section-desc">Ensure your contact and emergency details are accurate for mountain permit processing.</p>

                <form className="dash-form" onSubmit={handleProfileSubmit}>
                  <div className="form-group-row">
                    <div className="form-field">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>Email Address</label>
                      <input type="email" value={user.email} disabled />
                    </div>
                  </div>

                  <div className="form-group-row">
                    <div className="form-field">
                      <label>Contact Phone (WhatsApp)</label>
                      <input
                        type="tel"
                        value={profileForm.phone}
                        onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        placeholder="+1 555 123 4567"
                      />
                    </div>
                    <div className="form-field">
                      <label>Nationality (For Nepal Visa & Permits)</label>
                      <input
                        type="text"
                        value={profileForm.nationality}
                        onChange={(e) => setProfileForm({ ...profileForm, nationality: e.target.value })}
                        placeholder="e.g. United States, Germany, Japan"
                      />
                    </div>
                  </div>

                  <div className="form-field">
                    <label>About Your Trekking Background</label>
                    <textarea
                      rows={3}
                      value={profileForm.bio}
                      onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="Share your high altitude experience, favorite mountain ranges, or training habits..."
                    />
                  </div>

                  <h3 className="form-subhead">Emergency Contact (Required for Rescue Operations)</h3>
                  <div className="form-group-row">
                    <div className="form-field">
                      <label>Emergency Contact Name</label>
                      <input
                        type="text"
                        value={profileForm.emergencyName}
                        onChange={(e) => setProfileForm({ ...profileForm, emergencyName: e.target.value })}
                        placeholder="Full name of next of kin"
                      />
                    </div>
                    <div className="form-field">
                      <label>Emergency Contact Phone</label>
                      <input
                        type="tel"
                        value={profileForm.emergencyPhone}
                        onChange={(e) => setProfileForm({ ...profileForm, emergencyPhone: e.target.value })}
                        placeholder="Include country code"
                      />
                    </div>
                  </div>

                  <button type="submit" className="button button-orange">
                    Save Profile Changes
                  </button>
                </form>
              </div>
            )}

            {/* 6. SETTINGS & PASSWORD TAB */}
            {activeTab === "settings" && (
              <div className="dash-tab-pane">
                <h2>Account & Password Security</h2>
                <p className="dash-section-desc">Update your password and security credentials.</p>

                <form className="dash-form" onSubmit={handlePasswordSubmit}>
                  <div className="form-field">
                    <label>Current Password</label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group-row">
                    <div className="form-field">
                      <label>New Password (min. 6 characters)</label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-field">
                      <label>Confirm New Password</label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="button button-dark">
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>

        {/* Cancellation Modal Dialog */}
        {cancellingBookingId && (
          <div className="modal-backdrop">
            <div className="modal-content-card">
              <h3>Confirm Cancellation Request</h3>
              <p>Are you sure you wish to cancel this booking? Our team will process any eligible refund per our cancellation terms.</p>
              <textarea
                rows={3}
                placeholder="Please share the reason for cancellation (flight changes, health, etc.)..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
              <div className="modal-actions-row">
                <button
                  type="button"
                  className="button button-ghost"
                  onClick={() => setCancellingBookingId(null)}
                >
                  Keep Reservation
                </button>
                <button
                  type="button"
                  className="button button-danger"
                  onClick={handleCancelBooking}
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Page>
  );
}

export default TravelerDashboard;
