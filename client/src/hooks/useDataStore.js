import { useEffect, useState } from "react";
import { dataStore } from "../services/dataStore.js";

export function useTreks() {
  const [treks, setTreks] = useState(() => dataStore.getTreks());

  useEffect(() => {
    const handleUpdate = () => setTreks(dataStore.getTreks());
    window.addEventListener("agaaman_data_changed", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("agaaman_data_changed", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return treks;
}

export function useArticles() {
  const [articles, setArticles] = useState(() => dataStore.getArticles());

  useEffect(() => {
    const handleUpdate = () => setArticles(dataStore.getArticles());
    window.addEventListener("agaaman_data_changed", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("agaaman_data_changed", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return articles;
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
  const [departures, setDepartures] = useState(() => dataStore.getDepartures());

  useEffect(() => {
    const handleUpdate = () => setDepartures(dataStore.getDepartures());
    window.addEventListener("agaaman_data_changed", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("agaaman_data_changed", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return departures;
}

export function useDestinations() {
  const [destinations, setDestinations] = useState(() => dataStore.getDestinations());

  useEffect(() => {
    const handleUpdate = () => setDestinations(dataStore.getDestinations());
    window.addEventListener("agaaman_data_changed", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("agaaman_data_changed", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return destinations;
}

export function useRegions() {
  const [regions, setRegions] = useState(() => dataStore.getRegions());

  useEffect(() => {
    const handleUpdate = () => setRegions(dataStore.getRegions());
    window.addEventListener("agaaman_data_changed", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("agaaman_data_changed", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return regions;
}
