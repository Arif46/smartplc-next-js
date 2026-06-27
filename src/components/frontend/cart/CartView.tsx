"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  X,
  Package,
  ShieldCheck,
  Truck,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import { getProductImageUrl, formatPrice } from "@/lib/productUtils";
import { setPostLoginRedirect } from "@/lib/checkoutConstants";

const FREE_SHIPPING_MIN = 2000;

interface CartViewProps {
  variant?: "page" | "sidebar";
  onClose?: () => void;
}

export default function CartView({ variant = "page", onClose }: CartViewProps) {
  const router = useRouter();
  const { items, updateQuantity, removeItem, clearCart, getSubtotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { openLoginModal } = useModalStore();
  const [confirmClear, setConfirmClear] = useState(false);

  const isSidebar = variant === "sidebar";
  const subtotal = useMemo(() => getSubtotal(), [getSubtotal, items]);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_MIN ? 0 : 120;
  const total = subtotal + shipping;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_MIN - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / FREE_SHIPPING_MIN) * 100);

  const handleCheckout = () => {
    onClose?.();
    if (!isAuthenticated) {
      setPostLoginRedirect("/checkout");
      openLoginModal();
      toast.error("Please sign in to checkout");
      return;
    }
    router.push("/checkout");
  };

  const handleClearCart = () => {
    clearCart();
    setConfirmClear(false);
    toast.success("Cart cleared");
    if (isSidebar) onClose?.();
  };

  const handleRemoveItem = (id: number, name: string) => {
    removeItem(id);
    toast.success(`Removed ${name}`);
  };

  return (
    <div className={isSidebar ? "flex flex-col h-full bg-card" : "max-w-5xl mx-auto"}>
      {/* Header */}
      <div
        className={`flex items-center justify-between gap-4 ${
          isSidebar ? "p-5 border-b border-border" : "mb-8"
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <ShoppingBag className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className={`font-bold text-foreground ${isSidebar ? "text-lg" : "section-title"}`}>
              {isSidebar ? "Your Cart" : "Shopping Cart"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {itemCount === 0
                ? "No items yet"
                : `${itemCount} item${itemCount === 1 ? "" : "s"} in your cart`}
            </p>
          </div>
        </div>
        {isSidebar ? (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        ) : (
          <Link href="/shop" className="btn-secondary text-sm hidden sm:inline-flex">
            Continue Shopping
          </Link>
        )}
      </div>

      {items.length === 0 ? (
        <div className={`text-center ${isSidebar ? "flex-1 flex flex-col justify-center px-6 py-12" : "py-20"}`}>
          <div className="mx-auto w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-5">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-semibold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-sm text-muted-foreground mb-6 max-w-sm mx-auto">
            Browse our motorcycle parts catalog and add items to your cart.
          </p>
          <Link
            href="/shop"
            onClick={onClose}
            className="btn-primary inline-flex"
          >
            Shop Parts <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className={isSidebar ? "flex flex-col flex-1 min-h-0" : "grid lg:grid-cols-3 gap-8"}>
          {/* Items */}
          <div className={`space-y-3 ${isSidebar ? "flex-1 overflow-y-auto p-5" : "lg:col-span-2"}`}>
            {items.map((item) => (
              <article
                key={item.id}
                className="flex gap-4 p-4 rounded-xl border border-border bg-card hover:border-primary/30 transition-colors"
              >
                <div className="shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-muted border border-border">
                  <img
                    src={getProductImageUrl(item.image)}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-sm sm:text-base text-foreground line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(item.id, item.name)}
                      className="p-2 rounded-lg text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors shrink-0"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="inline-flex items-center rounded-lg border border-border bg-background">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="p-2 hover:bg-muted rounded-l-lg transition-colors disabled:opacity-40"
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-muted rounded-r-lg transition-colors disabled:opacity-40"
                        disabled={item.quantity >= item.stock}
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <span className="text-base font-bold text-primary">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </article>
            ))}

            {!isSidebar && (
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <Link href="/shop" className="text-sm font-medium text-primary hover:underline">
                  ← Continue shopping
                </Link>
                {!confirmClear ? (
                  <button
                    type="button"
                    onClick={() => setConfirmClear(true)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-danger transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                    Clear cart
                  </button>
                ) : (
                  <div className="flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/5 px-3 py-2">
                    <span className="text-sm text-danger font-medium">Remove all items?</span>
                    <button
                      type="button"
                      onClick={handleClearCart}
                      className="text-xs font-semibold px-2.5 py-1 rounded-md bg-danger text-white hover:brightness-110"
                    >
                      Yes, clear
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmClear(false)}
                      className="text-xs font-semibold px-2.5 py-1 rounded-md border border-border hover:bg-muted"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Summary */}
          <div
            className={
              isSidebar
                ? "border-t border-border p-5 space-y-4 bg-muted/30"
                : "lg:col-span-1"
            }
          >
            <div className="rounded-xl border border-border bg-card p-5 space-y-4 sticky top-24">
              <h2 className="font-semibold text-foreground">Order Summary</h2>

              {subtotal < FREE_SHIPPING_MIN && (
                <div className="rounded-lg bg-muted p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Truck className="h-4 w-4 shrink-0" />
                    Add {formatPrice(amountToFreeShipping)} more for free shipping
                  </div>
                  <div className="h-1.5 rounded-full bg-border overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{ width: `${freeShippingProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? (
                      <span className="text-success">Free</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-border text-base font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <button type="button" onClick={handleCheckout} className="btn-primary w-full py-3">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4" />
              </button>

              {isSidebar && (
                <Link
                  href="/cart"
                  onClick={onClose}
                  className="btn-secondary w-full text-sm"
                >
                  View Full Cart
                </Link>
              )}

              {isSidebar && (
                <>
                  {!confirmClear ? (
                    <button
                      type="button"
                      onClick={() => setConfirmClear(true)}
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-muted-foreground hover:border-danger/40 hover:text-danger hover:bg-danger/5 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      Clear Cart
                    </button>
                  ) : (
                    <div className="rounded-lg border border-danger/30 bg-danger/5 p-3 space-y-2">
                      <p className="text-sm font-medium text-danger text-center">
                        Remove all {itemCount} items?
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setConfirmClear(false)}
                          className="btn-secondary text-sm py-2"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleClearCart}
                          className="rounded-lg bg-danger text-white text-sm font-semibold py-2 hover:brightness-110 transition-all"
                        >
                          Clear All
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                <ShieldCheck className="h-4 w-4 shrink-0 text-success" />
                Secure checkout · Genuine parts guaranteed
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
