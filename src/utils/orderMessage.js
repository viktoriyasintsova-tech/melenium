import { formatPrice } from "./formatPrice";
import { ORDER_CONTACTS } from "../data/orderContacts";

export function buildOrderMessage({ items, totalPrice, customer } = {}) {
  const lines = (items ?? []).map((item) => {
    const title = [item.brand, item.name].filter(Boolean).join(" ");
    return `• ${title}, ${item.volumeMl} мл × ${item.qty} — ${formatPrice(
      item.price * item.qty,
    )} ₽`;
  });

  let message = `Здравствуйте! Хочу оформить заказ:\n\n${lines.join(
    "\n",
  )}\n\nИтого: ${formatPrice(totalPrice ?? 0)} ₽`;

  if (customer) {
    const extra = [];
    if (customer.name) extra.push(`Имя: ${customer.name}`);
    if (customer.phone) extra.push(`Телефон: ${customer.phone}`);
    if (customer.comment) extra.push(`Комментарий: ${customer.comment}`);
    if (extra.length) message += `\n\n${extra.join("\n")}`;
  }

  return message;
}

export function buildOrderLinks(message) {
  const text = encodeURIComponent(message);
  const { whatsapp, telegram, max } = ORDER_CONTACTS;

  return {
    // WhatsApp и Max открывают чат с уже подставленным текстом заказа.
    whatsapp: `https://wa.me/${whatsapp.phone}?text=${text}`,
    max: max.share
      ? `https://max.ru/:share?text=${text}`
      : max.url || "https://max.ru/",
    // Telegram запрещает подставлять текст в личный чат напрямую, поэтому
    // открываем чат, а текст заказа копируем в буфер обмена для вставки.
    telegram: telegram.username
      ? `https://t.me/${telegram.username}`
      : "https://t.me/",
  };
}

// Каналы, в которых текст заказа подставляется автоматически. Для остальных
// (Telegram) текст копируется в буфер обмена и показывается инструкция.
export const PREFILLS_TEXT = { whatsapp: true, telegram: false, max: true };
