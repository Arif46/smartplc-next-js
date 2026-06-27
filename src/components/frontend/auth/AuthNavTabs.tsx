"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Customer Login", href: "/login" },
  { label: "Admin Login", href: "/login/admin" },
  { label: "Sign Up", href: "/register" },
];

export default function AuthNavTabs() {
  const pathname = usePathname();

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {tabs.map((tab) => {
        const active = pathname === tab.href;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              active
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-card text-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
