import { useEffect, useState } from "react";

const VARIANTS = {
  catalog: {
    imageClassName:
      "site-catalog-bottle absolute left-1/2 top-1/2 max-h-[92%] max-w-[76%] w-auto h-auto -translate-x-1/2 -translate-y-1/2 origin-center object-contain group-hover:scale-[1.2]",
    grain: true,
    centered: true,
  },
  detail: {
    imageClassName: "h-full w-full object-contain object-center scale-[0.98]",
    grain: false,
    centered: false,
  },
  default: {
    imageClassName: "h-full w-full object-cover",
    grain: false,
    centered: false,
  },
};

export default function ProductMedia({
  product,
  className = "",
  imageClassName,
  showDots = true,
  variant = "default",
}) {
  const config = VARIANTS[variant] ?? VARIANTS.default;
  const resolvedImageClassName = imageClassName ?? config.imageClassName;
  const images = product.images?.length
    ? product.images
    : product.image
      ? [product.image]
      : [];

  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [product.slug]);

  if (images.length === 0) {
    return (
      <div
        className={`flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center ${className}`}
      >
        {product.brand && (
          <span className="font-sans text-[10px] uppercase tracking-[0.2em] text-[#1c1c1c]/35">
            {product.brand}
          </span>
        )}
        <span className="font-denistina text-[22px] leading-tight text-[#1c1c1c]/55 sm:text-[24px]">
          {product.name}
        </span>
      </div>
    );
  }

  const hasMultiple = images.length > 1;

  return (
    <div
      className={`group/media relative h-full w-full ${className}`}
      onMouseLeave={() => setActiveIndex(0)}
    >
      {images.map((src, index) => (
        <img
          key={src}
          src={src}
          alt={product.fullName}
          loading="lazy"
          className={`${resolvedImageClassName} ${
            config.centered
              ? index === activeIndex
                ? "opacity-100"
                : "opacity-0"
              : `absolute inset-0 origin-center ${
                  index === activeIndex ? "opacity-100" : "opacity-0"
                }`
          }`}
        />
      ))}

      {config.grain && (
        <span
          className="product-media-grain pointer-events-none absolute inset-0 z-[5]"
          aria-hidden="true"
        />
      )}

      {hasMultiple && (
        <>
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-black/20 to-transparent opacity-0 site-motion group-hover/media:opacity-100" />
          <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center gap-1.5 opacity-0 site-motion group-hover/media:opacity-100">
            {images.map((src, index) => (
              <button
                key={src}
                type="button"
                aria-label={`Фото ${index + 1}`}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                className={`h-1.5 rounded-full site-motion ${
                  index === activeIndex
                    ? "w-4 bg-white"
                    : "w-1.5 bg-white/45 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
          {showDots && (
            <div className="absolute right-3 top-3 z-20 rounded-full bg-black/35 px-2 py-0.5 font-sans text-[10px] text-white/90 opacity-0 backdrop-blur-sm site-motion group-hover/media:opacity-100">
              {activeIndex + 1}/{images.length}
            </div>
          )}
        </>
      )}
    </div>
  );
}
