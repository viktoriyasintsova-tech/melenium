import { Link } from "react-router-dom";
import ScrollReveal from "./ScrollReveal";
import MessengerLinks, { InstagramIcon } from "./MessengerLinks";
import { millenniumSpaces } from "../data/contacts";

export default function Contacts() {
  return (
    <section
      id="contacts"
      data-header-tone="dark"
      className="contacts-section site-section-divider-light relative overflow-hidden bg-[#140f0b] text-white"
    >
      <div className="contacts-section__glow contacts-section__glow--left" aria-hidden="true" />
      <div className="contacts-section__glow contacts-section__glow--right" aria-hidden="true" />

      <div className="site-container site-section-y relative">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16">
          <div>
            <ScrollReveal>
              <h2 className="font-denistina text-[40px] leading-none sm:text-[48px] lg:text-[56px]">
                Контакты
              </h2>
              <p className="mt-4 max-w-[460px] font-sans text-[14px] leading-[1.6] text-white/65 sm:text-[15px]">
                Приходите в наши пространства, чтобы вживую почувствовать ароматы, или напишите
                в мессенджерах — поможем подобрать аромат и оформить подарок.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={80} className="mt-9 sm:mt-10">
              <ul>
                {millenniumSpaces.map((space) => (
                  <li
                    key={space.id}
                    className="border-t border-white/10 py-5 first:border-t-0 first:pt-0 sm:py-6"
                  >
                    <h3 className="font-denistina text-[28px] leading-none sm:text-[32px]">
                      {space.city}
                    </h3>
                    <p className="mt-2 font-sans text-[14px] leading-[1.5] text-white/85 sm:text-[15px]">
                      {space.address}
                    </p>
                    <p className="mt-1 font-sans text-[13px] leading-[1.45] text-white/45">
                      {space.note}
                    </p>
                    {space.instagram && (
                      <a
                        href={space.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 inline-flex items-center gap-2 font-sans text-[13px] text-white/70 site-motion hover:text-white"
                      >
                        <InstagramIcon />
                        Instagram
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </ScrollReveal>
          </div>

          <ScrollReveal
            delay={120}
            className="contacts-logo-panel flex flex-col items-center justify-center text-center lg:border-l lg:border-white/10 lg:pl-16"
          >
            <Link to="/" className="contacts-logo-wrap block w-full max-w-[min(100%,360px)]">
              <img
              src="/assets/logo-full-transparent.png"
              alt="Миллениум"
              className="contacts-logo-img mx-auto h-auto w-full object-contain"
                width={360}
                height={255}
              />
            </Link>

            <p className="mt-6 max-w-[280px] font-sans text-[12px] leading-[1.5] tracking-[0.08em] text-white/45">
              Элитная французская парфюмерия · тихая роскошь
            </p>

            <div className="mt-8">
              <p className="font-sans text-[11px] uppercase tracking-[0.16em] text-white/40">
                Мы на связи
              </p>
              <MessengerLinks className="mt-4 justify-center" variant="dark" />
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
