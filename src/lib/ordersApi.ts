import api from "@/lib/api";

export const getCustomerOrders = async () => {
  const res = await api.get("/api/customer/orders");
  return res.data.data;
};

export const getAdminOrders = async () => {
  const res = await api.get("/api/admin/orders");
  return res.data.data;
};

export const getOrdersProcessing = async () => {
  const res = await api.get("/api/admin/orders-processing");
  return res.data.data;
};

export const getOrdersDelivered = async () => {
  const res = await api.get("/api/admin/orders-deliverd");
  return res.data.data;
};

export const getOrdersCompleted = async () => {
  const res = await api.get("/api/admin/orders-completed");
  return res.data.data;
};

export const getOrdersCancelled = async () => {
  const res = await api.get("/api/admin/orders-cancelled");
  return res.data.data;
};

export const getOrderDetails = async (id: number) => {
  const res = await api.get(`/api/customer/orders/${id}`);
  return res.data.data;
};

export const getAdminOrderById = async (id: number) => {
  const res = await api.get(`/api/admin/orders/${id}`);
  return res.data.data;
};

export const downloadInvoice = async (orderId: number, orderNumber: string) => {
  try {
    const response = await api.get(`/api/orders/${orderId}/invoice`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${orderNumber}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Invoice download error:", error);
    throw error;
  }
};

export const AdminDownloadInvoice = async (orderId: number, orderNumber: string) => {
  try {
    const response = await api.get(`/api/orders/${orderId}/invoice`, {
      responseType: "blob", // important
    });

    // create URL
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${orderNumber}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Invoice download error:", error);
  }
};


export const updateOrderStatus = async (orderId: number, status: string) => {
  const res = await api.put(`/api/admin/orders/${orderId}/status`, {
    status: status,
  });

  return res.data;
};

export { cancelCustomerOrder } from "@/lib/customerPanelApi";