"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import ProductCard, { ProductCardData } from "@/components/frontend/ProductCard";

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: ProductCardData[];
  viewAllHref?: string;
  accent?: "primary" | "danger" | "accent";
}

export default function ProductSection({
  title,
  subtitle,
  products,
  viewAllHref,
  accent = "primary",
}: ProductSectionProps) {
  if (!products?.length) return null;

  const accentClass = {
    primary: "text-primary",
    danger: "text-danger",
    accent: "text-accent",
  }[accent];

  return (
    <section className="py-10 md:py-14">
      <div className="flex items-end justify-between mb-6 md:mb-8">
        <div>
          <h2 className={`section-title ${accentClass}`}>{title}</h2>
          {subtitle && <p className="section-subtitle">{subtitle}</p>}
        </div>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {viewAllHref && (
        <div className="mt-6 text-center sm:hidden">
          <Link href={viewAllHref} className="btn-secondary">
            View All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  );
}
