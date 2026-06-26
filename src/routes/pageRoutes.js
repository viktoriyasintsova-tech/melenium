import { lazy } from "react";
import { PRODUCT_IMAGES } from "../data/productImages";

export const CatalogPage = lazy(() => import("../pages/Catalog"));
export const ProductPageRoute = lazy(() => import("../pages/ProductPage"));
export const CheckoutPageRoute = lazy(() => import("../pages/CheckoutPage"));
export const FavoritesPageRoute = lazy(() => import("../pages/Favorites"));
export const NotFoundRoute = lazy(() => import("../pages/NotFound"));

const loaders = {
  catalog: () => import("../pages/Catalog"),
  product: () => import("../pages/ProductPage"),
  checkout: () => import("../pages/CheckoutPage"),
  favorites: () => import("../pages/Favorites"),
};

const moduleCache = new Map();
const prefetchedImages = new Set();
const HOME_ASSETS = ["/assets/hero-bg.png", "/assets/logo.png"];

function prefetchAsset(href, rel = "prefetch") {
  if (prefetchedImages.has(href)) return;
  prefetchedImages.add(href);

  const link = document.createElement("link");
  link.rel = rel;
  link.as = "image";
  link.href = href;
  document.head.appendChild(link);
}

export function prefetchHomeAssets() {
  HOME_ASSETS.forEach((href) => prefetchAsset(href, "preload"));
}

export function getRouteKey(pathname) {
  if (pathname === "/") return "home";
  if (pathname === "/checkout") return "checkout";
  if (pathname === "/catalog") return "catalog";
  if (pathname === "/favorites") return "favorites";
  if (/^\/catalog\/[^/]+$/.test(pathname)) return "product";
  return null;
}

export function prefetchRoute(pathname) {
  const key = getRouteKey(pathname);
  if (!key) return Promise.resolve();

  if (key === "home") {
    prefetchHomeAssets();
    return Promise.resolve();
  }

  if (!moduleCache.has(key)) {
    moduleCache.set(key, loaders[key]());
  }

  return moduleCache.get(key);
}

export function prefetchProductImage(pathname) {
  const match = pathname.match(/^\/catalog\/([^/]+)$/);
  if (!match) return;

  const src = PRODUCT_IMAGES[match[1]]?.[0];
  if (!src || prefetchedImages.has(src)) return;

  prefetchAsset(src);
}

export function prefetchNavigation(pathname) {
  prefetchProductImage(pathname);
  return prefetchRoute(pathname);
}
