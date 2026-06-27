"use client";

import React, { useState } from "react";
import LoginForm from "@/components/frontend/auth/LoginForm";
import RegisterForm from "@/components/frontend/auth/RegisterForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [showRegister, setShowRegister] = useState(false);

  if (!isOpen) return null;

  if (showRegister) {
    return (
      <RegisterForm
        variant="modal"
        onClose={() => setShowRegister(false)}
        onLoginClick={() => setShowRegister(false)}
        onSuccess={() => {
          setShowRegister(false);
          onClose();
        }}
      />
    );
  }

  return (
    <LoginForm
      mode="customer"
      variant="modal"
      onClose={onClose}
      onSuccess={onClose}
      onRegisterClick={() => setShowRegister(true)}
    />
  );
}
