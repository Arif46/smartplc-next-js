"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import AdminAuthGuard from "../../components/shared/AdminAuthGuard";
import AdminShell from "../../components/shared/AdminShell";
import ProductDetailsView from "../../components/Product/ProductDetailsView";
import { getProduct } from "@/lib/productsApi";

export default function ProductDetailsPage() {
  const params = useParams();
  const id = Number(params.id);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setLoading(false);
      return;
    }
    getProduct(id)
      .then(setProduct)
      .catch((err) => toast.error(err?.response?.data?.message ?? "Product not found"))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <AdminAuthGuard>
      <AdminShell pageTitle={product?.name ?? "Product Details"} pageSubtitle="Product Information">
        {loading ? (
          <div className="text-center py-20 text-slate-400">Loading product...</div>
        ) : product ? (
          <ProductDetailsView product={product} />
        ) : (
          <div className="text-center py-20 text-slate-400">Product not found</div>
        )}
      </AdminShell>
    </AdminAuthGuard>
  );
}
