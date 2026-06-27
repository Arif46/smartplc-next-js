"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, Package, Loader2 } from "lucide-react";
import { getCustomerOrders } from "@/lib/ordersApi";
import { formatPrice } from "@/lib/productUtils";
import {
  formatOrderStatus,
  orderStatusStyle,
  paymentStatusStyle,
} from "@/lib/customerConstants";

type ApiOrder = {
  id: number;
  order_number: string;
  created_at: string;
  status: string;
  total_amount: number | string;
  items: Array<{ product_name?: string; name?: string }>;
  payment?: { status?: string };
};

export type OrderRow = {
  id: number;
  orderNumber: string;
  date: string;
  status: string;
  paymentStatus: string;
  total_amount: number;
  itemCount: number;
};

type OrderHistoryProps = {
  onViewDetails: (orderId: number) => void;
};

const mapApiOrderToRow = (order: ApiOrder): OrderRow => ({
  id: order.id,
  orderNumber: order.order_number,
  date: order.created_at,
  status: order.status,
  paymentStatus: order.payment?.status || "pending",
  total_amount: Number(order.total_amount || 0),
  itemCount: order.items?.length || 0,
});

const OrderHistory: React.FC<OrderHistoryProps> = ({ onViewDetails }) => {
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getCustomerOrders()
      .then((apiData) => setOrders((apiData as ApiOrder[]).map(mapApiOrderToRow)))
      .catch((err: any) => setError(err?.message || "Failed to load orders."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Order History</h2>
            <p className="text-sm text-muted-foreground">Track and manage your purchases</p>
          </div>
        </div>
      </div>

      {error ? (
        <div className="p-8 text-center">
          <p className="text-danger text-sm mb-2">{error}</p>
          <p className="text-muted-foreground text-sm">Please refresh and try again.</p>
        </div>
      ) : !orders.length ? (
        <div className="p-10 text-center">
          <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">You have no orders yet.</p>
          <Link
            href="/shop"
            className="inline-flex px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                    {order.orderNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(order.date).toLocaleDateString("en-BD", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {order.itemCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${orderStatusStyle(order.status)}`}
                    >
                      {formatOrderStatus(order.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${paymentStatusStyle(order.paymentStatus)}`}
                    >
                      {formatOrderStatus(order.paymentStatus)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-foreground">
                    {formatPrice(order.total_amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button
                      type="button"
                      onClick={() => onViewDetails(order.id)}
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <Eye className="h-4 w-4" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
