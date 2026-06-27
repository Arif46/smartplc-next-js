"use client";

import React from "react";

export default function ProductSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="skeleton h-48 w-full" />
          <div className="p-4 space-y-3">
            <div className="skeleton h-4 w-3/4 rounded" />
            <div className="skeleton h-3 w-1/2 rounded" />
            <div className="skeleton h-6 w-1/3 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
