import { writeFileSync } from "node:fs";
import { CATALOG_SOURCE } from "../src/data/catalogSource.js";
import { slugify } from "../src/utils/slugify.js";

const SITEMAP_COUNT = 10;

const SKIP_KEYWORDS = [
  "hair-mist",
  "body-wash",
  "shower-gel",
  "after-shave",
  "candle",
  "refill",
  "travel-set",
  "duo-",
  "lip-rehab",
  "hair-rehab",
  "moisturizer",
  "conditioner",
  "deodorant",
  "lotion",
  "shampoo",
  "soap",
  "palette",
  "lipstick",
  "mascara",
  "blush",
  "powder",
  "foundation",
  "concealer",
  "serum",
  "cream",
  "mask",
  "balm",
  "gel-rehab",
  "body-spray",
  "all-over-body",
];

function normalize(value) {
  return value
    .toLowerCase()
    .replace(/['.]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, "-");
}

function tokens(value) {
  return normalize(value)
    .split("-")
    .filter((token) => token.length > 1);
}

async function fetchSitemapUrls() {
  const urls = [];
  for (let i = 1; i <= SITEMAP_COUNT; i += 1) {
    const response = await fetch(`https://goldapple.ru/sitemap-${i}.xml`, {
      headers: { "User-Agent": "Mozilla/5.0 MillenniumCatalogBot/1.0" },
    });
    if (!response.ok) continue;
    const xml = await response.text();
    const matches = xml.matchAll(/https:\/\/goldapple\.ru\/(\d+)-([^<]+)/g);
    for (const match of matches) {
      urls.push({ itemId: match[1], slugPart: match[2] });
    }
  }
  return urls;
}

function scoreMatch(catalogEntry, gaEntry) {
  const [brand, name] = catalogEntry;
  const brandTokens = tokens(brand);
  const nameTokens = tokens(name);
  const slug = gaEntry.slugPart.toLowerCase();

  if (SKIP_KEYWORDS.some((keyword) => slug.includes(keyword))) {
    return 0;
  }

  const nameHits = nameTokens.filter((token) => slug.includes(token)).length;
  if (nameHits === 0) return 0;
  if (nameHits < Math.min(nameTokens.length, 2) && nameTokens.length > 1) {
    return 0;
  }

  let score = nameHits * 25;
  const brandHits = brandTokens.filter((token) => slug.includes(token)).length;
  score += brandHits * 15;

  if (slug === normalize(`${brand} ${name}`)) score += 40;
  if (slug.endsWith(normalize(name))) score += 20;
  if (slug.includes(normalize(name))) score += 10;

  return score;
}

const gaUrls = await fetchSitemapUrls();
const assignments = [];

for (const entry of CATALOG_SOURCE) {
  const productSlug = slugify(entry[0], entry[1]);
  const matches = gaUrls
    .map((gaEntry) => ({
      itemId: gaEntry.itemId,
      score: scoreMatch(entry, gaEntry),
      slugPart: gaEntry.slugPart,
    }))
    .filter((match) => match.score >= 40)
    .sort((a, b) => b.score - a.score || Number(b.itemId) - Number(a.itemId));

  for (const match of matches.slice(0, 6)) {
    assignments.push({ productSlug, ...match });
  }
}

assignments.sort((a, b) => b.score - a.score);

const itemOwners = new Map();
for (const assignment of assignments) {
  if (itemOwners.has(assignment.itemId)) continue;
  itemOwners.set(assignment.itemId, assignment.productSlug);
}

const mapping = {};
const mappingMeta = {};
for (const assignment of assignments) {
  if (itemOwners.get(assignment.itemId) !== assignment.productSlug) continue;
  if (!mapping[assignment.productSlug]) {
    mapping[assignment.productSlug] = [];
    mappingMeta[assignment.productSlug] = [];
  }
  if (mapping[assignment.productSlug].includes(assignment.itemId)) continue;
  mapping[assignment.productSlug].push(assignment.itemId);
  mappingMeta[assignment.productSlug].push({
    itemId: assignment.itemId,
    path: `${assignment.itemId}-${assignment.slugPart}`,
  });
  if (mapping[assignment.productSlug].length >= 4) continue;
}

const unresolved = CATALOG_SOURCE.map(([brand, name]) => {
  const productSlug = slugify(brand, name);
  if (mapping[productSlug]?.length) return null;
  return `${brand} — ${name}`;
}).filter(Boolean);

const output = `/** Auto-generated Gold Apple itemId map. Rebuild: node scripts/build-goldapple-map.mjs */
export const GOLDAPPLE_ITEM_MAP = ${JSON.stringify(mapping, null, 2)};

export const GOLDAPPLE_ITEM_PATHS = ${JSON.stringify(mappingMeta, null, 2)};

export const GOLDAPPLE_UNRESOLVED = ${JSON.stringify(unresolved, null, 2)};
`;

writeFileSync(new URL("../src/data/goldappleMap.js", import.meta.url), output);

console.log(`Mapped: ${Object.keys(mapping).length}`);
console.log(`Unresolved: ${unresolved.length}`);
if (unresolved.length) {
  console.log(unresolved.slice(0, 10).join("\n"));
}
