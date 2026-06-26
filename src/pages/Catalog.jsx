import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../components/ProductCard";
import CatalogFilterButton from "../components/CatalogFilterButton";
import PageShell from "../components/layout/PageShell";
import {
  products,
  CATEGORY_LABELS,
  CATEGORY_IDS,
} from "../data/products";

const filters = [
  { id: "all", label: "Все" },
  ...CATEGORY_IDS.map((id) => ({ id, label: CATEGORY_LABELS[id] })),
  { id: "for-him", label: CATEGORY_LABELS["for-him"] },
  { id: "diffusers", label: CATEGORY_LABELS.diffusers },
];

const SORT_OPTIONS = [
  { id: "popular", label: "Популярные" },
  { id: "price-asc", label: "Сначала дешевле" },
  { id: "price-desc", label: "Сначала дороже" },
  { id: "name", label: "По названию" },
];

function matchesPrice(minPrice, price) {
  if (price === "le1100") return minPrice <= 1100;
  if (price === "1100-1400") return minPrice > 1100 && minPrice <= 1400;
  if (price === "gt1400") return minPrice > 1400;
  return true;
}

function sortProducts(list, sort) {
  const copy = [...list];
  if (sort === "price-asc") return copy.sort((a, b) => a.minPrice - b.minPrice);
  if (sort === "price-desc") return copy.sort((a, b) => b.minPrice - a.minPrice);
  if (sort === "name")
    return copy.sort((a, b) => a.name.localeCompare(b.name, "ru"));
  // popular: бестселлеры первыми, остальной порядок сохраняется
  return copy.sort((a, b) => Number(b.bestseller) - Number(a.bestseller));
}

