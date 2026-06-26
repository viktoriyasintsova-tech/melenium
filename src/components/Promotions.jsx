import ScrollReveal from "./ScrollReveal";

const offers = [
  {
    id: "20-5",
    buy: "20 мл",
    gift: "+5 мл",
    caption: "любого аромата в подарок",
  },
  {
    id: "30-10",
    buy: "30 мл",
    gift: "+10 мл",
    caption: "любого аромата в подарок",
  },
];

function Offer({ buy, gift, caption }) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="font-sans text-[15px] leading-[1.45] tracking-[0.04em] text-white/60 sm:text-[17px]">
        Покупаешь
      </span>
      <span className="mt-2 font-denistina text-[clamp(48px,9vw,84px)] leading-[0.85] text-white">
        {buy}
      </span>

      <span className="my-5 block h-px w-12 bg-white/25" aria-hidden="true" />

      <span className="font-denistina text-[clamp(40px,7.5vw,68px)] leading-[0.85] text-[#e3ddcd]">
        {gift}
      </span>
      <span className="mt-3 max-w-[200px] font-sans text-[15px] leading-[1.45] tracking-[0.04em] text-white/60 sm:text-[17px]">
        {caption}
      </span>
    </div>
  );
}

export default function Promotions() {
  return (
    <section id="promotions" data-header-tone="dark" className="promo-section">
      <div className="promo-section__media" aria-hidden="true">
        <picture>
          <source srcSet="/assets/promo-bg.webp" type="image/webp" />
          <img
            src="/assets/promo-bg.jpg"
            alt=""
            width={1638}
            height={849}
            decoding="async"
            className="promo-section__img"
          />
        </picture>
        <div className="promo-section__tint" />
      </div>

      <div className="site-container relative z-10 flex min-h-[clamp(520px,68vw,640px)] flex-col py-14 sm:py-16 lg:py-20">
        <ScrollReveal>
          <h2 className="font-denistina text-[40px] leading-none text-white sm:text-[48px] lg:text-[56px]">
            Акции
          </h2>
        </ScrollReveal>

        <ScrollReveal
          delay={80}
          className="promo-diptych my-auto grid grid-cols-1 py-12 sm:grid-cols-2"
        >
          {offers.map((offer) => (
            <div key={offer.id} className="promo-diptych__cell flex justify-center py-10 sm:py-0">
              <Offer {...offer} />
            </div>
          ))}
        </ScrollReveal>
      </div>
    </section>
  );
}
