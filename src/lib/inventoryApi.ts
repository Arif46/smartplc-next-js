import api from "@/lib/api";

export interface StockSummary {
  totalProducts: number;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalUnits: number;
}

export interface Warehouse {
  id: number;
  name: string;
  code: string;
  address: string | null;
  is_default: boolean;
  status: number;
}

export interface StockMovement {
  id: number;
  product_id: number;
  warehouse_id: number | null;
  type: string;
  quantity: number;
  before_qty: number;
  after_qty: number;
  reference: string | null;
  notes: string | null;
  created_at: string;
  product?: { id: number; name: string; sku?: string };
  warehouse?: { id: number; name: string };
  user?: { id: number; name: string };
}

export const fetchStockSummary = async (): Promise<StockSummary> => {
  const res = await api.get("/api/admin/inventory/summary");
  return res.data.data;
};

export const fetchLowStock = async (threshold = 5) => {
  const res = await api.get("/api/admin/inventory/low-stock", { params: { threshold } });
  return res.data.data;
};

export const fetchStockMovements = async (params: Record<string, string | number> = {}) => {
  const res = await api.get("/api/admin/inventory/movements", { params });
  const payload = res.data.data;
  return {
    data: payload.data ?? [],
    meta: {
      current_page: payload.current_page,
      last_page: payload.last_page,
      total: payload.total,
    },
  };
};

export const stockIn = async (data: {
  product_id: number;
  quantity: number;
  warehouse_id?: number;
  notes?: string;
  reference?: string;
}) => {
  const res = await api.post("/api/admin/inventory/stock-in", data);
  return res.data;
};

export const stockOut = async (data: {
  product_id: number;
  quantity: number;
  warehouse_id?: number;
  notes?: string;
  reference?: string;
}) => {
  const res = await api.post("/api/admin/inventory/stock-out", data);
  return res.data;
};

export const adjustStock = async (data: {
  product_id: number;
  new_quantity: number;
  warehouse_id?: number;
  notes?: string;
}) => {
  const res = await api.post("/api/admin/inventory/adjust", data);
  return res.data;
};

export const fetchWarehouses = async (): Promise<Warehouse[]> => {
  const res = await api.get("/api/admin/warehouses");
  return res.data.data;
};

export const createWarehouse = async (data: Partial<Warehouse>) => {
  const res = await api.post("/api/admin/warehouses", data);
  return res.data.data;
};

export const updateWarehouse = async (id: number, data: Partial<Warehouse>) => {
  const res = await api.put(`/api/admin/warehouses/${id}`, data);
  return res.data.data;
};

export const deleteWarehouse = async (id: number) => {
  const res = await api.delete(`/api/admin/warehouses/${id}`);
  return res.data;
};
