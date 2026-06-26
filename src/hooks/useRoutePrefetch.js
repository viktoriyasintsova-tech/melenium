import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  getRouteKey,
  prefetchNavigation,
  prefetchRoute,
} from "../routes/pageRoutes";

function prefetchFromAnchor(anchor) {
  if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) {
    return;
  }

  let url;
  try {
    url = new URL(anchor.href, window.location.origin);
  } catch {
    return;
  }

  if (url.origin !== window.location.origin) return;

  prefetchNavigation(url.pathname);
}

function onPointerIntent(event) {
  prefetchFromAnchor(event.target.closest("a[href]"));
}

export function useRoutePrefetch() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.addEventListener("mouseover", onPointerIntent, true);
    document.addEventListener("focusin", onPointerIntent, true);
    document.addEventListener(
      "touchstart",
      onPointerIntent,
      { capture: true, passive: true },
    );

    return () => {
      document.removeEventListener("mouseover", onPointerIntent, true);
      document.removeEventListener("focusin", onPointerIntent, true);
      document.removeEventListener("touchstart", onPointerIntent, true);
    };
  }, []);

  useEffect(() => {
    const currentKey = getRouteKey(pathname);
    const idleTargets = ["/", "/catalog", "/checkout"].filter(
      (target) => getRouteKey(target) !== currentKey,
    );

    if (idleTargets.length === 0) return undefined;

    const run = () => {
      idleTargets.forEach((target) => {
        prefetchRoute(target);
      });
    };

    if ("requestIdleCallback" in window) {
      const id = window.requestIdleCallback(run, { timeout: 2500 });
      return () => window.cancelIdleCallback(id);
    }

    const id = window.setTimeout(run, 800);
    return () => window.clearTimeout(id);
  }, [pathname]);
}
