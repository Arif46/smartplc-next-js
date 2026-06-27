"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  fetchFilterCategoryProducts,
  fetchCategoryBrands,
  Product,
  Brand,
} from "@/lib/homeApi";
import ProductCard from "@/components/frontend/ProductCard";

interface Props {
  slug: string;
}

export default function CategoryShopPage({ slug }: Props) {
  const router = useRouter();

  const [products, setProducts] = useState<Product[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageMeta, setPageMeta] = useState<any>(null);

  const [selectedBrands, setSelectedBrands] = useState<number[]>([]);
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [rating, setRating] = useState<number | "">("");
  const [sort, setSort] = useState<string>("popularity");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const perPage = 12;

  const categoryTitle = slug.replace(/-/g, " ");

  // load brands
  useEffect(() => {
    (async () => {
      try {
        const b = await fetchCategoryBrands(slug);
        setBrands(b);
      } catch (err) {
        console.error("brands fetch failed", err);
      }
    })();
  }, [slug]);

  // build params
  const params = useMemo(() => {
    const p: Record<string, any> = { per_page: perPage, page, sort };
    if (selectedBrands.length) p.brand = selectedBrands.join(",");
    if (minPrice !== "") p.min_price = minPrice;
    if (maxPrice !== "") p.max_price = maxPrice;
    if (rating !== "") p.rating = rating;
    if (search) p.q = search;
    return p;
  }, [selectedBrands, minPrice, maxPrice, rating, sort, search, page]);

  // load products
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const res = await fetchFilterCategoryProducts(slug, params);
        if (!mounted) return;
        setProducts(res.data || []);
        // future pagination if meta  handle 
        // setPageMeta({
        //   current_page: res.current_page ?? res.meta?.current_page ?? 1,
        //   last_page: res.last_page ?? res.meta?.last_page ?? 1,
        //   total: res.total ?? res.meta?.total ?? 0,
        //   links: res.links ?? res.meta?.links ?? [],
        // });
      } catch (err) {
        console.error("products fetch failed", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [slug, params]);

  // handlers
  const toggleBrand = (id: number) => {
    setPage(1);
    setSelectedBrands((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };
  const applyPrice = () => setPage(1);
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 🔹 Breadcrumbs */}
      <nav className="text-sm mb-4 text-gray-600" aria-label="Breadcrumb">
        <ol className="flex items-center gap-1">
          <li>
            <Link
              href="/"
              className="hover:text-green-600 transition-colors font-medium"
            >
              Home
            </Link>
          </li>
          <li className="mx-1 text-gray-400">/</li>
          <li>
            <Link
              href="/shop"
              className="hover:text-green-600 transition-colors font-medium"
            >
              Shop
            </Link>
          </li>
          <li className="mx-1 text-gray-400">/</li>
          <li className="text-gray-800 capitalize font-semibold">
            {categoryTitle}
          </li>
        </ol>
      </nav>

      {/* 🔹 Filters + Products layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <aside className="col-span-1 space-y-6">
          {/* Search */}
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold mb-2">Search</h4>
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1 border p-2 rounded text-sm"
                placeholder="Search products..."
              />
              <button className="bg-blue-600 text-white px-3 rounded text-sm">
                Go
              </button>
            </form>
          </div>

          {/* Price */}
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold mb-3">Price Range</h4>
            <div className="flex gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(e.target.value ? Number(e.target.value) : "")
                }
                placeholder="Min"
                className="w-1/2 border p-2 rounded text-sm"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(e.target.value ? Number(e.target.value) : "")
                }
                placeholder="Max"
                className="w-1/2 border p-2 rounded text-sm"
              />
            </div>
            <button
              onClick={applyPrice}
              className="mt-3 bg-gray-800 text-white px-3 py-1 rounded text-sm"
            >
              Apply
            </button>
          </div>

          {/* Brands */}
          <div className="bg-white p-4 rounded shadow">
            <h4 className="font-semibold mb-3">Brands</h4>
            <div className="space-y-2 max-h-48 overflow-auto pr-1">
              {brands.length === 0 ? (
                <div className="text-sm text-gray-500">No brands</div>
              ) : (
                brands.map((b) => (
                  <div key={b.id} className="flex items-center gap-2">
                    <input
                      id={`brand_${b.id}`}
                      type="checkbox"
                      checked={selectedBrands.includes(b.id)}
                      onChange={() => toggleBrand(b.id)}
                    />
                    <label
                      htmlFor={`brand_${b.id}`}
                      className="text-sm text-gray-700"
                    >
                      {b.name}
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
        </aside>

        {/* Products */}
        <main className="col-span-3 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-semibold capitalize">
                {categoryTitle}
              </h2>
              <p className="text-sm text-gray-500">
                {pageMeta?.total ?? products.length} products
              </p>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setPage(1);
                }}
                className="border p-2 rounded text-sm"
              >
                <option value="popularity">Popularity</option>
                <option value="newest">Newest</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div>Loading...</div>
          ) : products.length === 0 ? (
            <div>No products found</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                />
              ))}
            </div>
          )}

          {/* Pagination future use */}
          {/* {pageMeta && (
            <div className="mt-6 flex items-center justify-center gap-3">
              <button
                onClick={() => goPage(pageMeta.current_page - 1)}
                disabled={pageMeta.current_page <= 1}
                className="px-3 py-1 border rounded"
              >
                Prev
              </button>
              <span>
                Page {pageMeta.current_page} of {pageMeta.last_page}
              </span>
              <button
                onClick={() => goPage(pageMeta.current_page + 1)}
                disabled={pageMeta.current_page >= pageMeta.last_page}
                className="px-3 py-1 border rounded"
              >
                Next
              </button>
            </div>
          )} */}
        </main>
      </div>
    </div>
  );
}
