"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard, { ProductCardData } from "@/components/frontend/ProductCard";

interface ProductSliderSectionProps {
  title: string;
  subtitle?: string;
  products: ProductCardData[];
  accent?: "primary" | "danger" | "accent";
  visibleCount?: number;
}

export default function ProductSliderSection({
  title,
  subtitle,
  products,
  accent = "primary",
  visibleCount = 5,
}: ProductSliderSectionProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (!products?.length) return null;

  const accentClass = {
    primary: "text-primary",
    danger: "text-danger",
    accent: "text-accent",
  }[accent];

  const scroll = (direction: -1 | 1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-slide-card]");
    const step = card ? card.offsetWidth + 16 : el.clientWidth / visibleCount;
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  };

  const cardWidthClass =
    visibleCount >= 5
      ? "w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-12px)] lg:w-[calc(20%-13px)]"
      : "w-[calc(50%-8px)] sm:w-[calc(33.333%-11px)] md:w-[calc(25%-12px)]";

  return (
    <section className="py-10 md:py-14">
      <div className="flex items-end justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h2 className={`section-title ${accentClass}`}>{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        {products.length > visibleCount && (
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scroll(-1)}
              className="p-2 rounded-full border border-border bg-card hover:bg-muted transition-colors"
              aria-label="Previous products"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scroll(1)}
              className="p-2 rounded-full border border-border bg-card hover:bg-muted transition-colors"
              aria-label="Next products"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      <div
        ref={trackRef}
        className="product-slider-track flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-2 -mx-1 px-1"
      >
        {products.map((product) => (
          <div
            key={product.id}
            data-slide-card
            className={`flex-none snap-start ${cardWidthClass}`}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
