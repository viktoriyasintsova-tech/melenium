import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import ProductCard from "../components/ProductCard";
import ProductMedia from "../components/ProductMedia";
import FavoriteButton from "../components/FavoriteButton";
import PageShell from "../components/layout/PageShell";
import { useCart } from "../context/CartContext";
import { getProductBySlug, getSimilarProducts } from "../data/products";
import { formatPrice } from "../utils/formatPrice";

export default function ProductPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem, decrementItem, getItemQty } = useCart();
  const product = getProductBySlug(slug);
  const [volumeMl, setVolumeMl] = useState(product?.volumes[0]);

  if (!product) {
    return (
      <PageShell>
        <div className="py-16 text-center">
          <p className="font-sans text-[16px]">Аромат не найден</p>
          <Link
            to="/catalog"
            className="mt-4 inline-block font-sans text-[14px] underline"
          >
            Вернуться в каталог
          </Link>
        </div>
      </PageShell>
    );
  }

  const price = product.prices[volumeMl];
  const similar = getSimilarProducts(product);
  const qty = getItemQty(product.slug, volumeMl);

  const handleAdd = () => {
    addItem(product, volumeMl, { openDrawer: false });
  };

  const handleDecrement = () => {
    decrementItem(product.slug, volumeMl);
  };

  return (
    <PageShell>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 inline-flex items-center gap-2 font-sans text-[13px] text-[#1c1c1c]/60 site-motion hover:text-[#1c1c1c] sm:mb-8 sm:text-[14px]"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
        Назад
      </button>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <div className="overflow-hidden rounded-[16px] bg-[#e8e4dc] lg:rounded-[20px]">
            <div className="aspect-[3/4] w-full">
              <ProductMedia product={product} variant="detail" />
            </div>
          </div>

          <div>
            {product.brand && (
              <p className="font-sans text-[12px] uppercase tracking-[0.16em] text-[#1c1c1c]/45">
                {product.brand}
              </p>
            )}
            <div className="mt-2 flex items-start justify-between gap-4">
              <h1 className="font-denistina text-[40px] leading-none sm:text-[48px]">
                {product.name}
              </h1>
              <FavoriteButton slug={product.slug} className="mt-1" />
            </div>
            <p className="mt-3 font-sans text-[15px] italic text-[#1c1c1c]/70 sm:text-[16px]">
              {product.tagline}
            </p>

            <p className="mt-6 font-sans text-[20px] font-medium text-[#1c1c1c] sm:text-[22px]">
              {formatPrice(price)} ₽
            </p>

            <div className="mt-6">
              <p className="mb-3 font-sans text-[12px] uppercase tracking-[0.12em] text-[#1c1c1c]/50">
                Объём
              </p>
              <div className="flex flex-wrap gap-2">
                {product.volumes.map((ml) => (
                  <button
                    key={ml}
                    type="button"
                    onClick={() => setVolumeMl(ml)}
                    className={`min-w-[56px] rounded-full px-4 py-2.5 font-sans text-[14px] site-motion ${
                      volumeMl === ml
                        ? "bg-[#1c1c1c] text-white"
                        : "border border-[#1c1c1c]/20 bg-white/70 hover:border-[#1c1c1c]/40"
                    }`}
                  >
                    {ml} мл
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 w-full max-w-[400px]">
              {qty === 0 ? (
                <button
                  type="button"
                  onClick={handleAdd}
                  className="flex h-[52px] w-full items-center justify-center rounded-full bg-[#1c1c1c] font-sans text-[15px] font-medium text-white site-motion hover:bg-[#2a2a2a] sm:text-[16px]"
                >
                  Добавить в корзину
                </button>
              ) : (
                <div className="flex h-[52px] items-center rounded-full bg-[#1c1c1c] px-5 text-white site-motion hover:bg-[#2a2a2a] sm:px-6">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    aria-label="Уменьшить количество"
                    className="flex h-full w-10 shrink-0 items-center justify-start font-sans text-[18px] leading-none text-white/70 site-motion hover:text-white"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center font-sans text-[15px] font-medium tabular-nums sm:text-[16px]">
                    {qty} шт
                  </span>
                  <button
                    type="button"
                    onClick={handleAdd}
                    aria-label="Увеличить количество"
                    className="flex h-full w-10 shrink-0 items-center justify-end font-sans text-[18px] leading-none text-white/70 site-motion hover:text-white"
                  >
                    +
                  </button>
                </div>
              )}
            </div>

            <div className="mt-10 space-y-8 border-t border-[#e3ddcd] pt-10">
              <div>
                <h2 className="font-sans text-[13px] uppercase tracking-[0.12em] text-[#1c1c1c]/50">
                  Описание
                </h2>
                <p className="mt-3 font-sans text-[15px] leading-[1.6] text-[#1c1c1c]/85">
                  {product.description}
                </p>
              </div>

              <div>
                <h2 className="font-sans text-[13px] uppercase tracking-[0.12em] text-[#1c1c1c]/50">
                  Пирамида
                </h2>
                <ul className="mt-3 space-y-2 font-sans text-[14px] leading-[1.5] text-[#1c1c1c]/80">
                  <li>
                    <span className="text-[#1c1c1c]/45">Верхние: </span>
                    {product.notes.top}
                  </li>
                  <li>
                    <span className="text-[#1c1c1c]/45">Сердце: </span>
                    {product.notes.heart}
                  </li>
                  <li>
                    <span className="text-[#1c1c1c]/45">База: </span>
                    {product.notes.base}
                  </li>
                </ul>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <h2 className="font-sans text-[13px] uppercase tracking-[0.12em] text-[#1c1c1c]/50">
                    Сезон
                  </h2>
                  <p className="mt-2 font-sans text-[14px] text-[#1c1c1c]/80">
                    {product.seasons.join(" · ")}
                  </p>
                </div>
                <div>
                  <h2 className="font-sans text-[13px] uppercase tracking-[0.12em] text-[#1c1c1c]/50">
                    Случай
                  </h2>
                  <p className="mt-2 font-sans text-[14px] text-[#1c1c1c]/80">
                    {product.occasions.join(" · ")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {similar.length > 0 && (
          <section className="mt-16 border-t border-[#e3ddcd] pt-12 sm:mt-20 sm:pt-14">
            <h2 className="font-denistina text-[32px] leading-none sm:text-[40px]">
              Похожие ароматы
            </h2>
            <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-6">
              {similar.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          </section>
        )}
    </PageShell>
  );
}
