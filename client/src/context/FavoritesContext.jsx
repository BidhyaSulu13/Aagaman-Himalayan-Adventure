import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import { api } from "../services/api.js";

const FavoritesContext = createContext(null);

function normalizeTreks(treks) {
  if (!Array.isArray(treks)) return [];
  return treks
    .map((trek) => typeof trek === "string" ? { slug: trek } : trek)
    .filter((trek) => typeof trek?.slug === "string" && trek.slug);
}

export function FavoritesProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [savedTreks, setSavedTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingSlugs, setSavingSlugs] = useState([]);
  const savedTreksRef = useRef([]);
  const ownerKey = user?._id || (user ? user.email : "guest");
  const ownerKeyRef = useRef(ownerKey);
  ownerKeyRef.current = ownerKey;

  useEffect(() => {
    if (authLoading) return undefined;
    let active = true;
    savedTreksRef.current = [];
    setSavedTreks([]);
    setLoading(true);
    setError("");

    try {
      localStorage.removeItem("himalayan-adventure-saved-treks");
      localStorage.removeItem("himalayan-adventure-saved-treks:guest");
    } catch (storageError) {
      console.error("Unable to clear browser-only saved treks:", storageError);
    }

    if (!user) {
      savedTreksRef.current = [];
      setSavedTreks([]);
      setLoading(false);
      return () => { active = false; };
    }

    api.favorites.get()
      .then((response) => {
        if (!response.success || !Array.isArray(response.treks)) {
          throw new Error("The saved trek response was invalid.");
        }
        if (active) {
          const accountTreks = normalizeTreks(response.treks);
          savedTreksRef.current = accountTreks;
          setSavedTreks(accountTreks);
        }
      })
      .catch((requestError) => {
        console.error("Unable to load account saved treks:", requestError);
        if (active) setError("Saved treks could not be loaded. Please refresh the page.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => { active = false; };
  }, [user, authLoading, ownerKey]);

  const toggleSaved = useCallback(async (slug, trek) => {
    if (!user) {
      navigate("/login", {
        state: { returnTo: `${location.pathname}${location.search}` },
      });
      return { requiresAuth: true };
    }
    if (loading) throw new Error("Your saved treks are still loading. Please try again.");
    if (!slug) throw new Error("This trek cannot be saved because it has no route identifier.");

    const identity = ownerKeyRef.current;
    const previousList = savedTreksRef.current;
    const currentSaved = previousList.some((saved) => saved.slug === slug);
    const nextSaved = !currentSaved;
    const nextList = nextSaved
      ? [...previousList.filter((saved) => saved.slug !== slug), { ...(typeof trek === "object" ? trek : {}), slug }]
      : previousList.filter((saved) => saved.slug !== slug);
    savedTreksRef.current = nextList;
    setSavedTreks(nextList);

    const trekId = typeof trek === "string" ? trek : trek?._id || trek?.id;
    if (!trekId) {
      savedTreksRef.current = previousList;
      setSavedTreks(previousList);
      throw new Error("This trek cannot be saved to your account. Refresh the trek list and try again.");
    }

    setSavingSlugs((current) => [...new Set([...current, slug])]);
    try {
      const response = await api.favorites.toggle(trekId);
      if (!response.success || response.saved !== nextSaved) {
        throw new Error(response.message || "The saved trek could not be updated.");
      }
      return response;
    } catch (requestError) {
      if (ownerKeyRef.current === identity) {
        const currentList = savedTreksRef.current;
        const restoredList = currentSaved
          ? [...currentList.filter((saved) => saved.slug !== slug), previousList.find((saved) => saved.slug === slug)]
          : currentList.filter((saved) => saved.slug !== slug);
        savedTreksRef.current = restoredList;
        setSavedTreks(restoredList);
        setError(requestError.message || "The saved trek could not be updated.");
      }
      throw requestError;
    } finally {
      setSavingSlugs((current) => current.filter((savingSlug) => savingSlug !== slug));
    }
  }, [loading, user, navigate, location.pathname, location.search]);

  const value = useMemo(
    () => ({
      savedTreks,
      loading,
      error,
      isSaving: (slug) => savingSlugs.includes(slug),
      isSaved: (slug) => savedTreks.some((trek) => trek.slug === slug),
      toggleSaved,
    }),
    [savedTreks, loading, error, savingSlugs, toggleSaved],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
