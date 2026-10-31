import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ArrowDown, ArrowUpRight, ChevronDown, Compass, Mountain, SlidersHorizontal } from "lucide-react";
import { Page, Reveal } from "../../components/common/Page.jsx";
import { TrekCard } from "../../components/trek/TrekCard.jsx";
import { DemoBanner, allSeasons } from "../../components/common/PagePrimitives.jsx";
import { treks } from "../../data/index.js";

function FilterSelect({ label, value, onChange, children }) {
  return (
    <label className="filter-field">
      <span>{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {children}
      </select>
      <ChevronDown size={14} aria-hidden="true" />
    </label>
  );
}

export function TreksPage() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("search") || "");
  const [region, setRegion] = useState(params.get("region") || "All regions");
  const [difficulty, setDifficulty] = useState(params.get("difficulty") || "Any difficulty");
  const [duration, setDuration] = useState(params.get("duration") || "Any duration");
  const [season, setSeason] = useState(params.get("season") || "Any season");
  const [maxPrice, setMaxPrice] = useState(Number(params.get("maxPrice")) || 3000);
  const [maxElevation, setMaxElevation] = useState(Number(params.get("maxElevation")) || 6000);
  const [sort, setSort] = useState("Recommended");
  const [showAll, setShowAll] = useState(true);

  // Sync state if URL query params change
  useEffect(() => {
    if (params.get("search") !== null) setSearch(params.get("search"));
    if (params.get("region")) setRegion(params.get("region"));
    if (params.get("duration")) setDuration(params.get("duration"));
    if (params.get("difficulty")) setDifficulty(params.get("difficulty"));
  }, [params]);

  const results = useMemo(() => {
    const filtered = treks.filter((trek) => {
      const matchesSearch = `${trek.title} ${trek.region} ${trek.description}`.toLowerCase().includes(search.toLowerCase());
      const matchesRegion = region === "All regions" || trek.region === region;
      const matchesDifficulty = difficulty === "Any difficulty" || trek.difficulty === difficulty;
      const matchesDuration = duration === "Any duration" ||
        (duration === "1–6 days" && trek.duration <= 6) ||
        (duration === "7–12 days" && trek.duration >= 7 && trek.duration <= 12) ||
        (duration === "13+ days" && trek.duration >= 13);
      const matchesSeason = season === "Any season" || trek.season.includes(season);
      return matchesSearch && matchesRegion && matchesDifficulty && matchesDuration && matchesSeason && trek.price <= maxPrice && trek.elevation <= maxElevation;
    });

    return filtered.sort((a, b) => {
      if (sort === "Price: low to high") return a.price - b.price;
      if (sort === "Price: high to low") return b.price - a.price;
      if (sort === "Shortest first") return a.duration - b.duration;
      if (sort === "Highest altitude") return b.elevation - a.elevation;
      return treks.indexOf(a) - treks.indexOf(b);
    });
  }, [search, region, difficulty, duration, season, maxPrice, maxElevation, sort]);

  const clearFilters = () => {
    setSearch("");
    setRegion("All regions");
    setDifficulty("Any difficulty");
    setDuration("Any duration");
    setSeason("Any season");
    setMaxPrice(3000);
    setMaxElevation(6000);
    setSort("Recommended");
    setParams({});
  };

  return (
    <Page className="catalog-page">
      <DemoBanner />
      <section className="page-intro section-wrap">
        <p className="eyebrow">The trail is yours to choose</p>
        <h1>Find a way<br /><em>into the wild.</em></h1>
        <p>Browse a few considered routes through the Himalaya. Use the filters to find a journey that fits your time, energy and curiosity.</p>
      </section>
      <section className="catalog section-wrap">
        <div className="catalog-toolbar">
          <div className="catalog-search">
            <label htmlFor="trek-search" className="sr-only">Search trek name or region</label>
            <input id="trek-search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search a trek or region" />
            <Compass size={18} />
          </div>
          <span className="catalog-count">{results.length} journeys</span>
          <label className="sort-control">
            <span>Sort by</span>
            <select value={sort} onChange={(event) => setSort(event.target.value)}>
              {["Recommended", "Price: low to high", "Price: high to low", "Shortest first", "Highest altitude"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <ChevronDown size={14} />
          </label>
        </div>
        <div className="filter-panel">
          <div className="filter-panel-heading"><SlidersHorizontal size={16} /><span>Make it yours</span></div>
          <FilterSelect label="Region" value={region} onChange={setRegion}>
            {["All regions", "Khumbu", "Annapurna", "Langtang", "Manaslu"].map((item) => <option key={item}>{item}</option>)}
          </FilterSelect>
          <FilterSelect label="Difficulty" value={difficulty} onChange={setDifficulty}>
            {["Any difficulty", "Easy", "Moderate", "Challenging"].map((item) => <option key={item}>{item}</option>)}
          </FilterSelect>
          <FilterSelect label="Duration" value={duration} onChange={setDuration}>
            {["Any duration", "1–6 days", "7–12 days", "13+ days"].map((item) => <option key={item}>{item}</option>)}
          </FilterSelect>
          <FilterSelect label="Season" value={season} onChange={setSeason}>
            {["Any season", ...allSeasons].map((item) => <option key={item}>{item}</option>)}
          </FilterSelect>
          <label className="price-filter">
            <span>Maximum budget <strong>${maxPrice.toLocaleString()}</strong></span>
            <input type="range" min="500" max="3000" step="50" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} aria-label="Maximum budget in US dollars" />
          </label>
          <label className="price-filter elevation-filter">
            <span>Maximum elevation <strong>{maxElevation.toLocaleString()} m</strong></span>
            <input type="range" min="3000" max="6000" step="100" value={maxElevation} onChange={(event) => setMaxElevation(Number(event.target.value))} aria-label="Maximum elevation in meters" />
          </label>
          <button type="button" className="filter-reset" onClick={clearFilters}>Clear filters</button>
        </div>
        {results.length ? (
          <>
            <div className="trek-grid">
              {results.slice(0, showAll ? results.length : 3).map((trek, index) => (
                <Reveal key={trek.slug} delay={index % 3 * 0.05}><TrekCard trek={trek} /></Reveal>
              ))}
            </div>
            {!showAll && results.length > 3 && (
              <button type="button" className="button button-outline load-more" onClick={() => setShowAll(true)}>
                Show all {results.length} journeys <ArrowDown size={15} />
              </button>
            )}
          </>
        ) : (
          <div className="empty-state">
            <span className="empty-state-icon"><Mountain size={24} /></span>
            <h3>No journeys in this combination</h3>
            <p>Try opening up one or two filters. The mountains aren't going anywhere.</p>
            <button type="button" className="button button-dark" onClick={clearFilters}>Clear all filters <ArrowUpRight size={15} /></button>
          </div>
        )}
        <p className="data-disclaimer"><span className="demo-dot" /> Demonstration itineraries and indicative prices only. No live departures or bookings.</p>
      </section>
    </Page>
  );
}
