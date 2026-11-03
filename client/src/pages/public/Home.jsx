import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Award,
  Calendar,
  CheckCircle2,
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

function HomeHero() {
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

          {/* Real Credibility Stats */}
          <div className="hero-stats-row">
            <div className="hero-stat">
              <strong>1,400+</strong>
              <span>Happy Trekkers</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>18+</strong>
              <span>Years on Trail</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>100%</strong>
              <span>Local Sherpa Staff</span>
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
const adventureStyles = [
  {
    title: "High Alpine Passes",
    count: "Cho La, Thorong La, Larkya La",
    icon: Mountain,
    desc: "Rigorous passes above 5,000m delivering panoramic ridge lines.",
    to: "/treks?difficulty=Challenging",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Base Camp Treks",
    count: "Everest, Annapurna, Makalu",
    icon: Compass,
    desc: "Iconic journeys directly to the foot of world-famous summits.",
    to: "/treks?search=base%20camp",
    image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Sacred Glacial Lakes",
    count: "Gokyo & Gosainkunda",
    icon: Sparkles,
    desc: "High altitude turquoise glacial tarns and pilgrimage waters.",
    to: "/treks?search=lakes",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "Scenic Teahouse Journeys",
    count: "Poon Hill, Langtang Valley",
    icon: Utensils,
    desc: "Gentle mountain ascents with warm lodge hospitality & rhododendrons.",
    to: "/treks?duration=1–6%20days",
    image: "https://images.unsplash.com/photo-1585409677983-0f6c41ca9c3b?auto=format&fit=crop&w=600&q=80",
  },
];

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
        setTopRatedTreks([]);
      }
      setLoadingRankings(false);
    }).catch(() => {
      if (!isMounted) return;
      const fallbackTreks = dataStore.getTreks();
      setPopularTreks(fallbackTreks.slice(0, 6));
      setFeaturedTreks(fallbackTreks.filter((t) => t.featured).slice(0, 6));
      setTopRatedTreks([]);
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
      .catch(() => {
        if (isMounted) setTestimonials([]);
      })
      .finally(() => {
        if (isMounted) setLoadingTestimonials(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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
      <HomeHero />
      <TrustCredibilityStrip />

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
          <div className="section-badge-row">
            <span className="sub-badge-pill" style={{ background: "#dbeafe", color: "#1d4ed8" }}>
              <Sparkles size={14} className="inline-icon" />
            </span>
          </div>

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
            From high glaciated mountain crossings to peaceful monastery paths, find the expedition tailored to your fitness and ambition.
          </p>
        </div>

        <div className="styles-grid">
          {adventureStyles.map((item) => {
            const Icon = item.icon;
            return (
              <Link to={item.to} key={item.title} className="style-card-item">
                <div className="style-card-bg" style={{ backgroundImage: `url("${item.image}")` }} />
                <div className="style-card-overlay" />
                <div className="style-card-content">
                  <div className="style-icon-bubble">
                    <Icon size={24} />
                  </div>
                  <h3>{item.title}</h3>
                  <span className="style-routes-label">{item.count}</span>
                  <p>{item.desc}</p>
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
            <span className="sub-badge-pill">THE LOCAL ADVANTAGE</span>
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
