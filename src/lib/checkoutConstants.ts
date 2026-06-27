export const CHECKOUT_FREE_SHIPPING_MIN = 2000;
export const CHECKOUT_SHIPPING_COST = 120;

export function calcCheckoutTotals(subtotal: number) {
  const shipping = subtotal >= CHECKOUT_FREE_SHIPPING_MIN ? 0 : CHECKOUT_SHIPPING_COST;
  const tax = 0;
  const total = subtotal + shipping + tax;
  return { subtotal, shipping, tax, total };
}

export const POST_LOGIN_REDIRECT_KEY = "postLoginRedirect";

export function setPostLoginRedirect(path: string) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, path);
  }
}

export function consumePostLoginRedirect(): string | null {
  if (typeof window === "undefined") return null;
  const path = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY);
  if (path) sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
  return path;
}

export const LAST_ORDER_KEY = "lastOrderConfirmation";

export interface OrderConfirmation {
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
}

export function saveOrderConfirmation(order: OrderConfirmation) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  }
}

export function loadOrderConfirmation(): OrderConfirmation | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(LAST_ORDER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OrderConfirmation;
  } catch {
    return null;
  }
}
