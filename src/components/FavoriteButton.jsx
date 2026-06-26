import { Heart } from "lucide-react";
import { useFavorites } from "../context/FavoritesContext";

export default function FavoriteButton({
  slug,
  className = "",
  size = "md",
  tone = "light",
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(slug);

  const dimensions = size === "sm" ? "h-8 w-8" : "h-9 w-9 sm:h-10 sm:w-10";
  const iconSize = size === "sm" ? "h-4 w-4" : "h-[18px] w-[18px]";

  const base =
    tone === "dark"
      ? "border-white/25 bg-black/20 text-white hover:border-white/50"
      : "border-[#1c1c1c]/15 bg-white/80 text-[#1c1c1c] hover:border-[#1c1c1c]/40";

  const handleClick = (event) => {
    event.preventDefault();
    event.stopPropagation();
    toggleFavorite(slug);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={active}
      aria-label={active ? "Убрать из избранного" : "Добавить в избранное"}
      className={`flex shrink-0 items-center justify-center rounded-full border site-motion ${dimensions} ${
        active
          ? "border-[#c64b4b]/30 bg-[#c64b4b]/10 text-[#c64b4b] hover:border-[#c64b4b]/50"
          : base
      } ${className}`}
    >
      <Heart
        className={iconSize}
        strokeWidth={1.7}
        fill={active ? "currentColor" : "none"}
      />
    </button>
  );
}
