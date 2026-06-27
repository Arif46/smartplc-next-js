"use client";

import LoginForm from "@/components/frontend/auth/LoginForm";
import AuthNavTabs from "@/components/frontend/auth/AuthNavTabs";

export default function AdminLoginPage() {
  return (
    <>
      <AuthNavTabs />
      <LoginForm mode="admin" redirectTo="/admin" />
    </>
  );
}
