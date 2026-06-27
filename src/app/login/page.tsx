"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import LoginForm from "@/components/frontend/auth/LoginForm";
import AuthNavTabs from "@/components/frontend/auth/AuthNavTabs";

function CustomerLoginContent() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || undefined;

  return (
    <>
      <AuthNavTabs />
      <LoginForm mode="customer" redirectTo={redirectTo} />
    </>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <CustomerLoginContent />
    </Suspense>
  );
}
