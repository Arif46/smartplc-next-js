"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import ProductCard from "@/components/frontend/ProductCard";
import ProductSkeleton from "@/components/frontend/ui/ProductSkeleton";
import EmptyState from "@/components/frontend/ui/EmptyState";
import { fetchBrandProducts } from "@/lib/shopApi";

function BrandContent() {
  const params = useParams();
  const slug = params.slug as string;
  const [brand, setBrand] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBrandProducts(slug)
      .then((data) => {
        setBrand(data.brand);
        setProducts(data.products?.data ?? []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <ProductSkeleton />;

  return (
    <div>
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-secondary to-primary/20 text-white">
        <h1 className="text-3xl font-bold">{brand?.name ?? "Brand"}</h1>
        <p className="text-white/70 mt-2">{brand?.description || "Shop genuine parts from this brand"}</p>
      </div>

      {products.length === 0 ? (
        <EmptyState title="No products for this brand" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function BrandPage() {
  return (
    <Suspense fallback={<ProductSkeleton />}>
      <BrandContent />
    </Suspense>
  );
}
