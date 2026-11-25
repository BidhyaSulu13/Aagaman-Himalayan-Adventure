import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
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
  Upload,
  XCircle,
} from "lucide-react";
import { Page } from "../../components/common/Page.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useFavorites } from "../../context/FavoritesContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { api } from "../../services/api.js";
import { getDepartureStatus } from "../../services/departures.js";

export function TravelerDashboard() {
  const { user, loading: authLoading, logout, updateProfile, changePassword } = useAuth();
  const { savedTreks, loading: favoritesLoading, error: favoritesError } = useFavorites();
  const notify = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const guestBooking = location.state?.guestBooking || null;
  const requestedTab = searchParams.get("tab");
  const requestedBooking = searchParams.get("booking");
  const [activeTab, setActiveTab] = useState(
    ["overview", "bookings", "reviews", "stories", "saved", "requests", "profile", "settings"].includes(requestedTab)
      ? requestedTab
      : "overview"
  );
  const [bookings, setBookings] = useState([]);
  const [tripRequests, setTripRequests] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [dashboardError, setDashboardError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  // Cancellation modal state
  const [cancellingBookingId, setCancellingBookingId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");
  const [reviewingBookingId, setReviewingBookingId] = useState(null);
  const [reviewForm, setReviewForm] = useState({ rating: 5, title: "", comment: "" });
  const [reviewPhotos, setReviewPhotos] = useState([]);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [myStories, setMyStories] = useState([]);
  const [storyForm, setStoryForm] = useState({ bookingId: "", title: "", content: "", videoUrl: "", instagramUrl: "", facebookUrl: "" });
  const [storyPhotos, setStoryPhotos] = useState([]);
  const [storyVideo, setStoryVideo] = useState(null);
  const [editingStoryId, setEditingStoryId] = useState(null);
  const [storySubmitting, setStorySubmitting] = useState(false);

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
    if (["overview", "bookings", "reviews", "stories", "saved", "requests", "profile", "settings"].includes(requestedTab)) {
      setActiveTab(requestedTab);
    }
  }, [requestedTab]);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      if (!guestBooking) {
        navigate("/login", {
          state: { returnTo: `${location.pathname}${location.search}` },
        });
      }
      else setLoadingData(false);
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

    // Fetch traveler's bookings and trip requests.
    setLoadingData(true);
    setDashboardError("");
    Promise.allSettled([
      api.bookings.getMy(),
      api.tripRequests.getMy(),
      api.articles.getMine(),
    ])
      .then(([bookingsRes, requestsRes, storiesRes]) => {
        if (bookingsRes.status === "fulfilled" && bookingsRes.value?.success) {
          setBookings(bookingsRes.value.bookings || []);
        } else {
          setDashboardError(
            bookingsRes.status === "rejected"
              ? bookingsRes.reason?.message || "Your bookings could not be loaded."
              : "The booking service returned an invalid response."
          );
        }
        if (requestsRes.status === "fulfilled" && requestsRes.value?.success) {
          setTripRequests(requestsRes.value.tripRequests || []);
        }
        if (storiesRes.status === "fulfilled" && storiesRes.value?.success) {
          setMyStories(storiesRes.value.articles || []);
        }
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [user, authLoading, navigate, refreshKey, guestBooking, location.pathname, location.search]);

  useEffect(() => {
    if (!user || guestBooking) return undefined;

    const refreshDepartureStatuses = () => {
      if (document.visibilityState !== "visible") return;
      api.bookings.getMy()
        .then((response) => {
          if (response.success && Array.isArray(response.bookings)) {
            setBookings(response.bookings);
          }
        })
        .catch((error) => {
          console.error("Unable to refresh traveler departure statuses:", error.message);
        });
    };

    const intervalId = window.setInterval(refreshDepartureStatuses, 30_000);
    window.addEventListener("focus", refreshDepartureStatuses);
    document.addEventListener("visibilitychange", refreshDepartureStatuses);
    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", refreshDepartureStatuses);
      document.removeEventListener("visibilitychange", refreshDepartureStatuses);
    };
  }, [user, guestBooking]);

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

  const handleStorySubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!storyForm.bookingId) {
      notify("Choose one of your completed treks.");
      return;
    }
    if (!editingStoryId && !storyPhotos.length) {
      notify("Add at least one trek photograph.");
      return;
    }
    if (storyPhotos.length > 8 || storyPhotos.some((photo) => !["image/jpeg", "image/png", "image/webp"].includes(photo.type) || photo.size > 5 * 1024 * 1024)) {
      notify("Choose up to eight JPEG, PNG, or WebP photographs, each no larger than 5 MB.");
      return;
    }
    if (storyVideo && (!["video/mp4", "video/webm"].includes(storyVideo.type) || storyVideo.size > 50 * 1024 * 1024)) {
      notify("Choose an MP4 or WebM video no larger than 50 MB.");
      return;
    }

    setStorySubmitting(true);
    try {
      const body = new FormData();
      body.append("bookingId", storyForm.bookingId);
      body.append("title", storyForm.title.trim());
      body.append("content", storyForm.content.trim());
      body.append("videoUrl", storyForm.videoUrl.trim());
      body.append("instagramUrl", storyForm.instagramUrl.trim());
      body.append("facebookUrl", storyForm.facebookUrl.trim());
      storyPhotos.forEach((photo) => body.append("photos", photo));
      if (storyVideo) body.append("videoFile", storyVideo);
      const response = editingStoryId
        ? await api.articles.updateStory(editingStoryId, body)
        : await api.articles.submitStory(body);
      setMyStories((current) => editingStoryId
        ? current.map((story) => story._id === editingStoryId ? response.article : story)
        : [response.article, ...current]);
      setStoryForm({ bookingId: "", title: "", content: "", videoUrl: "", instagramUrl: "", facebookUrl: "" });
      setStoryPhotos([]);
      setStoryVideo(null);
      setEditingStoryId(null);
      form.reset();
      notify(response.message || "Your trek story was submitted for review.");
    } catch (error) {
      notify(error.message || "Unable to submit your trek story.");
    } finally {
      setStorySubmitting(false);
    }
  };

  const handleReviseStory = (story) => {
    setEditingStoryId(story._id);
    setStoryForm({ bookingId: story.completedBooking?._id || "", title: story.title || "", content: story.content || "", videoUrl: story.videoUrl || "", instagramUrl: story.instagramUrl || "", facebookUrl: story.facebookUrl || "" });
    setStoryPhotos([]);
    setStoryVideo(null);
    setActiveTab("stories");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReviewSubmit = async (e, booking) => {
    e.preventDefault();
    if (reviewPhotos.length > 4 || reviewPhotos.some((photo) => photo.size > 5 * 1024 * 1024)) {
      notify("Choose up to four photos, each no larger than 5 MB.");
      return;
    }
    if (reviewPhotos.some((photo) => !["image/jpeg", "image/png", "image/webp"].includes(photo.type))) {
      notify("Review photos must be JPEG, PNG, or WebP images.");
      return;
    }

    setReviewSubmitting(true);
    try {
      const body = new FormData();
      body.append("bookingId", booking._id);
      body.append("rating", String(reviewForm.rating));
      body.append("title", reviewForm.title);
      body.append("comment", reviewForm.comment);
      reviewPhotos.forEach((photo) => body.append("photos", photo));
      const response = await api.reviews.create(body);
      setBookings((previous) =>
        previous.map((item) =>
          item._id === booking._id ? { ...item, review: response.review } : item
        )
      );
      setReviewingBookingId(null);
      setReviewForm({ rating: 5, title: "", comment: "" });
      setReviewPhotos([]);
      notify(response.message || "Review submitted for admin approval.");
    } catch (err) {
      notify(err.message || "Unable to submit your review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  const renderReviewForm = (booking) => (
    <form className="booking-review-form" onSubmit={(event) => handleReviewSubmit(event, booking)}>
      <label>
        Star rating
        <span className="review-star-picker" role="group" aria-label="Choose a star rating">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              aria-label={`${rating} star${rating === 1 ? "" : "s"}`}
              aria-pressed={reviewForm.rating === rating}
              onClick={() => setReviewForm({ ...reviewForm, rating })}
            >
              <Star size={21} fill={rating <= reviewForm.rating ? "currentColor" : "none"} />
            </button>
          ))}
        </span>
      </label>
      <label>
        Review title
        <input
          value={reviewForm.title}
          maxLength={120}
          onChange={(event) => setReviewForm({ ...reviewForm, title: event.target.value })}
          required
        />
      </label>
      <label>
        Your experience
        <textarea
          value={reviewForm.comment}
          maxLength={2000}
          onChange={(event) => setReviewForm({ ...reviewForm, comment: event.target.value })}
          required
        />
      </label>
      <label>
        Photos (optional, up to 4)
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={(event) => setReviewPhotos(Array.from(event.target.files || []))}
        />
      </label>
      {reviewPhotos.length > 0 && <small>{reviewPhotos.map((photo) => photo.name).join(", ")}</small>}
      <div className="booking-review-actions">
        <button type="submit" className="view-trek-btn" disabled={reviewSubmitting}>
          {reviewSubmitting ? "Submitting…" : "Submit for approval"}
        </button>
        <button
          type="button"
          className="cancel-booking-btn"
          onClick={() => {
            setReviewingBookingId(null);
            setReviewPhotos([]);
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );

  const dashboardBooking = requestedBooking
    ? bookings.find((booking) => booking.bookingReference === requestedBooking)
    : null;

  useEffect(() => {
    const bookingToFocus = dashboardBooking ||
      (activeTab === "bookings" && reviewingBookingId
        ? bookings.find((booking) => booking._id === reviewingBookingId)
        : null);
    if (!loadingData && bookingToFocus) {
      document.getElementById(`booking-${bookingToFocus.bookingReference}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [loadingData, dashboardBooking, activeTab, reviewingBookingId, bookings]);

  if (!authLoading && !user && guestBooking) {
    return (
      <Page className="traveler-dashboard-page">
        <section className="guest-booking-dashboard">
          <div className="guest-booking-dashboard-icon"><CheckCircle2 size={26} /></div>
          <p className="welcome-tag">Guest booking</p>
          <h1>Your booking is in the dashboard</h1>
          <p className="guest-booking-intro">
            This reservation was made without an account. Keep the booking reference below for updates from our expedition team.
          </p>
          <div className="guest-booking-reference">
            <span>Booking reference</span>
            <strong>{guestBooking.bookingReference}</strong>
          </div>
          <dl className="guest-booking-details">
            <div><dt>Trek</dt><dd>{guestBooking.trekTitle}</dd></div>
            <div><dt>Departure</dt><dd>{guestBooking.startDate ? new Date(guestBooking.startDate).toLocaleDateString() : "Flexible"}</dd></div>
            {guestBooking.endDate && <div><dt>Finish</dt><dd>{new Date(guestBooking.endDate).toLocaleDateString()}</dd></div>}
            <div><dt>Travelers</dt><dd>{guestBooking.numberOfTravelers}</dd></div>
            <div><dt>Booking status</dt><dd>{guestBooking.bookingStatus}</dd></div>
            <div><dt>Payment status</dt><dd>{guestBooking.paymentStatus}</dd></div>
            <div><dt>Total</dt><dd>{guestBooking.currency} {Number(guestBooking.totalAmount).toLocaleString()}</dd></div>
          </dl>
          <div className="guest-booking-dashboard-actions">
            {guestBooking.trekSlug && <Link className="button button-dark" to={`/treks/${guestBooking.trekSlug}`}>View trek details</Link>}
            <Link className="button button-orange" to="/treks">Explore more treks</Link>
          </div>
          <div className="guest-dashboard-signin">
            <p>Verify this booking email to see this reservation in your traveler dashboard and leave a review after your trek.</p>
            <Link
              to="/login"
              state={{
                email: guestBooking.email,
                returnTo: `/dashboard?tab=bookings&booking=${encodeURIComponent(guestBooking.bookingReference)}`,
              }}
            >
              Sign in with your booking email
            </Link>
          </div>
        </section>
      </Page>
    );
  }

  if (authLoading || !user) return null;

  const submittedReviews = bookings.filter((booking) => booking.review);
  const reviewableBookings = bookings.filter(
    (booking) => booking.bookingStatus === "Completed" && !booking.review
  );
  const completedBookings = bookings.filter((booking) => booking.bookingStatus === "Completed");
  const experienceBookings = completedBookings.filter((booking) => {
    const bookingId = booking._id || booking.id;
    return editingStoryId
      ? myStories.find((story) => story._id === editingStoryId)?.completedBooking?._id === bookingId
      : !myStories.some((story) => (story.completedBooking?._id || story.completedBooking) === bookingId && story.blocksDuplicateSubmission !== false);
  });

  return (
    <Page className="traveler-dashboard-page">
      <div className="section-wrap dashboard-container">
        {/* Top Welcome Bar */}
        <div className="dashboard-welcome-banner">
          <div className="welcome-avatar-wrap">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} />
            ) : (
              <span className="welcome-avatar-initials" aria-hidden="true">
                {(user.name || "Traveler").trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase()}
              </span>
            )}
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
                className={`dash-nav-btn${activeTab === "reviews" ? " is-active" : ""}`}
                onClick={() => setActiveTab("reviews")}
              >
                <MessageSquare size={18} /> My Reviews ({submittedReviews.length})
              </button>
              <button
                type="button"
                className={`dash-nav-btn${activeTab === "stories" ? " is-active" : ""}`}
                onClick={() => setActiveTab("stories")}
              >
                <BookOpen size={18} /> My Trek Experiences ({myStories.length})
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
            {requestedBooking && !loadingData && (
              <div className={`dashboard-booking-focus${dashboardBooking ? " is-found" : ""}`} role={dashboardBooking ? "status" : "alert"}>
                {dashboardBooking ? (
                  <>
                    <CheckCircle2 size={20} />
                    <span>
                      Booking <strong>{dashboardBooking.bookingReference}</strong> is shown below.
                      Current status: <strong>{dashboardBooking.bookingStatus}</strong>.
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={20} />
                    <span>
                      Booking {requestedBooking} is not available in this account. Sign in with the email used for the booking or contact our team for help.
                    </span>
                  </>
                )}
              </div>
            )}
            {loadingData && (
              <div className="dashboard-data-status" role="status">
                <span className="dashboard-loading-spinner" />
                Loading your bookings and saved treks…
              </div>
            )}
            {dashboardError && !loadingData && (
              <div className="dashboard-load-error" role="alert">
                <AlertCircle size={19} />
                <span>{dashboardError} Please retry in a moment.</span>
                <button type="button" onClick={() => setRefreshKey((key) => key + 1)}>Retry</button>
              </div>
            )}
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
                {loadingData ? (
                  <div className="dashboard-inline-loading">Loading your latest bookings…</div>
                ) : dashboardError ? (
                  <div className="dashboard-inline-error">{dashboardError}</div>
                ) : bookings.length === 0 ? (
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
                      <div id={`booking-${b.bookingReference}`} key={b._id || b.bookingReference} className={`dash-booking-card${b.bookingReference === requestedBooking ? " is-highlighted" : ""}`}>
                        <div className="booking-card-header">
                          <div>
                            <span className="booking-ref-badge">{b.bookingReference}</span>
                            <h4>{b.trek?.title || "Himalayan Expedition"}</h4>
                          </div>
                          <span className={`status-tag status-${(b.bookingStatus || "requested").toLowerCase().replace(/\s+/g, "-")}`}>
                            {b.bookingStatus}
                          </span>
                          {b.departure && (
                            <span className={`status-tag status-${getDepartureStatus(b.departure).toLowerCase().replace(/\s+/g, "-")}`}>
                              Departure: {getDepartureStatus(b.departure)}
                            </span>
                          )}
                        </div>
                        <div className="booking-card-meta">
                          <span><Calendar size={14} /> Start: {b.departure?.startDate ? new Date(b.departure.startDate).toDateString() : "Flexible"}</span>
                          {b.departure?.endDate && <span><Calendar size={14} /> Finish: {new Date(b.departure.endDate).toDateString()}</span>}
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
                  <Link to="/book-another-trek" className="button button-orange button-small">
                    Book Another Trek +
                  </Link>
                </div>

                {loadingData ? (
                  <div className="dashboard-inline-loading">Loading your latest bookings…</div>
                ) : dashboardError ? (
                  <div className="dashboard-inline-error">{dashboardError}</div>
                ) : bookings.length === 0 ? (
                  <div className="dash-empty-state">
                    <Calendar size={36} />
                    <h4>No bookings found</h4>
                    <p>You have not made any trek reservations yet. Browse our fixed group departures or custom routes.</p>
                    <Link to="/treks" className="button button-orange button-small">Find a Trail</Link>
                  </div>
                ) : (
                  <div className="dash-bookings-list">
                    {bookings.map((b) => (
                      <div id={`booking-${b.bookingReference}`} key={b._id || b.bookingReference} className={`dash-booking-card${b.bookingReference === requestedBooking ? " is-highlighted" : ""}`}>
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
                            {b.departure && (
                              <span className={`status-tag status-${getDepartureStatus(b.departure).toLowerCase().replace(/\s+/g, "-")}`}>
                                Departure: {getDepartureStatus(b.departure)}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="booking-card-meta">
                          <span><Calendar size={14} /> Start Date: {b.departure?.startDate ? new Date(b.departure.startDate).toDateString() : "Flexible"}</span>
                          {b.departure?.endDate && <span><Calendar size={14} /> Finish Date: {new Date(b.departure.endDate).toDateString()}</span>}
                          <span><User size={14} /> Travelers: {b.numberOfTravelers}</span>
                          <span><DollarSign size={14} /> Total: ${b.totalAmount} USD</span>
                        </div>
                        {b.departure && getDepartureStatus(b.departure) === "Cancelled" && (
                          <p className="booking-notes-preview" role="status">
                            This departure was cancelled. Your booking and payment history are preserved; our team will contact you about next steps.
                          </p>
                        )}
                        {b.departure && getDepartureStatus(b.departure) === "Completed" && (
                          <p className="booking-notes-preview" role="status">Past trip · This departure is completed.</p>
                        )}

                        {b.notes && (
                          <p className="booking-notes-preview"><strong>Notes:</strong> {b.notes}</p>
                        )}

                        {b.bookingStatus === "Completed" && (
                          <div className="booking-review-area">
                            {b.review ? (
                              <p className="booking-review-status">
                                <Star size={15} fill="currentColor" />
                                Review: {b.review.moderationStatus === "approved"
                                  ? "Published"
                                  : b.review.moderationStatus === "rejected"
                                    ? "Rejected"
                                    : "Pending Approval"}
                              </p>
                            ) : reviewingBookingId === b._id ? (
                              renderReviewForm(b)
                            ) : (
                              <button
                                type="button"
                                className="view-trek-btn"
                                onClick={() => {
                                  setReviewingBookingId(b._id);
                                  setReviewForm({ rating: 5, title: "", comment: "" });
                                  setReviewPhotos([]);
                                }}
                              >
                                <Star size={15} /> Write a Review
                              </button>
                            )}
                          </div>
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

            {activeTab === "reviews" && (
              <div className="dash-tab-pane">
                <h2>My Reviews</h2>
                <p className="dash-section-desc">After your trek ends, an admin confirms the departure as Completed in Admin Console → Group Departures. Confirmed bookings then become eligible for reviews, which are published after approval.</p>
                {submittedReviews.length === 0 && reviewableBookings.length === 0 ? (
                  <div className="dash-empty-state">
                    <MessageSquare size={36} />
                    <h4>No reviews yet</h4>
                    <p>After a trek is marked completed, you can share your experience here.</p>
                    <Link to="/treks" className="button button-orange button-small">Explore Treks</Link>
                  </div>
                ) : (
                  <div className="requests-list">
                    {submittedReviews.map((booking) => (
                      <article key={booking.review._id || booking._id} className="request-card">
                        <div className="request-card-header">
                          <strong>{booking.trek?.title || "Himalayan Journey"}</strong>
                          <span className="request-status-pill">
                            {booking.review.moderationStatus === "approved"
                              ? "Published"
                              : booking.review.moderationStatus === "rejected"
                                ? "Rejected"
                                : "Pending Approval"}
                          </span>
                        </div>
                        <p className="my-review-rating" aria-label={`${booking.review.rating} out of 5 stars`}>
                          {"★".repeat(Math.max(0, Math.min(5, Number(booking.review.rating) || 0)))}
                          <span>{"☆".repeat(5 - Math.max(0, Math.min(5, Number(booking.review.rating) || 0)))}</span>
                        </p>
                        <h3>{booking.review.title}</h3>
                        <p>{booking.review.comment}</p>
                        <small className="request-date">Booking reference: {booking.bookingReference}</small>
                      </article>
                    ))}
                    {reviewableBookings.map((booking) => (
                      <article key={booking._id} className="request-card">
                        <div className="request-card-header">
                          <strong>{booking.trek?.title || "Himalayan Journey"}</strong>
                          <span className="request-status-pill">Eligible</span>
                        </div>
                        <p>Your trek is complete. Share your experience with future travelers.</p>
                        {reviewingBookingId === booking._id ? renderReviewForm(booking) : <button
                          type="button"
                          className="view-trek-btn"
                          onClick={() => {
                            setReviewingBookingId(booking._id);
                            setReviewForm({ rating: 5, title: "", comment: "" });
                            setReviewPhotos([]);
                          }}
                        >
                          <Star size={15} /> Write a Review
                        </button>}
                      </article>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "stories" && (
              <div className="dash-tab-pane trek-story-pane">
                <div className="pane-header-flex">
                  <div>
                    <h2>My Trek Experiences</h2>
                    <p className="dash-section-desc">Share a real journey from a completed Agaaman trek. Our editorial team reviews each experience before it appears in the public journal.</p>
                  </div>
                  <span className="trek-story-status-note"><ShieldCheck size={16} /> Verified trip required</span>
                </div>

                {experienceBookings.length === 0 ? (
                  <div className="dash-empty-state">
                    <BookOpen size={36} />
                    <h4>{completedBookings.length === 0 ? "Your completed trek unlocks experiences" : "All completed treks have an experience submission"}</h4>
                    <p>{completedBookings.length === 0 ? "Once an Agaaman departure is marked complete, you can share your route, favorite moments, and advice for other trekkers." : "Each completed booking can be used for one experience. You can revise a returned submission from your list."}</p>
                    {completedBookings.length === 0 && <Link to="/treks" className="button button-orange button-small">Explore Treks</Link>}
                  </div>
                ) : (
                  <form className="trek-story-form" onSubmit={handleStorySubmit}>
                    <label className="form-field">
                      Completed trek booking
                      <select value={storyForm.bookingId} onChange={(event) => setStoryForm({ ...storyForm, bookingId: event.target.value })} required disabled={Boolean(editingStoryId)}>
                        <option value="">Choose a completed trek</option>
                        {experienceBookings.map((booking) => <option key={booking._id} value={booking._id}>{booking.trek?.title || "Himalayan Trek"} · {booking.bookingReference}</option>)}
                      </select>
                    </label>
                    <label className="form-field">
                      Experience title
                      <input value={storyForm.title} onChange={(event) => setStoryForm({ ...storyForm, title: event.target.value })} maxLength={200} placeholder="Give your journey a title" required />
                    </label>
                    <label className="form-field">
                      Your experience
                      <textarea value={storyForm.content} onChange={(event) => setStoryForm({ ...storyForm, content: event.target.value })} minLength={80} maxLength={30000} rows={9} placeholder="Tell us about the route, people, moments, and advice you would share with the next trekker..." required />
                      <small>{storyForm.content.length}/30,000 characters · At least 80 characters</small>
                    </label>
                    <label className="trek-story-upload">
                      <Upload size={19} />
                      <span><strong>Photographs</strong><small>{storyPhotos.length ? `${storyPhotos.length} selected` : editingStoryId ? "Optional · keep existing photographs or add up to 8 new ones" : "Select up to 8 JPEG, PNG, or WebP images · 5 MB each"}</small></span>
                      <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(event) => setStoryPhotos(Array.from(event.target.files || []))} required={!editingStoryId} />
                    </label>
                    <label className="form-field">
                      Video file (optional)
                      <input type="file" accept="video/mp4,video/webm" onChange={(event) => setStoryVideo(event.target.files?.[0] || null)} />
                      <small>{storyVideo ? storyVideo.name : "MP4 or WebM, up to 50 MB"}</small>
                    </label>
                    <label className="form-field">
                      Video link (optional)
                      <input type="url" value={storyForm.videoUrl} onChange={(event) => setStoryForm({ ...storyForm, videoUrl: event.target.value })} placeholder="https://youtu.be/... or https://vimeo.com/..." />
                    </label>
                    <div className="form-row">
                      <label className="form-field">
                        Instagram post (optional)
                        <input type="url" value={storyForm.instagramUrl} onChange={(event) => setStoryForm({ ...storyForm, instagramUrl: event.target.value })} placeholder="https://www.instagram.com/p/..." />
                      </label>
                      <label className="form-field">
                        Facebook post (optional)
                        <input type="url" value={storyForm.facebookUrl} onChange={(event) => setStoryForm({ ...storyForm, facebookUrl: event.target.value })} placeholder="https://www.facebook.com/..." />
                      </label>
                    </div>
                    <button className="button button-orange" type="submit" disabled={storySubmitting}>
                      {storySubmitting ? "Submitting experience..." : editingStoryId ? "Resubmit for review" : "Submit for editorial review"}
                    </button>
                    {editingStoryId && <button type="button" className="button button-secondary" onClick={() => { setEditingStoryId(null); setStoryForm({ bookingId: "", title: "", content: "", videoUrl: "", instagramUrl: "", facebookUrl: "" }); setStoryPhotos([]); setStoryVideo(null); }}>Cancel revision</button>}
                  </form>
                )}

                {myStories.length > 0 && (
                  <div className="trek-story-submissions">
                    <h3>My submissions</h3>
                    {myStories.map((story) => (
                      <article key={story._id}>
                        <div><strong>{story.title}</strong><span>{story.relatedTrek?.title || "Completed trek"}</span></div>
                        <span className={`story-status-pill is-${story.status}`}>{story.status === "pending_review" ? "Pending" : story.status === "published" ? "Published" : story.status === "rejected" ? "Rejected" : story.status === "approved" ? "Approved" : "Draft"}</span>
                        {story.moderationNote && <p>{story.moderationNote}</p>}
                        {(story.status === "rejected" || story.status === "draft") && <button type="button" className="button button-small" onClick={() => handleReviseStory(story)}>Revise experience</button>}
                      </article>
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
                  favoritesLoading ? (
                    <div className="dashboard-inline-loading" role="status">Loading your saved treks…</div>
                  ) : favoritesError ? (
                    <div className="dashboard-inline-error" role="alert">{favoritesError}</div>
                  ) : <div className="dash-empty-state">
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
