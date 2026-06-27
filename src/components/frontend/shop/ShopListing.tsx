"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/frontend/ProductCard";
import ProductSkeleton from "@/components/frontend/ui/ProductSkeleton";
import EmptyState from "@/components/frontend/ui/EmptyState";
import { searchProducts, fetchAllBrands } from "@/lib/shopApi";
import { fetchAllActiveCategories } from "@/lib/homeApi";
import type { Brand, Category } from "@/lib/homeApi";
import { SlidersHorizontal, ChevronLeft, ChevronRight, Search, X } from "lucide-react";

export type ShopSearchParams = {
  q?: string;
  search?: string;
  category?: string;
  brand?: string;
  sort?: string;
  page?: string;
  flag?: string;
  bike_model_id?: string;
};

function parseSearchParams(params: ShopSearchParams = {}) {
  const pageRaw = Number(params.page || 1);
  return {
    search: params.q || params.search || "",
    category: params.category || "",
    brand: params.brand || "",
    sort: params.sort || "newest",
    page: Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1,
    flag: params.flag || "",
    bikeModelId: params.bike_model_id || "",
  };
}

interface ShopListingProps {
  title: string;
  subtitle?: string;
  defaultFlag?: string;
  defaultParams?: Record<string, string>;
  initialSearchParams?: ShopSearchParams;
}

export default function ShopListing({
  title,
  subtitle,
  defaultFlag,
  defaultParams = {},
  initialSearchParams = {},
}: ShopListingProps) {
  const router = useRouter();
  const parsed = useMemo(() => parseSearchParams(initialSearchParams), [initialSearchParams]);

  const [products, setProducts] = useState<any[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [search, setSearch] = useState(parsed.search);
  const [category, setCategory] = useState(parsed.category);
  const [brand, setBrand] = useState(parsed.brand);
  const [sort, setSort] = useState(parsed.sort);
  const [page, setPage] = useState(parsed.page);

  useEffect(() => {
    const next = parseSearchParams(initialSearchParams);
    setSearch(next.search);
    setCategory(next.category);
    setBrand(next.brand);
    setSort(next.sort);
    setPage(next.page);
  }, [initialSearchParams]);

  useEffect(() => {
    Promise.all([fetchAllActiveCategories(), fetchAllBrands()])
      .then(([cats, brs]) => {
        setCategories(Array.isArray(cats) ? cats : []);
        setBrands(Array.isArray(brs) ? brs : []);
      })
      .catch(() => {});
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, string | number> = { ...defaultParams, sort, page, per_page: 12 };
      if (defaultFlag) params.flag = defaultFlag;
      else if (parsed.flag) params.flag = parsed.flag;
      if (search.trim()) params.q = search.trim();
      if (category) params.category = category;
      if (brand) params.brand = brand;
      if (parsed.bikeModelId) params.bike_model_id = parsed.bikeModelId;
      const data = await searchProducts(params);
      setProducts(data.data ?? []);
      setMeta(data);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [sort, page, defaultFlag, defaultParams, search, category, brand, parsed.flag, parsed.bikeModelId]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const buildQuery = (overrides: Partial<ShopSearchParams> = {}) => {
    const params = new URLSearchParams();
    const merged = {
      q: search.trim() || undefined,
      category: category || undefined,
      brand: brand || undefined,
      sort: sort !== "newest" ? sort : undefined,
      page: page > 1 ? String(page) : undefined,
      flag: defaultFlag || parsed.flag || undefined,
      bike_model_id: parsed.bikeModelId || undefined,
      ...overrides,
    };
    if (merged.q) params.set("q", merged.q);
    if (merged.category) params.set("category", merged.category);
    if (merged.brand) params.set("brand", merged.brand);
    if (merged.sort) params.set("sort", merged.sort);
    if (merged.page) params.set("page", merged.page);
    if (merged.flag) params.set("flag", merged.flag);
    if (merged.bike_model_id) params.set("bike_model_id", merged.bike_model_id);
    return params.toString();
  };

  const applyFilters = () => {
    setPage(1);
    const query = buildQuery({ page: undefined });
    router.push(query ? `/shop?${query}` : "/shop");
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("");
    setBrand("");
    setSort("newest");
    setPage(1);
    const params = new URLSearchParams();
    if (defaultFlag) params.set("flag", defaultFlag);
    else if (parsed.flag) params.set("flag", parsed.flag);
    if (parsed.bikeModelId) params.set("bike_model_id", parsed.bikeModelId);
    router.push(params.toString() ? `/shop?${params.toString()}` : "/shop");
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="section-title">{title}</h1>
        {subtitle && <p className="section-subtitle">{subtitle}</p>}
        {meta?.total !== undefined && (
          <p className="text-sm text-muted-foreground mt-2">{meta.total} products found</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <aside className="lg:col-span-1 space-y-4">
          <div className="rounded-xl border border-border bg-card p-4 space-y-4 sticky top-24">
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              Filter & Search
            </div>
            <div>
              <label htmlFor="shop-search" className="text-xs font-medium text-muted-foreground mb-1 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input id="shop-search" value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === "Enter" && applyFilters()} placeholder="Search parts..." className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring" />
              </div>
            </div>
            <div>
              <label htmlFor="shop-category" className="text-xs font-medium text-muted-foreground mb-1 block">Category</label>
              <select id="shop-category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
                <option value="">All Categories</option>
                {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="shop-brand" className="text-xs font-medium text-muted-foreground mb-1 block">Brand</label>
              <select id="shop-brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
                <option value="">All Brands</option>
                {brands.map((b) => <option key={b.id} value={String(b.id)}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="shop-sort" className="text-xs font-medium text-muted-foreground mb-1 block">Sort by</label>
              <select id="shop-sort" value={sort} onChange={(e) => setSort(e.target.value)} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring">
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
                <option value="popular">Most Popular</option>
              </select>
            </div>
            <div className="flex gap-2 pt-2">
              <button type="button" onClick={applyFilters} className="btn-primary flex-1 text-sm py-2">Apply</button>
              <button type="button" onClick={clearFilters} className="btn-secondary px-3" title="Clear filters"><X className="h-4 w-4" /></button>
            </div>
          </div>
        </aside>

        <div className="lg:col-span-3">
          {loading ? <ProductSkeleton /> : products.length === 0 ? <EmptyState /> : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
              {meta?.last_page > 1 && (
                <div className="flex items-center justify-center gap-4 mt-10">
                  <button type="button" onClick={() => { const next = Math.max(1, page - 1); setPage(next); router.push(`/shop?${buildQuery({ page: next > 1 ? String(next) : undefined })}`); }} disabled={page <= 1} className="btn-secondary disabled:opacity-40">
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>
                  <span className="text-sm text-muted-foreground">Page {page} of {meta.last_page}</span>
                  <button type="button" onClick={() => { const next = Math.min(meta.last_page, page + 1); setPage(next); router.push(`/shop?${buildQuery({ page: String(next) })}`); }} disabled={page >= meta.last_page} className="btn-secondary disabled:opacity-40">
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
