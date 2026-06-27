import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Handbag, Heart, Menu, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useFavorites } from "../context/FavoritesContext";
import { scrollToSection } from "../utils/scrollToSection";
import MessengerLinks from "./MessengerLinks";

const leftLinks = [
  { label: "О нас", href: "/#about", scrollTarget: "about" },
  { label: "Каталог ароматов", href: "/catalog" },
  { label: "Сертификаты", href: "/#certificates", scrollTarget: "certificates" },
];

const rightLinks = [
  { label: "Акции", href: "/#promotions", scrollTarget: "promotions" },
  { label: "Доставка", href: "/#delivery", scrollTarget: "delivery" },
  { label: "Контакты", href: "/#contacts", scrollTarget: "contacts" },
];

const mobileNavLinkClass =
  "flex w-full items-center gap-1 py-2 font-sans text-[18px] font-normal leading-[1.35] text-[#1c1c1c] site-motion hover:opacity-70 sm:text-[19px]";

function NavLink({
  label,
  href,
  className = "",
  onClick,
  isRouter,
  scrollTarget,
  onScrollTarget,
  mobile = false,
}) {
  const classes = mobile
    ? mobileNavLinkClass
    : `inline-flex items-center gap-1 whitespace-nowrap font-sans font-normal leading-[1.4] transition-opacity duration-soft ease-soft hover:opacity-80 ${className}`;

  const handleClick = (event) => {
    if (scrollTarget && onScrollTarget) {
      onScrollTarget(event, scrollTarget);
      return;
    }
    onClick?.(event);
  };

  if (isRouter) {
    return (
      <Link to={href} onClick={handleClick} className={classes}>
        {label}
      </Link>
    );
  }

  return (
    <a href={href} onClick={handleClick} className={classes}>
      {label}
    </a>
  );
}

const creamPillClass =
  "border border-[#e3ddcd] bg-[#faf8f4] shadow-[0_12px_34px_rgba(28,28,28,0.12)] backdrop-blur-none";

