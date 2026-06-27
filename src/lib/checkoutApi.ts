import api from "@/lib/api";

export interface CheckoutPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal_code: string;
  country: string;
  payment_method: "cod" | "bkash" | "nagad" | "card";
  items: {
    id: number;
    name: string;
    price: number;
    quantity: number;
  }[];
}

export const createOrder = async (payload: CheckoutPayload) => {
  try {
    const res = await api.post("/api/checkout", payload);
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
      axiosErr.response?.data?.error ||
      axiosErr.response?.data?.message ||
      axiosErr.message ||
      "Order failed. Please try again.";

    throw new Error(message);
  }
};
