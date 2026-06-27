"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Clock,
  CheckCircle2,
  Wallet,
  Heart,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { fetchCustomerDashboard, type CustomerDashboardData } from "@/lib/customerPanelApi";
import { formatPrice } from "@/lib/productUtils";
import {
  formatOrderStatus,
  orderStatusStyle,
  type CustomerTab,
} from "@/lib/customerConstants";

interface Props {
  onTabChange: (tab: CustomerTab) => void;
  onViewOrder: (orderId: number) => void;
}

export default function CustomerDashboardOverview({ onTabChange, onViewOrder }: Props) {
  const [data, setData] = useState<CustomerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomerDashboard()
      .then(setData)
      .catch(() => setError("Could not load dashboard."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-12 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        <p className="text-danger">{error}</p>
      </div>
    );
  }

  const { stats, recent_orders: recentOrders } = data;

  const statCards = [
    {
      label: "Total Orders",
      value: stats.total_orders,
      icon: Package,
      color: "text-primary bg-primary/10",
    },
    {
      label: "In Progress",
      value: stats.pending_orders + stats.processing_orders,
      icon: Clock,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Completed",
      value: stats.completed_orders,
      icon: CheckCircle2,
      color: "text-emerald-600 bg-emerald-100",
    },
    {
      label: "Total Spent",
      value: formatPrice(stats.total_spent),
      icon: Wallet,
      color: "text-amber-600 bg-amber-100",
      isText: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <div
            key={card.label}
            className="bg-card border border-border rounded-2xl p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  {card.label}
                </p>
                <p className="text-2xl font-bold text-foreground mt-2">
                  {card.isText ? card.value : card.value}
                </p>
              </div>
              <div className={`p-2.5 rounded-xl ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
              <p className="text-sm text-muted-foreground">Your latest purchases</p>
            </div>
            <button
              type="button"
              onClick={() => onTabChange("orders")}
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              View all <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-10 text-center">
              <Package className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">No orders yet.</p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
              >
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div>
                    <p className="font-medium text-foreground">{order.order_number}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleDateString("en-BD", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${orderStatusStyle(order.status)}`}
                    >
                      {formatOrderStatus(order.status)}
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatPrice(Number(order.total_amount))}
                    </span>
                    <button
                      type="button"
                      onClick={() => onViewOrder(order.id)}
                      className="text-sm text-primary hover:underline"
                    >
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => onTabChange("orders")}
                className="w-full text-left px-4 py-3 rounded-xl border border-border hover:bg-muted/50 transition-colors text-sm"
              >
                Track Orders
              </button>
              <button
                type="button"
                onClick={() => onTabChange("addresses")}
                className="w-full text-left px-4 py-3 rounded-xl border border-border hover:bg-muted/50 transition-colors text-sm"
              >
                Manage Addresses
              </button>
              <button
                type="button"
                onClick={() => onTabChange("wishlist")}
                className="w-full text-left px-4 py-3 rounded-xl border border-border hover:bg-muted/50 transition-colors text-sm flex items-center justify-between"
              >
                <span>My Wishlist</span>
                <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {stats.wishlist_count}
                </span>
              </button>
              <Link
                href="/shop"
                className="block w-full text-center px-4 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:brightness-105"
              >
                Continue Shopping
              </Link>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-6">
            <Heart className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-semibold text-foreground">Shop Your Ride</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Genuine parts, fast delivery, and secure checkout every time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
