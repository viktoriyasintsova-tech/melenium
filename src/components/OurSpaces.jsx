const brandPoints = [
  "В Millennium представлена эксклюзивная концепция Extrait de Parfum — настоящие духи, как делали раньше, в благородных графинах.",
  "Те же оригинальные ароматы, но с многогранным звучанием, раскрытием по пирамиде нот, красивым долгим шлейфом и стойкостью один–два дня на одежде.",
  "Концепция представлена только в магазинах Millennium. Клиенты отмечают невероятно вкусное раскрытие — таких ароматов вы не найдёте больше нигде.",
];

function WhyCard({ index, text }) {
  return (
    <article className="group relative flex min-h-[220px] flex-col rounded-[18px] border border-[#1c1c1c]/10 bg-white/70 p-5 shadow-[0_1px_0_rgba(28,28,28,0.04)] site-motion site-motion-slow hover:z-10 hover:scale-[1.02] hover:border-[#1c1c1c] hover:bg-[#1c1c1c] hover:shadow-[0_28px_56px_rgba(28,28,28,0.18)] sm:min-h-[240px] sm:p-6 lg:min-h-[260px] lg:p-8">
      <span className="font-sans text-[11px] font-medium uppercase tracking-[0.14em] text-[#1c1c1c]/40 site-motion group-hover:text-white/55">
        0{index + 1}
      </span>
      <p className="mt-4 flex-1 font-sans text-[13px] font-normal leading-[1.55] text-[#1c1c1c]/80 site-motion group-hover:text-white sm:text-[14px] lg:text-[15px]">
        {text}
      </p>
    </article>
  );
}

export default function OurSpaces() {
  return (
    <section
      id="about"
      data-header-tone="light"
      className="site-section-divider bg-[#faf8f4] text-[#1c1c1c]"
    >
      <div className="site-container py-14 sm:py-16 lg:py-20">
        <h2 className="max-w-[720px] font-denistina text-[44px] leading-[0.92] sm:text-[56px] lg:text-[72px]">
          О нас
        </h2>
        <p className="mt-5 max-w-[680px] font-sans text-[15px] leading-[1.6] text-[#1c1c1c]/70 sm:mt-6 sm:text-[16px]">
          Millennium — это пространство, где аромат выбирают не по этикетке, а по
          характеру. Мы помогаем подобрать тот самый запах и относимся к каждому
          гостю так, чтобы захотелось вернуться.
        </p>

        <div className="mt-8 px-1 sm:mt-10 sm:px-2 lg:mt-12">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-5 lg:gap-6">
            {brandPoints.map((point, index) => (
              <WhyCard key={point.slice(0, 24)} index={index} text={point} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
