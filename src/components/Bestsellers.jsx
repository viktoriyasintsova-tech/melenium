import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { getBestsellers } from "../data/products";
import ProductCard from "./ProductCard";
import ScrollReveal from "./ScrollReveal";

export default function Bestsellers() {
  const products = getBestsellers(4);

  return (
    <section data-header-tone="light" className="site-section-divider bg-[#faf8f4] text-[#1c1c1c]">
      <div className="site-container site-section-y">
        <ScrollReveal className="mb-8 flex flex-col gap-4 sm:mb-10 lg:mb-14 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <h2 className="font-denistina text-[40px] leading-none sm:text-[48px] lg:text-[56px]">
            Бестселлеры
          </h2>

          <p className="max-w-[340px] font-sans text-[13px] font-normal leading-[1.45] text-[#1c1c1c]/85 sm:text-[14px] lg:max-w-[380px] lg:text-right lg:text-[15px]">
            Ароматы к которым возвращаются снова и снова. Те самые, которые
            остаются на одежде, в памяти и в чужих комплиментах
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:gap-6">
          {products.map((product, index) => (
            <ScrollReveal
              key={product.slug}
              delay={index * 90}
              className={
                index < products.length - 1
                  ? "max-sm:border-b max-sm:border-[#1c1c1c]/5 max-sm:pb-5"
                  : ""
              }
            >
              <ProductCard product={product} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal className="mt-10 sm:mt-12 lg:hidden" delay={120}>
          <Link to="/catalog" className="site-btn-primary site-btn-fit gap-2 sm:mx-auto">
            Смотреть весь каталог
            <ChevronRight className="h-4 w-4 shrink-0" strokeWidth={1.75} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
