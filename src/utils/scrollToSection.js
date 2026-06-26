export function getHeaderOffset() {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--site-header-height",
  );
  const parsed = parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : 80;
}

export function scrollToSection(id, behavior = "smooth") {
  const element = document.getElementById(id);
  if (!element) return false;

  const top =
    element.getBoundingClientRect().top + window.scrollY - getHeaderOffset();

  window.scrollTo({
    top: Math.max(0, top),
    behavior,
  });

  return true;
}

export function scrollToHash(hash, behavior = "smooth") {
  const id = hash.replace(/^#/, "");
  if (!id) return false;
  return scrollToSection(id, behavior);
}
