export function formatPrice(value) {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function getMinPrice(prices) {
  const values = Object.values(prices);
  return Math.min(...values);
}
