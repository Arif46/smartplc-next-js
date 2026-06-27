"use client";

import { Suspense } from "react";
import ShopListing from "@/components/frontend/shop/ShopListing";
import ProductSkeleton from "@/components/frontend/ui/ProductSkeleton";

export default function BestSellersPage() {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ShopListing
        title="Best Sellers"
        subtitle="Our most popular parts loved by riders"
        defaultFlag="best_seller"
      />
    </Suspense>
  );
}
