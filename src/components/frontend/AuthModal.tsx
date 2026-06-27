"use client";

import React from "react";
import LoginForm from "@/components/frontend/auth/LoginForm";
import RegisterForm from "@/components/frontend/auth/RegisterForm";
import { useModalStore } from "@/store/modalStore";

export default function AuthModal() {
  const { authModal, closeAuthModal, openLoginModal, openRegisterModal } = useModalStore();

  if (authModal === "closed") return null;

  if (authModal === "register") {
    return (
      <RegisterForm
        variant="modal"
        onClose={closeAuthModal}
        onLoginClick={openLoginModal}
      />
    );
  }

  return (
    <LoginForm
      variant="modal"
      onClose={closeAuthModal}
      onSuccess={closeAuthModal}
      onRegisterClick={openRegisterModal}
    />
  );
}
