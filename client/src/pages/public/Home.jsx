import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Compass,
  Flame,
  HeartHandshake,
  Mail,
  MapPin,
  Mountain,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Utensils,
} from "lucide-react";
import { Page } from "../../components/common/Page.jsx";
import { TrekCard } from "../../components/trek/TrekCard.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { api } from "../../services/api.js";

/* ─────────────────────────────────────────────
   TRUST & CREDIBILITY STRIP
───────────────────────────────────────────── */
function TrustCredibilityStrip({ treks, destinations, regions, departures, loading }) {
  const metrics = [
    { value: treks, label: "Published treks" },
    { value: destinations, label: "Destinations" },
    { value: regions, label: "Regions" },
    { value: departures, label: "Scheduled departures" },
  ];

  return (
    <div className="trust-strip-v2">
      <div className="section-wrap trust-strip-inner-v2">
        {metrics.map((metric, index) => {
          const Icon = [Mountain, MapPin, Compass, Calendar][index];
          return (
            <div className="trust-item-v2" key={metric.label}>
              <Icon size={22} className="trust-icon" />
              <div>
                <strong>{loading ? "—" : metric.value}</strong>
                <small>{metric.label}</small>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO SLIDER DATA & COMPONENT WITH DISCOVERY TOOL
───────────────────────────────────────────── */
function HomeHero({ slides, metrics, loading }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const total = slides.length;

  const goTo = (idx) => {
    setCurrent(idx);
    if (timerRef.current) clearInterval(timerRef.current);
    if (total > 1) {
      timerRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % total);
      }, 6000);
    }
  };

  useEffect(() => {
    setCurrent(0);
    if (total > 1) {
      timerRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % total);
      }, 6000);
    }
    return () => clearInterval(timerRef.current);
  }, [total]);

  return (
    <section className="home-hero-slider">
      {slides.map((slide, idx) => (
        <div
          key={slide._id || slide.slug}
          className={`hero-slide${current === idx ? " is-active" : ""}`}
          style={{
            backgroundImage: slide.images?.[0] || slide.image
              ? `url("${slide.images?.[0] || slide.image}")`
              : undefined,
          }}
          aria-hidden={current !== idx}
        />
      ))}

      <div className="hero-slider-overlay" />

      <div className="section-wrap hero-slider-content" style={{ paddingLeft: "5%", paddingRight: "5%" }}>
        <div className="hero-text-left" style={{ maxWidth: "780px" }}>
          <span className="hero-kicker-tag">
            Published Himalayan routes · Database-backed trip details
          </span>

          <h1>
            Discover the<br />
            <em>Pinnacles of Nepal</em><br />
            <span className="hero-h1-accent">on Foot.</span>
          </h1>

          <p className="hero-subtext">
            Explore published itineraries, compare destinations, and review route details maintained in our trek catalog.
          </p>

          <div className="hero-cta-row">
            <Link to="/treks" className="hero-primary-btn">
              Explore All Treks <ArrowRight size={20} />
            </Link>
            <Link to="/customize-trip" className="hero-secondary-btn">
              Tailor-Made Expedition ↗
            </Link>
          </div>

          <div className="hero-stats-row">
            <div className="hero-stat">
              <strong>{loading ? "—" : metrics.treks}</strong>
              <span>Published treks</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>{loading ? "—" : metrics.destinations}</strong>
              <span>Destinations</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>{loading ? "—" : metrics.regions}</strong>
              <span>Regions</span>
            </div>
          </div>
        </div>

        <div className="hero-slide-label">
          {slides[current] && (
            <>
              <span className="slide-location-name">{slides[current].title}</span>
              <span className="slide-location-sub">
                {[slides[current].region, slides[current].duration ? `${slides[current].duration} days` : ""]
                  .filter(Boolean)
                  .join(" · ")}
              </span>
            </>
          )}
        </div>
      </div>

      <div className="hero-slider-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            className={`slider-dot${current === idx ? " is-active" : ""}`}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   ADVENTURE CATEGORIES / EXPEDITION STYLES
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   CUSTOMER TESTIMONIALS
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   MAIN HOMEPAGE
───────────────────────────────────────────── */
export function HomePage() {
  const notify = useToast();

  // Dynamic ranking states fetched from MongoDB
  const [popularTreks, setPopularTreks] = useState([]);
  const [featuredTreks, setFeaturedTreks] = useState([]);
  const [topRatedTreks, setTopRatedTreks] = useState([]);
  const [catalogTreks, setCatalogTreks] = useState([]);
  const [regions, setRegions] = useState([]);
  const [destinationCount, setDestinationCount] = useState(0);
  const [departureCount, setDepartureCount] = useState(0);
  const [loadingRankings, setLoadingRankings] = useState(true);
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  // Newsletter subscription
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoadingRankings(true);

    // Fetch dynamic rankings
    Promise.allSettled([
      api.rankings.getPopular({ limit: 6 }),
      api.rankings.getFeatured({ limit: 6 }),
      api.rankings.getTopRated({ limit: 6, minReviewsThreshold: 1 }),
      api.treks.getAll({ limit: 100 }),
      api.regions.getAll(),
      api.destinations.getAll(),
      api.departures.getAll(),
    ]).then(([popRes, featRes, topRes, catalogRes, regionRes, destinationRes, departureRes]) => {
      if (!isMounted) return;

      const readTreks = (result, label) => {
        if (result.status === "rejected") {
          console.error(`Unable to load ${label} from the database:`, result.reason);
          return [];
        }
        return Array.isArray(result.value?.treks) ? result.value.treks : [];
      };
      setPopularTreks(readTreks(popRes, "popular treks"));
      setFeaturedTreks(readTreks(featRes, "featured treks"));
      setTopRatedTreks(readTreks(topRes, "top-rated treks"));
      setCatalogTreks(readTreks(catalogRes, "trek catalog"));
      if (regionRes.status === "fulfilled" && Array.isArray(regionRes.value?.regions)) {
        setRegions(regionRes.value.regions);
      } else {
        console.error("Unable to load regions from the database:", regionRes.reason);
        setRegions([]);
      }
      if (destinationRes.status === "fulfilled" && Array.isArray(destinationRes.value?.destinations)) {
        setDestinationCount(destinationRes.value.destinations.length);
      } else {
        console.error("Unable to load destinations from the database:", destinationRes.reason);
      }
      if (departureRes.status === "fulfilled" && Array.isArray(departureRes.value?.departures)) {
        setDepartureCount(departureRes.value.departures.length);
      } else {
        console.error("Unable to load departures from the database:", departureRes.reason);
      }
      setLoadingRankings(false);
    }).catch((error) => {
      if (!isMounted) return;
      console.error("Unable to load homepage data from the database:", error);
      setPopularTreks([]);
      setFeaturedTreks([]);
      setTopRatedTreks([]);
      setCatalogTreks([]);
      setRegions([]);
      setLoadingRankings(false);
    });

    // Fetch dynamic approved customer reviews from MongoDB
    api.reviews.getApproved({ limit: 3 })
      .then((res) => {
        if (!isMounted) return;
        if (res.success && Array.isArray(res.reviews)) {
          setTestimonials(res.reviews.map((r) => ({
            name: r.name || r.user?.name || "Himalayan Adventurer",
            country: r.verificationStatus === "Verified Trekker"
              ? "Verified trekker"
              : r.user?.nationality || "Unverified review",
            trek: r.trek?.title || "Nepal Expedition",
            title: r.title,
            comment: r.comment,
            rating: Math.min(5, Math.max(1, Math.round(Number(r.rating)))),
          })));
        }
      })
      .catch((error) => {
        console.error("Unable to load approved reviews from the database:", error);
        if (isMounted) setTestimonials([]);
      })
      .finally(() => {
        if (isMounted) setLoadingTestimonials(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const heroSlides = featuredTreks.length ? featuredTreks : popularTreks;
  const regionCards = regions.map((region) => {
    const regionName = region.name?.toLowerCase();
    const regionTreks = regionName
      ? catalogTreks.filter((trek) => trek.region?.toLowerCase().includes(regionName))
      : [];
    return {
      ...region,
      image: region.image || regionTreks[0]?.images?.[0] || "",
      trekCount: regionTreks.length,
    };
  });

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes("@")) {
      notify("Please provide a valid email address.");
      return;
    }
    setSubscribed(true);
    notify("Thank you for subscribing to our Himalayan dispatch!");
  };

  return (
    <Page className="home-page-v2">
      <HomeHero
        slides={heroSlides}
        metrics={{
          treks: catalogTreks.length,
          destinations: destinationCount,
          regions: regions.length,
        }}
        loading={loadingRankings}
      />
      <TrustCredibilityStrip
        treks={catalogTreks.length}
        destinations={destinationCount}
        regions={regions.length}
        departures={departureCount}
        loading={loadingRankings}
      />

      {/* ════════════════════════════════════════════════════════
          DISCOVERY SECTION 1: MOST POPULAR TREKS
          Driven by Weighted Popularity Algorithm:
          Score = (Confirmed Bookings × 5) + (Unique Views × 1) + (Wishlists × 2) + (Approved Reviews × 3)
         ════════════════════════════════════════════════════════ */}
      <section className="section-wrap discovery-section popular-treks-section" id="popular">
        <div className="section-title-center">
          <div className="section-badge-row">
            <span className="sub-badge-pill">
              <Flame size={14} className="inline-icon" fill="currentColor" />
            </span>
            <span className="algorithm-hint-pill" title="Formula: (Confirmed Bookings × 5) + (Unique Views × 1) + (Wishlists × 2) + (Approved Reviews × 3)">

            </span>
          </div>

          <h2 className="main-section-title">
            Nepal's Most <span>Popular Treks</span>
          </h2>
          <p className="section-intro-p">
            Popularity reflects confirmed bookings, unique views, wishlists, and approved reviews when activity is available.
          </p>
        </div>

        {loadingRankings && popularTreks.length === 0 ? (
          <div className="ranking-loading-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="trek-skeleton-card" />
            ))}
          </div>
        ) : popularTreks.length > 0 ? (
          <div className="best-selling-grid">
            {popularTreks.map((trek) => (
              <TrekCard key={trek.slug || trek._id} trek={trek} badge="Popular" />
            ))}
          </div>
        ) : (
          <div className="empty-discovery-notice">
            <p>Popularity rankings will appear when published treks have recorded activity.</p>
          </div>
        )}

        <div className="center-view-all">
          <Link to="/treks?sort=popular" className="hero-primary-btn">
            Explore All Treks <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          DISCOVERY SECTION 2: ADMIN-CONTROLLED FEATURED TREKS
          Driven by manual display order and admin flagship flags
         ════════════════════════════════════════════════════════ */}
      <section className="section-wrap discovery-section featured-treks-section" id="featured">
        <div className="section-title-center">
          <div className="section-badge-row">
            <span className="sub-badge-pill" style={{ background: "#dbeafe", color: "#1d4ed8" }}>
              <Sparkles size={14} className="inline-icon" />
            </span>
          </div>

          <h2 className="main-section-title">
            Featured <span>Himalayan Journeys</span>
          </h2>
          <p className="section-intro-p">
            Featured routes are selected and ordered in the administrator console.
          </p>
        </div>

        {loadingRankings && featuredTreks.length === 0 ? (
          <div className="ranking-loading-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="trek-skeleton-card" />
            ))}
          </div>
        ) : featuredTreks.length > 0 ? (
          <div className="best-selling-grid">
            {featuredTreks.map((trek) => (
              <TrekCard key={trek.slug || trek._id} trek={trek} badge="Featured" />
            ))}
          </div>
        ) : null}

        <div className="center-view-all">
          <Link to="/treks" className="hero-secondary-btn" style={{ borderColor: "#083c34", color: "#083c34" }}>
            Explore Full Himalayan Catalog <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          ADVENTURE CATEGORIES / STYLES
         ════════════════════════════════════════════════════════ */}
      <section className="section-wrap adventure-styles-section">
        <div className="section-title-center">
          <span className="sub-badge-pill"></span>
          <h2 className="main-section-title">
            Find Your <span>Mountain Calling</span>
          </h2>
          <p className="section-intro-p">
            Explore routes grouped by the regions configured in the database.
          </p>
        </div>

        <div className="styles-grid">
          {regionCards.map((item) => {
            return (
              <Link to={`/regions/${item.slug}`} key={item._id || item.slug} className="style-card-item">
                <div className="style-card-bg" style={item.image ? { backgroundImage: `url("${item.image}")` } : undefined} />
                <div className="style-card-overlay" />
                <div className="style-card-content">
                  <div className="style-icon-bubble">
                    <Mountain size={24} />
                  </div>
                  <h3>{item.label || item.name}</h3>
                  <span className="style-routes-label">{item.trekCount} published routes</span>
                  <p>{item.description}</p>
                  <span className="style-link-action">
                    Browse Routes <ChevronRight size={16} />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          DISCOVERY SECTION 3: TOP RATED TREKS
          Driven by Verified Customer Reviews with Minimum Threshold
         ════════════════════════════════════════════════════════ */}
      <section className="section-wrap discovery-section top-rated-treks-section" id="top-rated">
        <div className="section-title-center">
          <div className="section-badge-row">
            <span className="sub-badge-pill" style={{ background: "#fef3c7", color: "#b45309" }}>
              <Star size={14} className="inline-icon" fill="currentColor" />
            </span>
          </div>

          <h2 className="main-section-title">
            Top Rated <span>Customer Favorites</span>
          </h2>
          <p className="section-intro-p">
            Ordered by approved reviews linked to completed, verified bookings.
          </p>
        </div>

        {loadingRankings && topRatedTreks.length === 0 ? (
          <div className="ranking-loading-grid">
            {[1, 2, 3].map((i) => (
              <div key={i} className="trek-skeleton-card" />
            ))}
          </div>
        ) : topRatedTreks.length > 0 ? (
          <div className="best-selling-grid">
            {topRatedTreks.map((trek) => (
              <TrekCard key={trek.slug || trek._id} trek={trek} badge="Top Rated" />
            ))}
          </div>
        ) : (
          <p className="testimonials-empty-state">Top-rated treks will appear after completed travelers submit approved reviews.</p>
        )}

        <div className="center-view-all">
          <Link to="/treks?sort=rating" className="hero-primary-btn">
            View All Top Rated Routes <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          WHY CHOOSE US: SHERPA SAFETY & HERITAGE
         ════════════════════════════════════════════════════════ */}
      <section className="why-us-section">
        <div className="section-wrap">
          <div className="section-title-center">
            <span className="sub-badge-pill">PLAN WITH CLEAR INFORMATION</span>
            <h2 className="main-section-title">
              Why Trek With <span>Agaaman?</span>
            </h2>
            <p className="section-intro-p">
              Review the published trek details, regions, prices, and available departure dates before deciding which route suits you.
            </p>
          </div>

          <div className="why-us-grid">
            <div className="why-card">
              <div className="why-icon-box"><ShieldCheck size={28} /></div>
              <h3>Route Details</h3>
              <p>Each published trek includes its listed duration, difficulty, maximum elevation, route notes, and price.</p>
            </div>
            <div className="why-card">
              <div className="why-icon-box"><Users size={28} /></div>
              <h3>Destination Information</h3>
              <p>Explore the destinations and regions associated with the routes in the current catalog.</p>
            </div>
            <div className="why-card">
              <div className="why-icon-box"><Utensils size={28} /></div>
              <h3>Departure Dates</h3>
              <p>Scheduled dates and availability are shown when they are listed for a published trek.</p>
            </div>
            <div className="why-card">
              <div className="why-icon-box"><HeartHandshake size={28} /></div>
              <h3>Approved Traveler Reviews</h3>
              <p>Published reviews appear after approval. Review counts and ratings are based on the records currently available.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          CUSTOMER TESTIMONIALS
         ════════════════════════════════════════════════════════ */}
      <section className="section-wrap testimonials-section">
        <div className="section-title-center">
          <span className="sub-badge-pill">TREKKER EXPERIENCES</span>
          <h2 className="main-section-title">
            Words From <span>The High Trails</span>
          </h2>
          <p className="section-intro-p">
            Approved feedback from travelers. Verified trekker reviews are linked to completed bookings.
          </p>
        </div>

        {loadingTestimonials ? (
          <p className="testimonials-empty-state" role="status">Loading approved traveler reviews…</p>
        ) : testimonials.length ? (
          <div className="testimonials-grid">
          {testimonials.map((rev, idx) => (
            <div key={idx} className="testimonial-card">
              <div className="testimonial-rating">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />
                ))}
              </div>
              {rev.title && <h3 className="testimonial-title">{rev.title}</h3>}
              <p className="testimonial-comment">"{rev.comment}"</p>
              <div className="testimonial-author">
                <div className="author-avatar-badge">
                  {rev.name.charAt(0)}
                </div>
                <div>
                  <strong>{rev.name}</strong>
                  <span className="author-country">{rev.country}</span>
                  <span className="author-trek-tag">{rev.trek}</span>
                </div>
              </div>
            </div>
          ))}
          </div>
        ) : (
          <div className="testimonials-empty-state">
            <Star size={22} />
            <p>No approved trek reviews yet. Complete a trek to share your experience.</p>
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════
          NEWSLETTER & TRAIL ADVISORY
         ════════════════════════════════════════════════════════ */}
      <section className="newsletter-section">
        <div className="section-wrap newsletter-inner">


          <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
            <div className="newsletter-input-group">
              <Mail size={18} className="mail-icon" />
              <input
                type="email"
                placeholder="Enter your email address..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                disabled={subscribed}
                required
              />
              <button type="submit" className="newsletter-submit-btn" disabled={subscribed}>
                {subscribed ? "Subscribed!" : "Subscribe"}
              </button>
            </div>
            <small className="newsletter-privacy-note">
              No spam, ever. Unsubscribe with a single click whenever you wish.
            </small>
          </form>
        </div>
      </section>
    </Page>
  );
}

export default HomePage;
