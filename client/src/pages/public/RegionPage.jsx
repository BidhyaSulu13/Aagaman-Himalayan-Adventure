import { useState, useMemo, lazy, Suspense, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Calendar,
  Compass,
  Filter,
  MapPin,
  Mountain,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle2
} from "lucide-react";
import { Page, Reveal } from "../../components/common/Page.jsx";
import { SectionHeading } from "../../components/common/SectionHeading.jsx";
import { TrekCard } from "../../components/trek/TrekCard.jsx";
import { MapLoading } from "../../components/common/PagePrimitives.jsx";
import { api } from "../../services/api.js";
import { NotFoundPage } from "./MiscPages.jsx";

const HimalayanMap = lazy(() => import("../../components/maps/HimalayanMap.jsx"));

export function RegionPage() {
  const { slug } = useParams();
  const [regionResponse, setRegionResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [activeGrade, setActiveGrade] = useState("all");
  const [durationFilter, setDurationFilter] = useState("all");
  const [altitudeFilter, setAltitudeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setRegionResponse(null);
    setLoadError("");
    api.regions.getBySlug(slug)
      .then((response) => {
        if (active) setRegionResponse(response);
      })
      .catch((error) => {
        if (active && !error.message.toLowerCase().includes("not found")) {
          setLoadError(error.message || "Unable to load this region.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [slug]);

  const regionData = useMemo(() => {
    const region = regionResponse?.region;
    if (!region) return null;

    const allTreks = (regionResponse.treks || []).map((trek) => ({
      ...trek,
      image: trek.images?.[0] || trek.image || "",
      elevation: trek.maximumElevation ?? trek.elevation ?? 0,
      description: trek.shortDescription || trek.description || "",
    }));
    const matchesGrade = (trek, grade) => {
      if (grade === "high") {
        return trek.duration >= 13 || trek.elevation >= 5000 ||
          ["challenging", "strenuous"].includes(trek.difficulty?.toLowerCase());
      }
      if (grade === "moderate") {
        return (trek.duration >= 7 && trek.duration < 13 && trek.elevation < 5000) ||
          trek.difficulty?.toLowerCase() === "moderate";
      }
      return trek.duration < 7 || trek.difficulty?.toLowerCase() === "easy";
    };

    return {
      ...region,
      slug: region.slug || slug,
      image: region.image || "",
      coordinates: region.coordinates || {},
      subDestinations: (regionResponse.destinations || []).map((destination) => ({
        ...destination,
        image: destination.images?.[0] || destination.image || "",
        lat: destination.coordinates?.lat,
        lng: destination.coordinates?.lng,
      })),
      allTreks,
      highGradeTreks: allTreks.filter((trek) => matchesGrade(trek, "high")),
      moderateGradeTreks: allTreks.filter((trek) => matchesGrade(trek, "moderate")),
      easyGradeTreks: allTreks.filter((trek) => matchesGrade(trek, "easy")),
    };
  }, [regionResponse, slug]);

  const filteredTreks = useMemo(() => {
    if (!regionData) return [];
    let list = [...regionData.allTreks];

    if (activeGrade === "high") {
      list = [...regionData.highGradeTreks];
    } else if (activeGrade === "moderate") {
      list = [...regionData.moderateGradeTreks];
    } else if (activeGrade === "easy") {
      list = [...regionData.easyGradeTreks];
    }

    if (durationFilter === "short") {
      list = list.filter((t) => t.duration < 10);
    } else if (durationFilter === "medium") {
      list = list.filter((t) => t.duration >= 10 && t.duration <= 14);
    } else if (durationFilter === "long") {
      list = list.filter((t) => t.duration > 14);
    }

    if (altitudeFilter === "low") {
      list = list.filter((t) => (t.elevation || 0) < 4000);
    } else if (altitudeFilter === "mid") {
      list = list.filter((t) => (t.elevation || 0) >= 4000 && (t.elevation || 0) < 5000);
    } else if (altitudeFilter === "high") {
      list = list.filter((t) => (t.elevation || 0) >= 5000);
    }

    if (sortBy === "duration-asc") {
      list.sort((a, b) => a.duration - b.duration);
    } else if (sortBy === "duration-desc") {
      list.sort((a, b) => b.duration - a.duration);
    } else if (sortBy === "elevation-desc") {
      list.sort((a, b) => (b.elevation || 0) - (a.elevation || 0));
    } else if (sortBy === "price-asc") {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    }

    return list;
  }, [regionData, activeGrade, durationFilter, altitudeFilter, sortBy]);

  if (loading) {
    return <Page className="region-page"><p className="section-wrap" role="status">Loading region…</p></Page>;
  }
  if (loadError) {
    return <Page className="region-page"><p className="section-wrap" role="alert">{loadError}</p></Page>;
  }
  if (!regionData || (!regionData.name && !regionData.label)) {
    return <NotFoundPage />;
  }

  const maxElevation = (regionData.allTreks || []).reduce(
    (max, t) => Math.max(max, t.elevation || 0),
    regionData.maxElevation || 0
  );

  return (
    <Page className="region-page">
      {/* Region Hero */}
      <section className="region-hero section-wrap">
        <div className="region-hero-copy">
          <Link to="/treks" className="region-back-link">
            <ArrowLeft size={16} /> Explore All Nepal Treks
          </Link>
          <div className="region-hero-header">
            <span className="eyebrow">{regionData.tagline || "Explore the region"}</span>
            <h1>{regionData.label || regionData.name}</h1>
            <p className="region-hero-desc">
              {regionData.description}
            </p>
          </div>

          {/* Quick Region Highlights Badges */}
          <div className="region-meta-pills">
            <div className="meta-pill">
              <Mountain size={16} className="pill-icon" />
              <span>Max Altitude: <strong>{maxElevation > 0 ? `${maxElevation.toLocaleString()}m` : "Not specified"}</strong></span>
            </div>
            <div className="meta-pill">
              <Compass size={16} className="pill-icon" />
              <span>Available Expeditions: <strong>{regionData.allTreks.length} Routes</strong></span>
            </div>
            <div className="meta-pill">
              <MapPin size={16} className="pill-icon" />
              <span>Staging Hubs: <strong>{regionData.subDestinations.length} Destinations</strong></span>
            </div>
            <div className="meta-pill">
              <Calendar size={16} className="pill-icon" />
              <span>Best Seasons: <strong>{Array.isArray(regionData.bestSeason) ? regionData.bestSeason.join(", ") : regionData.bestSeason}</strong></span>
            </div>
          </div>
        </div>
      </section>

      {/* Region Highlights & Permits Overview */}
      {(regionData.highlights?.length > 0 || regionData.permits?.length > 0) && (
        <section className="section-wrap" style={{ margin: "24px auto 36px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "20px",
          }}>
            {regionData.highlights?.length > 0 && (
              <div style={{
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "24px 28px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
              }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <Sparkles size={18} style={{ color: "#083c34" }} /> Region Highlights
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {regionData.highlights.map((h, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.93rem", color: "#334155" }}>
                      <CheckCircle2 size={16} style={{ color: "#083c34", flexShrink: 0, marginTop: "3px" }} />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {regionData.permits?.length > 0 && (
              <div style={{
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                padding: "24px 28px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
              }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: "700", color: "#0f172a", display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}>
                  <ShieldCheck size={18} style={{ color: "#083c34" }} /> Required Entry Permits
                </h3>
                <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }}>
                  {regionData.permits.map((p, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.93rem", color: "#334155" }}>
                      <span style={{ color: "#083c34", fontWeight: "bold" }}>•</span>
                      <span><strong>{p}</strong> — Fully organized and processed by Agaaman before departure.</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Sub-Destinations & Cultural Staging Hubs in this Region */}
      {regionData.subDestinations.length > 0 && (
        <section className="section-wrap region-subdests-section">
          <div className="section-head-row">
            <div>
              <span className="eyebrow">Waypoints & Staging Settlements</span>
              <h2>Destination Hubs in {regionData.name}</h2>
            </div>
            <p className="section-head-note">
              Explore staging towns, ancient monasteries, and cultural valleys that anchor trails in this territory.
            </p>
          </div>

          <div className="region-subdests-grid">
            {regionData.subDestinations.map((dest) => (
              <Link
                key={dest.slug}
                to={`/destinations/${dest.slug}`}
                className="region-subdest-card"
              >
                <div className="subdest-card-media">
                  <img src={dest.image} alt={dest.name} loading="lazy" />
                  <span className="subdest-region-badge">{dest.elevation > 0 ? `${dest.elevation.toLocaleString()}m` : dest.region}</span>
                </div>
                <div className="subdest-card-content">
                  <h3>{dest.name}</h3>
                  <p>{dest.description ? `${dest.description.slice(0, 115)}...` : dest.label}</p>
                  <span className="subdest-action-link">
                    Explore Destination Details <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Categorized Treks Catalog */}
      <section className="section-wrap region-treks-section">
        <div style={{ marginBottom: "20px" }}>
          <span className="eyebrow">Curated Expeditions</span>
          <h2 style={{ fontSize: "1.75rem", fontWeight: "700", color: "#0f172a" }}>
            All Trails in {regionData.name} ({filteredTreks.length})
          </h2>
        </div>

        {/* Multi-Dimensional Filter Toolbar: Grade, Duration, Altitude, Sort */}
        <div className="region-catalog-toolbar" style={{ flexDirection: "column", gap: "14px", alignItems: "stretch" }}>
          {/* Grade Tabs */}
          <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
            <div className="region-grade-tabs" role="tablist" aria-label="Trek Difficulty Grades">
              <button
                type="button"
                className={`grade-tab-btn${activeGrade === "all" ? " is-active" : ""}`}
                onClick={() => setActiveGrade("all")}
              >
                All Grades ({regionData.allTreks.length})
              </button>
              <button
                type="button"
                className={`grade-tab-btn${activeGrade === "high" ? " is-active" : ""}`}
                onClick={() => setActiveGrade("high")}
              >
                Challenging ({regionData.highGradeTreks.length})
              </button>
              <button
                type="button"
                className={`grade-tab-btn${activeGrade === "moderate" ? " is-active" : ""}`}
                onClick={() => setActiveGrade("moderate")}
              >
                Moderate ({regionData.moderateGradeTreks.length})
              </button>
              <button
                type="button"
                className={`grade-tab-btn${activeGrade === "easy" ? " is-active" : ""}`}
                onClick={() => setActiveGrade("easy")}
              >
                Gentle / Easy ({regionData.easyGradeTreks.length})
              </button>
            </div>

            {/* Sort Selector */}
            <div className="region-sort-selector">
              <ArrowUpDown size={15} />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort expeditions"
              >
                <option value="recommended">Sort by: Recommended</option>
                <option value="duration-asc">Duration: Shortest to Longest</option>
                <option value="duration-desc">Duration: Longest to Shortest</option>
                <option value="elevation-desc">Elevation: Highest First</option>
                <option value="price-asc">Price: Lowest to Highest</option>
              </select>
            </div>
          </div>

          {/* Duration & Altitude Secondary Filters */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "18px", paddingTop: "10px", borderTop: "1px solid #e2e8f0" }}>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: "600", color: "#64748b" }}>Duration:</span>
              {[
                { id: "all", label: "All Days" },
                { id: "short", label: "< 10 Days" },
                { id: "medium", label: "10–14 Days" },
                { id: "long", label: "15+ Days" },
              ].map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDurationFilter(d.id)}
                  style={{
                    padding: "3px 10px",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    border: "1px solid",
                    borderColor: durationFilter === d.id ? "#083c34" : "#cbd5e1",
                    background: durationFilter === d.id ? "#083c34" : "#ffffff",
                    color: durationFilter === d.id ? "#ffffff" : "#475569",
                    cursor: "pointer",
                  }}
                >
                  {d.label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <span style={{ fontSize: "0.82rem", fontWeight: "600", color: "#64748b" }}>Max Altitude:</span>
              {[
                { id: "all", label: "Any Altitude" },
                { id: "low", label: "< 4,000m" },
                { id: "mid", label: "4,000–5,000m" },
                { id: "high", label: "5,000m+" },
              ].map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAltitudeFilter(a.id)}
                  style={{
                    padding: "3px 10px",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    border: "1px solid",
                    borderColor: altitudeFilter === a.id ? "#083c34" : "#cbd5e1",
                    background: altitudeFilter === a.id ? "#083c34" : "#ffffff",
                    color: altitudeFilter === a.id ? "#ffffff" : "#475569",
                    cursor: "pointer",
                  }}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {filteredTreks.length === 0 ? (
          <div className="region-empty-state">
            <Mountain size={44} />
            <h3>No expeditions in this grading tier</h3>
            <p>We craft tailored private expeditions across {regionData.name} suited to your timeframe and fitness.</p>
            <button
              type="button"
              className="button button-orange"
              onClick={() => { setActiveGrade("all"); setDurationFilter("all"); setAltitudeFilter("all"); }}
            >
              Reset Filters & View All {regionData.name} Treks
            </button>
          </div>
        ) : (
          <div className="trek-grid">
            {filteredTreks.map((trek) => (
              <TrekCard key={trek.slug} trek={trek} />
            ))}
          </div>
        )}
      </section>

      {/* Regional Map */}
      <section className="section-wrap map-section">
        <SectionHeading
          eyebrow="Topographical Context"
          title={`Explore ${regionData.name} on the Map`}
          copy="Topographic view of peaks, glacial corridors, and neighboring settlements."
        />
        <Suspense fallback={<MapLoading />}>
          <HimalayanMap />
        </Suspense>
      </section>

      {/* Region Footer CTA */}
      <section className="section-wrap region-cta-section">
        <div className="guide-cta-card">
          <div className="guide-cta-copy">
            <h2>Customizing your trek in {regionData.name}?</h2>
            <p>
              Connect with our local Kathmandu route planners to tailor acclimatization schedules, 
              private helicopter returns, or luxury lodge upgrades.
            </p>
          </div>
          <div className="guide-cta-actions">
            <Link to="/customize-trip" className="button button-orange">
              Customize Itinerary
            </Link>
            <Link to="/contact" className="button button-outline">
              Speak with a Guide
            </Link>
          </div>
        </div>
      </section>
    </Page>
  );
}
