import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import OrderButtons from "../components/cart/OrderButtons";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../utils/formatPrice";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, totalCount } = useCart();
  const [customer, setCustomer] = useState({ name: "", phone: "", comment: "" });

  useEffect(() => {
    if (items.length === 0) {
      navigate("/catalog", { replace: true });
    }
  }, [items.length, navigate]);

  if (items.length === 0) return null;

  const updateField = (field) => (event) =>
    setCustomer((prev) => ({ ...prev, [field]: event.target.value }));

  return (
    <PageShell>
      <h1 className="font-denistina text-[40px] leading-none sm:text-[48px] lg:text-[56px]">
        Оформление заказа
      </h1>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
        <div className="space-y-5">
          <div>
            <label
              htmlFor="checkout-name"
              className="mb-2 block font-sans text-[13px] text-[#1c1c1c]/55"
            >
              Имя
            </label>
            <input
              id="checkout-name"
              name="name"
              value={customer.name}
              onChange={updateField("name")}
              className="h-12 w-full rounded-[14px] border border-[#1c1c1c]/12 bg-white px-4 font-sans text-[14px] outline-none site-motion focus:border-[#1c1c1c]/30"
              placeholder="Как к вам обращаться"
            />
          </div>

          <div>
            <label
              htmlFor="checkout-phone"
              className="mb-2 block font-sans text-[13px] text-[#1c1c1c]/55"
            >
              Телефон
            </label>
            <input
              id="checkout-phone"
              name="phone"
              type="tel"
              value={customer.phone}
              onChange={updateField("phone")}
              className="h-12 w-full rounded-[14px] border border-[#1c1c1c]/12 bg-white px-4 font-sans text-[14px] outline-none site-motion focus:border-[#1c1c1c]/30"
              placeholder="+7 (___) ___-__-__"
            />
          </div>

          <div>
            <label
              htmlFor="checkout-comment"
              className="mb-2 block font-sans text-[13px] text-[#1c1c1c]/55"
            >
              Комментарий
            </label>
            <textarea
              id="checkout-comment"
              name="comment"
              rows={4}
              value={customer.comment}
              onChange={updateField("comment")}
              className="w-full resize-none rounded-[14px] border border-[#1c1c1c]/12 bg-white px-4 py-3 font-sans text-[14px] outline-none site-motion focus:border-[#1c1c1c]/30"
              placeholder="Удобное время для связи или пожелания"
            />
          </div>

          <OrderButtons
            items={items}
            totalPrice={totalPrice}
            customer={customer}
            heading="Отправьте заказ в мессенджер"
            className="max-w-[400px] pt-1"
          />
          <p className="max-w-[400px] font-sans text-[12px] leading-[1.5] text-[#1c1c1c]/45">
            Заполните имя и телефон — они автоматически добавятся к заказу. Менеджер
            подтвердит наличие, сумму и доставку.
          </p>
        </div>

        <aside className="h-fit rounded-[18px] border border-[#e3ddcd] bg-white/70 p-6">
          <h2 className="font-sans text-[15px] font-medium text-[#1c1c1c]">
            Ваш заказ
          </h2>
          <ul className="mt-4 space-y-3 border-b border-[#e3ddcd] pb-4">
            {items.map((item) => (
              <li
                key={`${item.slug}-${item.volumeMl}`}
                className="flex items-start justify-between gap-3 font-sans text-[13px]"
              >
                <span className="min-w-0 text-[#1c1c1c]/75">
                  {[item.brand, item.name].filter(Boolean).join(" ")}, {item.volumeMl} мл × {item.qty}
                </span>
                <span className="shrink-0 tabular-nums text-[#1c1c1c]">
                  {formatPrice(item.price * item.qty)} ₽
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between">
            <span className="font-sans text-[14px] text-[#1c1c1c]/60">
              {totalCount} {totalCount < 5 ? "товара" : "товаров"}
            </span>
            <span className="font-sans text-[20px] font-medium tabular-nums text-[#1c1c1c]">
              {formatPrice(totalPrice)} ₽
            </span>
          </div>
          <Link
            to="/catalog"
            className="mt-5 inline-block font-sans text-[13px] text-[#1c1c1c]/50 underline-offset-2 hover:text-[#1c1c1c]/75 hover:underline"
          >
            Вернуться в каталог
          </Link>
        </aside>
      </div>
    </PageShell>
  );
}
