import api from "@/lib/api";
import type { Product, Brand, Category } from "@/lib/homeApi";

export interface HomepageData {
  featured: Product[];
  new_arrivals: Product[];
  best_sellers: Product[];
  flash_sale: Product[];
  trending: Product[];
  on_sale: Product[];
  recent: Product[];
  top_rated: Product[];
  sliders?: Slider[];
  blogs?: BlogPost[];
  categories?: Category[];
  footer_categories?: Category[];
  featured_brands?: Brand[];
  bike_companies?: BikeCompany[];
}

export interface Slider {
  id: number;
  title: string | null;
  subtitle: string | null;
  desktop_image: string;
  mobile_image: string | null;
  desktop_image_url: string;
  mobile_image_url: string | null;
  button_text: string | null;
  button_url: string | null;
}

export interface BikeCompany {
  id: number;
  name: string;
  slug: string;
  bike_models: BikeModel[];
}

export interface BikeModel {
  id: number;
  name: string;
  slug: string;
  engine_cc: number | null;
  year_from: number | null;
  year_to: number | null;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string | null;
  featured_image_url: string | null;
  author: string;
  published_at: string;
}

const getCache = new Map<string, { data: unknown; expires: number }>();
const CACHE_TTL_MS = 60_000;

async function cachedGet<T>(url: string, params?: Record<string, unknown>): Promise<T> {
  const key = `${url}?${JSON.stringify(params ?? {})}`;
  const hit = getCache.get(key);
  if (hit && hit.expires > Date.now()) {
    return hit.data as T;
  }

  const res = await api.get(url, { params });
  const data = res.data.data as T;
  getCache.set(key, { data, expires: Date.now() + CACHE_TTL_MS });
  return data;
}

export const fetchHomepageData = async (): Promise<HomepageData> => {
  return cachedGet<HomepageData>("/api/homepage");
};

export const fetchSliders = async (): Promise<Slider[]> => {
  return cachedGet<Slider[]>("/api/sliders");
};

export const searchProducts = async (params: Record<string, string | number | undefined>) => {
  const res = await api.get("/api/shop/search", { params });
  return res.data.data;
};

export const liveSearch = async (q: string) => {
  if (q.length < 2) return [];
  return cachedGet<Product[]>("/api/shop/live-search", { q });
};

export const fetchFeaturedBrands = async (): Promise<Brand[]> => {
  return cachedGet<Brand[]>("/api/featured-brands");
};

export const fetchAllBrands = async (): Promise<Brand[]> => {
  return cachedGet<Brand[]>("/api/all-brands");
};

export const fetchBrandProducts = async (slug: string, params: Record<string, string | number | undefined> = {}) => {
  const res = await api.get(`/api/brands/${slug}/products`, { params });
  return res.data.data;
};

export const fetchBikeCompanies = async (): Promise<BikeCompany[]> => {
  return cachedGet<BikeCompany[]>("/api/bike-companies");
};

export const fetchBikeModelsByCompany = async (companyId: number) => {
  const res = await api.get(`/api/bike-companies/${companyId}/models`);
  return res.data.data ?? [];
};

export const fetchBlogs = async (): Promise<BlogPost[]> => {
  return cachedGet<BlogPost[]>("/api/blogs");
};

export const fetchBlogBySlug = async (slug: string): Promise<BlogPost> => {
  const res = await api.get(`/api/blogs/${slug}`);
  return res.data.data;
};

export const validateCoupon = async (code: string, orderTotal: number) => {
  const res = await api.post("/api/coupons/validate", { code, order_total: orderTotal });
  return res.data.data;
};

export type { Product, Brand, Category };
