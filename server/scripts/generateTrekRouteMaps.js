import "dotenv/config";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { Trek } from "../src/models/Trek.js";

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const publicMapsDir = path.resolve(scriptDir, "../../client/public/maps");
const width = 1400;
const height = 900;

function escapeXml(value = "") {
  return String(value).replace(/[<>&"']/g, (char) => ({
    "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&apos;",
  })[char]);
}

function destinationFromDay(day, index) {
  const raw = String(day.to || day.title || `Day ${index + 1}`);
  return raw.replace(/^day\s*\d+[:.\-–—]?\s*/i, "")
    .replace(/\s+(?:via|& return|over \d+ days)\b.*$/i, "")
    .replace(/\s*\([^)]*\)/g, "").trim() || `Route stop ${index + 1}`;
}

function categoriesFor(stop, day = {}) {
  const text = `${stop} ${day.title || ""} ${day.details || ""} ${day.stay || ""}`.toLowerCase();
  const categories = [];
  if (/lake|pokh?ari|tsho|kund|tal\b/.test(text)) categories.push("lake");
  if (/base camp|peak|summit|\bri\b|mountain|himalaya/.test(text)) categories.push("mountain");
  if (/pass|\bla\b/.test(text)) categories.push("pass");
  if (/view|sunrise|panorama|ridge/.test(text)) categories.push("viewpoint");
  if (/airport|flight|kathmandu|pokhara|lukla/.test(text)) categories.push("flight");
  if (/lodge|hotel|teahouse|guesthouse|camp/.test(text)) categories.push("lodge");
  return [...new Set(categories)];
}

