"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchAllActiveCategories } from "@/lib/homeApi";
import type { Category } from "@/lib/homeApi";
import {
  Wrench, CircleDot, Zap, Wind, Settings, Shield, Droplets, Link2,
} from "lucide-react";

const iconMap: Record<string, React.ElementType> = {
  "engine-parts": Wrench,
  "brake-system": CircleDot,
  electrical: Zap,
  exhaust: Wind,
  suspension: Settings,
  "body-fairing": Shield,
  "filters-fluids": Droplets,
  "chain-sprocket": Link2,
};

interface FeaturedCategoriesProps {
  initialCategories?: Category[];
}

export default function FeaturedCategories({ initialCategories }: FeaturedCategoriesProps) {
  const [categories, setCategories] = useState<Category[]>(initialCategories ?? []);

  useEffect(() => {
    if (initialCategories?.length) return;
    fetchAllActiveCategories().then(setCategories).catch(() => {});
  }, [initialCategories]);

  if (!categories.length) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="text-center mb-8">
        <h2 className="section-title">Shop by Category</h2>
        <p className="section-subtitle">Find the exact parts you need for your motorcycle</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-3 md:gap-4">
        {categories.map((cat) => {
          const Icon = iconMap[cat.slug] || Wrench;
          return (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group flex flex-col items-center gap-3 p-4 md:p-5 rounded-xl border border-border bg-card hover:border-primary hover:shadow-lg transition-all card-hover text-center"
            >
              <div className="p-3 rounded-xl bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Icon className="h-6 w-6 text-primary group-hover:text-primary-foreground" />
              </div>
              <span className="text-xs md:text-sm font-semibold text-foreground line-clamp-2">
                {cat.name}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
