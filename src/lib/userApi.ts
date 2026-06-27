// src/lib/categoriesApi.ts
import api from "@/lib/api";

//export type BrandStatus = 1 | 2; // 1 = active, 2 = inactive

export interface User {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  phone: number;
  email: number;
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

export const fetchusers = async (
  q = "",
  page = 1,
  itemsPerPage = 10,
  role = ""
): Promise<PaginatedResponse<User>> => {
  const res = await api.get("/api/users", {
    params: { q, page, paginate: true, itemsPerPage, role: role || undefined },
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
  first_name: string;
  last_name: string;
  phone: number;
  email: string;
  role?: string;
  password?: string;
  password_confirmation?: string;
}

export const createUser = async (payload: CreatePayload): Promise<User> => {
  const res = await api.post("/api/users-create", payload);
  return res.data.data;
};

export const getUsers = async (id: number): Promise<User> => {
  const res = await api.get(`/api/users/${id}`);
  return res.data.data;
};

export const updateUser = async (
  id: number,
  payload: CreatePayload
): Promise<User> => {
  const res = await api.put(`/api/users-update/${id}`, payload);
  return res.data.data;
};

export const updateCustomerProfile = async (
  id: number,
  payload: CreatePayload
): Promise<User> => {
  const res = await api.put(`/api/users-profile-update/${id}`, payload);
  return res.data.data;
};

export const deleteUser = async (id: number): Promise<{ message?: string }> => {
  const res = await api.delete(`/api/users/${id}`);
  return res.data;
};

// export const toggleBrandStatus = async (id: number): Promise<Brand> => {
//   const res = await api.delete(`/api/brands/${id}/toggle-status`);
//   return res.data.data;
// };

// export const getAllBrand = async (): Promise<Brand> => {
//   const res = await api.get(`/api/all-brand`);
//   return res.data.data;
// };

export const changePassword = async (oldPassword: string, newPassword: string, confirmPassword: string) => {
  const response = await api.post("/api/customer/change-password", {
    old_password: oldPassword,
    new_password: newPassword,
    new_password_confirmation: confirmPassword,
  });
  return response.data;
};