function makeMapSvg(trek) {
  const itinerary = (trek.itinerary || []).slice(0, 24);
  const stops = itinerary.length ? itinerary.map(destinationFromDay) : [trek.region || "Trailhead", trek.title];
  const count = stops.length;
  const points = stops.map((_, index) => {
    const progress = count < 2 ? 0.5 : index / (count - 1);
    return {
      x: 90 + progress * 850,
      y: 700 - progress * 480 + Math.sin(index * 1.13) * 78 + (index % 2 ? 18 : -18),
    };
  });
  const route = points.map(({ x, y }, index) => {
    if (!index) return `M${x.toFixed(1)},${y.toFixed(1)}`;
    const previous = points[index - 1];
    const midX = (previous.x + x) / 2;
    const bend = (index % 2 ? -1 : 1) * Math.min(54, Math.abs(x - previous.x) * 0.16);
    return `Q${midX.toFixed(1)},${((previous.y + y) / 2 + bend).toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const markers = points.map(({ x, y }, index) => {
    const label = stops[index].length > 25 ? `${stops[index].slice(0, 23)}...` : stops[index];
    const labelY = y + (index % 2 ? 48 : -34);
    const icons = categoriesFor(stops[index], itinerary[index]).map((category, iconIndex) =>
      `<use href="#${category}" x="${x + 25 + iconIndex * 23}" y="${y - 12}" width="22" height="22"/>`).join("");
    const elevation = itinerary[index]?.elevation ? ` | ${Number(itinerary[index].elevation).toLocaleString()} m` : "";
    return `<g><circle cx="${x}" cy="${y}" r="19" fill="#fffdf7" stroke="#173f36" stroke-width="4"/><circle cx="${x}" cy="${y}" r="14" fill="#f2a735"/><text x="${x}" y="${y + 6}" text-anchor="middle" class="number">${index + 1}</text>${icons}<text x="${x}" y="${labelY}" text-anchor="middle" class="place">${escapeXml(label)}</text><text x="${x}" y="${labelY + 20}" text-anchor="middle" class="day">DAY ${escapeXml(itinerary[index]?.day ?? index + 1)}${escapeXml(elevation)}</text></g>`;
  }).join("");
  const categories = [...new Set(points.flatMap((_, index) => categoriesFor(stops[index], itinerary[index])))];
  const legendEntries = [
    ["trail", "Trekking route"], ["stop", "Itinerary stop"], ["mountain", "Mountain / summit"],
    ["lake", "Lake"], ["lodge", "Lodge / overnight"], ["pass", "Mountain pass"],
    ["viewpoint", "Viewpoint"], ["flight", "Flight / gateway"],
  ].filter(([key]) => key === "trail" || key === "stop" || categories.includes(key));
  const legend = legendEntries.map(([key, label], index) => {
    const y = 300 + index * 51;
    const symbol = key === "trail"
      ? `<path d="M1110 ${y}h42" stroke="#c95f35" stroke-width="5" stroke-dasharray="3 8" stroke-linecap="round"/>`
      : key === "stop"
        ? `<circle cx="1131" cy="${y}" r="10" fill="#f2a735" stroke="#173f36" stroke-width="3"/>`
        : `<use href="#${key}" x="1119" y="${y - 12}" width="24" height="24"/>`;
    return `${symbol}<text x="1164" y="${y + 5}" class="legend-label">${escapeXml(label)}</text>`;
  }).join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Illustrated route map for ${escapeXml(trek.title)}">
<defs>
<linearGradient id="paper" x2="0" y2="1"><stop stop-color="#fffef9"/><stop offset="1" stop-color="#f3f0e5"/></linearGradient>
<pattern id="contours" width="170" height="130" patternUnits="userSpaceOnUse"><path d="M-40 70Q15 5 80 70T200 68M-35 88Q15 25 80 88T205 86M-30 106Q15 45 80 106T210 104" fill="none" stroke="#d6dfd1" stroke-width="1.5"/></pattern>
<symbol id="mountain" viewBox="0 0 24 24"><path d="M2 20 9 6l4 7 3-5 6 12Z" fill="#718b9b" stroke="#324f61" stroke-width="1.5"/><path d="m7 10 2-4 2 4-2-1Zm7 1 2-3 2 4-2-1Z" fill="#fff"/></symbol>
<symbol id="lake" viewBox="0 0 24 24"><path d="M3 9q4-4 8 0t10 0v8q-5 4-10 0t-8 0Z" fill="#8bc5d4" stroke="#397b91" stroke-width="1.5"/><path d="M5 12q3-2 6 0t7 0" fill="none" stroke="#fff" stroke-width="1.3"/></symbol>
<symbol id="lodge" viewBox="0 0 24 24"><path d="M3 11 12 4l9 7v9H3Z" fill="#d8aa70" stroke="#72533c" stroke-width="1.5"/><path d="M8 20v-6h8v6M2 11l10-8 10 8" fill="none" stroke="#72533c" stroke-width="1.5"/></symbol>
<symbol id="pass" viewBox="0 0 24 24"><path d="M3 20 12 5l9 15Z" fill="#a6b5b4" stroke="#52666b" stroke-width="1.4"/><path d="M12 7v9m0-9 6 2-6 2" fill="none" stroke="#c2523e" stroke-width="1.8"/></symbol>
<symbol id="viewpoint" viewBox="0 0 24 24"><path d="M2 12s4-6 10-6 10 6 10 6-4 6-10 6S2 12 2 12Z" fill="#fff" stroke="#a7742a" stroke-width="1.6"/><circle cx="12" cy="12" r="3" fill="#e3a43b"/></symbol>
<symbol id="flight" viewBox="0 0 24 24"><path d="m2 14 8-2 3-9 2-1 1 9 6 2v2l-7-1-2 5-2 1v-6l-7 2Z" fill="#567f91"/></symbol>
</defs>
<style>.title{font:700 31px Arial,sans-serif;fill:#163d36}.sub{font:15px Arial,sans-serif;fill:#68756e}.place{font:700 16px Arial,sans-serif;fill:#183d36;paint-order:stroke;stroke:#fffdf7;stroke-width:6px;stroke-linejoin:round}.day{font:12px Arial,sans-serif;fill:#69776f;letter-spacing:.5px;paint-order:stroke;stroke:#fffdf7;stroke-width:5px}.number{font:700 15px Arial,sans-serif;fill:#173d35}.legend-label{font:15px Arial,sans-serif;fill:#334b45}.tiny{font:12px Arial,sans-serif;fill:#748079}</style>
<rect width="1400" height="900" fill="url(#paper)"/><rect width="1080" height="900" fill="url(#contours)" opacity=".9"/>
<path d="M0 590 90 470 170 530 285 330 370 475 485 240 590 455 710 285 810 470 920 260 1010 420 1080 360V900H0Z" fill="#e4e9dc" opacity=".8"/><path d="m55 512 115-200 94 159 116-249 112 214 104-190 115 211 109-202 107 210" fill="none" stroke="#c8d4c9" stroke-width="3" opacity=".8"/>
<rect x="1080" y="0" width="320" height="900" fill="#fffdf7"/><path d="M1080 0v900" stroke="#d9ddd4" stroke-width="2"/>
<text x="52" y="60" class="title">${escapeXml(trek.title)} | ROUTE MAP</text><text x="54" y="89" class="sub">${escapeXml(trek.region || "Nepal")} | ${escapeXml(trek.duration || stops.length)}-day itinerary | Places shown in travel order</text>
${stops.map((_, index) => `<use href="#mountain" x="${100 + (index * 137) % 850}" y="${140 + (index * 89) % 560}" width="34" height="34" opacity=".5"/>`).join("")}
<path d="${route}" fill="none" stroke="#fffdf7" stroke-width="13" stroke-linecap="round" stroke-linejoin="round"/><path d="${route}" fill="none" stroke="#c95f35" stroke-width="5" stroke-dasharray="2 9" stroke-linecap="round" stroke-linejoin="round"/>${markers}
<text x="1110" y="75" class="title" style="font-size:22px">MAP LEGEND</text><text x="1110" y="103" class="tiny">Consistent symbols by place type</text>${legend}
<path d="M1110 748h250" stroke="#e1e4dc"/><text x="1110" y="782" class="sub">${stops.length} itinerary stops</text><text x="1110" y="809" class="tiny">Illustrated route overview</text><text x="1110" y="830" class="tiny">For trip planning, not navigation</text>
<text x="54" y="855" class="tiny">N</text><text x="1040" y="855" text-anchor="end" class="tiny">SCHEMATIC ROUTE MAP | NOT TO SCALE</text></svg>`;
}

async function generateTrekRouteMaps() {
  await mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/himalayan_adventure");
  try {
    const treks = await Trek.find({ isArchived: { $ne: true } }).select("_id slug title region duration itinerary mapImageUrl");
    await mkdir(publicMapsDir, { recursive: true });
    let updated = 0;
    for (const trek of treks) {
      const filename = `${trek.slug}-route.svg`;
      await writeFile(path.join(publicMapsDir, filename), makeMapSvg(trek), "utf8");
      const mapImageUrl = `/maps/${filename}`;
      if (trek.mapImageUrl !== mapImageUrl) {
        trek.mapImageUrl = mapImageUrl;
        await trek.save();
        updated += 1;
      }
      console.log(`${trek.title}: ${mapImageUrl}`);
    }
    console.log(`Generated ${treks.length} illustrated maps; updated ${updated} map URLs.`);
  } finally {
    await mongoose.disconnect();
  }
}

generateTrekRouteMaps().catch((error) => {
  console.error("Trek map generation failed:", error.message);
  process.exitCode = 1;
});
