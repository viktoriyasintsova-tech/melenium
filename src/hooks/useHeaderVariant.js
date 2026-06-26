import { useLayoutEffect, useState } from "react";
import { getHeaderOffset } from "../utils/scrollToSection";

// Определяем тон секции, которая сейчас находится под хедером.
// Тёмная секция -> "hero" (стеклянная плашка, белый текст),
// светлая -> "cream" (кремовая плашка, тёмный текст).
function resolveHomeHeaderVariant() {
  const sections = document.querySelectorAll("[data-header-tone]");
  if (!sections.length) return "cream";

  // Пробная линия чуть ниже центра хедера.
  const probe = getHeaderOffset() / 2 + 4;

  let current = null;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= probe && rect.bottom > probe) {
      current = section;
    }
  });

  if (!current) {
    // Выше первой секции (например, при overscroll сверху) — берём первую.
    const first = sections[0].getBoundingClientRect();
    if (first.top > probe) {
      current = sections[0];
    }
  }

  const tone = current?.getAttribute("data-header-tone");
  return tone === "dark" ? "hero" : "cream";
}

export function useHeaderVariant(displayPathname, pendingPathname) {
  const onDisplayedHome = displayPathname === "/";
  const leavingHome = pendingPathname !== "/" && displayPathname === "/";
  const onOtherPage = displayPathname !== "/";

  const [homeVariant, setHomeVariant] = useState(() =>
    onDisplayedHome ? resolveHomeHeaderVariant() : "cream",
  );

  useLayoutEffect(() => {
    if (onOtherPage || leavingHome || !onDisplayedHome) {
      setHomeVariant("cream");
      return undefined;
    }

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        setHomeVariant(resolveHomeHeaderVariant());
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    // Секции главной могут домонтироваться (lazy/анимации) — последим за DOM.
    const root = document.getElementById("root") ?? document.body;
    const mutationObserver = new MutationObserver(update);
    mutationObserver.observe(root, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      mutationObserver.disconnect();
    };
  }, [displayPathname, pendingPathname, onDisplayedHome, onOtherPage, leavingHome]);

  if (pendingPathname !== "/") {
    return "cream";
  }

  if (!onDisplayedHome) {
    return "cream";
  }

  return homeVariant;
}
