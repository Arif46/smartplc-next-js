"use client";

import Link from "next/link";
import { useCompareStore } from "@/store/compareStore";
import EmptyState from "@/components/frontend/ui/EmptyState";
import { getProductImageUrl, formatPrice } from "@/lib/productUtils";
import { GitCompare, X, Trash2 } from "lucide-react";

export default function ComparePage() {
  const { items, remove, clear } = useCompareStore();

  if (items.length === 0) {
    return (
      <EmptyState
        title="Nothing to compare"
        description="Add up to 4 products to compare specifications side by side."
        actionLabel="Browse Products"
        actionHref="/shop"
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <GitCompare className="h-7 w-7 text-accent" />
          <div>
            <h1 className="section-title">Compare Products</h1>
            <p className="section-subtitle">{items.length} of 4 products</p>
          </div>
        </div>
        <button onClick={clear} className="btn-secondary text-danger">
          <Trash2 className="h-4 w-4" /> Clear All
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="p-4 text-left text-sm font-semibold w-32">Feature</th>
              {items.map((item) => (
                <th key={item.id} className="p-4 text-center min-w-[180px]">
                  <div className="relative">
                    <button
                      onClick={() => remove(item.id)}
                      className="absolute -top-1 -right-1 p-1 rounded-full bg-muted hover:bg-danger hover:text-white transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <img
                      src={getProductImageUrl(item.image)}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded-lg mx-auto mb-2"
                    />
                    <Link href={`/product/${item.slug}`} className="text-sm font-semibold hover:text-primary line-clamp-2">
                      {item.name}
                    </Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="p-4 text-sm font-medium text-muted-foreground">Brand</td>
              {items.map((item) => (
                <td key={item.id} className="p-4 text-center text-sm">{item.brand?.name || "—"}</td>
              ))}
            </tr>
            <tr className="border-b border-border">
              <td className="p-4 text-sm font-medium text-muted-foreground">Price</td>
              {items.map((item) => (
                <td key={item.id} className="p-4 text-center text-sm font-bold text-primary">
                  {formatPrice(item.purchase_price)}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-4 text-sm font-medium text-muted-foreground">Specifications</td>
              {items.map((item) => (
                <td key={item.id} className="p-4 text-center text-xs text-muted-foreground whitespace-pre-line">
                  {item.specification || "—"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
