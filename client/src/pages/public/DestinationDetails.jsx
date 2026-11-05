import { lazy, Suspense, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Mountain, Utensils, Users, Navigation, Calendar, ArrowRight } from "lucide-react";
import { Page, Reveal } from "../../components/common/Page.jsx";
import { SectionHeading } from "../../components/common/SectionHeading.jsx";
import { TrekCard } from "../../components/trek/TrekCard.jsx";
import { MapLoading } from "../../components/common/PagePrimitives.jsx";
import { api } from "../../services/api.js";
import { NotFoundPage } from "./MiscPages.jsx";

const HimalayanMap = lazy(() => import("../../components/maps/HimalayanMap.jsx"));

export function DestinationDetailPage() {
  const { slug } = useParams();
  const [destination, setDestination] = useState(null);
  const [destinationTreks, setDestinationTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    setDestination(null);
    setDestinationTreks([]);
    setLoadError("");
    api.destinations.getBySlug(slug)
      .then((response) => {
        if (!active) return;
        const record = response.destination;
        if (!record) return;
        setDestination({
          ...record,
          id: record._id || record.id,
          image: record.images?.[0] || record.image || "",
          lat: record.coordinates?.lat ?? record.lat,
          lng: record.coordinates?.lng ?? record.lng,
        });
        setDestinationTreks(Array.isArray(response.treks) ? response.treks.map((trek) => ({
          ...trek,
          image: trek.images?.[0] || trek.image || "",
          elevation: trek.maximumElevation ?? trek.elevation ?? 0,
          description: trek.shortDescription || trek.description || "",
        })) : []);
      })
      .catch((error) => {
        if (!active) return;
        if (!error.message.toLowerCase().includes("not found")) {
          setLoadError(error.message || "Unable to load this destination.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [slug]);

  if (loading) {
    return <Page className="detail-page"><p className="section-wrap" role="status">Loading destination…</p></Page>;
  }
  if (loadError) {
    return <Page className="detail-page"><p className="section-wrap" role="alert">{loadError}</p></Page>;
  }
  if (!destination) return <NotFoundPage />;

  const hasAttractions = destination.attractions && destination.attractions.length > 0;
  const hasAccommodation = destination.accommodationTypes && destination.accommodationTypes.length > 0;
  const hasCulture = destination.culturalHighlights && destination.culturalHighlights.overview;
  const hasSideTrips = destination.nearbySideTrips && destination.nearbySideTrips.length > 0;

  return (
    <Page className="detail-page">
      {/* Hero */}
      <section className="destination-detail-hero" style={{ "--destination-image": `url("${destination.image}")` }}>
        <div className="destination-detail-overlay" />
        <div className="destination-detail-copy section-wrap">
          <Link className="light-breadcrumb" to="/destinations"><ArrowLeft size={14} /> All destinations</Link>
          <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap", marginTop: "12px", marginBottom: "8px" }}>
            <Link
              to={`/regions/${(destination.region || "").toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
              style={{
                fontSize: "0.85rem",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                color: "#e2e8f0",
                background: "rgba(0,0,0,0.35)",
                padding: "4px 12px",
                borderRadius: "100px",
                backdropFilter: "blur(6px)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "5px"
              }}
            >
              <span>{destination.region}</span> →
            </Link>
            {destination.elevation > 0 && (
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  color: "#ffffff",
                  background: "rgba(8,60,52,0.85)",
                  padding: "4px 12px",
                  borderRadius: "100px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <Mountain size={13} /> {destination.elevation.toLocaleString()}m Elevation
              </span>
            )}
            {destination.bestSeason && (
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "500",
                  color: "#ffffff",
                  background: "rgba(255,255,255,0.22)",
                  padding: "4px 12px",
                  borderRadius: "100px",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px"
                }}
              >
                <Calendar size={13} /> {Array.isArray(destination.bestSeason) ? destination.bestSeason.join(", ") : destination.bestSeason}
              </span>
            )}
          </div>
          <h1>{destination.name}</h1>
          <p>{destination.label}</p>
        </div>
      </section>

      {/* Overview & Coordinates */}
      <section className="section-wrap destination-detail-body">
        <div>
          <p className="eyebrow">A sense of place</p>
          <h2>Where the trail meets the valley.</h2>
          <p>{destination.description}</p>
        </div>
        <div className="destination-coordinates">
          <MapPin size={17} />
          <span>Coordinates</span>
          <b>{Number(destination.lat || 27.8).toFixed(3)}° N, {Number(destination.lng || 86.7).toFixed(3)}° E</b>
        </div>
      </section>

      {/* Key Attractions & Landmarks */}
      {hasAttractions && (
        <Reveal>
          <section className="section-wrap dest-rich-section">
            <div className="dest-section-title">
              <span className="eyebrow">Places to explore</span>
              <h2>Key Attractions in {destination.name}</h2>
              <p>Explore notable natural, cultural, and visitor sites in and around {destination.name}. Access and opening conditions can vary.</p>
            </div>
            <div className="dest-attractions-grid">
              {destination.attractions.map((attr, idx) => (
                <div className="attraction-card" key={idx}>
                  <span className="attraction-type-badge">{attr.type}</span>
                  <h3>{attr.name}</h3>
                  <p>{attr.description}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* Accommodation Types */}
      {hasAccommodation && (
        <Reveal>
          <section className="section-wrap dest-rich-section">
            <div className="dest-section-title">
              <span className="eyebrow">Where to stay</span>
              <h2>Accommodation in {destination.name}</h2>
              <p>Accommodation types and amenities vary by property. Confirm location, accessibility, and included services directly with your chosen stay.</p>
            </div>
            <div className="dest-accommodation-grid">
              {destination.accommodationTypes.map((stay, idx) => (
                <div className="accommodation-card" key={idx}>
                  <div className="accommodation-header">
                    <h3>{stay.type}</h3>
                    {stay.badge && <span className="accommodation-badge">{stay.badge}</span>}
                  </div>
                  <p className="accommodation-desc">{stay.description}</p>
                  {stay.amenities && stay.amenities.length > 0 && (
                    <ul className="amenities-list">
                      {stay.amenities.map((amenity, i) => (
                        <li className="amenity-item" key={i}>
                          <span className="amenity-check">✓</span>
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* Cultural Highlights & Ethnic Groups */}
      {hasCulture && (
        <Reveal>
          <section className="section-wrap dest-rich-section">
            <div className="dest-section-title">
              <span className="eyebrow">Local people and living traditions</span>
              <h2>Cultural Heritage & Ethnic Communities</h2>
              <p>Learning about the communities and traditions of {destination.name} can add context to a visit. Follow local guidance and approach cultural sites respectfully.</p>
            </div>
            <div className="dest-culture-card">
              <div className="ethnic-groups-row">
                <span className="ethnic-label">Ethnic Communities:</span>
                {(destination.culturalHighlights.ethnicGroups || []).map((group, i) => (
                  <span className="ethnic-pill" key={i}>{group}</span>
                ))}
              </div>
              <p className="culture-overview-text">{destination.culturalHighlights.overview}</p>
              {destination.culturalHighlights.etiquette && destination.culturalHighlights.etiquette.length > 0 && (
                <div className="etiquette-box">
                  <h4>🙏 Trail Etiquette & Cultural Respect</h4>
                  <ul className="etiquette-list">
                    {destination.culturalHighlights.etiquette.map((rule, i) => (
                      <li key={i}>{rule}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </section>
        </Reveal>
      )}

      {/* Nearby Day Hikes & Side Trips */}
      {hasSideTrips && (
        <Reveal>
          <section className="section-wrap dest-rich-section">
            <div className="dest-section-title">
              <span className="eyebrow">Explore nearby</span>
              <h2>Nearby Day Hikes & Side Trips</h2>
              <p>Extend your adventure with these curated excursions from {destination.name} — each offering a unique vantage point.</p>
            </div>
            <div className="dest-sidetrips-grid">
              {destination.nearbySideTrips.map((trip, idx) => (
                <div className="sidetrip-card" key={idx}>
                  <div className="sidetrip-header">
                    <h3>{trip.name}</h3>
                  </div>
                  <div className="sidetrip-meta">
                    {trip.duration && <span>⏱ {trip.duration}</span>}
                    {trip.elevation && <span>⛰ {trip.elevation}</span>}
                  </div>
                  <p>{trip.description}</p>
                </div>
              ))}
            </div>
          </section>
        </Reveal>
      )}

      {/* Associated Treks */}
      {destinationTreks.length > 0 && (
        <section className="section-wrap related-section">
          <SectionHeading eyebrow="Journeys in this region" title={`Trails through ${destination.name}.`} />
          <div className="trek-grid">
            {destinationTreks.map((trek) => <TrekCard trek={trek} key={trek.slug} />)}
          </div>
        </section>
      )}

      {/* Map */}
      <section className="section-wrap map-section">
        <Suspense fallback={<MapLoading />}>
          <HimalayanMap initialDestinationSlug={destination.slug} />
        </Suspense>
      </section>
    </Page>
  );
}
