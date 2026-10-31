import { dataStore } from "../services/dataStore.js";
export { destinations } from "./demoDestinations.js";
export { treks } from "./demoTreks.js";
export { articles } from "./demoArticles.js";

export const findDestination = (slug) => {
  return dataStore.getDestination(slug);
};

export const findTrek = (slug) => {
  return dataStore.getTrek(slug);
};

export const getLiveDestinations = () => dataStore.getDestinations();
export const getLiveTreks = () => dataStore.getTreks();
export const getLiveArticles = () => dataStore.getArticles();
