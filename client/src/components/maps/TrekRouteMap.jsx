import { useEffect, useMemo, useState } from "react";
import { Maximize2, Minus, Plus, RotateCcw, X } from "lucide-react";
import "./TrekRouteMap.css";

function getDayStop(day, index) {
  const dayNumber = day?.day ?? index + 1;
  const routeTarget = String(day?.to || "").split(/\s+(?:via|& return|over \d+ days)\b/i)[0].trim();
  const titleTarget = String(day?.title || "")
    .replace(/^(?:day\s*\d+[:.\-–]?\s*)/i, "")
    .split(/\s+(?:to|via|&|·|\|)\s+/i)
    .filter(Boolean)
    .at(-1)
    ?.replace(/\s*\([^)]*\)\s*/g, " ")
    .trim();
  const stop = routeTarget || titleTarget || `Route stop ${index + 1}`;
  const elevation = String(day?.elevation || "").match(/[\d,]+\s*m?/i)?.[0]?.trim();
  return { dayNumber, stop, elevation };
}

export default function TrekRouteMap({ trek, onSelectDay }) {
  const [zoom, setZoom] = useState(1);
  const [fullscreen, setFullscreen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [selectedStop, setSelectedStop] = useState(null);
  const stops = useMemo(
    () => (Array.isArray(trek.itinerary) ? trek.itinerary.map(getDayStop) : []),
    [trek.itinerary]
  );
  const imageUrl = trek.mapImageUrl || "";
  useEffect(() => {
    setImageFailed(false);
    setZoom(1);
  }, [imageUrl]);

  const viewer = (isFullscreen = false) => (
    <div className={`illustrated-map-viewer${isFullscreen ? " is-fullscreen" : ""}`}>
      {imageUrl && !imageFailed ? (
        <div className="illustrated-map-canvas">
          <img
            src={imageUrl}
            alt={`${trek.title} illustrated trekking route map`}
            style={{ transform: `scale(${zoom})` }}
            onError={() => setImageFailed(true)}
          />
          <div className="illustrated-map-controls" aria-label="Map image controls">
            <button type="button" aria-label="Zoom in" onClick={() => setZoom((current) => Math.min(3, current + 0.25))}><Plus size={18} /></button>
            <button type="button" aria-label="Zoom out" onClick={() => setZoom((current) => Math.max(1, current - 0.25))}><Minus size={18} /></button>
            <button type="button" aria-label="Reset zoom" onClick={() => setZoom(1)}><RotateCcw size={17} /></button>
            {!isFullscreen && <button type="button" aria-label="Fullscreen preview" onClick={() => setFullscreen(true)}><Maximize2 size={17} /></button>}
          </div>
        </div>
      ) : (
        <div className="illustrated-map-placeholder">
          <span className="illustrated-map-placeholder-icon" aria-hidden="true">⌁</span>
          <strong>Illustrated route map coming soon</strong>
          <span>A route map for {trek.title} has not been added yet.</span>
        </div>
      )}
      {isFullscreen && (
        <button className="illustrated-map-close" type="button" aria-label="Close fullscreen preview" onClick={() => setFullscreen(false)}><X size={22} /></button>
      )}
    </div>
  );

  return (
    <div className="illustrated-route-map">
      {viewer()}
      {stops.length > 0 && (
        <div className="illustrated-route-stops-wrap">
          <p className="illustrated-route-stops-title">Daily route stops <span>{stops.length} days</span></p>
          <div className="illustrated-route-stops" aria-label="Daily route stops">
            {stops.map((stop, index) => (
              <button
                className="illustrated-route-stop"
                data-active={selectedStop === index}
                type="button"
                key={`${stop.dayNumber}-${index}`}
                onClick={() => { setSelectedStop(index); onSelectDay?.(index); }}
                title={`Go to day ${stop.dayNumber} itinerary`}
              >
                <strong>Day {stop.dayNumber}: {stop.stop}</strong>
                {stop.elevation && <span>{stop.elevation}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
      {fullscreen && (
        <div className="illustrated-map-modal" role="dialog" aria-modal="true" aria-label={`${trek.title} route map preview`} onClick={() => setFullscreen(false)}>
          <div onClick={(event) => event.stopPropagation()}>{viewer(true)}</div>
        </div>
      )}
    </div>
  );
}
