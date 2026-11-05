import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Compass,
  Filter,
  Mountain,
  RotateCcw,
  Search,
  SlidersHorizontal,
  Star,
} from "lucide-react";
import { Page, Reveal } from "../../components/common/Page.jsx";
import { TrekCard } from "../../components/trek/TrekCard.jsx";
import { api } from "../../services/api.js";

function FilterSelect({ label, value, onChange, children }) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}>
        {children}
      </select>
      <ChevronDown size={14} aria-hidden="true" />
    </label>
  );
}

export function TreksPage() {
  const [params, setParams] = useSearchParams();

  // Filters state
  const [search, setSearch] = useState(params.get("search") || "");
  const [region, setRegion] = useState(params.get("region") || "All regions");
  const [difficulty, setDifficulty] = useState(params.get("difficulty") || "Any difficulty");
  const [duration, setDuration] = useState(params.get("duration") || "Any duration");
  const [minRating, setMinRating] = useState(params.get("minRating") || "Any rating");
  const [maxPrice, setMaxPrice] = useState(Number(params.get("maxPrice")) || 4000);
  const [sort, setSort] = useState(params.get("sort") || "popular");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Live treks from MongoDB API
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sync state if URL query params change
  useEffect(() => {
    if (params.get("search") !== null) setSearch(params.get("search"));
    if (params.get("region")) setRegion(params.get("region"));
    if (params.get("difficulty")) setDifficulty(params.get("difficulty"));
    if (params.get("duration")) setDuration(params.get("duration"));
    if (params.get("sort")) setSort(params.get("sort"));
  }, [params]);

  // The public catalog is backed only by published database records.
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    api.treks
      .getAll({ limit: 100 })
      .then((res) => {
        if (!isMounted) return;
        setTreks(res.success && Array.isArray(res.treks) ? res.treks : []);
      })
      .catch((requestError) => {
        if (!isMounted) return;
        setTreks([]);
        setError(requestError.message || "Unable to load the expedition catalog.");
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Build dynamic region options from fetched database records
  const regionOptions = useMemo(() => {
    const set = new Set();
    treks.forEach((t) => {
      if (t.region) set.add(t.region.trim());
    });
    return ["All regions", ...Array.from(set).sort()];
  }, [treks]);

  // Dynamic client-side filter and sorting computation
  const filteredResults = useMemo(() => {
    const list = treks.filter((trek) => {
      // 1. Search Query
      if (search.trim()) {
        const query = search.toLowerCase().trim();
        const fullText = `${trek.title || ""} ${trek.region || ""} ${trek.location || ""} ${
          trek.shortDescription || trek.description || ""
        }`.toLowerCase();
        if (!fullText.includes(query)) return false;
      }

      // 2. Region Filter
      if (region !== "All regions") {
        if (!trek.region || !trek.region.toLowerCase().includes(region.toLowerCase())) {
          return false;
        }
      }

      // 3. Difficulty Filter
      if (difficulty !== "Any difficulty") {
        if (trek.difficulty !== difficulty) return false;
      }

      // 4. Duration Filter
      if (duration !== "Any duration") {
        const dur = Number(trek.duration) || 0;
        if ((duration.startsWith("1–6") || duration.startsWith("1-6") || duration.startsWith("1")) && !duration.startsWith("13") && (dur < 1 || dur > 6)) return false;
        if ((duration.startsWith("7–12") || duration.startsWith("7-12") || duration.startsWith("7")) && (dur < 7 || dur > 12)) return false;
        if (duration.startsWith("13") && dur < 13) return false;
      }

      // 5. Rating Filter
      if (minRating !== "Any rating") {
        const r = trek.rating || 0;
        if (minRating === "4.9+" && r < 4.9) return false;
        if (minRating === "4.8+" && r < 4.8) return false;
        if (minRating === "4.5+" && r < 4.5) return false;
      }

      // 6. Max Price Filter
      if (trek.price && trek.price > maxPrice) return false;

      return true;
    });

    // Sort Results
    return list.sort((a, b) => {
      if (sort === "popular") {
        const scoreA = (a.confirmedBookingsCount || 0) * 5 + (a.uniqueViewsCount || 0) + (a.reviewCount || 0) * 3;
        const scoreB = (b.confirmedBookingsCount || 0) * 5 + (b.uniqueViewsCount || 0) + (b.reviewCount || 0) * 3;
        return scoreB - scoreA;
      }
      if (sort === "rating") return (b.rating || 0) - (a.rating || 0);
      if (sort === "price_asc") return (a.price || 0) - (b.price || 0);
      if (sort === "price_desc") return (b.price || 0) - (a.price || 0);
      if (sort === "duration_asc") return (a.duration || 0) - (b.duration || 0);
      if (sort === "duration_desc") return (b.duration || 0) - (a.duration || 0);
      if (sort === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [treks, search, region, difficulty, duration, minRating, maxPrice, sort]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, region, difficulty, duration, minRating, maxPrice, sort]);

  // Pagination calculation
  const totalItems = filteredResults.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredResults.slice(startIndex, startIndex + itemsPerPage);

  const clearFilters = () => {
    setSearch("");
    setRegion("All regions");
    setDifficulty("Any difficulty");
    setDuration("Any duration");
    setMinRating("Any rating");
    setMaxPrice(4000);
    setSort("popular");
    setParams({});
  };

  return (
    <Page className="catalog-page">
      <section className="page-intro section-wrap" style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
        <p className="eyebrow" style={{ color: "#ea580c", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
          Himalayan Expedition Directory
        </p>
        <h1 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, margin: "10px 0 16px" }}>
          Explore All <span style={{ color: "#ea580c" }}>Trekking Packages</span>
        </h1>
        <p style={{ color: "#475569", fontSize: "17px", lineHeight: 1.6 }}>
          Browse published trek listings and compare the route details, duration, difficulty, and prices currently available in the catalog. Confirm itinerary and departure details before booking.
        </p>
      </section>

      <section className="catalog section-wrap">
        {loading && <p role="status">Loading expeditions…</p>}
        {!loading && error && <p role="alert">{error}</p>}
        {/* Toolbar: Search input, Count & Sorting Dropdown */}
        <div className="catalog-toolbar">
          <div className="catalog-search">
            <label htmlFor="trek-search" className="sr-only">
              Search trek name or region
            </label>
            <input
              id="trek-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by trek name, peak, or region..."
            />
            <Compass size={18} />
          </div>

          <span className="catalog-count" style={{ fontWeight: 700, color: "#0f172a" }}>
            {totalItems} {totalItems === 1 ? "expedition" : "expeditions"} found
          </span>

          <label className="sort-control">
            <span>Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="popular">Popularity (Views & Reviews)</option>
              <option value="rating">Top Rated (Verified Trekker Reviews)</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Newest Routes</option>
              <option value="duration_asc">Duration: Short to Long</option>
              <option value="duration_desc">Duration: Long to Short</option>
            </select>
            <ChevronDown size={14} />
          </label>
        </div>

        {/* Filter Controls Panel */}
        <div className="filter-panel">
          <div className="filter-panel-heading">
            <SlidersHorizontal size={16} />
            <span>Refine Criteria</span>
          </div>

          <FilterSelect label="Region" value={region} onChange={setRegion}>
            {regionOptions.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect label="Difficulty" value={difficulty} onChange={setDifficulty}>
            {["Any difficulty", "Easy", "Moderate", "Challenging", "Strenuous"].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect label="Duration" value={duration} onChange={setDuration}>
            {["Any duration", "1–6 days", "7–12 days", "13+ days"].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </FilterSelect>

          <FilterSelect label="Customer Rating" value={minRating} onChange={setMinRating}>
            {["Any rating", "4.9+", "4.8+", "4.5+"].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </FilterSelect>

          <label className="price-filter">
            <span>
              Maximum Budget: <strong>${maxPrice.toLocaleString()}</strong>
            </span>
            <input
              type="range"
              min="500"
              max="4000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              aria-label="Maximum budget in US dollars"
            />
          </label>

          <button type="button" className="filter-reset" onClick={clearFilters} title="Reset all filters">
            <RotateCcw size={14} style={{ marginRight: "4px" }} /> Reset Filters
          </button>
        </div>

        {/* Results Grid / Loading / Empty State */}
        {loading ? (
          <div className="trek-grid">
            {[1, 2, 3, 4, 5, 6].map((idx) => (
              <div key={idx} className="trek-skeleton-card" style={{ height: "420px", background: "#e2e8f0", borderRadius: "12px", animation: "pulse 1.5s infinite" }} />
            ))}
          </div>
        ) : error ? (
          <div className="empty-state" style={{ padding: "40px 20px", textAlign: "center" }}>
            <p style={{ color: "#ef4444", fontWeight: 600 }}>{error}</p>
            <button type="button" className="button button-dark" onClick={() => window.location.reload()}>
              Retry Connection
            </button>
          </div>
        ) : currentItems.length > 0 ? (
          <>
            <div className="trek-grid">
              {currentItems.map((trek, index) => (
                <Reveal key={trek.slug || trek._id} delay={(index % 3) * 0.05}>
                  <TrekCard trek={trek} />
                </Reveal>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div
                className="catalog-pagination-row"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginTop: "48px",
                }}
              >
                <button
                  type="button"
                  className="card-cta-btn btn-details"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
                >
                  <ArrowLeft size={14} style={{ marginRight: "4px" }} /> Previous
                </button>

                <div style={{ display: "flex", gap: "6px" }}>
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    const isActive = pageNum === currentPage;
                    return (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        style={{
                          width: "36px",
                          height: "36px",
                          borderRadius: "8px",
                          border: isActive ? "1px solid #ea580c" : "1px solid #cbd5e1",
                          background: isActive ? "#ea580c" : "#ffffff",
                          color: isActive ? "#ffffff" : "#0f172a",
                          fontWeight: 700,
                          fontSize: "14px",
                          cursor: "pointer",
                        }}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  className="card-cta-btn btn-details"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? "not-allowed" : "pointer" }}
                >
                  Next <ArrowRight size={14} style={{ marginLeft: "4px" }} />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="empty-state">
            <span className="empty-state-icon">
              <Mountain size={28} />
            </span>
            <h3>No trekking packages matched your filters</h3>
            <p>Try widening your search terms, price ceiling, or duration constraints.</p>
            <button type="button" className="button button-dark" onClick={clearFilters}>
              Clear All Filters
            </button>
          </div>
        )}
      </section>
    </Page>
  );
}

export default TreksPage;
