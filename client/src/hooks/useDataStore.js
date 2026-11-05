import { useEffect, useState } from "react";
import { api } from "../services/api.js";
import { dataStore } from "../services/dataStore.js";

function useRemoteCollection(load, select, name) {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    let active = true;
    load()
      .then((response) => {
        if (active) setRecords(select(response));
      })
      .catch((error) => {
        console.error(`Unable to load public ${name} from the database:`, error);
        if (active) setRecords([]);
      });

    return () => {
      active = false;
    };
  }, [load, select, name]);

  return records;
}

const loadTreks = () => api.treks.getAll({ limit: 100 });
const loadDestinations = () => api.destinations.getAll();
const loadRegions = () => api.regions.getAll();
const loadArticles = () => api.articles.getAll();
const loadDepartures = () => api.departures.getAll();

const selectTreks = (response) =>
  Array.isArray(response.treks)
    ? response.treks.map((trek) => ({
        ...trek,
        image: trek.images?.[0] || trek.image || "",
        elevation: trek.maximumElevation ?? trek.elevation ?? 0,
        description: trek.shortDescription || trek.description || "",
      }))
    : [];
const selectDestinations = (response) =>
  Array.isArray(response.destinations)
    ? response.destinations.map((destination) => ({
        ...destination,
        id: destination._id || destination.id,
        image: destination.images?.[0] || destination.image || "",
        images: destination.images || [],
        lat: destination.coordinates?.lat ?? destination.lat,
        lng: destination.coordinates?.lng ?? destination.lng,
      }))
    : [];
const selectRegions = (response) =>
  Array.isArray(response.regions)
    ? response.regions.map((region) => ({
        ...region,
        id: region._id || region.id || region.slug,
        image: region.image || "",
      }))
    : [];
const selectArticles = (response) =>
  Array.isArray(response.articles)
    ? response.articles.map((article) => ({
        ...article,
        image: article.coverImage || article.image || "",
        read: article.readTime || article.read || "",
      }))
    : [];
const selectDepartures = (response) =>
  Array.isArray(response.departures)
    ? response.departures.map((departure) => ({
        ...departure,
        id: departure._id || departure.id,
        trekSlug: departure.trek?.slug || departure.trekSlug,
        trekTitle: departure.trek?.title || departure.trekTitle,
        startDate:
          typeof departure.startDate === "string"
            ? departure.startDate.slice(0, 10)
            : departure.startDate,
        endDate:
          typeof departure.endDate === "string"
            ? departure.endDate.slice(0, 10)
            : departure.endDate,
        availableSeats:
          departure.availableSeats ??
          (departure.capacity != null
            ? departure.capacity - (departure.bookedCount || 0)
            : undefined),
        totalSeats: departure.capacity ?? departure.totalSeats,
      }))
    : [];

export function useTreks() {
  return useRemoteCollection(loadTreks, selectTreks, "treks");
}

export function useArticles() {
  return useRemoteCollection(loadArticles, selectArticles, "articles");
}

export function useBookings() {
  const [bookings, setBookings] = useState(() => dataStore.getBookings());

  useEffect(() => {
    const handleUpdate = () => setBookings(dataStore.getBookings());
    window.addEventListener("agaaman_data_changed", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("agaaman_data_changed", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return bookings;
}

export function useDepartures() {
  return useRemoteCollection(loadDepartures, selectDepartures, "departures");
}

export function useDestinations() {
  return useRemoteCollection(loadDestinations, selectDestinations, "destinations");
}

export function useRegions() {
  return useRemoteCollection(loadRegions, selectRegions, "regions");
}

export function useGuides() {
  const [guides, setGuides] = useState(() => dataStore.getGuides());

  useEffect(() => {
    const handleUpdate = () => setGuides(dataStore.getGuides());
    window.addEventListener("agaaman_data_changed", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("agaaman_data_changed", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return guides;
}
