"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Filter } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import {
  fetchProducts, deleteProduct, toggleProductStatus, type Product,
} from "@/lib/productsApi";
import {
  AdminCrudTable, AdminStatusToggle, AdminRowActions, AdminPagination,
  AdminThumb, AdminTypeBadge,
} from "../shared/AdminCrudLayout";

export default function ProductListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const loadData = async (query = search, page = currentPage, size = perPage) => {
    setLoading(true);
    try {
      const res = await fetchProducts(query, page, size);
      setItems(res.data);
      if (res.meta) {
        setCurrentPage(res.meta.current_page);
        setLastPage(res.meta.last_page);
      }
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData("", 1); }, []);
  useEffect(() => {
    const t = setTimeout(() => loadData(search, 1), 350);
    return () => clearTimeout(t);
  }, [search, perPage]);

  const handleDelete = async (item: Product) => {
    const result = await Swal.fire({
      title: "Delete product?",
      text: `"${item.name}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteProduct(item.id);
      toast.success("Product deleted");
      loadData(search, currentPage);
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleToggle = async (item: Product) => {
    try {
      await toggleProductStatus(item.id);
      toast.success(`"${item.name}" status updated successfully`);
      loadData(search, currentPage);
    } catch {
      toast.error("Status update failed");
    }
  };

  const stockBadge = (stock: number) => {
    if (stock <= 0) return <AdminTypeBadge label="Out of Stock" variant="gray" />;
    if (stock <= 5) return <AdminTypeBadge label={`Low (${stock})`} variant="blue" />;
    return <AdminTypeBadge label={`In Stock (${stock})`} variant="green" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Product List</h1>
        <button type="button" onClick={() => router.push("/admin/products/create")} className="crud-btn-primary">
          <Plus size={16} /> Add New
        </button>
      </div>

      <div className="crud-card">
        <div className="crud-card-body">
          <div className="flex gap-2 mb-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, slug or SKU..."
              className="crud-input flex-1"
            />
            <button type="button" onClick={() => loadData(search, 1)} className="crud-btn-primary shrink-0">
              <Filter size={16} /> Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <AdminCrudTable>
              <thead>
                <tr>
                  <th>SL No</th>
                  <th>Image</th>
                  <th>Product Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={10} className="text-center py-10 text-slate-400">Loading...</td></tr>
                ) : items.length === 0 ? (
                  <tr><td colSpan={10} className="text-center py-10 text-slate-400">No products found</td></tr>
                ) : items.map((item, idx) => {
                  const stock = Number(item.stock ?? 0);
                  return (
                    <tr key={item.id} className="cursor-pointer" onClick={() => router.push(`/admin/products/${item.id}`)}>
                      <td onClick={(e) => e.stopPropagation()}>{(currentPage - 1) * perPage + idx + 1}</td>
                      <td><AdminThumb src={item.image_url} alt={item.name} /></td>
                      <td className="font-medium">{item.name}</td>
                      <td className="text-xs text-slate-500">{item.sku ?? "—"}</td>
                      <td>{item.category?.name ?? "—"}</td>
                      <td>{item.brand?.name ?? "—"}</td>
                      <td>
                        {item.sale_price ? (
                          <span><span className="line-through text-slate-400 text-xs mr-1">৳{item.purchase_price}</span>৳{item.sale_price}</span>
                        ) : `৳${item.purchase_price}`}
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>{stockBadge(stock)}</td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <AdminStatusToggle checked={item.status === 1} onChange={() => handleToggle(item)} />
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <AdminRowActions
                          onEdit={() => router.push(`/admin/products/${item.id}/edit`)}
                          onDelete={() => handleDelete(item)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </AdminCrudTable>
          </div>
        </div>
        <div className="crud-card-footer">
          <AdminPagination
            currentPage={currentPage}
            lastPage={lastPage}
            perPage={perPage}
            onPageChange={(p) => loadData(search, p)}
            onPerPageChange={(n) => { setPerPage(n); setCurrentPage(1); }}
          />
        </div>
      </div>
    </div>
  );
}
