"use client";

import React from "react";
import CartView from "@/components/frontend/cart/CartView";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className="fixed right-0 top-0 z-[95] h-full w-full max-w-md shadow-2xl animate-fade-in-up">
        <CartView variant="sidebar" onClose={onClose} />
      </aside>
    </>
  );
}
