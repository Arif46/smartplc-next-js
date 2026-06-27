"use client";

import { Suspense } from "react";
import ShopListing from "@/components/frontend/shop/ShopListing";
import ProductSkeleton from "@/components/frontend/ui/ProductSkeleton";

export default function OffersPage() {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ShopListing
        title="Special Offers"
        subtitle="Discounted parts and exclusive deals"
        defaultFlag="on_sale"
      />
    </Suspense>
  );
}
