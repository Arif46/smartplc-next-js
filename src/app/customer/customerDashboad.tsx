"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Package, Loader2 } from "lucide-react";
import CustomerPanelShell from "@/components/frontend/customer/CustomerPanelShell";
import CustomerDashboardOverview from "@/components/frontend/customer/CustomerDashboardOverview";
import CustomerProfileTab from "@/components/frontend/customer/CustomerProfileTab";
import CustomerPasswordTab from "@/components/frontend/customer/CustomerPasswordTab";
import CustomerAddressesTab from "@/components/frontend/customer/CustomerAddressesTab";
import CustomerWishlistTab from "@/components/frontend/customer/CustomerWishlistTab";
import OrderHistory from "@/components/frontend/customer/OrderHIstory";
import OrderDetails, { type Order } from "@/components/frontend/customer/OrderDetails";
import { useAuthStore } from "@/store/authStore";
import { getOrderDetails } from "@/lib/ordersApi";
import { parseCustomerTab, type CustomerTab } from "@/lib/customerConstants";
import toast from "react-hot-toast";

export default function CustomerDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuthStore();

  const tabFromUrl = parseCustomerTab(searchParams.get("tab"));
  const [activeTab, setActiveTab] = useState<CustomerTab>(tabFromUrl);
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(false);

  useEffect(() => {
    setActiveTab(tabFromUrl);
    if (tabFromUrl !== "orders") {
      setShowOrderDetails(false);
      setSelectedOrder(null);
    }
  }, [tabFromUrl]);

  const changeTab = useCallback(
    (tab: CustomerTab) => {
      setActiveTab(tab);
      setShowOrderDetails(false);
      setSelectedOrder(null);
      router.replace(tab === "dashboard" ? "/customer" : `/customer?tab=${tab}`, {
        scroll: false,
      });
    },
    [router]
  );

  const handleViewOrder = async (orderId: number) => {
    try {
      setLoadingOrder(true);
      changeTab("orders");
      const apiOrder = await getOrderDetails(orderId);
      setSelectedOrder(apiOrder as Order);
      setShowOrderDetails(true);
    } catch {
      toast.error("Failed to load order details");
    } finally {
      setLoadingOrder(false);
    }
  };

  const handleBackToOrders = () => {
    setShowOrderDetails(false);
    setSelectedOrder(null);
  };

  const handleOrderUpdated = (order: Order) => {
    setSelectedOrder(order);
  };

  const displayName =
    [user?.first_name, (user as any)?.last_name].filter(Boolean).join(" ") ||
    user?.name ||
    "Customer";

  const renderContent = () => {
    if (loadingOrder) {
      return (
        <div className="bg-card border border-border rounded-2xl p-12 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <CustomerDashboardOverview
            onTabChange={changeTab}
            onViewOrder={handleViewOrder}
          />
        );
      case "profile":
        return <CustomerProfileTab />;
      case "orders":
        if (showOrderDetails && selectedOrder) {
          return (
            <OrderDetails
              order={selectedOrder}
              onBack={handleBackToOrders}
              onOrderUpdated={handleOrderUpdated}
            />
          );
        }
        return <OrderHistory onViewDetails={handleViewOrder} />;
      case "addresses":
        return <CustomerAddressesTab />;
      case "wishlist":
        return <CustomerWishlistTab />;
      case "password":
        return <CustomerPasswordTab />;
      default:
        return null;
    }
  };

  return (
    <CustomerPanelShell
      activeTab={activeTab}
      onTabChange={changeTab}
      userName={displayName}
      userEmail={user?.email}
    >
      {renderContent()}
    </CustomerPanelShell>
  );
}
