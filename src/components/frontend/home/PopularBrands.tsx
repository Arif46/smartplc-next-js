"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchFeaturedBrands } from "@/lib/shopApi";
import type { Brand } from "@/lib/homeApi";

interface PopularBrandsProps {
  initialBrands?: Brand[];
}

export default function PopularBrands({ initialBrands }: PopularBrandsProps) {
  const [brands, setBrands] = useState<Brand[]>(initialBrands ?? []);

  useEffect(() => {
    if (initialBrands?.length) return;
    fetchFeaturedBrands().then(setBrands).catch(() => {});
  }, [initialBrands]);

  if (!brands.length) return null;

  return (
    <section className="py-10 md:py-14 bg-muted/50 rounded-2xl px-4 md:px-8">
      <div className="text-center mb-8">
        <h2 className="section-title">Popular Brands</h2>
        <p className="section-subtitle">Trusted manufacturers for performance & reliability</p>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {brands.map((brand) => (
          <Link
            key={brand.id}
            href={`/brand/${brand.slug}`}
            className="flex items-center justify-center p-4 md:p-6 rounded-xl border border-border bg-card hover:border-primary hover:shadow-md transition-all card-hover"
          >
            <span className="text-sm md:text-base font-bold text-foreground text-center">
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
