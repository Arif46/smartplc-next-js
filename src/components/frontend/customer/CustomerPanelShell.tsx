"use client";

import {
  LayoutDashboard,
  User,
  Package,
  MapPin,
  Heart,
  Shield,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { CUSTOMER_TABS, type CustomerTab } from "@/lib/customerConstants";
import api from "@/lib/api";
import toast from "react-hot-toast";

const TAB_ICONS: Record<CustomerTab, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  profile: User,
  orders: Package,
  addresses: MapPin,
  wishlist: Heart,
  password: Shield,
};

interface CustomerPanelShellProps {
  activeTab: CustomerTab;
  onTabChange: (tab: CustomerTab) => void;
  children: React.ReactNode;
  userName?: string;
  userEmail?: string;
}

export default function CustomerPanelShell({
  activeTab,
  onTabChange,
  children,
  userName,
  userEmail,
}: CustomerPanelShellProps) {
  const router = useRouter();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await api.post("/api/logout");
    } catch {
      // proceed with local logout even if API fails
    }
    logout();
    toast.success("Signed out");
    router.push("/");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 md:py-10">
      <div className="mb-8">
        <p className="text-sm text-muted-foreground mb-1">Account</p>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Manage your profile, orders, addresses, and saved items.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        <aside className="lg:w-72 shrink-0">
          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-border bg-muted/30">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">{userName || "Customer"}</p>
                  <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                </div>
              </div>
            </div>

            <nav className="p-3">
              <ul className="space-y-1">
                {CUSTOMER_TABS.map((tab) => {
                  const Icon = TAB_ICONS[tab.id];
                  const active = activeTab === tab.id;
                  return (
                    <li key={tab.id}>
                      <button
                        type="button"
                        onClick={() => onTabChange(tab.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                          active
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        {tab.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="p-3 border-t border-border">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-danger hover:bg-danger/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
