import { LayoutGrid, List } from "lucide-react";

const PAGE_SIZE_OPTIONS = [12, 24, 48];

const GENDER_OPTIONS = [
  { id: "all", label: "Любой" },
  { id: "female", label: "Женский" },
  { id: "male", label: "Мужской" },
  { id: "unisex", label: "Унисекс" },
];

const PRICE_OPTIONS = [
  { id: "all", label: "Любая" },
  { id: "le1100", label: "до 1100 ₽" },
  { id: "1100-1400", label: "1100–1400 ₽" },
  { id: "gt1400", label: "от 1400 ₽" },
];

function Segmented({ options, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => onChange(option.id)}
          className={`rounded-full px-3 py-1.5 font-sans text-[13px] site-motion ${
            value === option.id
              ? "bg-[#1c1c1c] text-white"
              : "border border-[#1c1c1c]/12 text-[#1c1c1c]/70 hover:border-[#1c1c1c]/30"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export default function CatalogViewControls({
  viewMode,
  onViewModeChange,
  pageSize,
  onPageSizeChange,
  gender = "all",
  onGenderChange,
  price = "all",
  onPriceChange,
  onlyBestsellers = false,
  onOnlyBestsellersChange,
  onReset,
  hasActiveFilters = false,
  compact = false,
}) {
  const labelClass =
    "font-sans text-[12px] uppercase tracking-[0.1em] text-[#1c1c1c]/45";

  return (
    <div className={compact ? "flex flex-col gap-5" : "flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-6"}>
      {onGenderChange && (
        <div className="flex flex-col items-start gap-2">
          <span className={labelClass}>Пол</span>
          <Segmented options={GENDER_OPTIONS} value={gender} onChange={onGenderChange} />
        </div>
      )}

      {onPriceChange && (
        <div className="flex flex-col items-start gap-2">
          <span className={labelClass}>Цена</span>
          <Segmented options={PRICE_OPTIONS} value={price} onChange={onPriceChange} />
        </div>
      )}

      {onOnlyBestsellersChange && (
        <label className="flex cursor-pointer items-center gap-2.5 font-sans text-[14px] text-[#1c1c1c]">
          <input
            type="checkbox"
            checked={onlyBestsellers}
            onChange={(e) => onOnlyBestsellersChange(e.target.checked)}
            className="h-4 w-4 accent-[#1c1c1c]"
          />
          Только бестселлеры
        </label>
      )}

      <div className={`flex items-center gap-3 ${compact ? "flex-col items-start gap-2" : ""}`}>
        <span className={labelClass}>{compact ? "Вид отображения" : "Вид"}</span>
        <div className="flex rounded-full border border-[#1c1c1c]/12 bg-[#faf8f4] p-0.5">
          <button
            type="button"
            onClick={() => onViewModeChange("grid")}
            aria-label="Сетка"
            aria-pressed={viewMode === "grid"}
            className={`flex h-8 w-8 items-center justify-center rounded-full site-motion sm:h-9 sm:w-9 ${
              viewMode === "grid"
                ? "bg-[#1c1c1c] text-white"
                : "text-[#1c1c1c]/55 hover:text-[#1c1c1c]"
            }`}
          >
            <LayoutGrid className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange("list")}
            aria-label="Список"
            aria-pressed={viewMode === "list"}
            className={`flex h-8 w-8 items-center justify-center rounded-full site-motion sm:h-9 sm:w-9 ${
              viewMode === "list"
                ? "bg-[#1c1c1c] text-white"
                : "text-[#1c1c1c]/55 hover:text-[#1c1c1c]"
            }`}
          >
            <List className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className={`flex items-center gap-3 ${compact ? "flex-col items-start gap-2" : ""}`}>
        <span className={labelClass}>На странице</span>
        <div className="flex gap-1.5">
          {PAGE_SIZE_OPTIONS.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => onPageSizeChange(size)}
              className={`rounded-full px-3 py-1.5 font-sans text-[13px] site-motion sm:text-[14px] ${
                pageSize === size
                  ? "bg-[#1c1c1c] text-white"
                  : "text-[#1c1c1c]/55 hover:text-[#1c1c1c]"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {onReset && (
        <button
          type="button"
          onClick={onReset}
          disabled={!hasActiveFilters}
          className="self-start font-sans text-[13px] text-[#1c1c1c]/50 underline-offset-2 site-motion hover:text-[#1c1c1c]/80 hover:underline disabled:pointer-events-none disabled:opacity-40"
        >
          Сбросить фильтры
        </button>
      )}
    </div>
  );
}

export { PAGE_SIZE_OPTIONS };
