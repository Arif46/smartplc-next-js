// src/lib/categoriesApi.ts
import api from "@/lib/api";

export type CategoryStatus = 1 | 2; // 1 = active, 2 = inactive

export interface Category {
  id: number;
  name: string;
  slug: string;
  status: CategoryStatus;
  parent_id?: number | null;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
  products_count?: number;
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

export const fetchCategories = async (
  q = "",
  page = 1,
  itemsPerPage = 10
): Promise<PaginatedResponse<Category>> => {
  const res = await api.get("/api/categories", {
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
  status?: CategoryStatus;
}

export const createCategory = async (payload: FormData | CreatePayload): Promise<Category> => {
  const config = payload instanceof FormData ? { headers: { "Content-Type": "multipart/form-data" } } : {};
  const res = await api.post("/api/categories", payload, config);
  return res.data.data;
};

export const updateCategory = async (id: number, payload: FormData | CreatePayload): Promise<Category> => {
  if (payload instanceof FormData) {
    payload.append("_method", "PUT");
    const res = await api.post(`/api/categories/${id}`, payload, { headers: { "Content-Type": "multipart/form-data" } });
    return res.data.data;
  }
  const res = await api.put(`/api/categories/${id}`, payload);
  return res.data.data;
};

export const deleteCategory = async (id: number): Promise<{ message?: string }> => {
  const res = await api.delete(`/api/categories/${id}`);
  return res.data;
};

export const toggleCategoryStatus = async (id: number): Promise<Category> => {
  const res = await api.delete(`/api/categories/${id}/toggle-status`);
  return res.data.data; 
};

export const getAllCategory = async (): Promise<Category[]> => {
  const res = await api.get("/api/all-category");
  const data = res.data.data;
  return Array.isArray(data) ? data : [];
};
