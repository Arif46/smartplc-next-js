"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import AdminAuthGuard from "../../components/shared/AdminAuthGuard";
import AdminShell from "../../components/shared/AdminShell";
import ProductForm from "../../components/Product/ProductForm";
import { createProduct } from "@/lib/productsApi";
import { getAllCategory } from "@/lib/categoriesApi";
import { getAllBrand } from "@/lib/brandApi";

export default function ProductCreatePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    Promise.all([getAllCategory(), getAllBrand()])
      .then(([cats, brs]) => {
        setCategories(Array.isArray(cats) ? cats : []);
        setBrands(Array.isArray(brs) ? brs : []);
      })
      .catch(() => toast.error("Failed to load categories/brands"));
  }, []);

  return (
    <AdminAuthGuard>
      <AdminShell pageTitle="Create Product" pageSubtitle="Add New Product">
        <ProductForm
          mode="create"
          categories={categories}
          brands={brands}
          onSave={async (fd) => {
            const created = await createProduct(fd);
            toast.success("Product created successfully");
            router.push(`/admin/products/${created.id}`);
          }}
        />
      </AdminShell>
    </AdminAuthGuard>
  );
}
