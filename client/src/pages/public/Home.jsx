import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Compass,
  HeartHandshake,
  Mail,
  MapPin,
  Mountain,
  Search,
  ShieldCheck,
  Star,
  Users,
  Utensils,
  Zap,
} from "lucide-react";
import { Page } from "../../components/common/Page.jsx";
import { TrekCard } from "../../components/trek/TrekCard.jsx";
import { useToast } from "../../context/ToastContext.jsx";
import { api } from "../../services/api.js";
import { dataStore } from "../../services/dataStore.js";

/* ─────────────────────────────────────────────
   TRUST & CREDIBILITY STRIP
───────────────────────────────────────────── */
function TrustCredibilityStrip() {
  return (
    <div className="trust-strip-v2">
      <div className="section-wrap trust-strip-inner-v2">
        <div className="trust-item-v2">
          <ShieldCheck size={22} className="trust-icon" />
          <div>
            <strong>Govt. Registered</strong>
            <small>Licensed Nepal Tourism Operator #1892</small>
          </div>
        </div>
        <div className="trust-item-v2">
          <Users size={22} className="trust-icon" />
          <div>
            <strong>100% Sherpa Led</strong>
            <small>Local Mountain Born Expedition Crew</small>
          </div>
        </div>
        <div className="trust-item-v2">
          <Star size={22} className="trust-icon" fill="#f59e0b" color="#f59e0b" />
          <div>
            <strong>4.95 / 5 Rating</strong>
            <small>Over 1,400+ Satisfied Alpine Trekkers</small>
          </div>
        </div>
        <div className="trust-item-v2">
          <HeartHandshake size={22} className="trust-icon" />
          <div>
            <strong>Fair Porter Ethics</strong>
            <small>IPPG 100% Welfare & Insurance Compliant</small>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO SLIDER DATA & COMPONENT WITH DISCOVERY TOOL
───────────────────────────────────────────── */
const heroSlides = [
  {
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85",
    label: "Everest Base Camp & Kala Patthar",
    subtitle: "Khumbu Glacier & 8,848m Summit Panorama",
    region: "Khumbu",
  },
  {
    url: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=2000&q=85",
    label: "Annapurna Sanctuary & Thorong La",
    subtitle: "Golden Sunrise over Dhaulagiri & Machhapuchhre",
    region: "Annapurna",
  },
  {
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=85",
    label: "Langtang Valley & Kyanjin Ri",
    subtitle: "Living Tamang Heritage & Glacial Valleys",
    region: "Langtang",
  },
  {
    url: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=2000&q=85",
    label: "Gokyo Lakes & Cho La Pass",
    subtitle: "Sacred Turquoise Alpine Waters & Ngozumpa Glacier",
    region: "Khumbu",
  },
];

function HomeHero({ counts }) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);

  const total = heroSlides.length;

  const goTo = (idx) => {
    setCurrent(idx);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 6000);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % total);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, [total]);

  return (
    <section className="home-hero-slider">
      {heroSlides.map((slide, idx) => (
        <div
          key={idx}
          className={`hero-slide${current === idx ? " is-active" : ""}`}
          style={{ backgroundImage: `url("${slide.url}")` }}
          aria-hidden={current !== idx}
        />
      ))}

      <div className="hero-slider-overlay" />

      <div className="section-wrap hero-slider-content" style={{ paddingLeft: "5%", paddingRight: "5%" }}>
        <div className="hero-text-left" style={{ maxWidth: "780px" }}>
          <span className="hero-kicker-tag">
            Authentic Himalayan Expeditions · Local Sherpa Guided · 2026 Season
          </span>

          <h1>
            Discover the<br />
            <em>Pinnacles of Nepal</em><br />
            <span className="hero-h1-accent">on Foot.</span>
          </h1>

          <p className="hero-subtext">
            No rushed tourist itineraries. Authentic trails, raw mountain majesty, and intimate journeys
            guided safely by native Sherpas who call these soaring peaks home.
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
              <strong>{counts.destinations ?? "—"}</strong>
              <span>Destinations</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>{counts.regions ?? "—"}</strong>
              <span>Regions</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>{counts.treks ?? "—"}</strong>
              <span>Treks</span>
            </div>
          </div>
        </div>

        <div className="hero-slide-label">
          <span className="slide-location-name">{heroSlides[current].label}</span>
          <span className="slide-location-sub">{heroSlides[current].subtitle}</span>
        </div>
      </div>

      <div className="hero-slider-dots">
        {heroSlides.map((_, idx) => (
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
   MAIN HOMEPAGE
───────────────────────────────────────────── */
export function HomePage() {
  const notify = useToast();

  // Dynamic ranking states fetched from MongoDB
  const [popularTreks, setPopularTreks] = useState([]);
  const [featuredTreks, setFeaturedTreks] = useState([]);
  const [topRatedTreks, setTopRatedTreks] = useState([]);
  const [loadingRankings, setLoadingRankings] = useState(true);
  const [catalogTreks, setCatalogTreks] = useState([]);
  const [regions, setRegions] = useState([]);
  const [homeCounts, setHomeCounts] = useState({ destinations: null, regions: null, treks: null });
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);

  // Newsletter subscription
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setLoadingRankings(true);

    Promise.allSettled([
      api.rankings.getPopular({ limit: 6 }),
      api.rankings.getFeatured({ limit: 6 }),
      api.rankings.getTopRated({ limit: 6, minReviewsThreshold: 1 }),
    ]).then(([popRes, featRes, topRes]) => {
      if (!isMounted) return;

      const fallbackTreks = dataStore.getTreks();

      if (popRes.status === "fulfilled" && Array.isArray(popRes.value?.treks) && popRes.value.treks.length > 0) {
        setPopularTreks(popRes.value.treks);
      } else {
        setPopularTreks(fallbackTreks.slice(0, 6));
      }

      if (featRes.status === "fulfilled" && Array.isArray(featRes.value?.treks) && featRes.value.treks.length > 0) {
        setFeaturedTreks(featRes.value.treks);
      } else {
        const feat = fallbackTreks.filter((t) => t.featured);
        setFeaturedTreks(feat.length > 0 ? feat : fallbackTreks.slice(0, 6));
      }

      if (topRes.status === "fulfilled" && Array.isArray(topRes.value?.treks) && topRes.value.treks.length > 0) {
        setTopRatedTreks(topRes.value.treks);
      } else {
        const sorted = [...fallbackTreks].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        setTopRatedTreks(sorted.slice(0, 6));
      }
      setLoadingRankings(false);
    }).catch(() => {
      if (!isMounted) return;
      const fallbackTreks = dataStore.getTreks();
      setPopularTreks(fallbackTreks.slice(0, 6));
      setFeaturedTreks(fallbackTreks.filter((t) => t.featured).slice(0, 6));
      setTopRatedTreks(fallbackTreks.slice(0, 6));
      setLoadingRankings(false);
    });

    api.treks.getAll({ limit: 100 }).then((res) => {
      if (isMounted && Array.isArray(res?.treks)) {
        setCatalogTreks(res.treks);
        setHomeCounts((current) => ({ ...current, treks: res.total ?? res.treks.length }));
      }
    }).catch((error) => console.error("Unable to load trek catalog:", error));
    api.regions.getAll().then((res) => {
      if (isMounted && Array.isArray(res?.regions)) {
        setRegions(res.regions);
        setHomeCounts((current) => ({ ...current, regions: res.regions.length }));
      }
    }).catch((error) => console.error("Unable to load regions:", error));
    api.destinations.getAll().then((res) => {
      if (isMounted && Array.isArray(res?.destinations)) {
        setHomeCounts((current) => ({ ...current, destinations: res.destinations.length }));
      }
    }).catch((error) => console.error("Unable to load destinations:", error));
    api.reviews.getApproved({ limit: 3 }).then((res) => {
      if (isMounted && Array.isArray(res?.reviews)) {
        setTestimonials(res.reviews.map((review) => ({
          id: review._id,
          name: review.name || review.user?.name || "Verified Trekker",
          country: review.user?.nationality || "Verified trekker",
          trek: review.trek?.title || "Completed trek",
          title: review.title,
          comment: review.comment,
          rating: Math.min(5, Math.max(1, Math.round(Number(review.rating) || 0))),
        })));
      }
    }).catch((error) => {
      console.error("Unable to load approved reviews:", error);
    }).finally(() => {
      if (isMounted) setLoadingTestimonials(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

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
      <HomeHero counts={homeCounts} />
      <TrustCredibilityStrip />

      {/* ════════════════════════════════════════════════════════
          DISCOVERY SECTION 1: MOST POPULAR TREKS
          Driven by Weighted Popularity Algorithm:
          Score = (Confirmed Bookings × 5) + (Unique Views × 1) + (Wishlists × 2) + (Approved Reviews × 3)
         ════════════════════════════════════════════════════════ */}
      <section className="section-wrap discovery-section popular-treks-section" id="popular">
        <div className="section-title-center">
          <h2 className="main-section-title">
            Nepal's Most <span>Popular Treks</span>
          </h2>
          <p className="section-intro-p">
            Ranked dynamically by verified booking volume, trekker wishlists, authentic reviews, and real trail interest.
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
            <p>Our trails are getting geared up for the new season.</p>
          </div>
        )}

        <div className="center-view-all">
          <Link to="/treks?sort=popular" className="hero-primary-btn">
            View All Trending Expeditions <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          DISCOVERY SECTION 2: ADMIN-CONTROLLED FEATURED TREKS
          Driven by manual display order and admin flagship flags
         ════════════════════════════════════════════════════════ */}
      <section className="section-wrap discovery-section featured-treks-section" id="featured">
        <div className="section-title-center">
          <h2 className="main-section-title">
            Featured <span>Himalayan Journeys</span>
          </h2>
          <p className="section-intro-p">
            Hand-selected by our IFMGA certified expedition leaders for quintessential vistas, cultural depth, and unmatched high-altitude memories.
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
          {regionCards.map((item) => (
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
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          DISCOVERY SECTION 3: TOP RATED TREKS
          Driven by Verified Customer Reviews with Minimum Threshold
         ════════════════════════════════════════════════════════ */}
      <section className="section-wrap discovery-section top-rated-treks-section" id="top-rated">
        <div className="section-title-center">
          <h2 className="main-section-title">
            Top Rated <span>Customer Favorites</span>
          </h2>
          <p className="section-intro-p">
            Calculated dynamically from verified, approved traveler reviews with rigorous safety and service satisfaction scores.
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
        ) : null}

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
            <h2 className="main-section-title">
              Why Trek With <span>Agaaman?</span>
            </h2>
            <p className="section-intro-p">
              We never broker your trip to anonymous subcontractors. Every single departure is led
              by our veteran, certified Sherpa guides who grew up among these 8,000-meter peaks.
            </p>
          </div>

          <div className="why-us-grid">
            <div className="why-card">
              <div className="why-icon-box"><ShieldCheck size={28} /></div>
              <h3>Wilderness Medicine & Pulse Oximeters</h3>
              <p>Daily biometric monitoring, altitude protocols, Gamow bags, and 24/7 direct helicopter evacuation coordination guarantee your safety.</p>
            </div>
            <div className="why-card">
              <div className="why-icon-box"><Users size={28} /></div>
              <h3>Intimate Small Groups (Max 10-12)</h3>
              <p>Never get lost in a crowded tourist herd. High guide-to-client ratios provide personal pacing, flexible photo stops, and genuine Sherpa stories.</p>
            </div>
            <div className="why-card">
              <div className="why-icon-box"><Utensils size={28} /></div>
              <h3>Best Teahouses & Wholesome Meals</h3>
              <p>Rest in top local mountain lodges with warm bukhari stoves. Enjoy clean, freshly prepared meals with organic Himalayan vegetables and pure water.</p>
            </div>
            <div className="why-card">
              <div className="why-icon-box"><HeartHandshake size={28} /></div>
              <h3>Ethical Porter Welfare Guarantee</h3>
              <p>We honor our porters with fair living wages, comprehensive mountain medical insurance, insulated clothing, and strictly capped pack weights.</p>
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
        ) : testimonials.length > 0 ? (
          <div className="testimonials-grid">
          {testimonials.map((rev) => (
            <div key={rev.id} className="testimonial-card">
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
            <p>No approved trek reviews yet. Completed trekkers’ approved reviews will appear here.</p>
          </div>
        )}
      </section>

      {/* ════════════════════════════════════════════════════════
          NEWSLETTER & TRAIL ADVISORY
         ════════════════════════════════════════════════════════ */}
      <section className="newsletter-section">
        <div className="section-wrap newsletter-inner">
          <div className="newsletter-text">
            <span className="sub-badge-pill" style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
              TRAIL INTELLIGENCE
            </span>
            <h2>Join the Himalayan Dispatch</h2>
            <p>
              Receive seasonal weather windows, new route permits, altitude packing checklists, and private fixed-departure discounts straight from Kathmandu.
            </p>
          </div>

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
