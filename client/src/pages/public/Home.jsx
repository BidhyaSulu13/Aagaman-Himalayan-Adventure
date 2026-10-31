import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  HeartHandshake,
  ShieldCheck,
  Star,
  Users,
  Utensils
} from "lucide-react";
import { Page } from "../../components/common/Page.jsx";
import { TrekCard } from "../../components/trek/TrekCard.jsx";
import { useArticles, useDepartures, useRegions, useTreks } from "../../hooks/useDataStore.js";

/* ─────────────────────────────────────────────
   TRUST STRIP
───────────────────────────────────────────── */
function TrustCredibilityStrip() {
  return (
    <div className="trust-strip-v2">
      <div className="section-wrap trust-strip-inner-v2">
        <div className="trust-item-v2">
          <ShieldCheck size={22} className="trust-icon" />
          <div>
            <strong>Govt. Registered</strong>
            <small>Licensed Nepal Trekking Operator</small>
          </div>
        </div>
        <div className="trust-item-v2">
          <Users size={22} className="trust-icon" />
          <div>
            <strong>Local Sherpa Team</strong>
            <small>Experienced Mountain Born Guides</small>
          </div>
        </div>
        <div className="trust-item-v2">
          <Star size={22} className="trust-icon" fill="#f59e0b" color="#f59e0b" />
          <div>
            <strong>4.95 / 5 Rating</strong>
            <small>Over 1,400+ Satisfied Trekkers</small>
          </div>
        </div>
        <div className="trust-item-v2">
          <HeartHandshake size={22} className="trust-icon" />
          <div>
            <strong>Fair Porter Ethics</strong>
            <small>IPPG 100% Welfare Adherent</small>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   HERO SLIDER DATA
───────────────────────────────────────────── */
const heroSlides = [
  {
    url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=2000&q=85",
  },
  {
    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzPhTTJoIYcXSjdtUSlXILMpI73TQjbuQKqKyp5rkJSfHqvhrPtX-lUJ0Q&s=10",
  },
  {
    url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=2000&q=85",
  },
  {
    url: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=2000&q=85",
  }
];

/* ─────────────────────────────────────────────
   HERO COMPONENT — Balanced Offset & Humanized Copy
───────────────────────────────────────────── */
function HomeHero() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const total = heroSlides.length;

  const goTo = (idx) => {
    setCurrent(idx);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % total);
    }, 5500);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % total);
    }, 5500);
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

      {/* Balanced container with professional left padding offset */}
      <div className="section-wrap hero-slider-content" style={{ paddingLeft: "5%", paddingRight: "5%" }}>
        <div className="hero-text-left" style={{ maxWidth: "680px" }}>
          <span className="hero-kicker-tag">
            🏔️ Himalayan Adventure · Born in the Mountains · Real Local Guides
          </span>

          <h1>
            Discover the<br />
            <em>Heart of Nepal</em><br />
            <span className="hero-h1-accent">on Foot.</span>
          </h1>

          <p className="hero-subtext">
            No rushed tourist checklists or crowded itineraries. Just honest trails, raw mountain beauty, and deep connections built alongside guides who call these ridges home.
          </p>

          <div className="hero-cta-row">
            <Link to="/treks" className="hero-primary-btn">
              Explore All Treks <ArrowRight size={20} />
            </Link>
            <Link to="/contact" className="hero-secondary-btn">
              Plan My Trek ↗
            </Link>
          </div>

          <div className="hero-stats-row">
            <div className="hero-stat">
              <strong>1,400+</strong>
              <span>Happy Trekkers</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>18+</strong>
              <span>Years Experience</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <strong>40+</strong>
              <span>Unique Routes</span>
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
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────── */
export function HomePage() {
  const treks = useTreks();
  const articles = useArticles();
  const departures = useDepartures();
  const regions = useRegions();

  const [activeRegion, setActiveRegion] = useState("All");

  const filterTabs = [
    { label: "All Packages", val: "All" },
    ...regions.map((r) => ({
      label: r.label,
      val: r.match[0] || r.id,
    })),
  ];

  const filteredTreks = treks.filter((t) => {
    if (activeRegion === "All") return true;
    return (
      t.region?.toLowerCase().includes(activeRegion.toLowerCase()) ||
      t.location?.toLowerCase().includes(activeRegion.toLowerCase())
    );
  });

  return (
    <Page className="home-page-v2">
      <HomeHero />
      <TrustCredibilityStrip />

      {/* ── BEST SELLING PACKAGES ────────────────── */}
      <section className="section-wrap best-selling-section" id="packages">
        <div className="section-title-center">
          <span className="sub-badge-pill">NEPAL'S MOST POPULAR TRAILS</span>
          <h2 className="main-section-title">
            Signature <span>Himalayan Journeys</span>
          </h2>
          <p className="section-intro-p">
            Explore our handcrafted, top-rated journeys trusted by over 1,400 trekkers worldwide.
            Each route is guided by our certified Sherpa team.
          </p>
        </div>

        <div className="package-tabs-row">
          {filterTabs.map((tab) => (
            <button
              key={tab.val}
              type="button"
              className={`package-tab-btn${activeRegion === tab.val ? " is-active" : ""}`}
              onClick={() => setActiveRegion(tab.val)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="best-selling-grid">
          {filteredTreks.slice(0, 8).map((trek) => (
            <TrekCard key={trek.slug} trek={trek} />
          ))}
        </div>

        <div className="center-view-all">
          <Link to="/treks" className="hero-primary-btn">
            View All 2026–2027 Packages <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ── GROUP JOINING TREKS / FIXED DEPARTURES ─ */}
      <section className="group-departures-section" id="group-departures">
        <div className="section-wrap">
          <div className="section-title-center">
            <span className="sub-badge-pill">GUARANTEED DEPARTURES</span>
            <h2 className="main-section-title">
              Group Joining <span>Treks & Fixed Dates</span>
            </h2>
            <p className="section-intro-p">
              Join a small group, save up to 25%, and meet fellow trekkers from around the globe.
              All dates are guaranteed once confirmed.
            </p>
          </div>

          <div className="departures-table-card">
            <div className="table-responsive-wrap">
              <table className="home-departures-table">
                <thead>
                  <tr>
                    <th>Trek Package</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Status</th>
                    <th>Price / PAX</th>
                    <th>Seats Left</th>
                    <th>Booking</th>
                  </tr>
                </thead>
                <tbody>
                  {departures.map((dep) => (
                    <tr key={dep.id}>
                      <td>
                        <Link to={`/treks/${dep.trekSlug}`} className="dep-trek-title">
                          {dep.trekTitle}
                        </Link>
                      </td>
                      <td><strong>{dep.startDate}</strong></td>
                      <td>{dep.endDate}</td>
                      <td>
                        <span className={`status-pill status-${dep.status.toLowerCase().replace(/\s+/g, "-")}`}>
                          {dep.status}
                        </span>
                      </td>
                      <td>
                        <div className="table-price-box">
                          <span className="table-orig-price">${dep.originalPrice}</span>
                          <strong className="table-current-price">${dep.price}</strong>
                        </div>
                      </td>
                      <td>
                        <span className="seats-indicator">
                          {dep.availableSeats} of {dep.totalSeats} seats
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/booking/${dep.trekSlug}?date=${dep.startDate}`}
                          className="join-now-btn"
                        >
                          Join Now ↗
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY TREK WITH US ──────────────────────── */}
      <section className="why-us-section">
        <div className="section-wrap">
          <div className="section-title-center">
            <span className="sub-badge-pill">THE LOCAL SHERPA ADVANTAGE</span>
            <h2 className="main-section-title">
              Why Trek <span>With Agaaman?</span>
            </h2>
            <p className="section-intro-p">
              We don't outsource to third-party operators. You are guided by the very people who were
              born and raised in these valleys — that's a promise only we can make.
            </p>
          </div>

          <div className="why-us-grid">
            <div className="why-card">
              <div className="why-icon-box"><ShieldCheck size={28} /></div>
              <h3>100% Success & Zero-Rescue</h3>
              <p>Our slow acclimatization profiles and daily oxygen checks ensure every trekker reaches the summit safely without altitude distress.</p>
            </div>
            <div className="why-card">
              <div className="why-icon-box"><Users size={28} /></div>
              <h3>Small Intimate Groups</h3>
              <p>Never lost in a crowd. Our group sizes are capped at 8 to 12 trekkers, maintaining high guide-to-client ratios for personal attention.</p>
            </div>
            <div className="why-card">
              <div className="why-icon-box"><Utensils size={28} /></div>
              <h3>Warm Teahouses & Wholesome Meals</h3>
              <p>Sleep in the best local lodges. Enjoy freshly cooked nutritious meals with organic local produce and pure filtered water at every stop.</p>
            </div>
            <div className="why-card">
              <div className="why-icon-box"><HeartHandshake size={28} /></div>
              <h3>Ethical Porter Treatment</h3>
              <p>We respect our mountain porters with fair wages, medical insurance, proper high-altitude gear, and strictly enforced weight limits.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── LATEST BLOGS ─────────────────────────── */}
      <section className="section-wrap home-blogs-section" id="blogs">
        <div className="section-title-center">
          <span className="sub-badge-pill">FIELD STORIES & ADVICE</span>
          <h2 className="main-section-title">
            Latest <span>Blogs & Posts</span>
          </h2>
          <p className="section-intro-p">
            Practical advice, gear guides, and trail wisdom straight from our Sherpa guides and the trekkers who walked before you.
          </p>
        </div>

        <div className="home-blogs-grid">
          {articles.map((article) => (
            <article key={article.slug} className="home-blog-card">
              <Link to={`/journal/${article.slug}`} className="blog-img-link">
                <img src={article.image} alt={article.title} loading="lazy" />
                <span className="blog-cat-badge">{article.category}</span>
              </Link>
              <div className="blog-card-body">
                <span className="blog-read-time">{article.read}</span>
                <h3 className="blog-card-title">
                  <Link to={`/journal/${article.slug}`}>{article.title}</Link>
                </h3>
                <p className="blog-card-summary">{article.summary}</p>
                <Link to={`/journal/${article.slug}`} className="blog-read-more">
                  Read Article <ArrowRight size={15} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </Page>
  );
}