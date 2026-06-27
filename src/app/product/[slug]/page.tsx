"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ProductDetails from "@/components/frontend/ProductDetails";
import { getProductDetails } from "@/lib/productsApi";
import type { Product } from "@/lib/productsApi";

function ProductSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 animate-pulse">
      <div className="h-4 w-48 bg-muted rounded mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="flex gap-4">
          <div className="hidden lg:flex flex-col gap-2 w-20">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted rounded-xl" />
            ))}
          </div>
          <div className="flex-1 aspect-square bg-muted rounded-2xl" />
        </div>
        <div className="space-y-5">
          <div className="h-6 w-24 bg-muted rounded-full" />
          <div className="h-10 w-full bg-muted rounded-xl" />
          <div className="h-8 w-32 bg-muted rounded" />
          <div className="h-24 bg-muted rounded-2xl" />
          <div className="h-12 bg-muted rounded-xl" />
          <div className="h-12 bg-muted rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  const params = useParams();
  const slug = String(params.slug);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    getProductDetails(slug)
      .then(setProduct)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <ProductSkeleton />;

  if (notFound || !product) {
    return (
      <div className="max-w-lg mx-auto py-20 text-center">
        <h1 className="text-2xl font-bold text-foreground mb-2">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">
          This product may have been removed or is no longer available.
        </p>
        <a href="/shop" className="inline-flex px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium">
          Back to Shop
        </a>
      </div>
    );
  }

  return <ProductDetails product={product} />;
}
