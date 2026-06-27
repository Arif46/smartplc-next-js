"use client";

import RegisterForm from "@/components/frontend/auth/RegisterForm";
import AuthNavTabs from "@/components/frontend/auth/AuthNavTabs";

export default function RegisterPage() {
  return (
    <>
      <AuthNavTabs />
      <RegisterForm />
    </>
  );
}
