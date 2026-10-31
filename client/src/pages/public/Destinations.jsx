import { lazy, Suspense } from "react";
import { Page, Reveal } from "../../components/common/Page.jsx";
import { SectionHeading } from "../../components/common/SectionHeading.jsx";
import { DestinationCard } from "../../components/destination/DestinationCard.jsx";
import { DemoBanner, MapLoading } from "../../components/common/PagePrimitives.jsx";
import { useDestinations } from "../../hooks/useDataStore.js";

const HimalayanMap = lazy(() => import("../../components/maps/HimalayanMap.jsx"));

export function DestinationsPage() {
  const destinations = useDestinations();

  return (
    <Page className="destinations-page">
      <DemoBanner />
      <section className="page-intro section-wrap">
        <p className="eyebrow">Many mountains, many ways to wander</p>
        <h1>{destinations.length} Himalayan Regions.<br /><em>A thousand beginnings.</em></h1>
        <p>From well-loved high trails to quieter valleys, each region offers a different way to meet the mountains.</p>
      </section>
      <section className="section-wrap destination-tiles">
        {destinations.map((destination, index) => (
          <Reveal className="destination-tile" key={destination.slug} delay={index * 0.05}>
            <DestinationCard destination={destination} index={index} />
            <div className="destination-tile-note">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{destination.description}</p>
              <span>{destination.trekSlugs ? destination.trekSlugs.length : 0} sample routes</span>
            </div>
          </Reveal>
        ))}
      </section>
      <section className="map-section section-wrap">
        <SectionHeading
          eyebrow="The Himalayan explorer"
          title="Get a feel for the lay of the land."
          copy="Choose a region to discover the treks connected with it. Markers indicate approximate region centers; this is not a navigation map."
        />
        <Suspense fallback={<MapLoading />}><HimalayanMap /></Suspense>
      </section>
      <div className="section-wrap data-disclaimer">
        <span className="demo-dot" /> Destination and location information is for demonstration; verify coordinates and current local conditions before travel.
      </div>
    </Page>
  );
}