function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set([1, total, current, current - 1, current + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const result = [];
  for (let i = 0; i < sorted.length; i += 1) {
    if (i > 0 && sorted[i] - sorted[i - 1] > 1) {
      result.push("…");
    }
    result.push(sorted[i]);
  }
  return result;
}

export default function Catalog() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "all";
  const [activeFilter, setActiveFilter] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState("grid");
  const [pageSize, setPageSize] = useState(12);
  const [sort, setSort] = useState("popular");
  const [gender, setGender] = useState("all");
  const [price, setPrice] = useState("all");
  const [onlyBestsellers, setOnlyBestsellers] = useState(false);

  const hasActiveFilters =
    gender !== "all" || price !== "all" || onlyBestsellers;

  const resetFilters = () => {
    setGender("all");
    setPrice("all");
    setOnlyBestsellers(false);
  };

  useEffect(() => {
    const cat = searchParams.get("category");
    if (cat) setActiveFilter(cat);
  }, [searchParams]);

  useEffect(() => {
    setPage(1);
  }, [activeFilter, search, pageSize, sort, gender, price, onlyBestsellers]);

  const isDiffusers = activeFilter === "diffusers";

  const filtered = useMemo(() => {
    if (isDiffusers) return [];

    let list = products;

    if (activeFilter === "for-him") {
      list = list.filter((p) => p.gender === "male");
    } else if (activeFilter !== "all") {
      list = list.filter((p) => p.category === activeFilter);
    }

    if (gender !== "all") {
      list = list.filter((p) => p.gender === gender);
    }

    if (price !== "all") {
      list = list.filter((p) => matchesPrice(p.minPrice, price));
    }

    if (onlyBestsellers) {
      list = list.filter((p) => p.bestseller);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q),
      );
    }

    return sortProducts(list, sort);
  }, [activeFilter, search, isDiffusers, gender, price, onlyBestsellers, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const paginated = filtered.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const pageNumbers = getPageNumbers(safePage, totalPages);
  const rangeStart = filtered.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const rangeEnd = Math.min(safePage * pageSize, filtered.length);

  const goToPage = (nextPage) => {
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pillActive = "bg-[#1c1c1c] text-white border border-[#1c1c1c]";
  const pillIdle =
    "border border-[#1c1c1c]/12 bg-transparent text-[#1c1c1c] hover:border-[#1c1c1c]/25";

  return (
    <PageShell>
      <h1 className="font-denistina text-[40px] leading-none sm:text-[48px] lg:text-[56px]">
        Каталог ароматов
      </h1>

      <div className="mb-10 mt-8 flex flex-wrap items-center gap-2 sm:mb-12 sm:mt-10 lg:gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setActiveFilter(f.id)}
                className={`rounded-full px-4 py-2 font-sans text-[13px] font-normal site-motion sm:text-[14px] ${
                  activeFilter === f.id ? pillActive : pillIdle
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {!isDiffusers && (
            <>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Поиск по бренду или названию"
                className="h-10 min-w-[200px] flex-1 rounded-full border border-[#1c1c1c]/12 bg-white/80 px-5 font-sans text-[14px] outline-none site-motion focus:border-[#1c1c1c]/30 sm:h-11 sm:min-w-[240px] lg:max-w-[320px]"
              />
              <div className="relative shrink-0">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  aria-label="Сортировка"
                  className="h-10 cursor-pointer appearance-none rounded-full border border-[#1c1c1c]/12 bg-white/80 pl-4 pr-9 font-sans text-[13px] text-[#1c1c1c] outline-none site-motion hover:border-[#1c1c1c]/25 focus:border-[#1c1c1c]/30 sm:h-11 sm:text-[14px]"
                >
                  {SORT_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#1c1c1c]/45"
                  strokeWidth={1.5}
                />
              </div>
              <CatalogFilterButton
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                gender={gender}
                onGenderChange={setGender}
                price={price}
                onPriceChange={setPrice}
                onlyBestsellers={onlyBestsellers}
                onOnlyBestsellersChange={setOnlyBestsellers}
                onReset={resetFilters}
                hasActiveFilters={hasActiveFilters}
              />
            </>
          )}
        </div>

        {isDiffusers ? (
          <div className="flex flex-col items-center py-20 text-center sm:py-24">
            <p className="font-denistina text-[32px] leading-none sm:text-[36px]">
              Скоро в наличии
            </p>
            <p className="mt-4 max-w-[400px] font-sans text-[15px] leading-[1.55] text-[#1c1c1c]/65">
              Диффузоры для дома скоро появятся в каталоге. Следите за
              обновлениями — мы уже готовим коллекцию ароматов для вашего
              пространства.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center font-sans text-[15px] text-[#1c1c1c]/60">
            Ничего не найдено. Попробуйте другой запрос или категорию.
          </p>
        ) : (
          <>
            <p className="mb-6 font-sans text-[13px] text-[#1c1c1c]/50 sm:text-[14px]">
              Показано {rangeStart}–{rangeEnd} из {filtered.length}
            </p>

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-6"
                  : "flex flex-col gap-3 sm:gap-4"
              }
            >
              {paginated.map((product, index) => (
                <div
                  key={product.slug}
                  className={
                    viewMode === "grid" && index < paginated.length - 1
                      ? "max-sm:border-b max-sm:border-[#1c1c1c]/5 max-sm:pb-5"
                      : ""
                  }
                >
                  <ProductCard product={product} layout={viewMode} />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center gap-6 sm:mt-14">
                {safePage < totalPages && (
                  <button
                    type="button"
                    onClick={() => goToPage(safePage + 1)}
                    className="inline-flex h-[48px] items-center justify-center rounded-full border border-[#1c1c1c]/20 px-8 font-sans text-[14px] text-[#1c1c1c] site-motion hover:border-[#1c1c1c]/40"
                  >
                    Показать ещё
                  </button>
                )}

                <nav
                  aria-label="Навигация по страницам каталога"
                  className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2"
                >
                  <button
                    type="button"
                    onClick={() => goToPage(safePage - 1)}
                    disabled={safePage === 1}
                    aria-label="Предыдущая страница"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1c1c1c]/15 text-[#1c1c1c] site-motion hover:border-[#1c1c1c]/35 disabled:pointer-events-none disabled:opacity-30 sm:h-10 sm:w-10"
                  >
                    <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                  </button>

                  {pageNumbers.map((item, index) =>
                    item === "…" ? (
                      <span
                        key={`ellipsis-${index}`}
                        className="px-1 font-sans text-[14px] text-[#1c1c1c]/40"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        onClick={() => goToPage(item)}
                        aria-label={`Страница ${item}`}
                        aria-current={safePage === item ? "page" : undefined}
                        className={`flex h-9 min-w-9 items-center justify-center rounded-full px-3 font-sans text-[14px] site-motion sm:h-10 sm:min-w-10 ${
                          safePage === item
                            ? "bg-[#1c1c1c] text-white"
                            : "border border-[#1c1c1c]/15 text-[#1c1c1c] hover:border-[#1c1c1c]/35"
                        }`}
                      >
                        {item}
                      </button>
                    ),
                  )}

                  <button
                    type="button"
                    onClick={() => goToPage(safePage + 1)}
                    disabled={safePage === totalPages}
                    aria-label="Следующая страница"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-[#1c1c1c]/15 text-[#1c1c1c] site-motion hover:border-[#1c1c1c]/35 disabled:pointer-events-none disabled:opacity-30 sm:h-10 sm:w-10"
                  >
                    <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </nav>
              </div>
            )}
          </>
        )}
    </PageShell>
  );
}
