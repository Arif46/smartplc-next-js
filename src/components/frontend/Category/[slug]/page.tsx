'use client'
import { useEffect, useState } from "react";
import { fetchProductsByCategorySlug } from "@/lib/homeApi";
import ProductCard from "@/components/frontend/ProductCard";


export default function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      const res = await fetchProductsByCategorySlug(slug);
      setProducts(res);
    };
    loadProducts();
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 capitalize">{slug} Products</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
          />
        ))}
      </div>
    </div>
  );
}
