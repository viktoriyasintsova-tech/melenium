import { ChevronLeft, ChevronRight, ShieldCheck, Sparkles, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import OrderButtons from "./cart/OrderButtons";
import ElectronicPreview from "./ElectronicCertificate";
import { eCertificateThemes, presetAmounts } from "../data/certificateThemes";

const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function makeCertCode() {
  const block = (length) =>
    Array.from(
      { length },
      () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
    ).join("");
  return `MLN-${block(4)}-${block(4)}`;
}

function todayLabel() {
  return new Date().toLocaleDateString("ru-RU");
}

function FormatCard({ label, children }) {
  return (
    <article className="flex h-full flex-col rounded-[16px] border border-white/12 bg-white/[0.05] p-5 sm:p-6">
      <p className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-white/45">
        {label}
      </p>
      <p className="mt-3 flex-1 font-sans text-[14px] leading-[1.55] text-white/85 sm:text-[15px]">
        {children}
      </p>
    </article>
  );
}

const gallerySlides = [
  {
    id: "mockup",
    src: "/assets/certificates/paper-mockup-envelope.png",
    alt: "Подарочный сертификат Millennium в конверте",
    caption: "Подарочный конверт — вау-эффект при вручении",
  },
  {
    id: "front",
    src: "/assets/certificates/paper-front.png",
    alt: "Лицевая сторона сертификата Millennium",
    caption: "Лицевая сторона сертификата",
  },
  {
    id: "back",
    src: "/assets/certificates/paper-back.png",
    alt: "Оборотная сторона сертификата Millennium",
    caption: "Оборот с QR и контактами",
  },
];

export default function Certificates() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(presetAmounts[1]);
  const [selectedThemeId, setSelectedThemeId] = useState(eCertificateThemes[0].id);
  const [customAmount, setCustomAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [certCode, setCertCode] = useState("");
  const [issueDate, setIssueDate] = useState("");

  const currentSlide = gallerySlides[activeSlide];
  const isMockupSlide = currentSlide.id === "mockup";
  const amountToPreview = customAmount.trim() || `${selectedAmount} ₽`;
  const recipientLabel = recipient.trim();

  const selectedTheme = useMemo(
    () =>
      eCertificateThemes.find((theme) => theme.id === selectedThemeId) ??
      eCertificateThemes[0],
    [selectedThemeId],
  );

  const certMessage = [
    "Здравствуйте! Хочу оформить электронный сертификат Millennium.",
    "",
    `Номинал: ${amountToPreview}`,
    `Оформление: ${selectedTheme.label}`,
    `Кому: ${recipientLabel || "—"}`,
    `Код сертификата: ${certCode || "—"}`,
    `Дата: ${issueDate || todayLabel()}`,
    "",
    "Прикладываю изображение сертификата и чек об оплате — прошу активировать код.",
  ].join("\n");

  const goPrev = () =>
    setActiveSlide((prev) => (prev === 0 ? gallerySlides.length - 1 : prev - 1));
  const goNext = () =>
    setActiveSlide((prev) => (prev === gallerySlides.length - 1 ? 0 : prev + 1));

  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    if (!isModalOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.body.classList.add("site-cert-modal-open");

    return () => {
      document.body.style.overflow = previousOverflow;
      document.body.classList.remove("site-cert-modal-open");
    };
  }, [isModalOpen]);

  return (
    <section
      id="certificates"
      data-header-tone="dark"
      className="site-section-divider-light bg-[#140f0b] text-white"
    >
      <div className="site-container site-section-y">
        <div className="certificates-layout">
          <div className="certificates-text">
            <ScrollReveal className="certificates-intro">
              <header className="max-w-[520px] space-y-4 sm:space-y-5">
                <h2 className="font-denistina text-[40px] leading-[0.92] sm:text-[52px] lg:text-[64px]">
                  Подарок, который всегда в сердце
                </h2>
                <p className="font-sans text-[14px] leading-[1.6] text-white/75 sm:text-[15px] lg:text-[16px]">
                  Номинал может быть любым. Бумажный сертификат — в наших пространствах,
                  в фирменном конверте. Электронный — оформите и отправьте онлайн за минуту.
                </p>
              </header>
            </ScrollReveal>

            <ScrollReveal className="certificates-details" delay={120}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
                <FormatCard label="Бумажный сертификат">
                  Формат A6, плотная печать, фирменный конверт и ощущение премиального
                  подарка в руках.
                </FormatCard>
                <FormatCard label="Электронный сертификат">
                  Выбор номинала и дизайна, мгновенная отправка и аккуратный digital-формат.
                </FormatCard>
              </div>

              <div className="mt-6 sm:mt-8 lg:mt-auto lg:pt-8">
                <button
                  type="button"
                  onClick={() => {
                    setCertCode(makeCertCode());
                    setIssueDate(todayLabel());
                    setIsModalOpen(true);
                  }}
                  className="site-btn-light w-full gap-2"
                >
                  <Sparkles className="h-4 w-4 shrink-0" strokeWidth={1.9} />
                  Оформить электронный
                </button>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal className="certificates-gallery" delay={80}>
            <figure className="certificate-gallery-main">
              <div className="certificate-gallery-frame">
                <div
                  className={`certificate-gallery-stage ${
                    isMockupSlide
                      ? "certificate-gallery-stage--mockup"
                      : "certificate-gallery-stage--photo"
                  }`}
                >
                  <img
                    src={currentSlide.src}
                    alt={currentSlide.alt}
                    width={isMockupSlide ? 604 : undefined}
                    height={isMockupSlide ? 440 : undefined}
                    className={
                      isMockupSlide
                        ? "certificate-mockup-img"
                        : "certificate-gallery-photo"
                    }
                  />
                </div>
              </div>

              <figcaption className="certificate-gallery-caption">
                <div className="flex items-center justify-center gap-4 sm:gap-6">
                  <button
                    type="button"
                    onClick={goPrev}
                    className="certificate-gallery-nav-btn"
                    aria-label="Предыдущий слайд"
                  >
                    <ChevronLeft className="h-5 w-5" strokeWidth={1.9} />
                  </button>

                  <p className="min-w-0 flex-1 text-center font-sans text-[13px] leading-[1.45] text-white/70 sm:text-[14px]">
                    {currentSlide.caption}
                  </p>

                  <button
                    type="button"
                    onClick={goNext}
                    className="certificate-gallery-nav-btn"
                    aria-label="Следующий слайд"
                  >
                    <ChevronRight className="h-5 w-5" strokeWidth={1.9} />
                  </button>
                </div>
              </figcaption>
            </figure>

            <div
              className="certificate-gallery-thumbs"
              role="tablist"
              aria-label="Виды сертификата"
            >
              {gallerySlides.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  role="tab"
                  aria-selected={idx === activeSlide}
                  onClick={() => setActiveSlide(idx)}
                  className={`certificate-gallery-thumb ${
                    idx === activeSlide ? "certificate-gallery-thumb--active" : ""
                  }`}
                >
                  <img
                    src={slide.src}
                    alt=""
                    className={
                      slide.id === "mockup"
                        ? "certificate-gallery-thumb-img certificate-gallery-thumb-img--mockup"
                        : "certificate-gallery-thumb-img"
                    }
                  />
                  <span className="sr-only">{slide.alt}</span>
                </button>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-[#151210]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="e-cert-title"
        >
          <div className="relative flex h-[100dvh] min-h-0 w-full flex-col overflow-hidden">
            <div className="sticky top-0 z-20 border-b border-white/10 bg-[#151210]">
              <div className="site-container flex items-start justify-between gap-3 py-4 sm:py-5">
                <div className="min-w-0 pr-2">
                  <h3
                    id="e-cert-title"
                    className="font-denistina text-[32px] leading-[0.9] text-[#f3ede5] sm:text-[44px]"
                  >
                    Электронный сертификат
                  </h3>
                </div>
                <button
                  type="button"
                  aria-label="Закрыть"
                  onClick={closeModal}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/[0.08] text-[#f3ede5] site-motion hover:bg-white/[0.16]"
                >
                  <X className="h-5 w-5" strokeWidth={1.9} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              <div className="site-container space-y-8 py-6 sm:py-8">
                {/* Верх: превью слева, инструкция + мессенджеры справа */}
                <div className="grid gap-6 lg:grid-cols-[minmax(0,640px)_minmax(0,1fr)] lg:items-stretch lg:gap-6">
                  <ElectronicPreview
                    theme={selectedTheme}
                    amountToPreview={amountToPreview}
                    sample={false}
                    recipient={recipientLabel}
                    dateText={issueDate}
                    code={certCode}
                  />

                  <div className="flex flex-col gap-5">
                    <div className="rounded-[16px] border border-white/12 bg-white/[0.04] p-4 sm:p-5">
                      <div className="flex items-center gap-2 text-[#f3ede5]">
                        <ShieldCheck className="h-4 w-4 shrink-0" strokeWidth={1.9} />
                        <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.12em]">
                          Как оформить и активировать
                        </p>
                      </div>
                      <ol className="mt-3 space-y-2.5 font-sans text-[12px] leading-[1.5] text-[#f3ede5]/75 sm:text-[13px]">
                        {[
                          "Укажите имя получателя — код и дата подставятся в сертификат автоматически.",
                          "Сохраните или сделайте скриншот готового сертификата.",
                          "Нажмите кнопку мессенджера и отправьте продавцу изображение сертификата вместе с чеком об оплате.",
                          "Продавец вносит код в реестр и подтверждает, что сертификат действителен.",
                        ].map((step, i) => (
                          <li key={i} className="flex gap-2.5">
                            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#f3ede5]/12 text-[11px] font-semibold text-[#f3ede5]">
                              {i + 1}
                            </span>
                            <span>{step}</span>
                          </li>
                        ))}
                      </ol>
                    </div>

                    <OrderButtons
                      message={certMessage}
                      tone="dark"
                      compact
                      heading="Оформить сертификат через мессенджер"
                      className="lg:mt-auto"
                    />
                  </div>
                </div>

                {/* Низ: форма на всю ширину */}
                <div className="space-y-6 border-t border-white/10 pt-6 sm:space-y-7">
                  <div>
                    <label
                      htmlFor="cert-recipient"
                      className="font-sans text-[12px] text-[#f3ede5]/70"
                    >
                      Имя получателя
                    </label>
                    <input
                      id="cert-recipient"
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="Например, Анна"
                      className="mt-2 w-full rounded-[12px] border border-white/20 bg-white/[0.03] px-4 py-3 font-sans text-[14px] text-[#f3ede5] outline-none placeholder:text-[#f3ede5]/40 focus:border-[#e3ddcd]"
                    />
                    <p className="mt-2 font-sans text-[11px] leading-[1.5] text-[#f3ede5]/45">
                      Код{" "}
                      {certCode ? (
                        <span className="font-mono text-[#f3ede5]/70">{certCode}</span>
                      ) : (
                        "сертификата"
                      )}{" "}
                      и дата формируются автоматически и уже видны на сертификате.
                    </p>
                  </div>

                  <div>
                    <p className="font-sans text-[12px] text-[#f3ede5]/70">Выберите номинал</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {presetAmounts.map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(amount);
                            setCustomAmount("");
                          }}
                          className={`rounded-full border px-4 py-2 font-sans text-[12px] site-motion ${
                            selectedAmount === amount && customAmount === ""
                              ? "border-[#e3ddcd] bg-[#f3ede5] text-[#1b1713]"
                              : "border-white/20 bg-white/[0.04] text-[#f3ede5] hover:bg-white/[0.12]"
                          }`}
                        >
                          {amount} ₽
                        </button>
                      ))}
                    </div>
                    <input
                      type="number"
                      inputMode="numeric"
                      min="1000"
                      step="500"
                      placeholder="Или введите свой номинал"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="mt-3 w-full rounded-[12px] border border-white/20 bg-white/[0.03] px-4 py-3 font-sans text-[14px] text-[#f3ede5] outline-none placeholder:text-[#f3ede5]/40 focus:border-[#e3ddcd]"
                    />
                  </div>

                  <div>
                    <p className="font-sans text-[12px] text-[#f3ede5]/70">Выберите оформление</p>
                    <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                      {eCertificateThemes.map((theme) => (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => setSelectedThemeId(theme.id)}
                          className={`rounded-[12px] border px-4 py-3 text-left site-motion ${
                            selectedTheme.id === theme.id
                              ? "border-[#e3ddcd] bg-[#f3ede5] text-[#1b1713]"
                              : "border-white/20 bg-white/[0.04] text-[#f3ede5] hover:bg-white/[0.12]"
                          }`}
                        >
                          <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.08em]">
                            {theme.label}
                          </p>
                          <p className="mt-1 font-sans text-[12px] opacity-70">{theme.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
