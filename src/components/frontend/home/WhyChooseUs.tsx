"use client";

import React from "react";
import Link from "next/link";
import { Truck, ShieldCheck, Headphones, RotateCcw, Award, Clock } from "lucide-react";

const features = [
  { icon: Truck, title: "Free Shipping", desc: "On orders over ৳2,000" },
  { icon: ShieldCheck, title: "Genuine Parts", desc: "100% authentic products" },
  { icon: Headphones, title: "Expert Support", desc: "Rider-focused service" },
  { icon: RotateCcw, title: "Easy Returns", desc: "7-day hassle-free returns" },
  { icon: Award, title: "Best Prices", desc: "Competitive pricing guaranteed" },
  { icon: Clock, title: "Fast Delivery", desc: "Same-day dispatch available" },
];

export default function WhyChooseUs() {
  return (
    <section className="py-10 md:py-14">
      <div className="text-center mb-8">
        <h2 className="section-title">Why Choose Smart PLC</h2>
        <p className="section-subtitle">Bangladesh&apos;s trusted destination for motorcycle parts</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex flex-col items-center text-center p-5 rounded-xl border border-border bg-card hover:shadow-md transition-shadow"
          >
            <div className="p-3 rounded-full bg-primary/10 mb-3">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold text-sm text-foreground">{title}</h3>
            <p className="text-xs text-muted-foreground mt-1">{desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
