import api from "@/lib/api";

export interface DashboardStats {
  total_orders: number;
  pending_orders: number;
  processing_orders: number;
  completed_orders: number;
  total_spent: number;
  wishlist_count: number;
}

export interface CustomerDashboardData {
  stats: DashboardStats;
  recent_orders: Array<{
    id: number;
    order_number: string;
    status: string;
    total_amount: string | number;
    created_at: string;
    items?: Array<{ product_name?: string; name?: string }>;
  }>;
  member_since?: string;
}

export interface CustomerAddress {
  id: number;
  label: "home" | "work" | "other";
  name: string;
  phone?: string | null;
  address: string;
  city: string;
  state?: string | null;
  postal_code?: string | null;
  country?: string;
  is_default: boolean;
}

export interface WishlistProduct {
  id: number;
  slug: string;
  name: string;
  purchase_price: number;
  sale_price?: number | null;
  stock: number;
  image?: string | null;
  image_url?: string | null;
}

export const fetchCustomerDashboard = async (): Promise<CustomerDashboardData> => {
  const res = await api.get("/api/customer/dashboard");
  return res.data.data;
};

export const fetchCurrentUser = async () => {
  const res = await api.get("/api/user");
  return res.data;
};

export const fetchCustomerAddresses = async (): Promise<CustomerAddress[]> => {
  const res = await api.get("/api/customer/addresses");
  return res.data.data;
};

export const createCustomerAddress = async (
  payload: Omit<CustomerAddress, "id">
): Promise<CustomerAddress> => {
  const res = await api.post("/api/customer/addresses", payload);
  return res.data.data;
};

export const updateCustomerAddress = async (
  id: number,
  payload: Partial<Omit<CustomerAddress, "id">>
): Promise<CustomerAddress> => {
  const res = await api.put(`/api/customer/addresses/${id}`, payload);
  return res.data.data;
};

export const deleteCustomerAddress = async (id: number) => {
  const res = await api.delete(`/api/customer/addresses/${id}`);
  return res.data;
};

export const fetchServerWishlist = async (): Promise<WishlistProduct[]> => {
  const res = await api.get("/api/customer/wishlist");
  return res.data.data;
};

export const addToServerWishlist = async (productId: number) => {
  const res = await api.post("/api/customer/wishlist", { product_id: productId });
  return res.data;
};

export const removeFromServerWishlist = async (productId: number) => {
  const res = await api.delete(`/api/customer/wishlist/${productId}`);
  return res.data;
};

export const syncServerWishlist = async (productIds: number[]) => {
  const res = await api.post("/api/customer/wishlist/sync", { product_ids: productIds });
  return res.data;
};

export const cancelCustomerOrder = async (orderId: number) => {
  const res = await api.post(`/api/customer/orders/${orderId}/cancel`);
  return res.data;
};
