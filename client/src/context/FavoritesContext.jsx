import { createContext, useContext, useEffect, useMemo, useState } from "react";

const FavoritesContext = createContext(null);
const STORAGE_KEY = "himalayan-adventure-saved-treks";

function readSavedTreks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [savedTreks, setSavedTreks] = useState(readSavedTreks);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedTreks));
  }, [savedTreks]);

  const value = useMemo(
    () => ({
      savedTreks,
      isSaved: (slug) => savedTreks.includes(slug),
      toggleSaved: (slug) =>
        setSavedTreks((current) =>
          current.includes(slug)
            ? current.filter((saved) => saved !== slug)
            : [...current, slug],
        ),
    }),
    [savedTreks],
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
