"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Package, AlertTriangle, TrendingDown, Boxes } from "lucide-react";
import AdminPageHeader from "../shared/AdminPageHeader";
import {
  fetchStockSummary, fetchLowStock, fetchStockMovements, stockIn, stockOut, adjustStock,
  fetchWarehouses, type StockSummary, type StockMovement, type Warehouse,
} from "@/lib/inventoryApi";
import { fetchProducts } from "@/lib/productsApi";

export default function InventoryPage() {
  const [summary, setSummary] = useState<StockSummary | null>(null);
  const [lowStock, setLowStock] = useState<any[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [tab, setTab] = useState<"overview" | "movements" | "adjust">("overview");
  const [form, setForm] = useState({
    product_id: "",
    quantity: "",
    new_quantity: "",
    type: "in" as "in" | "out" | "adjust",
    notes: "",
    reference: "",
    warehouse_id: "",
  });

  const load = async () => {
    try {
      const [sum, low, mov, wh, prods] = await Promise.all([
        fetchStockSummary(),
        fetchLowStock(5),
        fetchStockMovements({ per_page: 20 }),
        fetchWarehouses(),
        fetchProducts("", 1, 100),
      ]);
      setSummary(sum);
      setLowStock(low);
      setMovements(mov.data);
      setWarehouses(wh);
      setProducts(prods.data ?? []);
    } catch {
      toast.error("Failed to load inventory data");
    }
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const productId = Number(form.product_id);
    if (!productId) return toast.error("Select a product");

    try {
      const wh = form.warehouse_id ? Number(form.warehouse_id) : undefined;
      if (form.type === "in") {
        await stockIn({ product_id: productId, quantity: Number(form.quantity), warehouse_id: wh, notes: form.notes, reference: form.reference });
        toast.success("Stock added");
      } else if (form.type === "out") {
        await stockOut({ product_id: productId, quantity: Number(form.quantity), warehouse_id: wh, notes: form.notes, reference: form.reference });
        toast.success("Stock removed");
      } else {
        await adjustStock({ product_id: productId, new_quantity: Number(form.new_quantity), warehouse_id: wh, notes: form.notes });
        toast.success("Stock adjusted");
      }
      setForm({ ...form, quantity: "", new_quantity: "", notes: "", reference: "" });
      load();
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || "Operation failed");
    }
  };

  const stats = [
    { label: "Total Products", value: summary?.totalProducts ?? 0, icon: Package, color: "bg-blue-100 text-blue-700" },
    { label: "In Stock", value: summary?.inStock ?? 0, icon: Boxes, color: "bg-green-100 text-green-700" },
    { label: "Low Stock", value: summary?.lowStock ?? 0, icon: AlertTriangle, color: "bg-amber-100 text-amber-700" },
    { label: "Out of Stock", value: summary?.outOfStock ?? 0, icon: TrendingDown, color: "bg-red-100 text-red-700" },
  ];

  return (
    <div>
      <AdminPageHeader title="Stock Management" subtitle="Track inventory, stock in/out, adjustments & history" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="admin-card p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${color}`}><Icon size={20} /></div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{value}</p>
                <p className="text-xs text-slate-500">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        {(["overview", "adjust", "movements"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize ${
              tab === t ? "bg-orange-500 text-white" : "bg-white border border-slate-200 text-slate-600"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <div className="admin-card overflow-hidden">
          <div className="p-4 border-b"><h3 className="font-semibold">Low Stock Alert (≤ 5 units)</h3></div>
          <table className="admin-table w-full">
            <thead><tr><th>Product</th><th>SKU</th><th>Stock</th><th>Category</th></tr></thead>
            <tbody>
              {lowStock.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-6 text-slate-500">All products well stocked</td></tr>
              ) : lowStock.map((p) => (
                <tr key={p.id}>
                  <td className="font-medium">{p.name}</td>
                  <td>{p.sku || "—"}</td>
                  <td><span className={p.stock <= 0 ? "admin-badge-danger" : "admin-badge-warning"}>{p.stock}</span></td>
                  <td>{p.category?.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "adjust" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit} className="admin-card p-5 space-y-4">
            <h3 className="font-semibold">Stock Operation</h3>
            <div>
              <label className="block text-sm font-medium mb-1">Operation Type</label>
              <select className="admin-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as any })}>
                <option value="in">Stock In (Add)</option>
                <option value="out">Stock Out (Remove)</option>
                <option value="adjust">Adjust to Quantity</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Product</label>
              <select className="admin-input" value={form.product_id} onChange={(e) => setForm({ ...form, product_id: e.target.value })} required>
                <option value="">Select product...</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</option>
                ))}
              </select>
            </div>
            {warehouses.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1">Warehouse</label>
                <select className="admin-input" value={form.warehouse_id} onChange={(e) => setForm({ ...form, warehouse_id: e.target.value })}>
                  <option value="">Default warehouse</option>
                  {warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
                </select>
              </div>
            )}
            {form.type !== "adjust" ? (
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input type="number" min="1" className="admin-input" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} required />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium mb-1">New Quantity</label>
                <input type="number" min="0" className="admin-input" value={form.new_quantity} onChange={(e) => setForm({ ...form, new_quantity: e.target.value })} required />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Reference</label>
              <input className="admin-input" value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} placeholder="PO-123, Invoice, etc." />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Notes</label>
              <textarea className="admin-input" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </div>
            <button type="submit" className="admin-btn-primary w-full justify-center">Submit</button>
          </form>

          <div className="admin-card p-5">
            <h3 className="font-semibold mb-3">Warehouses</h3>
            {warehouses.length === 0 ? (
              <p className="text-sm text-slate-500">No warehouses configured. Default warehouse will be used.</p>
            ) : (
              <ul className="space-y-2">
                {warehouses.map((w) => (
                  <li key={w.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                    <div>
                      <p className="font-medium">{w.name}</p>
                      <p className="text-xs text-slate-500">{w.code}</p>
                    </div>
                    {w.is_default && <span className="admin-badge-success">Default</span>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {tab === "movements" && (
        <div className="admin-card overflow-hidden">
          <table className="admin-table w-full">
            <thead>
              <tr><th>Date</th><th>Product</th><th>Type</th><th>Qty</th><th>Before</th><th>After</th><th>Notes</th></tr>
            </thead>
            <tbody>
              {movements.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-6 text-slate-500">No stock movements yet</td></tr>
              ) : movements.map((m) => (
                <tr key={m.id}>
                  <td className="text-xs">{new Date(m.created_at).toLocaleString()}</td>
                  <td>{m.product?.name}</td>
                  <td><span className="admin-badge-warning uppercase">{m.type}</span></td>
                  <td>{m.quantity}</td>
                  <td>{m.before_qty}</td>
                  <td>{m.after_qty}</td>
                  <td className="text-xs text-slate-500">{m.notes || m.reference || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
