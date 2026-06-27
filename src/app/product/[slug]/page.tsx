'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ProductDetails from '@/components/frontend/ProductDetails';
import { getProductDetails } from '@/lib/productsApi';

export default function ProductPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductDetails(String(params.slug))
      .then(setProduct)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="aspect-square skeleton rounded-xl" />
          <div className="space-y-4">
            <div className="skeleton h-8 w-3/4 rounded" />
            <div className="skeleton h-4 w-1/2 rounded" />
            <div className="skeleton h-6 w-1/4 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="text-center py-16 text-muted-foreground">Product not found</div>;
  }

  return <ProductDetails product={product} />;
}
