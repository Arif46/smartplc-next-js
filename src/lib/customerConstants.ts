export type CustomerTab =
  | "dashboard"
  | "profile"
  | "orders"
  | "addresses"
  | "wishlist"
  | "password";

export const CUSTOMER_TABS: { id: CustomerTab; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "profile", label: "Profile" },
  { id: "orders", label: "Orders" },
  { id: "addresses", label: "Addresses" },
  { id: "wishlist", label: "Wishlist" },
  { id: "password", label: "Security" },
];

export function parseCustomerTab(value?: string | null): CustomerTab {
  const valid = CUSTOMER_TABS.map((t) => t.id);
  if (value && valid.includes(value as CustomerTab)) {
    return value as CustomerTab;
  }
  return "dashboard";
}

export function orderStatusStyle(status: string): string {
  switch (status) {
    case "pending":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "processing":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "completed":
    case "delivered":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function paymentStatusStyle(status?: string): string {
  switch (status) {
    case "paid":
      return "bg-emerald-100 text-emerald-800 border-emerald-200";
    case "pending":
      return "bg-amber-100 text-amber-800 border-amber-200";
    case "failed":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

export function formatOrderStatus(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
