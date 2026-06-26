import { useEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { prefetchNavigation } from "../routes/pageRoutes";
import { scrollToHash, scrollToSection } from "../utils/scrollToSection";

const supportsViewTransition =
  typeof document !== "undefined" &&
  typeof document.startViewTransition === "function";

function getScrollTarget(location) {
  if (location.state?.scrollTo) {
    return location.state.scrollTo;
  }

  if (location.hash) {
    return location.hash.replace(/^#/, "");
  }

  return null;
}

function scheduleScrollTo(target) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      scrollToSection(target);
    });
  });
}

export function useDisplayedLocation() {
  const location = useLocation();
  const navigate = useNavigate();
  const [displayLocation, setDisplayLocation] = useState(location);
  const [fallbackPulse, setFallbackPulse] = useState(0);
  const isFirstRender = useRef(true);
  const navigationId = useRef(0);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return undefined;
    }

    const scrollTarget = getScrollTarget(location);

    if (
      location.pathname === displayLocation.pathname &&
      location.key === displayLocation.key
    ) {
      return undefined;
    }

    if (
      location.pathname === displayLocation.pathname &&
      scrollTarget
    ) {
      setDisplayLocation(location);
      scheduleScrollTo(scrollTarget);

      if (location.state?.scrollTo) {
        navigate(
          { pathname: location.pathname, hash: location.hash },
          { replace: true, state: null },
        );
      }

      return undefined;
    }

    const currentNavigation = ++navigationId.current;

    const applyNavigation = () => {
      flushSync(() => {
        setDisplayLocation(location);
      });

      const target = getScrollTarget(location);
      if (target) {
        scheduleScrollTo(target);

        if (location.state?.scrollTo) {
          navigate(
            { pathname: location.pathname, hash: location.hash },
            { replace: true, state: null },
          );
        }
      } else {
        window.scrollTo(0, 0);
      }
    };

    const runTransition = () => {
      if (currentNavigation !== navigationId.current) return;

      if (supportsViewTransition) {
        document.startViewTransition(applyNavigation);
        return;
      }

      applyNavigation();
      setFallbackPulse((value) => value + 1);
    };

    prefetchNavigation(location.pathname);
    runTransition();

    return () => {
      navigationId.current += 1;
    };
  }, [
    location,
    displayLocation.pathname,
    displayLocation.key,
    navigate,
  ]);

  useEffect(() => {
    if (displayLocation.pathname !== location.pathname) return;
    if (!location.hash) return;

    scrollToHash(location.hash);
  }, [location.hash, location.pathname, displayLocation.pathname]);

  return {
    displayLocation,
    displayPathname: displayLocation.pathname,
    pendingPathname: location.pathname,
    transitionKey: supportsViewTransition ? displayLocation.key : fallbackPulse,
    useViewTransition: supportsViewTransition,
  };
}
