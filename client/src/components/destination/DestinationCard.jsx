import { ArrowUpRight, Mountain } from "lucide-react";
import { Link } from "react-router-dom";

export function DestinationCard({ destination, index = 0 }) {
  const trekCount = destination.trekSlugs ? destination.trekSlugs.length : 0;
  return (
    <Link className={`destination-card destination-card-${index % 3}`} to={`/destinations/${destination.slug}`}>
      <img src={destination.image} alt={`${destination.name} landscape`} loading="lazy" />
      <div className="destination-card-overlay" />
      <div className="destination-card-copy">
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginBottom: "6px" }}>
          <span className="destination-region">{destination.region}</span>
          {destination.elevation > 0 && (
            <span style={{ fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "100px", background: "rgba(255,255,255,0.22)", color: "#ffffff", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <Mountain size={11} /> {destination.elevation.toLocaleString()}m
            </span>
          )}
          {trekCount > 0 && (
            <span style={{ fontSize: "11px", fontWeight: "600", padding: "2px 8px", borderRadius: "100px", background: "rgba(8, 60, 52, 0.75)", color: "#ffffff" }}>
              {trekCount} {trekCount === 1 ? "Route" : "Routes"}
            </span>
          )}
        </div>
        <h3>{destination.name}</h3>
        <span className="destination-tagline">{destination.label || (destination.description ? destination.description.slice(0, 80) + "..." : "")}</span>
      </div>
      <span className="destination-arrow"><ArrowUpRight size={18} /></span>
    </Link>
  );
}
