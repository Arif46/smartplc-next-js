"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AdminAuthGuard from "../../../components/shared/AdminAuthGuard";
import AdminShell from "../../../components/shared/AdminShell";
import ProductForm, { Product } from "../../../components/Product/ProductForm";
import { getProduct, updateProduct } from "@/lib/productsApi";
import { getAllCategory } from "@/lib/categoriesApi";
import { getAllBrand } from "@/lib/brandApi";

export default function ProductEditPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);
  const [product, setProduct] = useState<Partial<Product> | null>(null);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id || Number.isNaN(id)) {
      setLoading(false);
      return;
    }
    Promise.all([getProduct(id), getAllCategory(), getAllBrand()])
      .then(([prod, cats, brs]) => {
        setProduct({
          ...prod,
          category_id: prod.category_id ?? prod.category?.id ?? 0,
          brand_id: prod.brand_id ?? prod.brand?.id ?? 0,
        });
        setCategories(Array.isArray(cats) ? cats : []);
        setBrands(Array.isArray(brs) ? brs : []);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err?.response?.data?.message ?? "Failed to load product");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <AdminAuthGuard>
        <AdminShell pageTitle="Edit Product" pageSubtitle="Loading...">
          <div className="text-center py-20 text-slate-400">Loading...</div>
        </AdminShell>
      </AdminAuthGuard>
    );
  }

  if (!product) {
    return (
      <AdminAuthGuard>
        <AdminShell pageTitle="Edit Product" pageSubtitle="Not Found">
          <div className="text-center py-20 text-slate-400">Product not found</div>
        </AdminShell>
      </AdminAuthGuard>
    );
  }

  return (
    <AdminAuthGuard>
      <AdminShell pageTitle={`Edit: ${product.name}`} pageSubtitle="Update Product">
        <ProductForm
          key={product.id}
          mode="edit"
          initial={product}
          categories={categories}
          brands={brands}
          onSave={async (fd) => {
            await updateProduct(id, fd);
            toast.success("Product updated successfully");
            router.push(`/admin/products/${id}`);
          }}
        />
      </AdminShell>
    </AdminAuthGuard>
  );
}
