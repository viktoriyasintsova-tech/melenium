import { Truck, MapPin } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { deliveryOptions } from "../data/contacts";

const icons = {
  russia: Truck,
  local: MapPin,
};

export default function Delivery() {
  return (
    <section id="delivery" data-header-tone="light" className="site-section-divider bg-[#faf8f4] text-[#1c1c1c]">
      <div className="site-container site-section-y">
        <ScrollReveal className="mb-10 max-w-[520px] sm:mb-12 lg:mb-14">
          <h2 className="font-denistina text-[40px] leading-none sm:text-[48px] lg:text-[56px]">
            Доставка
          </h2>
          <p className="mt-4 font-sans text-[14px] leading-[1.6] text-[#1c1c1c]/70 sm:text-[15px]">
            Бережно упакуем и доставим аромат по всей России, а в наших городах —
            привезём прямо к вам.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
          {deliveryOptions.map((option, index) => {
            const Icon = icons[option.id] ?? Truck;

            return (
              <ScrollReveal key={option.id} delay={index * 80}>
                <article className="flex h-full flex-col rounded-[18px] border border-[#1c1c1c]/10 bg-white/70 p-6 sm:p-8">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#1c1c1c]/10 bg-[#faf8f4] text-[#1c1c1c]/65">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </span>

                  <h3 className="mt-5 font-denistina text-[26px] leading-none sm:text-[30px]">
                    {option.title}
                  </h3>

                  <ul className="mt-5 flex flex-col gap-3">
                    {option.lines.map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-3 font-sans text-[14px] leading-[1.5] text-[#1c1c1c]/80 sm:text-[15px]"
                      >
                        <span
                          className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#1c1c1c]/35"
                          aria-hidden="true"
                        />
                        {line}
                      </li>
                    ))}
                  </ul>
                </article>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
