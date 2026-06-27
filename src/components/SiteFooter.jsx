export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-[#e3ddcd] bg-[#faf8f4]">
      <div className="site-container flex flex-col items-center justify-between gap-2 py-6 text-center sm:flex-row sm:text-left">
        <p className="font-sans text-[12px] tracking-[0.02em] text-[#1c1c1c]/40">
          © {year} Millennium
        </p>
        <a
          href="https://t.me/vkomaro"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-[12px] tracking-[0.02em] text-[#1c1c1c]/55 site-motion hover:text-[#1c1c1c]"
        >
          Создание сайтов — <span className="font-medium">@vkomaro</span>
        </a>
      </div>
    </footer>
  );
}
