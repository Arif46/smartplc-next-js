'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AdminShell from './components/shared/AdminShell';
import AdminAuthGuard from './components/shared/AdminAuthGuard';
import DashboardPage from './components/Dashboard/DashboardPage';
import CategoryPage from './components/Category/CategoryListPage';
import BrandPage from './components/Brand/BrandListPage';
import CustomerPage from './components/CustomerPage';
import UserPage from './components/User/AllUserPage';
import OrderDetailsPage from './components/OrderInformation/OrderList';
import OrderProcessingPage from './components/OrderInformation/ProcessingList';
import OrderDeliveredPage from './components/OrderInformation/DeliveredList';
import OrderCompletedPage from './components/OrderInformation/CompletedList';
import OrderCancelledPage from './components/OrderInformation/CancelledList';
import SliderListPage from './components/Slider/SliderListPage';
import InventoryPage from './components/Inventory/InventoryPage';

const TAB_COMPONENTS: Record<string, React.ComponentType> = {
  dashboard: DashboardPage,
  'category-table': CategoryPage,
  'brand-table': BrandPage,
  'customer-table': CustomerPage,
  'user-table': UserPage,
  'order-details-table': OrderDetailsPage,
  'order-processing': OrderProcessingPage,
  'order-delivered': OrderDeliveredPage,
  'order-completed': OrderCompletedPage,
  'order-cancelled': OrderCancelledPage,
  'slider-table': SliderListPage,
  'inventory-table': InventoryPage,
};

const TAB_LABELS: Record<string, string> = {
  dashboard: 'Dashboard',
  'category-table': 'Categories',
  'brand-table': 'Brands',
  'customer-table': 'Customers',
  'user-table': 'Admin Users',
  'order-details-table': 'All Orders',
  'order-processing': 'Processing Orders',
  'order-delivered': 'Delivered Orders',
  'order-completed': 'Completed Orders',
  'order-cancelled': 'Cancelled Orders',
  'slider-table': 'Sliders',
  'inventory-table': 'Stock Management',
};

function resolveTab(tab: string | null): string {
  if (tab && TAB_COMPONENTS[tab]) return tab;
  return 'dashboard';
}

export default function AdminDashboard() {
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(() => resolveTab(tabParam));

  useEffect(() => {
    setActiveTab(resolveTab(tabParam));
  }, [tabParam]);

  const ActiveComponent = TAB_COMPONENTS[activeTab] ?? DashboardPage;

  return (
    <AdminAuthGuard>
      <AdminShell
        pageTitle={TAB_LABELS[activeTab] ?? 'Dashboard'}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      >
        <ActiveComponent />
      </AdminShell>
    </AdminAuthGuard>
  );
}
