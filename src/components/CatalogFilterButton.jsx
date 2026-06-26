import { useEffect, useRef, useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import CatalogViewControls from "./CatalogViewControls";

export default function CatalogFilterButton({
  viewMode,
  onViewModeChange,
  pageSize,
  onPageSizeChange,
  gender,
  onGenderChange,
  price,
  onPriceChange,
  onlyBestsellers,
  onOnlyBestsellersChange,
  onReset,
  hasActiveFilters = false,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleClickOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="relative shrink-0" ref={rootRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Фильтры и отображение"
        aria-expanded={open}
        className={`relative flex h-10 w-10 items-center justify-center rounded-full border site-motion sm:h-11 sm:w-11 ${
          open
            ? "border-[#1c1c1c]/30 bg-[#1c1c1c] text-white"
            : "border-[#1c1c1c]/12 bg-white/80 text-[#1c1c1c] hover:border-[#1c1c1c]/25"
        }`}
      >
        <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
        {hasActiveFilters && !open && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#faf8f4] bg-[#c64b4b]" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-30 w-[min(320px,calc(100vw-2rem))] rounded-[16px] border border-[#e3ddcd] bg-white p-5 shadow-[0_12px_40px_rgba(28,28,28,0.12)]">
          <CatalogViewControls
            compact
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            pageSize={pageSize}
            onPageSizeChange={onPageSizeChange}
            gender={gender}
            onGenderChange={onGenderChange}
            price={price}
            onPriceChange={onPriceChange}
            onlyBestsellers={onlyBestsellers}
            onOnlyBestsellersChange={onOnlyBestsellersChange}
            onReset={onReset}
            hasActiveFilters={hasActiveFilters}
          />
        </div>
      )}
    </div>
  );
}
