"use client";

import { Suspense } from "react";
import ShopListing from "@/components/frontend/shop/ShopListing";
import ProductSkeleton from "@/components/frontend/ui/ProductSkeleton";

export default function SearchPage() {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ShopListing title="Search Results" subtitle="Find the parts you need" />
    </Suspense>
  );
}
