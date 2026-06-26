import { Link } from "react-router-dom";
import { Heart } from "lucide-react";
import ProductCard from "../components/ProductCard";
import PageShell from "../components/layout/PageShell";
import { useFavorites } from "../context/FavoritesContext";
import { getProductBySlug } from "../data/products";

export default function Favorites() {
  const { slugs, clearFavorites } = useFavorites();
  const items = slugs.map(getProductBySlug).filter(Boolean);

  return (
    <PageShell>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-denistina text-[40px] leading-none sm:text-[48px] lg:text-[56px]">
          Избранное
        </h1>
        {items.length > 0 && (
          <button
            type="button"
            onClick={clearFavorites}
            className="font-sans text-[13px] text-[#1c1c1c]/50 underline-offset-2 site-motion hover:text-[#1c1c1c]/80 hover:underline"
          >
            Очистить список
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center sm:py-28">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#1c1c1c]/5 text-[#1c1c1c]/50">
            <Heart className="h-7 w-7" strokeWidth={1.5} />
          </span>
          <p className="mt-5 font-sans text-[16px] text-[#1c1c1c]">
            Здесь пока пусто
          </p>
          <p className="mt-2 max-w-[380px] font-sans text-[14px] leading-[1.55] text-[#1c1c1c]/60">
            Нажимайте на сердечко у понравившихся ароматов — и они появятся
            здесь, чтобы вернуться к ним позже.
          </p>
          <Link
            to="/catalog"
            className="site-btn-primary mt-7 gap-2"
          >
            Перейти в каталог
          </Link>
        </div>
      ) : (
        <>
          <p className="mb-6 mt-8 font-sans text-[13px] text-[#1c1c1c]/50 sm:text-[14px]">
            {items.length}{" "}
            {items.length % 10 === 1 && items.length % 100 !== 11
              ? "аромат"
              : items.length % 10 >= 2 &&
                  items.length % 10 <= 4 &&
                  (items.length % 100 < 10 || items.length % 100 >= 20)
                ? "аромата"
                : "ароматов"}
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-6">
            {items.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        </>
      )}
    </PageShell>
  );
}
