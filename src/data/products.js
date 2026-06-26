import { CATALOG_SOURCE, CATEGORY_LABELS } from "./catalogSource";
import { TIERS } from "./tiers";
import { getFragranceDetails } from "./fragranceDetails";
import { PRODUCT_IMAGES } from "./productImages.js";
import { slugify } from "../utils/slugify";
import { getMinPrice } from "../utils/formatPrice";

// Бренды, у которых в каталоге показываем только название аромата (без бренда).
// Slug и пути к картинкам по-прежнему строятся из исходного бренда.
const HIDDEN_BRANDS = new Set([
  "Jo Malone",
  "Zielinski & Rozen",
  "Zielinski Rozen",
  "Tiziana Terenzi",
]);

function buildProduct([brand, name, tierKey, category, gender, bestseller]) {
  const slug = slugify(brand, name);
  const prices = { ...TIERS[tierKey] };
  const details = getFragranceDetails(slug, category);
  const volumes = Object.keys(prices)
    .map(Number)
    .sort((a, b) => a - b);
  const images = PRODUCT_IMAGES[slug] ?? [];
  const displayBrand = HIDDEN_BRANDS.has(brand) ? "" : brand;

  return {
    id: slug,
    slug,
    brand: displayBrand,
    name,
    fullName: displayBrand ? `${displayBrand} — ${name}` : name,
    category,
    categoryLabel: CATEGORY_LABELS[category],
    gender,
    prices,
    volumes,
    minPrice: getMinPrice(prices),
    bestseller: Boolean(bestseller),
    tagline: details.tagline,
    description: details.description,
    notes: details.notes,
    seasons: details.seasons,
    occasions: details.occasions,
    images,
    image: images[0] ?? null,
  };
}

export const products = CATALOG_SOURCE.map(buildProduct);

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(category) {
  if (category === "for-him") {
    return products.filter((p) => p.gender === "male");
  }
  return products.filter((p) => p.category === category);
}

export function getBestsellers(limit = 4) {
  const flagged = products.filter((p) => p.bestseller);
  if (flagged.length >= limit) return flagged.slice(0, limit);
  return products.slice(0, limit);
}

export function getSimilarProducts(product, limit = 4) {
  return products
    .filter(
      (p) =>
        p.slug !== product.slug &&
        (p.category === product.category || p.gender === product.gender),
    )
    .slice(0, limit);
}

export { CATEGORY_LABELS, CATEGORY_IDS } from "./catalogSource";
