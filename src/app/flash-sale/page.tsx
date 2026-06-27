"use client";

import { Suspense } from "react";
import ShopListing from "@/components/frontend/shop/ShopListing";
import ProductSkeleton from "@/components/frontend/ui/ProductSkeleton";

export default function FlashSalePage() {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <ShopListing
        title="Flash Sale"
        subtitle="Limited time deals — grab them before they're gone!"
        defaultFlag="flash_sale"
      />
    </Suspense>
  );
}
