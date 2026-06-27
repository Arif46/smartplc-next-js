"use client";

import React from "react";
import Link from "next/link";

export default function PromoBanner() {
  return (
    <section className="py-6">
      <div className="grid md:grid-cols-3 gap-4">
        <Link
          href="/new-arrivals"
          className="relative rounded-xl overflow-hidden h-36 md:h-44 group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent/70" />
          <div className="relative z-10 h-full flex flex-col justify-center px-6 text-white">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">New</span>
            <h3 className="text-xl font-bold mt-1">New Arrivals</h3>
            <span className="text-sm mt-2 opacity-80 group-hover:underline">Shop Now →</span>
          </div>
        </Link>
        <Link
          href="/flash-sale"
          className="relative rounded-xl overflow-hidden h-36 md:h-44 group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-danger to-primary" />
          <div className="relative z-10 h-full flex flex-col justify-center px-6 text-white">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Sale</span>
            <h3 className="text-xl font-bold mt-1">Up to 40% Off</h3>
            <span className="text-sm mt-2 opacity-80 group-hover:underline">Shop Deals →</span>
          </div>
        </Link>
        <Link
          href="/best-sellers"
          className="relative rounded-xl overflow-hidden h-36 md:h-44 group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary/80" />
          <div className="relative z-10 h-full flex flex-col justify-center px-6 text-white">
            <span className="text-xs font-bold uppercase tracking-wider opacity-80">Popular</span>
            <h3 className="text-xl font-bold mt-1">Best Sellers</h3>
            <span className="text-sm mt-2 opacity-80 group-hover:underline">Explore →</span>
          </div>
        </Link>
      </div>
    </section>
  );
}
