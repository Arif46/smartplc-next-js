"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Pencil, Package, Tag, Award, Barcode, Shield } from "lucide-react";
import { getProductImageUrl, formatPrice, getEffectivePrice } from "@/lib/productUtils";
import type { Product } from "@/lib/productsApi";

interface Props {
  product: Product & {
    oem_number?: string;
    part_number?: string;
    barcode?: string;
    weight?: number;
    warranty?: string;
    video_url?: string;
    cost_price?: number;
    meta_title?: string;
    meta_description?: string;
    is_featured?: boolean;
    is_new_arrival?: boolean;
    is_best_seller?: boolean;
    bike_models?: { id: number; name: string }[];
  };
}

function DetailRow({ label, value }: { label: string; value?: React.ReactNode }) {
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className="py-3 border-b border-slate-100 last:border-0">
      <dt className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1">{label}</dt>
      <dd className="text-sm text-slate-800">{value}</dd>
    </div>
  );
}

function Flag({ active, label }: { active?: boolean; label: string }) {
  if (!active) return null;
  return <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700 mr-1 mb-1">{label}</span>;
}

export default function ProductDetailsView({ product }: Props) {
  const image = product.image_url ?? getProductImageUrl(product.image);
  const price = getEffectivePrice(product as any);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/admin/products" className="crud-btn-outline">
          <ArrowLeft size={16} /> Back to List
        </Link>
        <Link href={`/admin/products/${product.id}/edit`} className="crud-btn-primary">
          <Pencil size={16} /> Edit Product
        </Link>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Image card */}
        <div className="product-form-section xl:col-span-1">
          <h3 className="product-form-section-title">Product Photo</h3>
          <div className="product-form-section-body flex justify-center">
            <img src={image} alt={product.name} className="w-full max-w-sm rounded-lg border object-contain bg-slate-50 aspect-square" />
          </div>
        </div>

        {/* Overview */}
        <div className="product-form-section xl:col-span-2">
          <h3 className="product-form-section-title">Overview</h3>
          <div className="product-form-section-body">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">{product.name}</h2>
            <p className="text-sm text-slate-500 mb-4">SKU: {product.sku ?? "—"} · Slug: {product.slug}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${product.status === 1 ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                {product.status === 1 ? "Active" : "Inactive"}
              </span>
              {Number(product.stock ?? 0) <= 0
                ? <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Out of Stock</span>
                : <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{product.stock} in stock</span>}
            </div>
            <p className="text-3xl font-bold text-orange-600">{formatPrice(price)}</p>
            {product.sale_price && (
              <p className="text-sm text-slate-400 line-through mt-1">{formatPrice(product.purchase_price ?? 0)}</p>
            )}
            <div className="mt-4 flex flex-wrap">
              <Flag active={product.is_featured} label="Featured" />
              <Flag active={product.is_new_arrival} label="New Arrival" />
              <Flag active={product.is_best_seller} label="Best Seller" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        <div className="product-form-section">
          <h3 className="product-form-section-title flex items-center gap-2"><Tag size={16} /> Classification</h3>
          <dl className="product-form-section-body">
            <DetailRow label="Category" value={product.category?.name} />
            <DetailRow label="Brand" value={product.brand?.name} />
          </dl>
        </div>

        <div className="product-form-section">
          <h3 className="product-form-section-title flex items-center gap-2"><Package size={16} /> Pricing & Stock</h3>
          <dl className="product-form-section-body">
            <DetailRow label="Purchase Price" value={product.purchase_price != null ? formatPrice(product.purchase_price) : undefined} />
            <DetailRow label="Sale Price" value={product.sale_price ? formatPrice(product.sale_price) : undefined} />
            <DetailRow label="Cost Price" value={product.cost_price ? formatPrice(product.cost_price) : undefined} />
            <DetailRow label="Stock" value={product.stock} />
          </dl>
        </div>

        <div className="product-form-section">
          <h3 className="product-form-section-title flex items-center gap-2"><Barcode size={16} /> Identifiers</h3>
          <dl className="product-form-section-body">
            <DetailRow label="OEM Number" value={product.oem_number} />
            <DetailRow label="Part Number" value={product.part_number} />
            <DetailRow label="Barcode" value={product.barcode} />
            <DetailRow label="Weight" value={product.weight ? `${product.weight} kg` : undefined} />
            <DetailRow label="Warranty" value={product.warranty} />
            <DetailRow label="Video" value={product.video_url ? <a href={product.video_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">View</a> : undefined} />
          </dl>
        </div>
      </div>

      {product.description && (
        <div className="product-form-section">
          <h3 className="product-form-section-title">Description</h3>
          <p className="product-form-section-body text-sm text-slate-700 leading-relaxed">{product.description}</p>
        </div>
      )}

      {product.specification && (
        <div className="product-form-section">
          <h3 className="product-form-section-title">Specification</h3>
          <div className="product-form-section-body prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.specification }} />
        </div>
      )}

      {(product.bike_models?.length ?? 0) > 0 && (
        <div className="product-form-section">
          <h3 className="product-form-section-title flex items-center gap-2"><Award size={16} /> Bike Fitment</h3>
          <div className="product-form-section-body flex flex-wrap gap-2">
            {product.bike_models!.map((m) => (
              <span key={m.id} className="px-3 py-1 bg-slate-100 rounded-full text-sm text-slate-700">{m.name}</span>
            ))}
          </div>
        </div>
      )}

      {(product.meta_title || product.meta_description) && (
        <div className="product-form-section">
          <h3 className="product-form-section-title flex items-center gap-2"><Shield size={16} /> SEO</h3>
          <dl className="product-form-section-body">
            <DetailRow label="Meta Title" value={product.meta_title} />
            <DetailRow label="Meta Description" value={product.meta_description} />
          </dl>
        </div>
      )}
    </div>
  );
}
