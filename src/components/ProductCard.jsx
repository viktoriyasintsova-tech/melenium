import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import ProductMedia from "./ProductMedia";
import FavoriteButton from "./FavoriteButton";
import { formatPrice } from "../utils/formatPrice";

export function ProductCardGrid({ product, variant = "light" }) {
  const isDark = variant === "dark";

  return (
    <article className="group flex flex-col">
      <div className="relative mx-auto w-[286px] max-w-full">
        <Link
          to={`/catalog/${product.slug}`}
          className={`relative block h-[341px] w-full overflow-hidden rounded-[12px] sm:rounded-[14px] lg:rounded-[16px] ${
            isDark ? "bg-white/[0.06] ring-1 ring-[#e3ddcd]/15" : "bg-[#e8e4dc]"
          }`}
        >
          <div className="h-full w-full">
            <ProductMedia product={product} variant="catalog" />
          </div>
        </Link>
        <FavoriteButton
          slug={product.slug}
          tone={isDark ? "dark" : "light"}
          size="sm"
          className="absolute right-3 top-3 z-10"
        />
      </div>

      <div className="mt-3 flex items-end justify-between gap-3 sm:mt-4">
        <div className="min-w-0">
          <Link to={`/catalog/${product.slug}`} className="block min-w-0">
            {product.brand && (
              <p
                className={`truncate font-sans text-[11px] font-normal uppercase tracking-[0.08em] ${
                  isDark ? "text-white/45" : "text-[#1c1c1c]/45"
                }`}
              >
                {product.brand}
              </p>
            )}
            <h3
              className={`truncate font-sans text-[14px] font-normal leading-[1.3] sm:text-[15px] lg:text-[16px] ${
                isDark ? "text-white" : "text-[#1c1c1c]"
              }`}
            >
              {product.name}
            </h3>
          </Link>
          <p
            className={`mt-1 font-sans text-[13px] font-normal leading-[1.3] sm:text-[14px] ${
              isDark ? "text-white/70" : "text-[#1c1c1c]/80"
            }`}
          >
            от {formatPrice(product.minPrice)} ₽
          </p>
        </div>

        <Link
          to={`/catalog/${product.slug}`}
          aria-label={`Открыть ${product.name}`}
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border site-motion sm:h-9 sm:w-9 ${
            isDark
              ? "border-white/25 text-white hover:border-white/50"
              : "border-[#1c1c1c]/25 text-[#1c1c1c] hover:border-[#1c1c1c]/50"
          }`}
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
        </Link>
      </div>
    </article>
  );
}

export function ProductCardList({ product, variant = "light" }) {
  const isDark = variant === "dark";

  return (
    <article
      className={`group flex gap-4 rounded-[14px] p-3 site-motion sm:gap-5 sm:p-4 ${
        isDark
          ? "bg-white/[0.05] ring-1 ring-[#e3ddcd]/12 hover:bg-white/[0.08]"
          : "bg-white/80 ring-1 ring-[#1c1c1c]/8 hover:bg-white"
      }`}
    >
      <div className="relative h-[100px] w-[80px] shrink-0 sm:h-[120px] sm:w-[96px]">
        <Link
          to={`/catalog/${product.slug}`}
          className={`relative block h-full w-full overflow-hidden rounded-[10px] ${
            isDark ? "bg-white/[0.06]" : "bg-[#e8e4dc]"
          }`}
        >
          <ProductMedia product={product} variant="catalog" showDots={false} />
        </Link>
        <FavoriteButton
          slug={product.slug}
          tone={isDark ? "dark" : "light"}
          size="sm"
          className="absolute right-1.5 top-1.5 z-10"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1 sm:gap-1.5">
        {product.brand && (
          <p
            className={`font-sans text-[10px] uppercase tracking-[0.12em] sm:text-[11px] ${
              isDark ? "text-white/40" : "text-[#1c1c1c]/45"
            }`}
          >
            {product.brand}
          </p>
        )}
        <Link to={`/catalog/${product.slug}`}>
          <h3
            className={`font-sans text-[15px] font-normal leading-[1.3] sm:text-[16px] ${
              isDark ? "text-white" : "text-[#1c1c1c]"
            }`}
          >
            {product.name}
          </h3>
        </Link>
        <p
          className={`font-sans text-[13px] sm:text-[14px] ${
            isDark ? "text-millennium-yellow/90" : "text-[#1c1c1c]/75"
          }`}
        >
          от {formatPrice(product.minPrice)} ₽
        </p>
        <p
          className={`hidden font-sans text-[13px] leading-[1.45] sm:line-clamp-2 ${
            isDark ? "text-white/55" : "text-[#1c1c1c]/60"
          }`}
        >
          {product.tagline}
        </p>
      </div>

      <Link
        to={`/catalog/${product.slug}`}
        className={`my-auto flex h-9 shrink-0 items-center justify-center rounded-full px-4 font-sans text-[13px] site-motion sm:h-10 sm:px-5 ${
          isDark
            ? "border border-[#e3ddcd]/30 text-[#e3ddcd] hover:border-[#e3ddcd]/55"
            : "border border-[#1c1c1c]/20 text-[#1c1c1c] hover:border-[#1c1c1c]/40"
        }`}
      >
        Смотреть
      </Link>
    </article>
  );
}

export default function ProductCard({ product, variant = "light", layout = "grid" }) {
  if (layout === "list") {
    return <ProductCardList product={product} variant={variant} />;
  }
  return <ProductCardGrid product={product} variant={variant} />;
}
