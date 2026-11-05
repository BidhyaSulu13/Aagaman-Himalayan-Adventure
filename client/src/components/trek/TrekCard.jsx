import { Calendar, Compass, Flame, Heart, MapPin, Sparkles, Star, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext.jsx";
import { useToast } from "../../context/ToastContext.jsx";

export function TrekCard({ trek, badge: explicitBadge, compact = false }) {
  const { isSaved, isSaving, loading: favoritesLoading, toggleSaved } = useFavorites();
  const notify = useToast();
  const saved = isSaved(trek.slug);
  const saving = isSaving(trek.slug);

  const image =
    trek.images?.[0] ||
    trek.image ||
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=900&q=80";

  const reviewCount = Number(trek.approvedReviewsCount) || 0;
  const rating = reviewCount > 0
    ? Number(trek.calculatedRating ?? trek.rating) || 0
    : 0;

  const locationLabel = trek.location
    ? trek.location.split("·")[0].trim()
    : trek.region
    ? `${trek.region}, Nepal`
    : "Nepal Himalaya";

  // Determine dynamic badge
  const resolveBadge = () => {
    if (explicitBadge) return explicitBadge;
    if (trek.badge && trek.badge.toLowerCase() !== "top rated") return trek.badge;
    if (trek.isPopular || (trek.popularityScore && trek.popularityScore > 0)) return "Popular";
    if (trek.meetsThreshold || (reviewCount > 0 && rating >= 4.85)) return "Top Rated";
    if (trek.featured) return "Featured";
    if (trek.createdAt && Date.now() - new Date(trek.createdAt).getTime() < 45 * 24 * 60 * 60 * 1000)
      return "New";
    return null;
  };

  const badgeType = resolveBadge();

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const response = await toggleSaved(trek.slug, trek);
      if (response.requiresAuth) {
        notify("Sign in to save treks to your account.");
        return;
      }
      notify(saved ? "Removed from your saved treks" : "Added to your saved treks");
    } catch (error) {
      notify(error.message || "Unable to update saved treks.");
    }
  };

  // Badge styling configuration
  const renderBadge = () => {
    if (!badgeType) return null;
    switch (badgeType.toLowerCase()) {
      case "popular":
        return (
          <span className="trek-badge badge-popular" title="High booking & discovery volume">
            <Flame size={13} className="badge-icon" fill="currentColor" /> Popular
          </span>
        );
      case "top rated":
        return (
          <span className="trek-badge badge-top-rated" title="Highest verified customer ratings">
            <Star size={13} className="badge-icon" fill="currentColor" /> Top Rated
          </span>
        );
      case "featured":
        return (
          <span className="trek-badge badge-featured" title="Hand-picked Sherpa expedition">
            <Sparkles size={13} className="badge-icon" /> Featured
          </span>
        );
      case "new":
        return (
          <span className="trek-badge badge-new" title="Newly charted Himalayan route">
            <Zap size={13} className="badge-icon" /> New
          </span>
        );
      default:
        return <span className="trek-badge badge-default">{badgeType}</span>;
    }
  };

  return (
    <article className={`trek-card-v2 modern-trek-card${compact ? " is-compact" : ""}`}>
      {/* Top Image Wrap with smooth zoom */}
      <div className="trek-card-v2-img-box">
        <Link
          to={`/treks/${trek.slug}`}
          className="trek-card-v2-link"
          aria-label={`View ${trek.title} details`}
        >
          <img
            src={image}
            alt={trek.imageAlt || trek.title}
            loading="lazy"
            className="zoom-hover-img"
          />
        </Link>

        {/* Dynamic Badge */}
        {renderBadge()}

        {/* Difficulty Pill */}
        {trek.difficulty && (
          <span className={`trek-difficulty-pill diff-${trek.difficulty.toLowerCase()}`}>
            {trek.difficulty}
          </span>
        )}

        {/* Favorite Heart Button */}
        <button
          type="button"
          className={`card-v2-fav-btn${saved ? " is-saved" : ""}`}
          onClick={handleSave}
          disabled={favoritesLoading || saving}
          aria-label={saved ? `Remove ${trek.title} from saved` : `Save ${trek.title}`}
        >
          <Heart size={16} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Card Body */}
      <div className="trek-card-v2-body">
        {/* Meta Row: Location, Duration & Elevation */}
        <div className="trek-card-v2-meta-row">
          <span className="meta-loc" title={locationLabel}>
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

        {/* Rating and Reviews Row */}
        <div className="trek-rating-row">
          {reviewCount > 0 && (
            <div className="rating-pill">
              <Star size={14} fill="#f59e0b" color="#f59e0b" />
              <span className="rating-num">{rating.toFixed(1)}</span>
            </div>
          )}
          <span className="review-count-text">
            {reviewCount > 0
              ? `(${reviewCount} verified review${reviewCount === 1 ? "" : "s"})`
              : "(No approved reviews)"}
          </span>
          {trek.maximumElevation && (
            <span className="meta-elevation-tag" title="Maximum trail elevation">
              <Compass size={12} /> {trek.maximumElevation}m
            </span>
          )}
        </div>

        {/* Cost & Dual Action CTAs */}
        <div className="trek-card-v2-footer modern-footer-layout">
          <div className="v2-cost-block">
            <span className="v2-cost-label">Price from</span>
            <div className="price-value-wrap">
              <span className="v2-cost-value">${trek.price?.toLocaleString()}</span>
              {trek.originalPrice && trek.originalPrice > trek.price && (
                <span className="original-price-strike">${trek.originalPrice?.toLocaleString()}</span>
              )}
            </div>
          </div>

          <div className="card-actions-row">
            <Link
              to={`/treks/${trek.slug}`}
              className="card-cta-btn btn-details"
              title="Inspect full route & itinerary"
            >
              View Details
            </Link>
            <Link
              to={`/treks/${trek.slug}/book`}
              className="card-cta-btn btn-book"
              title="Book this departure"
            >
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

export default TrekCard;
