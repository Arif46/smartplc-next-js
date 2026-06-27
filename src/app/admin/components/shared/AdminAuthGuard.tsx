"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";

export default function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => setHydrated(true), []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated || user?.role !== "admin") router.push("/login/admin");
  }, [hydrated, isAuthenticated, user, router]);

  if (!hydrated || !isAuthenticated || user?.role !== "admin") return null;
  return <>{children}</>;
}
