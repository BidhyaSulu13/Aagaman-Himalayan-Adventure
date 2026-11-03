import { useState, useMemo, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Compass, MapPin, Mountain, Search } from "lucide-react";
import { Page, Reveal } from "../../components/common/Page.jsx";
import { SectionHeading } from "../../components/common/SectionHeading.jsx";
import { DestinationCard } from "../../components/destination/DestinationCard.jsx";
import { DemoBanner, MapLoading } from "../../components/common/PagePrimitives.jsx";
import { useDestinations, useRegions } from "../../hooks/useDataStore.js";

const HimalayanMap = lazy(() => import("../../components/maps/HimalayanMap.jsx"));

export function DestinationsPage() {
  const destinations = useDestinations();
  const regions = useRegions();
  const [selectedRegion, setSelectedRegion] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const regionOptions = useMemo(() => {
    const list = [{ id: "all", label: "All Destinations" }];
    const set = new Set();
    destinations.forEach((d) => {
      if (d.region && !set.has(d.region)) {
        set.add(d.region);
        list.push({ id: d.region, label: d.region });
      }
    });
    return list;
  }, [destinations]);

  const filteredDestinations = useMemo(() => {
    return destinations.filter((dest) => {
      const matchRegion =
        selectedRegion === "all" ||
        (dest.region && dest.region.toLowerCase() === selectedRegion.toLowerCase());

      const query = searchQuery.trim().toLowerCase();
      const matchSearch =
        !query ||
        dest.name.toLowerCase().includes(query) ||
        (dest.description && dest.description.toLowerCase().includes(query)) ||
        (dest.region && dest.region.toLowerCase().includes(query));

      return matchRegion && matchSearch;
    });
  }, [destinations, selectedRegion, searchQuery]);

  return (
    <Page className="destinations-page">
      <DemoBanner />

      {/* Intro Header */}
      <section className="page-intro section-wrap">
        <p className="eyebrow">Himalayan Towns, Trading Posts & Staging Hubs</p>
        <h1>
          {destinations.length} Historic Destinations.<br />
          <em>Where high trails begin and stories gather.</em>
        </h1>
        <p>
          From the vibrant lakeside promenades of Pokhara to the cliffside timber bakeries of Namche Bazaar,
          each Himalayan destination serves as the heartbeat, staging hub, and cultural sanctuary for expedition trails.
        </p>

        {/* Search & Filter Bar */}
        <div style={{ marginTop: "32px", display: "flex", flexWrap: "wrap", gap: "14px", alignItems: "center", justifyContent: "space-between" }}>
          {/* Region Tabs */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {regionOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setSelectedRegion(opt.id)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "100px",
                  fontSize: "0.88rem",
                  fontWeight: selectedRegion === opt.id ? "600" : "500",
                  backgroundColor: selectedRegion === opt.id ? "#083c34" : "#ffffff",
                  color: selectedRegion === opt.id ? "#ffffff" : "#475569",
                  border: selectedRegion === opt.id ? "1px solid #083c34" : "1px solid #cbd5e1",
                  cursor: "pointer",
                  transition: "all 0.18s ease",
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div style={{ position: "relative", minWidth: "260px" }}>
            <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input
              type="text"
              placeholder="Search towns or landmarks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 16px 8px 38px",
                borderRadius: "100px",
                border: "1px solid #cbd5e1",
                fontSize: "0.88rem",
                backgroundColor: "#ffffff",
                outline: "none",
              }}
            />
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="section-wrap destination-tiles">
        {filteredDestinations.map((destination, index) => {
          const trekCount = destination.trekSlugs ? destination.trekSlugs.length : 0;
          return (
            <Reveal className="destination-tile" key={destination.slug} delay={index * 0.04}>
              <DestinationCard destination={destination} index={index} />
              <div className="destination-tile-note">
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{destination.description}</p>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", marginTop: "8px" }}>
                  <span style={{ fontWeight: "600", color: "#083c34" }}>
                    {trekCount > 0 ? `${trekCount} Expedition Routes` : "Gateway Center"}
                  </span>
                  <Link
                    to={`/destinations/${destination.slug}`}
                    style={{ fontSize: "0.82rem", color: "#083c34", fontWeight: "600", textDecoration: "underline", marginLeft: "auto" }}
                  >
                    View Guide & Routes →
                  </Link>
                </div>
              </div>
            </Reveal>
          );
        })}

        {filteredDestinations.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px 20px" }}>
            <MapPin size={36} style={{ color: "#94a3b8", margin: "0 auto 12px" }} />
            <h3 style={{ fontSize: "1.2rem", color: "#1e293b" }}>No destinations match your filter</h3>
            <p style={{ color: "#64748b", marginTop: "6px" }}>Try selecting another region or clear your search term.</p>
            <button
              type="button"
              className="button button-small"
              onClick={() => { setSelectedRegion("all"); setSearchQuery(""); }}
              style={{ marginTop: "16px" }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* Explore Nepal Treks by Region Callout */}
      <section className="section-wrap" style={{ margin: "40px auto 20px" }}>
        <div style={{
          backgroundColor: "#f1f5f9",
          borderRadius: "16px",
          padding: "32px 36px",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
          border: "1px solid #e2e8f0"
        }}>
          <div>
            <span style={{ fontSize: "0.82rem", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.08em", color: "#083c34" }}>
              Looking for Regional Portals?
            </span>
            <h3 style={{ fontSize: "1.45rem", fontWeight: "700", color: "#0f172a", marginTop: "4px" }}>
              Explore Nepal’s 5 Mountain Territories
            </h3>
            <p style={{ color: "#475569", maxWidth: "600px", marginTop: "6px", fontSize: "0.95rem" }}>
              Browse dedicated landing pages for Everest, Annapurna, Langtang, Manaslu, and Mustang with trail grading and altitude breakdowns.
            </p>
          </div>
          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {regions.map((reg) => (
              <Link
                key={reg.id || reg.slug}
                to={`/regions/${reg.id || reg.slug}`}
                className="button button-small button-outline"
                style={{ backgroundColor: "#ffffff" }}
              >
                {reg.name} →
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="map-section section-wrap">
        <SectionHeading
          eyebrow="Interactive Staging Map"
          title="Explore Key Himalayan Trailheads & Hubs"
          copy="Click any destination marker to discover connected high passes, sacred monasteries, and expedition routes."
        />
        <Suspense fallback={<MapLoading />}><HimalayanMap /></Suspense>
      </section>

      <div className="section-wrap data-disclaimer">
        <span className="demo-dot" /> High mountain destinations are subject to seasonal weather and altitude precautions. Always trek with certified Sherpa guides.
      </div>
    </Page>
  );
}
