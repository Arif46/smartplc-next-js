"use client";

import React, { useRef, useState, useCallback } from "react";
import { Maximize2, Move3d } from "lucide-react";

interface ProductImage5DViewerProps {
  src: string;
  alt: string;
  onOpenLightbox?: () => void;
  className?: string;
}

export default function ProductImage5DViewer({
  src,
  alt,
  onOpenLightbox,
  className = "",
}: ProductImage5DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    originX: 50,
    originY: 50,
    shineX: 50,
    shineY: 50,
  });

  const handleMove = useCallback((clientX: number, clientY: number) => {
    const el = containerRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = (clientX - rect.left) / rect.width;
    const y = (clientY - rect.top) / rect.height;
    const nx = (x - 0.5) * 2;
    const ny = (y - 0.5) * 2;

    setTransform({
      rotateX: -ny * 14,
      rotateY: nx * 14,
      scale: 1.18,
      originX: x * 100,
      originY: y * 100,
      shineX: x * 100,
      shineY: y * 100,
    });
  }, []);

  const reset = useCallback(() => {
    setActive(false);
    setTransform({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      originX: 50,
      originY: 50,
      shineX: 50,
      shineY: 50,
    });
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative aspect-square rounded-2xl overflow-hidden bg-muted/30 border border-border group ${className}`}
      style={{ perspective: "1200px" }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={reset}
      onMouseMove={(e) => active && handleMove(e.clientX, e.clientY)}
      onTouchMove={(e) => {
        const touch = e.touches[0];
        if (touch) handleMove(touch.clientX, touch.clientY);
      }}
      onTouchEnd={reset}
    >
      <div
        className="absolute inset-0 transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: active
            ? `rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg) scale(${transform.scale})`
            : "rotateX(0deg) rotateY(0deg) scale(1)",
          transformStyle: "preserve-3d",
        }}
      >
        <img
          src={src}
          alt={alt}
          draggable={false}
          className="w-full h-full object-cover select-none"
          style={{
            transformOrigin: `${transform.originX}% ${transform.originY}%`,
            transition: active ? "transform 0.08s ease-out" : "transform 0.35s ease-out",
          }}
        />
      </div>

      {/* 5D shine overlay */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(circle at ${transform.shineX}% ${transform.shineY}%, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.08) 28%, transparent 55%)`,
        }}
      />

      {/* Depth shadow */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: active ? 0.45 : 0,
          background: `radial-gradient(circle at ${100 - transform.shineX}% ${100 - transform.shineY}%, rgba(0,0,0,0.25) 0%, transparent 50%)`,
        }}
      />

      {/* Controls hint */}
      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-sm border border-border text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        <Move3d className="h-3.5 w-3.5" />
        5D View
      </div>

      {onOpenLightbox && (
        <button
          type="button"
          onClick={onOpenLightbox}
          className="absolute top-3 right-3 p-2 rounded-xl bg-background/80 backdrop-blur-sm border border-border text-foreground hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
          aria-label="Open fullscreen"
        >
          <Maximize2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
