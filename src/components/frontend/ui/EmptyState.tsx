"use client";

import React from "react";
import Link from "next/link";
import { Package } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  title = "No products found",
  description = "Try adjusting your filters or search terms.",
  actionLabel = "Browse Shop",
  actionHref = "/shop",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Package className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground mt-2 max-w-md">{description}</p>
      {actionHref && (
        <Link href={actionHref} className="btn-primary mt-6">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
