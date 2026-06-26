const PHRASE = "В пространстве Millennium можно платить долями — без переплат и процентов";

function DolyamiLogo() {
  return (
    <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-[12px] font-bold lowercase leading-none tracking-tight text-[#140f0b]">
      долями
    </span>
  );
}

function MarqueeGroup() {
  return (
    <div className="flex shrink-0 items-center" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, i) => (
        <span
          key={i}
          className="mx-7 inline-flex items-center gap-6 whitespace-nowrap font-sans text-[12px] uppercase tracking-[0.18em] text-white/85 sm:text-[13px]"
        >
          {PHRASE}
          <DolyamiLogo />
          <span className="h-[5px] w-[5px] rounded-full bg-white/30" />
        </span>
      ))}
    </div>
  );
}

export default function PaymentMarquee() {
  return (
    <section
      data-header-tone="dark"
      className="site-section-divider bg-[#140f0b] py-4 sm:py-5"
      aria-label="В пространстве Millennium доступна оплата долями"
    >
      <div className="marquee">
        <div className="marquee__track">
          <MarqueeGroup />
          <MarqueeGroup />
        </div>
      </div>
    </section>
  );
}
