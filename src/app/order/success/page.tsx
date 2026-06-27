"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  Package,
  ArrowRight,
  FileText,
  Home,
  Truck,
} from "lucide-react";
import { formatPrice } from "@/lib/productUtils";
import { loadOrderConfirmation, type OrderConfirmation } from "@/lib/checkoutConstants";

const paymentLabels: Record<string, string> = {
  cod: "Cash on Delivery",
  bkash: "bKash",
  nagad: "Nagad",
  card: "Card",
};

export default function OrderSuccessPage() {
  const router = useRouter();
  const [order, setOrder] = useState<OrderConfirmation | null>(null);

  useEffect(() => {
    const data = loadOrderConfirmation();
    if (!data) {
      router.replace("/shop");
      return;
    }
    setOrder(data);
  }, [router]);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center text-muted-foreground">
        Loading confirmation...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 md:py-12">
      <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xl">
        <div className="bg-success/10 border-b border-success/20 px-6 py-8 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-success/20 flex items-center justify-center mb-4">
            <CheckCircle2 className="h-9 w-9 text-success" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Order Confirmed!
          </h1>
          <p className="text-muted-foreground">
            Thank you for your order. We&apos;ve received it and will process it shortly.
          </p>
        </div>

        <div className="p-6 md:p-8 space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Order Number</p>
              <p className="text-lg font-bold text-primary">{order.order_number}</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Status</p>
              <p className="text-lg font-semibold capitalize">{order.status}</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Payment</p>
              <p className="font-semibold">{paymentLabels[order.payment_method] || order.payment_method}</p>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">{order.payment_status}</p>
            </div>
            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-1">Total Paid</p>
              <p className="text-lg font-bold">{formatPrice(order.total_amount)}</p>
            </div>
          </div>

          <div>
            <h2 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" /> Order Items
            </h2>
            <div className="rounded-xl border border-border divide-y divide-border">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between gap-4 p-4 text-sm">
                  <div>
                    <p className="font-medium">{item.product_name}</p>
                    <p className="text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold shrink-0">{formatPrice(item.subtotal)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-border p-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{order.shipping_cost === 0 ? "Free" : formatPrice(order.shipping_cost)}</span>
            </div>
            <div className="flex justify-between font-bold pt-2 border-t border-border">
              <span>Total</span>
              <span className="text-primary">{formatPrice(order.total_amount)}</span>
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4 flex items-start gap-3 text-sm text-muted-foreground">
            <Truck className="h-5 w-5 shrink-0 text-primary mt-0.5" />
            <p>
              You will receive updates when your order is packed and shipped.
              Track your order anytime from your customer dashboard.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/customer?tab=orders" className="btn-primary">
              <FileText className="h-4 w-4" /> View My Orders
            </Link>
            <Link href="/shop" className="btn-secondary">
              Continue Shopping <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/" className="btn-secondary">
              <Home className="h-4 w-4" /> Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
