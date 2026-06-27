"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import {
  LayoutDashboard, Tags, Award, Package, Users, UserCog,
  ShoppingCart, Image, Warehouse, LogOut, Menu, X, ChevronRight,
  Clock, Truck, CheckCircle, XCircle,
} from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  href?: string;
  tab?: string;
  action?: () => void;
  section?: string;
}

interface AdminShellProps {
  pageTitle: string;
  pageSubtitle?: string;
  activeTab?: string;
  onTabChange?: (tab: string) => void;
  children: React.ReactNode;
}

export default function AdminShell({ pageTitle, pageSubtitle, activeTab, onTabChange, children }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { logout } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, tab: "dashboard", section: "Main" },
    { id: "category-table", label: "Categories", icon: Tags, tab: "category-table", section: "Catalog" },
    { id: "brand-table", label: "Brands", icon: Award, tab: "brand-table", section: "Catalog" },
    { id: "product-table", label: "Products", icon: Package, href: "/admin/products", section: "Catalog" },
    { id: "slider-table", label: "Sliders", icon: Image, tab: "slider-table", section: "Marketing" },
    { id: "inventory-table", label: "Stock Management", icon: Warehouse, tab: "inventory-table", section: "Inventory" },
    { id: "customer-table", label: "Customers", icon: Users, tab: "customer-table", section: "Users" },
    { id: "user-table", label: "Admin Users", icon: UserCog, tab: "user-table", section: "Users" },
    { id: "order-details-table", label: "All Orders", icon: ShoppingCart, tab: "order-details-table", section: "Orders" },
    { id: "order-processing", label: "Processing", icon: Clock, tab: "order-processing", section: "Orders" },
    { id: "order-delivered", label: "Delivered", icon: Truck, tab: "order-delivered", section: "Orders" },
    { id: "order-completed", label: "Completed", icon: CheckCircle, tab: "order-completed", section: "Orders" },
    { id: "order-cancelled", label: "Cancelled", icon: XCircle, tab: "order-cancelled", section: "Orders" },
    { id: "logout", label: "Logout", icon: LogOut, action: handleLogout, section: "Account" },
  ];

  const sections = [...new Set(navItems.map((i) => i.section).filter(Boolean))];
  const urlTab = searchParams.get("tab");

  const isActive = (item: NavItem) => {
    if (item.id === "product-table") {
      return pathname?.startsWith("/admin/products") ?? false;
    }
    if (item.tab) {
      if (pathname !== "/admin") return false;
      const current = urlTab || activeTab || "dashboard";
      return current === item.tab;
    }
    return false;
  };

  const handleNav = (item: NavItem) => {
    if (item.action) {
      item.action();
      return;
    }
    if (item.href) {
      router.push(item.href);
      setSidebarOpen(false);
      return;
    }
    if (item.tab) {
      const href = item.tab === "dashboard" ? "/admin" : `/admin?tab=${item.tab}`;
      router.push(href);
      onTabChange?.(item.tab);
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex overflow-hidden">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`admin-sidebar fixed lg:static inset-y-0 left-0 z-50 w-64 flex flex-col transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-5 border-b border-white/10">
          <Link href="/admin" className="flex items-center gap-3" onClick={() => setSidebarOpen(false)}>
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center font-black text-white text-sm">PLC</div>
            <div>
              <p className="font-bold text-white">Smart PLC</p>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-4">
          {sections.map((section) => (
            <div key={section}>
              <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">{section}</p>
              <div className="space-y-0.5">
                {navItems.filter((item) => item.section === section).map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNav(item)}
                      className={`admin-sidebar-item w-full ${active ? "active" : ""} ${
                        item.id === "logout" ? "text-red-400 hover:text-red-300" : ""
                      }`}
                    >
                      <Icon size={18} />
                      <span className="flex-1 text-left">{item.label}</span>
                      {active && <ChevronRight size={14} />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 min-h-0">
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 lg:px-6 py-3 flex items-center gap-4 shrink-0">
          <button type="button" onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex-1">
            <p className="text-sm text-slate-500">{pageSubtitle ?? "Smart PLC Eco System"}</p>
            <p className="font-semibold text-slate-900">{pageTitle}</p>
          </div>
        </header>
        <main className="flex-1 min-h-0 overflow-y-auto p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
