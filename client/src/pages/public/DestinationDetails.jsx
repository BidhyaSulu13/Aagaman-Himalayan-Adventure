import { lazy, Suspense } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { Page } from "../../components/common/Page.jsx";
import { SectionHeading } from "../../components/common/SectionHeading.jsx";
import { TrekCard } from "../../components/trek/TrekCard.jsx";
import { DemoBanner, MapLoading } from "../../components/common/PagePrimitives.jsx";
import { useDestinations, useTreks } from "../../hooks/useDataStore.js";
import { NotFoundPage } from "./MiscPages.jsx";

const HimalayanMap = lazy(() => import("../../components/maps/HimalayanMap.jsx"));

export function DestinationDetailPage() {
  const { slug } = useParams();
  const destinations = useDestinations();
  const allTreks = useTreks();
  const destination = destinations.find((d) => d.slug === slug);

  if (!destination) return <NotFoundPage />;

  // Find treks belonging to this destination by slug, name match, or region match
  const destinationTreks = allTreks.filter((t) => {
    if (destination.trekSlugs && destination.trekSlugs.includes(t.slug)) return true;
    const destName = destination.name.toLowerCase();
    const destRegion = (destination.region || "").toLowerCase();
    return (
      t.region?.toLowerCase().includes(destName) ||
      t.location?.toLowerCase().includes(destName) ||
      (destRegion && t.region?.toLowerCase().includes(destRegion))
    );
  });
  return (
    <Page className="detail-page">
      <DemoBanner />
      <section className="destination-detail-hero" style={{ "--destination-image": `url("${destination.image}")` }}>
        <div className="destination-detail-overlay" />
        <div className="destination-detail-copy section-wrap">
          <Link className="light-breadcrumb" to="/destinations"><ArrowLeft size={14} /> All destinations</Link>
          <p className="eyebrow">{destination.region}</p>
          <h1>{destination.name}</h1>
          <p>{destination.label}</p>
        </div>
      </section>
      <section className="section-wrap destination-detail-body">
        <div><p className="eyebrow">A sense of place</p><h2>Where the trail meets the valley.</h2><p>{destination.description}</p><p>Routes, seasons and local access are represented here as introductory demo content. Please seek current, qualified advice before planning travel.</p></div>
        <div className="destination-coordinates"><MapPin size={17} /><span>Approximate region marker</span><b>{destination.lat.toFixed(3)}° N, {destination.lng.toFixed(3)}° E</b></div>
      </section>
      <section className="section-wrap related-section"><SectionHeading eyebrow="Journeys in this region" title={`A trail through ${destination.name}.`} /><div className="trek-grid">{destinationTreks.map((trek) => <TrekCard trek={trek} key={trek.slug} />)}</div></section>
      <section className="section-wrap map-section"><Suspense fallback={<MapLoading />}><HimalayanMap initialDestinationSlug={destination.slug} /></Suspense></section>
    </Page>
  );
}
