import { Calendar, Heart, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export function TrekCard({ trek, compact = false }) {
  const { isSaved, toggleSaved } = useFavorites();
  const notify = useToast();
  const saved = isSaved(trek.slug);
  const image = trek.image;
  const rating = trek.rating || 4.9;
  const locationLabel = trek.location ? trek.location.split("·")[0].trim() : `Nepal / ${trek.region}`;

  const handleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaved(trek.slug);
    notify(saved ? "Removed from your saved treks" : "Added to your saved treks");
  };

  return (
    <article className={`trek-card-v2${compact ? " is-compact" : ""}`}>
      {/* Top Image Wrap */}
      <div className="trek-card-v2-img-box">
        <Link to={`/treks/${trek.slug}`} className="trek-card-v2-link" aria-label={`View ${trek.title}`}>
          <img src={image} alt={trek.imageAlt || trek.title} loading="lazy" />
        </Link>

        {/* Best Sellers Badge (Screenshot 2 style) */}
        <span className="top-picks-badge">
          <Star size={13} fill="#111" color="#111" /> Top Picks
        </span>

        {/* Favorite Button */}
        <button
          type="button"
          className={`card-v2-fav-btn${saved ? " is-saved" : ""}`}
          onClick={handleSave}
          aria-label={saved ? `Remove ${trek.title} from saved` : `Save ${trek.title}`}
        >
          <Heart size={16} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Card Content (Screenshot 2 style) */}
      <div className="trek-card-v2-body">
        {/* Location & Duration row */}
        <div className="trek-card-v2-meta-row">
          <span className="meta-loc">
            <MapPin size={15} className="meta-icon" />
            <span>{locationLabel}</span>
          </span>
          <span className="meta-days">
            <Calendar size={15} className="meta-icon" />
            <span>{trek.duration} Days</span>
          </span>
        </div>

        {/* Big Bold Title */}
        <h3 className="trek-card-v2-title">
          <Link to={`/treks/${trek.slug}`}>{trek.title}</Link>
        </h3>

        {/* Cost & View Details Button */}
        <div className="trek-card-v2-footer">
          <div className="v2-cost-block">
            <span className="v2-cost-label">Cost From</span>
            <span className="v2-cost-value">US ${trek.price?.toLocaleString()}</span>
          </div>

          <Link to={`/treks/${trek.slug}`} className="v2-view-btn">
            Explore
          </Link>
        </div>
      </div>
    </article>
  );
}
