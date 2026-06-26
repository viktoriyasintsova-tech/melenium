import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const FavoritesContext = createContext(null);
const STORAGE_KEY = "mln_favorites";

function readStored() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [slugs, setSlugs] = useState(readStored);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(slugs));
    } catch {
      // localStorage может быть недоступен — игнорируем.
    }
  }, [slugs]);

  const toggleFavorite = useCallback((slug) => {
    if (!slug) return;
    setSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [slug, ...prev],
    );
  }, []);

  const isFavorite = useCallback((slug) => slugs.includes(slug), [slugs]);

  const clearFavorites = useCallback(() => setSlugs([]), []);

  const value = useMemo(
    () => ({
      slugs,
      count: slugs.length,
      toggleFavorite,
      isFavorite,
      clearFavorites,
    }),
    [slugs, toggleFavorite, isFavorite, clearFavorites],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
