import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, X } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { getProductBySlug } from "../../data/products";
import { formatPrice } from "../../utils/formatPrice";
import OrderButtons from "./OrderButtons";

function CartItemImage({ item }) {
  const product = getProductBySlug(item.slug);
  if (product?.images?.length) {
    return (
      <img
        src={product.images[0]}
        alt={product.fullName}
        className="h-full w-full object-cover object-center"
      />
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-1 bg-[#e8e4dc] px-2 text-center">
      {item.brand && (
        <span className="font-sans text-[8px] uppercase tracking-[0.14em] text-[#1c1c1c]/40">
          {item.brand}
        </span>
      )}
      <span className="font-denistina text-[13px] leading-tight text-[#1c1c1c]/55">
        {item.name}
      </span>
    </div>
  );
}

function CartLineItem({ item, onIncrement, onDecrement, onRemove, onClose }) {
  const lineTotal = item.price * item.qty;

  return (
    <article className="flex gap-3 border-b border-[#e3ddcd]/80 py-4 sm:gap-4 sm:py-5">
      <Link
        to={`/catalog/${item.slug}`}
        onClick={onClose}
        className="relative block h-[88px] w-[68px] shrink-0 overflow-hidden rounded-[12px] bg-[#e8e4dc] sm:h-[96px] sm:w-[72px]"
      >
        <CartItemImage item={item} />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              to={`/catalog/${item.slug}`}
              onClick={onClose}
              className="block min-w-0"
            >
              {item.brand && (
                <p className="truncate font-sans text-[10px] uppercase tracking-[0.1em] text-[#1c1c1c]/45">
                  {item.brand}
                </p>
              )}
              <h3 className="mt-0.5 font-sans text-[14px] font-medium leading-[1.3] text-[#1c1c1c] sm:text-[15px]">
                {item.name}
              </h3>
            </Link>
            <p className="mt-1 font-sans text-[12px] text-[#1c1c1c]/50 sm:text-[13px]">
              {item.volumeMl} мл
            </p>
          </div>

          <button
            type="button"
            onClick={() => onRemove(item.slug, item.volumeMl)}
            aria-label="Удалить из корзины"
            className="shrink-0 rounded-full p-1.5 text-[#1c1c1c]/35 site-motion hover:bg-[#1c1c1c]/5 hover:text-[#1c1c1c]/70"
          >
            <Trash2 className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className="flex h-[36px] items-center rounded-full bg-[#1c1c1c] px-1 text-white sm:h-[38px]">
            <button
              type="button"
              onClick={() => onDecrement(item.slug, item.volumeMl)}
              aria-label="Уменьшить количество"
              className="flex h-full w-9 items-center justify-center text-[16px] leading-none text-white/70 site-motion hover:text-white"
            >
              −
            </button>
            <span className="min-w-[2.5rem] text-center font-sans text-[13px] font-medium tabular-nums sm:text-[14px]">
              {item.qty} шт
            </span>
            <button
              type="button"
              onClick={() => onIncrement(item.slug, item.volumeMl)}
              aria-label="Увеличить количество"
              className="flex h-full w-9 items-center justify-center text-[16px] leading-none text-white/70 site-motion hover:text-white"
            >
              +
            </button>
          </div>

          <div className="text-right">
            <p className="font-sans text-[15px] font-medium tabular-nums text-[#1c1c1c] sm:text-[16px]">
              {formatPrice(lineTotal)} ₽
            </p>
            {item.qty > 1 && (
              <p className="mt-0.5 font-sans text-[11px] tabular-nums text-[#1c1c1c]/45">
                {formatPrice(item.price)} ₽ / шт
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function CartEmpty({ onClose }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
      <h3 className="font-denistina text-[32px] leading-none text-[#1c1c1c] sm:text-[36px]">
        Корзина пуста
      </h3>
      <p className="mt-3 max-w-[260px] font-sans text-[14px] leading-[1.5] text-[#1c1c1c]/55">
        Добавьте аромат из каталога — масляные композиции с мягким шлейфом ждут вас
      </p>
      <Link
        to="/catalog"
        onClick={onClose}
        className="mt-8 inline-flex h-[48px] items-center justify-center rounded-full bg-[#1c1c1c] px-8 font-sans text-[14px] font-medium text-white site-motion hover:bg-[#2a2a2a]"
      >
        Перейти в каталог
      </Link>
    </div>
  );
}

export default function CartDrawer() {
  const navigate = useNavigate();
  const {
    items,
    isOpen,
    closeCart,
    incrementItem,
    decrementItem,
    removeItem,
    clearCart,
    totalCount,
    totalPrice,
  } = useCart();

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeCart();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, closeCart]);

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  if (!isOpen) return null;

  const isEmpty = items.length === 0;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <button
        type="button"
        aria-label="Закрыть корзину"
        className="absolute inset-0 bg-black/45 backdrop-blur-[2px] site-motion"
        onClick={closeCart}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Корзина"
        className="cart-drawer-panel relative flex h-full w-full max-w-[440px] flex-col bg-[#faf8f4] shadow-[-8px_0_40px_rgba(0,0,0,0.12)]"
      >
        <header className="flex shrink-0 items-center justify-between border-b border-[#e3ddcd] px-5 py-4 sm:px-6 sm:py-5">
          <div>
            <h2 className="font-sans text-[18px] font-medium text-[#1c1c1c] sm:text-[20px]">
              Корзина
            </h2>
            {!isEmpty && (
              <p className="mt-0.5 font-sans text-[13px] text-[#1c1c1c]/50">
                {totalCount}{" "}
                {totalCount === 1
                  ? "товар"
                  : totalCount < 5
                    ? "товара"
                    : "товаров"}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Закрыть"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e3ddcd] text-[#1c1c1c]/70 site-motion hover:border-[#1c1c1c]/20 hover:text-[#1c1c1c]"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </header>

        {isEmpty ? (
          <CartEmpty onClose={closeCart} />
        ) : (
          <>
            <div className="flex items-center justify-between border-b border-[#e3ddcd]/60 px-5 py-3 sm:px-6">
              <button
                type="button"
                onClick={clearCart}
                className="font-sans text-[12px] text-[#1c1c1c]/45 underline-offset-2 site-motion hover:text-[#1c1c1c]/70 hover:underline sm:text-[13px]"
              >
                Очистить корзину
              </button>
              <button
                type="button"
                onClick={closeCart}
                className="font-sans text-[12px] text-[#1c1c1c]/45 underline-offset-2 site-motion hover:text-[#1c1c1c]/70 hover:underline sm:text-[13px]"
              >
                Продолжить покупки
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 sm:px-6">
              {items.map((item) => (
                <CartLineItem
                  key={`${item.slug}-${item.volumeMl}`}
                  item={item}
                  onIncrement={incrementItem}
                  onDecrement={decrementItem}
                  onRemove={removeItem}
                  onClose={closeCart}
                />
              ))}
            </div>

            <footer className="shrink-0 border-t border-[#e3ddcd] bg-[#faf8f4] px-5 py-5 sm:px-6 sm:py-6">
              <div className="flex items-center justify-between">
                <span className="font-sans text-[14px] text-[#1c1c1c]/60">
                  Итого
                </span>
                <span className="font-sans text-[22px] font-medium tabular-nums text-[#1c1c1c] sm:text-[24px]">
                  {formatPrice(totalPrice)} ₽
                </span>
              </div>

              <OrderButtons items={items} totalPrice={totalPrice} className="mt-4" />

              <button
                type="button"
                onClick={handleCheckout}
                className="mt-3 flex h-[48px] w-full items-center justify-center rounded-full border border-[#1c1c1c]/20 font-sans text-[14px] font-medium text-[#1c1c1c]/70 site-motion hover:border-[#1c1c1c]/40 hover:text-[#1c1c1c]"
              >
                Оформить с доставкой
              </button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
