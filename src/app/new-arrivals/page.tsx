"use client";

import { Suspense } from "react";
import ShopListing from "@/components/frontend/shop/ShopListing";
import ProductSkeleton from "@/components/frontend/ui/ProductSkeleton";

export default function NewArrivalsPage() {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ShopListing
        title="New Arrivals"
        subtitle="The latest parts added to our catalog"
        defaultFlag="new_arrival"
      />
    </Suspense>
  );
}
