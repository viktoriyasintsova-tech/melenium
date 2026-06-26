#!/usr/bin/env node
/**
 * Export category images from Figma node 437:134 (Экран 3).
 * Usage: FIGMA_ACCESS_TOKEN=xxx node scripts/export-figma-categories.mjs
 */
const FILE_KEY = "ardfJW19yTiGRMAOkCI9vv";
const NODE_ID = "437:134";
const token = process.env.FIGMA_ACCESS_TOKEN;

if (!token) {
  console.error("Set FIGMA_ACCESS_TOKEN environment variable.");
  process.exit(1);
}

const headers = { "X-Figma-Token": token };

async function figmaFetch(path) {
  const res = await fetch(`https://api.figma.com/v1${path}`, { headers });
  if (!res.ok) throw new Error(`${path} → ${res.status} ${await res.text()}`);
  return res.json();
}

async function main() {
  const { fs, path } = await import("node:fs/promises");
  const { createWriteStream } = await import("node:fs");
  const { pipeline } = await import("node:stream/promises");
  const outDir = new URL("../public/assets/categories/", import.meta.url);

  await fs.mkdir(outDir, { recursive: true });

  const file = await figmaFetch(`/files/${FILE_KEY}?depth=4&ids=${encodeURIComponent(NODE_ID)}`);
  const node = file.nodes?.[NODE_ID.replace("-", ":")]?.document;
  if (!node) throw new Error("Node 437:134 not found");

  const imageNodes = [];
  function walk(n) {
    if (n.type === "RECTANGLE" || n.type === "FRAME") {
      if (n.fills?.some((f) => f.type === "IMAGE")) imageNodes.push(n);
    }
    n.children?.forEach(walk);
  }
  walk(node);

  const ids = imageNodes.map((n) => n.id).join(",");
  const images = await figmaFetch(`/images/${FILE_KEY}?ids=${ids}&format=jpg&scale=2`);
  const names = ["sweet", "floral", "fresh", "woody", "fruity", "for-him"];

  let i = 0;
  for (const [id, url] of Object.entries(images.images)) {
    if (!url) continue;
    const name = names[i++] ?? `category-${id.replace(":", "-")}`;
    const dest = path.join(outDir.pathname, `${name}.jpg`);
    const res = await fetch(url);
    await pipeline(res.body, createWriteStream(dest));
    console.log("Saved", dest);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
