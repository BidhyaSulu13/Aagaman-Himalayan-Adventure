import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from "react-leaflet";
import { Link } from "react-router-dom";
import { useDestinations, useTreks } from "../../hooks/useDataStore.js";

function MapFocus({ destination }) {
  const map = useMap();
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (destination && destination.lat && destination.lng) {
      map.flyTo([destination.lat, destination.lng], 8, { duration: 0.8 });
    }
  }, [destination, map]);
  return null;
}

export default function HimalayanMap({ initialDestinationSlug }) {
  const destinations = useDestinations();
  const treks = useTreks();
  const [selected, setSelected] = useState(
    () => destinations.find((d) => d.slug === initialDestinationSlug) || destinations[0]
  );

  useEffect(() => {
    if (initialDestinationSlug) {
      const found = destinations.find((d) => d.slug === initialDestinationSlug);
      if (found) setSelected(found);
    } else if (!selected && destinations.length > 0) {
      setSelected(destinations[0]);
    }
  }, [destinations, initialDestinationSlug]);

  const selectedRegion = selected?.region?.toLowerCase();
  const selectedName = selected?.name?.toLowerCase();
  const selectedTreks = selected
    ? treks.filter((trek) =>
        (selected.trekSlugs || []).includes(trek.slug) ||
        (selectedRegion && trek.region?.toLowerCase().includes(selectedRegion)) ||
        (selectedName && trek.location?.toLowerCase().includes(selectedName))
      )
    : [];

  if (!destinations.length) {
    return <p className="map-loading" role="status">No destinations are available in the database.</p>;
  }

  return (
    <div className="explorer-map-shell">
      <div className="explorer-map">
        <MapContainer
          center={[28.2, 84.9]}
          zoom={6}
          minZoom={5}
          maxZoom={11}
          scrollWheelZoom={false}
          aria-label="Map of trekking regions in Nepal"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapFocus destination={selected} />
          {destinations.filter((destination) => Number.isFinite(destination.lat) && Number.isFinite(destination.lng)).map((destination) => (
            <CircleMarker
              key={destination.slug}
              center={[destination.lat, destination.lng]}
              radius={selected?.slug === destination.slug ? 10 : 7}
              pathOptions={{
                color: "#f4f1e9",
                weight: 3,
                fillColor: selected?.slug === destination.slug ? "#c47b52" : "#243a35",
                fillOpacity: 0.95,
              }}
              eventHandlers={{ click: () => setSelected(destination) }}
            >
              <Popup>
                <strong>{destination.name}</strong>
                <br />
                {destination.label}
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
        <span className="map-disclaimer">Region markers are approximate · not for navigation</span>
      </div>
      <aside className="explorer-panel">
        <div>
          <p className="eyebrow">Choose a region</p>
          <h3>Where will the trail take you?</h3>
          <p className="explorer-panel-copy">
            Select a marker or region to see the journeys that begin there.
          </p>
        </div>
        <div className="region-list" role="group" aria-label="Trekking regions">
          {destinations.map((destination) => (
            <button
              className={`region-button${selected?.slug === destination.slug ? " is-active" : ""}`}
              type="button"
              aria-pressed={selected?.slug === destination.slug}
              onClick={() => setSelected(destination)}
              key={destination.slug}
            >
              <span>{destination.name}</span>
              <span>{destination.region}</span>
            </button>
          ))}
        </div>
        {selected && (
          <div className="explorer-selection">
            <span className="destination-region">{selected.region}</span>
            <h4>{selected.name}</h4>
            <p>{selected.description}</p>
            <div className="explorer-trek-links">
              {selectedTreks.map((trek) => (
                <Link to={`/treks/${trek.slug}`} key={trek.slug}>
                  {trek.title}<span aria-hidden="true">↗</span>
                </Link>
              ))}
            </div>
            <Link className="text-link" to={`/destinations/${selected.slug}`}>
              Explore {selected.name} <span aria-hidden="true">↗</span>
            </Link>
          </div>
        )}
      </aside>
    </div>
  );
}
