"use client";

import React from "react";
import Link from "next/link";
import { Timer, Zap } from "lucide-react";
import ProductCard, { ProductCardData } from "@/components/frontend/ProductCard";

interface FlashSaleBannerProps {
  products: ProductCardData[];
}

export default function FlashSaleBanner({ products }: FlashSaleBannerProps) {
  if (!products?.length) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="rounded-2xl border border-danger/30 bg-gradient-to-br from-danger/5 to-primary/5 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-danger/10">
              <Zap className="h-6 w-6 text-danger" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                Flash Sale
                <span className="badge-sale animate-pulse">LIVE</span>
              </h2>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Timer className="h-3.5 w-3.5" /> Limited time offers — grab them fast!
              </p>
            </div>
          </div>
          <Link href="/flash-sale" className="btn-primary">
            View All Deals
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
