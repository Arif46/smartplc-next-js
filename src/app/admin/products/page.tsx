"use client";

import AdminAuthGuard from "../components/shared/AdminAuthGuard";
import AdminShell from "../components/shared/AdminShell";
import ProductListPage from "../components/Product/ProductListPage";

export default function ProductsPage() {
  return (
    <AdminAuthGuard>
      <AdminShell pageTitle="Products" pageSubtitle="Catalog Management">
        <ProductListPage />
      </AdminShell>
    </AdminAuthGuard>
  );
}
