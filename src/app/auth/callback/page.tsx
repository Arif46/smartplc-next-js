"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuthStore } from "@/store/authStore";
import { consumePostLoginRedirect } from "@/lib/checkoutConstants";
import { Loader2 } from "lucide-react";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const login = useAuthStore((s) => s.login);

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      toast.error("Social login failed. Please try again.");
      router.replace("/login");
      return;
    }

    const token = searchParams.get("token");
    const role = searchParams.get("role") || "customer";
    const email = searchParams.get("email") || "";
    const name = searchParams.get("name") || "Rider";

    if (!token) {
      toast.error("Invalid login response.");
      router.replace("/login");
      return;
    }

    login(token, { role, email, first_name: name, name });
    toast.success("Signed in successfully!");
    const storedRedirect = consumePostLoginRedirect();
    if (storedRedirect && role === "customer") {
      router.replace(storedRedirect);
    } else {
      router.replace(role === "admin" ? "/admin" : "/customer");
    }
  }, [searchParams, login, router]);

  return (
    <div className="min-h-[40vh] flex items-center justify-center py-8">
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-6 py-4 shadow-xl">
        <Loader2 className="h-5 w-5 animate-spin text-primary" />
        <span className="text-sm font-medium">Completing sign in...</span>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={null}>
      <AuthCallbackContent />
    </Suspense>
  );
}
