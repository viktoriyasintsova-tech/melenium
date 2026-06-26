import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <main className="relative z-10 mt-[var(--site-header-height)] flex min-h-[calc(100dvh-var(--site-header-height))] flex-col items-center justify-center px-4 pb-10 text-center max-lg:pt-[10vw] sm:px-6 sm:pb-16 lg:px-8 lg:pb-0 lg:pt-0">
      <div className="flex w-full max-w-[909px] flex-col items-center gap-6 sm:gap-9 lg:gap-12">
        <div className="flex flex-col items-center gap-3 sm:gap-4 lg:gap-6">
          <h1 className="font-semibold text-white">
            <span className="block text-[clamp(28px,8.5vw,82px)] leading-[1.02] lg:leading-[70px]">
              Элитная французская
            </span>
            <span className="block text-[clamp(28px,8.5vw,82px)] leading-[1.02] lg:leading-[70px]">
              парфюмерия
            </span>
          </h1>

          <p className="max-w-[907px] text-[clamp(13px,3.2vw,24px)] font-normal leading-[1.045] text-[#e3ddcd]">
            <span className="block sm:inline">масляные композиции с мягким шлейфом</span>
            <br className="hidden sm:block" />
            <span className="block sm:inline">и эстетикой тихой роскоши</span>
          </p>
        </div>

        <Link
          to="/catalog"
          className="flex h-[36px] w-[min(300px,92vw)] items-center justify-center rounded-[64px] border border-millennium-yellow bg-white/20 text-[13px] font-semibold leading-none text-millennium-yellow backdrop-blur-[12.5px] site-motion hover:bg-white/25 sm:h-[44px] sm:w-[300px] sm:text-[16px] lg:h-[60px] lg:w-[550px] lg:text-[24px]"
        >
          Выбрать аромат
        </Link>
      </div>
    </main>
  );
}
