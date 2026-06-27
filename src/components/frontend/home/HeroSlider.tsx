"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { fetchSliders, type Slider } from "@/lib/shopApi";

const fallbackSlides = [
  {
    id: 1,
    title: "Premium Bike Parts",
    subtitle: "Genuine parts for every ride — engine, brakes, exhaust & more",
    desktop_image_url: "/slider-1.jpg",
    button_text: "Shop Now",
    button_url: "/shop",
  },
  {
    id: 2,
    title: "Flash Sale",
    subtitle: "Up to 40% off on selected performance parts",
    desktop_image_url: "/slider-2.jpg",
    button_text: "View Deals",
    button_url: "/flash-sale",
  },
];

interface HeroSliderProps {
  initialSliders?: Slider[];
}

export default function HeroSlider({ initialSliders }: HeroSliderProps) {
  const router = useRouter();
  const [slides, setSlides] = useState<any[]>(
    initialSliders?.length
      ? initialSliders.map((s) => ({
          id: s.id,
          title: s.title,
          subtitle: s.subtitle,
          desktop_image_url: s.desktop_image_url || `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/${s.desktop_image}`,
          button_text: s.button_text,
          button_url: s.button_url,
        }))
      : fallbackSlides
  );
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (initialSliders?.length) return;
    fetchSliders()
      .then((data: Slider[]) => {
        if (data.length) {
          setSlides(
            data.map((s) => ({
              id: s.id,
              title: s.title,
              subtitle: s.subtitle,
              desktop_image_url: s.desktop_image_url || `${process.env.NEXT_PUBLIC_API_BASE_URL}/storage/${s.desktop_image}`,
              button_text: s.button_text,
              button_url: s.button_url,
            }))
          );
        }
      })
      .catch(() => {});
  }, [initialSliders]);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[current];

  return (
    <div className="relative rounded-2xl overflow-hidden h-[280px] md:h-[420px] lg:h-[480px]">
      {slides.map((s, i) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `linear-gradient(to right, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.4) 60%, transparent 100%), url(${s.desktop_image_url})`,
            }}
          />
        </div>
      ))}

      <div className="relative z-10 h-full flex flex-col justify-center px-8 md:px-14 max-w-2xl">
        {slide?.title && (
          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight animate-fade-in-up">
            {slide.title}
          </h1>
        )}
        {slide?.subtitle && (
          <p className="mt-3 text-base md:text-lg text-white/80 max-w-lg">
            {slide.subtitle}
          </p>
        )}
        {slide?.button_text && (
          <button
            onClick={() => router.push(slide.button_url || "/shop")}
            className="mt-6 btn-primary w-fit px-8 py-3 text-base"
          >
            {slide.button_text}
          </button>
        )}
      </div>

      <button
        onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur transition-colors"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        onClick={() => setCurrent((c) => (c + 1) % slides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur transition-colors"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all ${
              i === current ? "w-8 bg-primary" : "w-3 bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
