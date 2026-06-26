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

  const dimensions = size === "sm" ? "h-9 w-9" : "h-10 w-10 sm:h-11 sm:w-11";
  const iconSize = size === "sm" ? "h-[17px] w-[17px]" : "h-[18px] w-[18px]";

  const inactive =
    tone === "dark"
      ? "border-white/30 bg-white/90 text-[#1c1c1c] hover:border-white/50"
      : "border-[#1c1c1c]/10 bg-white text-[#1c1c1c] hover:border-[#1c1c1c]/25";

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
          ? "border-[#1c1c1c]/15 bg-white text-[#1c1c1c]"
          : inactive
      } ${className}`}
    >
      <Heart
        className={iconSize}
        strokeWidth={active ? 0 : 1.5}
        fill={active ? "currentColor" : "none"}
      />
    </button>
  );
}
