
import api from "@/lib/api";

const getCache = new Map<string, { data: unknown; expires: number }>();
const CACHE_TTL_MS = 60_000;

async function cachedGet<T>(url: string): Promise<T> {
  const hit = getCache.get(url);
  if (hit && hit.expires > Date.now()) {
    return hit.data as T;
  }
  const res = await api.get(url);
  const data = res.data.data as T;
  getCache.set(url, { data, expires: Date.now() + CACHE_TTL_MS });
  return data;
}

/**
 * Laravel paginator meta shape (common fields).
 * Adjust if your backend uses different keys.
 */


export interface Product {
  id: number;
  name: string;
  slug: string;
  purchase_price: number;
  description: string;
  specification: string;
  originalPrice?: number;
  image: string;
  category: { id: number; name: string };
  brand?: { id: number; name: string };
  stock: number;
}

export interface Brand {
  id: number;
  name: string;
  slug?: string;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  products_count?: number;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from?: number | null;
  to?: number | null;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta?: PaginationMeta;    // if your Laravel returns `meta` (depends on config)
  links?: Record<string, any>;
  // older Laravel paginator returns `current_page`, `last_page` on top-level; adjust if needed
}

export const fetchAllActiveCategories = async () => {
    return cachedGet<Category[]>("/api/all-categories");
  };

export const fetchProductsByCategorySlug = async (slug: string) => {
    const res = await api.get(`/api/categories/${slug}/products`);
    return res.data.data;
};

export const fetchProductBySlug = async (slug: string) => {
    const res = await api.get(`/api/products/${slug}`);
    return res.data.data;
};

// export const fetchAvailableCategories = async () => {
//     const res = await api.get("/api/product-wise-categories");
//     return res.data.data;
// };
  
export const fetchAvailableCategories = async (): Promise<Category[]> => {
   return cachedGet<Category[]>("/api/product-wise-categories");
};

export const fetchFilterCategoryProducts = async (
  slug: string,
  params: Record<string, any> = {}
): Promise<PaginatedResponse<Product>> => {
  const res = await api.get(`/api/categories/${slug}/products-filter`, { params });
  return res.data.data;
};

export const fetchCategoryBrands = async (slug: string): Promise<Brand[]> => {
  const res = await api.get(`/api/categories/${slug}/brands`);
  return res.data.data;
};
