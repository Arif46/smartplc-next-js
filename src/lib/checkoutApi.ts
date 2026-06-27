import api from "@/lib/api";

export interface CheckoutPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  postal_code: string;
  country: string;
  notes?: string;
  payment_method: "cod" | "bkash" | "nagad" | "card";
  transaction_id?: string;
  shipping_cost: number;
  tax_amount?: number;
  discount_amount?: number;
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
}

export interface CheckoutOrderResponse {
  message: string;
  order: {
    id: number;
    order_number: string;
    status: string;
    subtotal: number;
    shipping_cost: number;
    tax_amount: number;
    discount_amount: number;
    total_amount: number;
    payment_method: string;
    payment_status: string;
    created_at?: string;
    items: {
      product_name: string;
      quantity: number;
      price: number;
      subtotal: number;
    }[];
  };
}

export const createOrder = async (payload: CheckoutPayload): Promise<CheckoutOrderResponse> => {
  try {
    const res = await api.post<CheckoutOrderResponse>("/api/checkout", payload);
    return res.data;
  } catch (err: unknown) {
    const axiosErr = err as {
      response?: { status?: number; data?: { error?: string; message?: string } };
      message?: string;
    };

    if (axiosErr.response?.status === 401) {
      throw new Error("Please login to complete your order.");
    }

    const message =
      axiosErr.response?.data?.message ||
      axiosErr.response?.data?.error ||
      axiosErr.message ||
      "Order failed. Please try again.";

    throw new Error(message);
  }
};
