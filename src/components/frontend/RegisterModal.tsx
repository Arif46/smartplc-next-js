"use client";

import RegisterForm from "@/components/frontend/auth/RegisterForm";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function RegisterModal({ isOpen, onClose, onSuccess }: RegisterModalProps) {
  if (!isOpen) return null;
  return <RegisterForm variant="modal" onClose={onClose} onSuccess={onSuccess} />;
}