function IconCountBadge({ count, solid }) {
  if (!count) return null;
  return (
    <span
      className={`absolute -right-1.5 -top-1.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 font-sans text-[10px] font-semibold tabular-nums leading-none ${
        solid ? "bg-[#1c1c1c] text-white" : "bg-white text-[#1c1c1c] shadow-[0_1px_4px_rgba(0,0,0,0.18)]"
      }`}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function Header({ variant = "hero" }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalCount, openCart } = useCart();
  const { count: favCount } = useFavorites();
  const location = useLocation();
  const navigate = useNavigate();
  const isCream = variant === "cream";
  const mobileSolid = scrolled || isCream;
  const textClass = mobileSolid ? "text-[#1c1c1c]" : "text-white";
  const logoClass = mobileSolid ? "brightness-0 opacity-[0.88]" : "";
  const desktopTextClass = isCream ? "text-[#1c1c1c]" : "text-white";
  const desktopLogoClass = isCream ? "brightness-0 opacity-[0.88]" : "";

  const closeMenu = () => setMenuOpen(false);

  const handleScrollTarget = (event, targetId) => {
    event.preventDefault();
    closeMenu();

    if (location.pathname === "/") {
      scrollToSection(targetId);
      return;
    }

    navigate("/", { state: { scrollTo: targetId } });
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <header
      className={`site-header-root site-header-offset ${
        scrolled ? "site-header-mobile-scrolled" : ""
      } ${isCream ? "bg-[#faf8f4] lg:bg-transparent" : "bg-transparent"}`}
    >
      <div className="site-container flex items-center justify-between pb-4 sm:pb-5 lg:hidden">
        <Link to="/" className="shrink-0">
          <img
            src="/assets/logo.png"
            alt="Миллениум"
            className={`block h-[18px] w-auto object-contain sm:h-[22px] ${logoClass}`}
          />
        </Link>

        <div className="flex items-center gap-4">
          <Link
            to="/favorites"
            aria-label={favCount > 0 ? `Избранное: ${favCount}` : "Избранное"}
            className="relative inline-flex items-center site-motion hover:opacity-80"
          >
            <Heart className={`h-5 w-5 ${textClass}`} strokeWidth={1.5} />
            <IconCountBadge count={favCount} solid={mobileSolid} />
          </Link>

          <button
            type="button"
            aria-label={totalCount > 0 ? `Корзина: ${totalCount}` : "Корзина"}
            onClick={openCart}
            className="relative inline-flex items-center site-motion hover:opacity-80"
          >
            <Handbag className={`h-5 w-5 ${textClass}`} strokeWidth={1.5} />
            <IconCountBadge count={totalCount} solid={mobileSolid} />
          </button>

          <button
            type="button"
            aria-label={menuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className={`inline-flex items-center ${textClass} site-motion hover:opacity-80`}
          >
            <Menu className="h-6 w-6" strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <div className="site-container hidden lg:block">
        <div
          className={`flex h-[84px] w-full items-center rounded-[50px] px-6 ${
            isCream ? creamPillClass : "border border-[#e3ddcd] bg-white/10 backdrop-blur-[12.5px]"
          }`}
        >
          <nav className="flex flex-1 items-center gap-8 font-sans text-[14px] font-normal">
            {leftLinks.map((link) => (
              <NavLink
                key={link.label}
                {...link}
                className={desktopTextClass}
                isRouter={link.href.startsWith("/") && !link.href.includes("#")}
                onScrollTarget={handleScrollTarget}
              />
            ))}
          </nav>

          <div className="flex h-full shrink-0 items-center justify-center px-6">
            <Link to="/">
              <img
                src="/assets/logo.png"
                alt="Миллениум"
                className={`block h-[28px] w-[185px] object-contain object-center -mb-2 ${desktopLogoClass}`}
              />
            </Link>
          </div>

          <nav className="flex flex-1 items-center justify-end gap-8 font-sans text-[14px] font-normal">
            {rightLinks.map((link) => (
              <NavLink
                key={link.label}
                {...link}
                className={desktopTextClass}
                isRouter={link.href.startsWith("/") && !link.href.includes("#")}
                onScrollTarget={handleScrollTarget}
              />
            ))}
            <Link
              to="/favorites"
              aria-label={favCount > 0 ? `Избранное: ${favCount}` : "Избранное"}
              className="relative inline-flex shrink-0 items-center site-motion hover:opacity-80"
            >
              <Heart className={`h-6 w-6 ${desktopTextClass}`} strokeWidth={1.5} />
              <IconCountBadge count={favCount} solid={isCream} />
            </Link>
            <button
              type="button"
              aria-label={totalCount > 0 ? `Корзина: ${totalCount}` : "Корзина"}
              onClick={openCart}
              className="relative inline-flex shrink-0 items-center site-motion hover:opacity-80"
            >
              <Handbag className={`h-6 w-6 ${desktopTextClass}`} strokeWidth={1.5} />
              <IconCountBadge count={totalCount} solid={isCream} />
            </button>
          </nav>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex lg:hidden">
          <button
            type="button"
            aria-label="Закрыть меню"
            className="absolute inset-0 bg-black/45"
            onClick={closeMenu}
          />

          <aside
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
            className="mobile-menu-panel relative flex h-full w-full flex-col bg-[#faf8f4]"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="flex shrink-0 items-center justify-between px-5 pb-2 pt-5 sm:px-6 sm:pt-6">
              <Link to="/" onClick={closeMenu} className="shrink-0">
                <img
                  src="/assets/logo.png"
                  alt="Миллениум"
                  className="block h-[22px] w-auto object-contain brightness-0 opacity-[0.88] sm:h-[26px]"
                />
              </Link>
              <button
                type="button"
                aria-label="Закрыть меню"
                onClick={closeMenu}
                className="flex h-10 w-10 items-center justify-center text-[#1c1c1c]/55 site-motion hover:text-[#1c1c1c]"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </header>

            <nav className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 pb-8 pt-8 sm:gap-5 sm:px-6 sm:pt-10">
              {leftLinks.map((link) => (
                <NavLink
                  key={link.label}
                  {...link}
                  mobile
                  onClick={closeMenu}
                  isRouter={link.href.startsWith("/") && !link.href.includes("#")}
                  onScrollTarget={handleScrollTarget}
                />
              ))}
              {rightLinks.map((link) => (
                <NavLink
                  key={link.label}
                  {...link}
                  mobile
                  onClick={closeMenu}
                  isRouter={
                    link.href.startsWith("/") && !link.href.includes("#")
                  }
                  onScrollTarget={handleScrollTarget}
                />
              ))}
              <Link to="/favorites" onClick={closeMenu} className={mobileNavLinkClass}>
                Избранное
                {favCount > 0 && (
                  <span className="ml-1 font-sans text-[14px] text-[#1c1c1c]/45">
                    ({favCount})
                  </span>
                )}
              </Link>
            </nav>

            <footer className="shrink-0 px-5 pb-8 pt-4 sm:px-6 sm:pb-10">
              <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-[#1c1c1c]/45">
                Мы в мессенджерах
              </p>
              <MessengerLinks className="mt-3" />
            </footer>
          </aside>
        </div>
      )}
    </header>
  );
}
