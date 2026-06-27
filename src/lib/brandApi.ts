// src/lib/categoriesApi.ts
import api from "@/lib/api";

export type BrandStatus = 1 | 2; // 1 = active, 2 = inactive

export interface Brand {
  id: number;
  name: string;
  slug: string;
  status: BrandStatus;
  description?: string | null;
  is_featured?: boolean;
  logo?: string | null;
  logo_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

/**
 * Laravel paginator meta shape (common fields).
 * Adjust if your backend uses different keys.
 */
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

/**
 * Fetch categories (supports search q and page).
 * Returns the full axios data (paginated). Caller may read res.data or res.data.data
 */

export const fetchBrands = async (
  q = "",
  page = 1,
  itemsPerPage = 10
): Promise<PaginatedResponse<Brand>> => {
  const res = await api.get("/api/brands", {
    params: { q, page, paginate: true, itemsPerPage },
  });

  const payload = res.data.data; // <-- this is the Laravel paginator result

  if (Array.isArray(payload.data)) {
    // If paginated
    return {
      data: payload.data,
      meta: {
        current_page: payload.current_page,
        last_page: payload.last_page,
        per_page: payload.per_page,
        total: payload.total,
        from: payload.from,
        to: payload.to,
      },
    };
  }

  // fallback for array (non-paginated)
  return { data: Array.isArray(payload) ? payload : [] };
};


export interface CreatePayload {
  name: string;
  slug?: string;
  status?: BrandStatus;
}

export const createBrand = async (payload: FormData | CreatePayload): Promise<Brand> => {
  const config = payload instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
  const res = await api.post("/api/brands-create", payload, config);
  return res.data.data;
};

export const getBrand = async (id: number): Promise<Brand> => {
  const res = await api.get(`/api/brands/${id}`);
  return res.data.data;
};

export const updateBrand = async (id: number, payload: FormData | CreatePayload): Promise<Brand> => {
  if (payload instanceof FormData) {
    payload.append("_method", "PUT");
    const res = await api.post(`/api/brands-update/${id}`, payload, { headers: { "Content-Type": "multipart/form-data" } });
    return res.data.data;
  }
  const res = await api.put(`/api/brands-update/${id}`, payload);
  return res.data.data;
};

export const deleteBrand = async (id: number): Promise<{ message?: string }> => {
  const res = await api.delete(`/api/brands/${id}`);
  return res.data;
};

export const toggleBrandStatus = async (id: number): Promise<Brand> => {
  const res = await api.delete(`/api/brands/${id}/toggle-status`);
  return res.data.data; 
};

export const getAllBrand = async (): Promise<Brand[]> => {
  const res = await api.get(`/api/all-brand`);
  const data = res.data.data;
  return Array.isArray(data) ? data : [];
};
