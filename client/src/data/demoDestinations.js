import { treks } from "./demoTreks.js";

export const destinations = [
  {
    slug: "khumbu",
    name: "Khumbu",
    region: "Eastern Nepal",
    label: "Beneath the world's highest peaks",
    description:
      "A high Himalayan landscape of Sherpa villages, glacial valleys and trails beneath the Everest massif.",
    lat: 27.805,
    lng: 86.71,
    image: treks[0].image,
    trekSlugs: ["everest-base-camp", "gokyo-lakes"],
  },
  {
    slug: "annapurna",
    name: "Annapurna",
    region: "Central Nepal",
    label: "From forest to mountain sanctuary",
    description:
      "Terraced hillsides, rhododendron forest and big mountain views shape the many trails of the Annapurna region.",
    lat: 28.5306,
    lng: 83.878,
    image: treks[1].image,
    trekSlugs: ["annapurna-sanctuary", "poon-hill", "annapurna-circuit"],
  },
  {
    slug: "langtang",
    name: "Langtang",
    region: "Central Nepal",
    label: "A valley with its own quiet rhythm",
    description:
      "A varied mountain valley north of Kathmandu, known for forest trails, Tamang communities and open high meadows.",
    lat: 28.2128,
    lng: 85.6108,
    image: treks[2].image,
    trekSlugs: ["langtang-valley", "gosainkunda-lakes"],
  },
  {
    slug: "manaslu",
    name: "Manaslu",
    region: "Western Nepal",
    label: "A circuit into the remote Himalaya",
    description:
      "A more remote high-mountain circuit through village valleys and dramatic terrain around the Manaslu massif.",
    lat: 28.55,
    lng: 84.56,
    image: treks[3].image,
    trekSlugs: ["manaslu-circuit"],
  },
];

export const findDestination = (slug) =>
  destinations.find((destination) => destination.slug === slug);
