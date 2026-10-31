export const heroImage =
  "https://res.cloudinary.com/dslrn3soo/image/upload/f_auto,c_limit,w_3840,q_auto/summit-trail-trekking/Annapurna_Base_Camp_Short_Trek_-_9_Days_vld8hb.jpg";

export const allSeasons = ["Spring", "Summer", "Autumn", "Winter"];

export function Image({ src, alt, className = "", ...props }) {
  return (
    <img
      className={className}
      src={src}
      alt={alt}
      loading="lazy"
      onError={(event) => {
        event.currentTarget.style.visibility = "hidden";
      }}
      {...props}
    />
  );
}

export function DemoBanner() {
  return (
    <div className="demo-banner">
      <span className="demo-dot" /> Demonstration experience · trip data is illustrative
    </div>
  );
}

export function MapLoading() {
  return <div className="map-loading" role="status">Loading the Himalayan explorer...</div>;
}
