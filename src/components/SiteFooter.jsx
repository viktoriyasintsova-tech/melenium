export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#140f0b] text-white">
      <div className="site-container flex flex-col items-center justify-between gap-2 py-6 text-center sm:flex-row sm:text-left">
        <p className="font-sans text-[12px] tracking-[0.02em] text-white/40">
          © {year} Millennium
        </p>
        <a
          href="https://t.me/vkomaro"
          target="_blank"
          rel="noopener noreferrer"
          className="font-sans text-[12px] tracking-[0.02em] text-white/55 site-motion hover:text-white"
        >
          Создание сайтов — <span className="font-medium">@vkomaro</span>
        </a>
      </div>
    </footer>
  );
}
