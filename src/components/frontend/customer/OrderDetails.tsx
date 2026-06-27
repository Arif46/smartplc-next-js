"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Download,
  MapPin,
  CreditCard,
  Loader2,
  RotateCcw,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";
import { downloadInvoice, cancelCustomerOrder } from "@/lib/ordersApi";
import { formatPrice } from "@/lib/productUtils";
import { useCartStore } from "@/store/useCartStore";
import {
  formatOrderStatus,
  orderStatusStyle,
  paymentStatusStyle,
} from "@/lib/customerConstants";

type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  price: string;
  quantity: number;
  subtotal: string;
};

type Payment = {
  id: number;
  order_id: number;
  method: string;
  transaction_id: string | null;
  status: string;
  amount?: string | number;
};

export type Order = {
  id: number;
  user_id?: number;
  order_number: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  status: string;
  subtotal?: string | number;
  shipping_cost?: string | number;
  tax_amount?: string | number;
  discount_amount?: string | number;
  total_amount: string;
  tracking_number?: string | null;
  created_at: string;
  items: OrderItem[];
  payment: Payment;
};

type OrderDetailsProps = {
  order: Order;
  onBack: () => void;
  onOrderUpdated?: (order: Order) => void;
};

const OrderDetails: React.FC<OrderDetailsProps> = ({ order, onBack, onOrderUpdated }) => {
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addToCart);
  const [cancelling, setCancelling] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const subtotal =
    order.subtotal != null
      ? Number(order.subtotal)
      : order.items.reduce(
          (acc, it) =>
            acc + (parseFloat(it.subtotal) || parseFloat(it.price) * it.quantity),
          0
        );

  const shipping = Number(order.shipping_cost || 0);
  const tax = Number(order.tax_amount || 0);
  const discount = Number(order.discount_amount || 0);
  const total = parseFloat(order.total_amount || "0");
  const payment = order.payment;
  const canCancel = ["pending", "processing"].includes(order.status);

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadInvoice(order.id, order.order_number);
      toast.success("Invoice downloaded");
    } catch {
      toast.error("Failed to download invoice");
    } finally {
      setDownloading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      setCancelling(true);
      const res = await cancelCustomerOrder(order.id);
      onOrderUpdated?.(res.data);
      toast.success("Order cancelled");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Could not cancel order");
    } finally {
      setCancelling(false);
    }
  };

  const handleReorder = () => {
    order.items.forEach((item) => {
      addToCart({
        id: item.product_id,
        name: item.product_name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        image: "",
        stock: 999,
      });
    });
    toast.success("Items added to cart");
    router.push("/cart");
  };

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </button>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Order Details</h2>
            <p className="text-sm text-muted-foreground">#{order.order_number}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          Placed on{" "}
          {new Date(order.created_at).toLocaleDateString("en-BD", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="p-6 space-y-6">
        <div className="rounded-xl border border-border bg-muted/20 p-4 flex flex-wrap items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium border ${orderStatusStyle(order.status)}`}
          >
            {formatOrderStatus(order.status)}
          </span>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium border ${paymentStatusStyle(payment?.status)}`}
          >
            Payment: {formatOrderStatus(payment?.status || "pending")}
          </span>
          {order.tracking_number && (
            <span className="text-sm text-muted-foreground">
              Tracking: <strong>{order.tracking_number}</strong>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-foreground mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 p-4 rounded-xl border border-border"
                >
                  <div>
                    <p className="font-medium text-foreground">{item.product_name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-foreground">
                    {formatPrice(
                      parseFloat(item.subtotal) || parseFloat(item.price) * item.quantity
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>
              <div className="rounded-xl border border-border p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
                </div>
                {tax > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Tax</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="border-t border-border pt-3 flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payment
              </h3>
              <div className="rounded-xl border border-border p-4 text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Method</span>
                  <span className="font-medium uppercase">{payment?.method}</span>
                </div>
                {payment?.transaction_id && (
                  <div>
                    <span className="text-muted-foreground">Transaction ID</span>
                    <p className="font-mono text-xs mt-1">{payment.transaction_id}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Shipping Address
          </h3>
          <div className="rounded-xl border border-border p-4 text-sm">
            <p className="font-medium text-foreground">{order.name}</p>
            <p className="text-muted-foreground mt-1">{order.address}</p>
            <p className="text-muted-foreground">
              {[order.city, order.state, order.postal_code, order.country]
                .filter(Boolean)
                .join(", ")}
            </p>
            <p className="text-muted-foreground mt-2">Phone: {order.phone}</p>
            <p className="text-muted-foreground">Email: {order.email}</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm hover:bg-muted/50 disabled:opacity-60"
          >
            {downloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            Download Invoice
          </button>

          {order.status !== "cancelled" && (
            <button
              type="button"
              onClick={handleReorder}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary text-primary text-sm hover:bg-primary/5"
            >
              <RotateCcw className="h-4 w-4" />
              Reorder
            </button>
          )}

          {canCancel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={cancelling}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-danger text-white text-sm hover:brightness-110 disabled:opacity-60"
            >
              {cancelling ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
