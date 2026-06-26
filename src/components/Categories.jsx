import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const categories = [
  {
    id: "sweet",
    title: "Сладкие",
    image: "/assets/categories/sweet.png",
    objectPosition: "center center",
    className:
      "min-h-[240px] sm:min-h-[280px] lg:col-start-1 lg:row-start-1 lg:row-span-2 lg:min-h-0 lg:h-full",
  },
  {
    id: "floral",
    title: "Цветочные",
    image: "/assets/categories/floral.png",
    objectPosition: "center 35%",
    className:
      "min-h-[180px] sm:min-h-[200px] lg:col-start-1 lg:row-start-3 lg:min-h-0 lg:h-full",
  },
  {
    id: "fresh",
    title: "Свежие",
    image: "/assets/categories/fresh.png",
    objectPosition: "center 35%",
    className:
      "min-h-[180px] sm:min-h-[200px] lg:col-start-2 lg:row-start-1 lg:min-h-0 lg:h-full",
  },
  {
    id: "woody",
    title: "Древесные",
    image: "/assets/categories/woody.png",
    objectPosition: "center center",
    className:
      "min-h-[240px] sm:min-h-[280px] lg:col-start-2 lg:row-start-2 lg:row-span-2 lg:min-h-0 lg:h-full",
  },
  {
    id: "fruity",
    title: "Фруктовые",
    image: "/assets/categories/fruity.png",
    objectPosition: "center 40%",
    className:
      "min-h-[240px] sm:min-h-[280px] lg:col-start-3 lg:row-start-1 lg:row-span-2 lg:min-h-0 lg:h-full",
  },
  {
    id: "for-him",
    title: "Для него",
    image: "/assets/categories/for-him.png",
    objectPosition: "center 30%",
    className:
      "min-h-[180px] sm:min-h-[200px] lg:col-start-3 lg:row-start-3 lg:min-h-0 lg:h-full",
  },
];

const catalogButtonClass = "site-btn-primary site-btn-fit gap-2 sm:w-auto";

function CategoryCard({ id, title, image, objectPosition }) {
  return (
    <Link
      to={`/catalog?category=${id}`}
      className="group relative block h-full w-full overflow-hidden rounded-[14px] sm:rounded-[16px] lg:rounded-[18px]"
    >
      <img
        src={image}
        alt={title}
        style={{ objectPosition }}
        className="absolute inset-0 h-full w-full object-cover site-motion site-motion-slow group-hover:scale-[1.02]"
      />

      <div className="absolute inset-0 bg-black/20 site-motion group-hover:bg-black/25" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/25 to-black/5" />

      <span className="absolute bottom-4 left-4 z-10 font-denistina text-[28px] leading-none text-[#faf8f4] drop-shadow-[0_2px_12px_rgba(0,0,0,0.65)] sm:bottom-5 sm:left-5 sm:text-[32px] lg:text-[36px]">
        {title}
      </span>
    </Link>
  );
}

export default function Categories() {
  return (
    <section data-header-tone="light" className="site-section-divider bg-[#faf8f4] text-[#1c1c1c]">
      <div className="site-container site-section-y">
        <ScrollReveal className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-center sm:justify-between lg:mb-12">
          <h2 className="font-denistina text-[40px] leading-none sm:text-[48px] lg:text-[56px]">
            Категории ароматов
          </h2>

          <Link to="/catalog" className={`${catalogButtonClass} hidden sm:inline-flex`}>
            Смотреть все
            <ChevronRight className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          </Link>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:grid-rows-[220px_220px_220px] lg:gap-5">
          {categories.map((category, index) => (
            <ScrollReveal
              key={category.id}
              delay={index * 70}
              className={`min-h-0 ${category.className}`}
            >
              <CategoryCard {...category} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-8 sm:hidden" delay={80}>
          <Link to="/catalog" className={catalogButtonClass}>
            Смотреть все
            <ChevronRight className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
