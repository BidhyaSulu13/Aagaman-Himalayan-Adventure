import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export function DestinationCard({ destination, index = 0 }) {
  return (
    <Link className={`destination-card destination-card-${index % 3}`} to={`/destinations/${destination.slug}`}>
      <img src={destination.image} alt={`${destination.name} mountain landscape`} loading="lazy" />
      <div className="destination-card-overlay" />
      <div className="destination-card-copy">
        <span className="destination-region">{destination.region}</span>
        <h3>{destination.name}</h3>
        <span className="destination-tagline">{destination.label}</span>
      </div>
      <span className="destination-arrow"><ArrowUpRight size={18} /></span>
    </Link>
  );
}
