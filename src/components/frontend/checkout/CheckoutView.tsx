"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  CreditCard,
  ShieldCheck,
  Truck,
  ChevronRight,
  ChevronLeft,
  Package,
  CheckCircle2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import { useMounted } from "@/hooks/useMounted";
import { createOrder } from "@/lib/checkoutApi";
import { formatPrice, getProductImageUrl } from "@/lib/productUtils";
import {
  calcCheckoutTotals,
  saveOrderConfirmation,
  setPostLoginRedirect,
} from "@/lib/checkoutConstants";

type ShippingState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  notes: string;
};

type PaymentMethod = "cod" | "bkash" | "nagad" | "card";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring";
const inputErrorClass = "border-danger focus:ring-danger/30";

export default function CheckoutView() {
  const router = useRouter();
  const mounted = useMounted();
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { openLoginModal } = useModalStore();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState<ShippingState>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Bangladesh",
    notes: "",
  });
  const [shippingErrors, setShippingErrors] = useState<Partial<Record<keyof ShippingState, string>>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [transactionId, setTransactionId] = useState("");
  const [paymentError, setPaymentError] = useState("");

  const subtotal = useMemo(() => getSubtotal(), [getSubtotal, items]);
  const { shipping: shippingCost, tax, total } = useMemo(
    () => calcCheckoutTotals(subtotal),
    [subtotal]
  );

  useEffect(() => {
    if (!user) return;
    setShipping((prev) => ({
      ...prev,
      firstName: (user as any).first_name || prev.firstName,
      lastName: (user as any).last_name || prev.lastName,
      email: (user as any).email || prev.email,
      phone: (user as any).phone || prev.phone,
    }));
  }, [user]);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated) {
      setPostLoginRedirect("/checkout");
      openLoginModal();
      toast.error("Please sign in to continue checkout");
      return;
    }
    if (items.length === 0) {
      toast.error("Your cart is empty");
      router.replace("/cart");
    }
  }, [mounted, isAuthenticated, items.length, openLoginModal, router]);

  const onShippingChange = (key: keyof ShippingState, value: string) => {
    setShipping((prev) => ({ ...prev, [key]: value }));
    setShippingErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const validateShipping = () => {
    const errors: Partial<Record<keyof ShippingState, string>> = {};
    if (!shipping.firstName.trim()) errors.firstName = "First name is required";
    if (!shipping.lastName.trim()) errors.lastName = "Last name is required";
    if (!shipping.email.trim()) errors.email = "Email is required";
    if (!shipping.phone.trim()) errors.phone = "Phone is required";
    if (!shipping.address.trim()) errors.address = "Address is required";
    if (!shipping.city.trim()) errors.city = "City is required";
    setShippingErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePayment = () => {
    if ((paymentMethod === "bkash" || paymentMethod === "nagad") && transactionId.trim().length < 3) {
      setPaymentError(`Transaction ID is required for ${paymentMethod.toUpperCase()}`);
      return false;
    }
    setPaymentError("");
    return true;
  };

  const placeOrder = async () => {
    if (!validatePayment() || items.length === 0) return;

    setLoading(true);
    try {
      const response = await createOrder({
        firstName: shipping.firstName.trim(),
        lastName: shipping.lastName.trim(),
        email: shipping.email.trim(),
        phone: shipping.phone.trim(),
        address: shipping.address.trim(),
        city: shipping.city.trim(),
        state: shipping.state.trim() || undefined,
        postal_code: shipping.zipCode.trim(),
        country: shipping.country.trim() || "Bangladesh",
        notes: shipping.notes.trim() || undefined,
        payment_method: paymentMethod,
        transaction_id: transactionId.trim() || undefined,
        shipping_cost: shippingCost,
        tax_amount: tax,
        items: items.map((it) => ({
          id: it.id,
          name: it.name,
          price: it.price,
          quantity: it.quantity,
        })),
      });

      saveOrderConfirmation(response.order);
      clearCart();
      toast.success("Order confirmed!");
      router.push("/order/success");
    } catch (err: any) {
      setPaymentError(err.message || "Order failed");
      toast.error(err.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || !isAuthenticated || items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 text-center text-muted-foreground">
        Loading checkout...
      </div>
    );
  }

  const paymentOptions: { id: PaymentMethod; title: string; desc: string }[] = [
    { id: "cod", title: "Cash on Delivery", desc: "Pay when your parts arrive at your door." },
    { id: "bkash", title: "bKash", desc: "Send payment and enter your transaction ID." },
    { id: "nagad", title: "Nagad", desc: "Send payment and enter your transaction ID." },
    { id: "card", title: "Debit / Credit Card", desc: "Secure card payment (demo mode)." },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 rounded-xl bg-primary/10">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="section-title">Checkout</h1>
            <p className="section-subtitle">Complete your order securely</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-6">
          {[
            { n: 1, label: "Shipping", icon: MapPin },
            { n: 2, label: "Payment", icon: CreditCard },
          ].map(({ n, label, icon: Icon }) => (
            <div
              key={n}
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold border ${
                step === n
                  ? "bg-primary text-primary-foreground border-primary"
                  : step > n
                  ? "bg-success/10 text-success border-success/30"
                  : "bg-card text-muted-foreground border-border"
              }`}
            >
              {step > n ? <CheckCircle2 className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {step === 1 && (
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Shipping Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(
                  [
                    ["firstName", "First Name", "text"],
                    ["lastName", "Last Name", "text"],
                    ["email", "Email", "email"],
                    ["phone", "Phone", "tel"],
                  ] as const
                ).map(([key, label, type]) => (
                  <div key={key}>
                    <label className="text-sm font-medium mb-1.5 block">{label} *</label>
                    <input
                      type={type}
                      value={shipping[key]}
                      onChange={(e) => onShippingChange(key, e.target.value)}
                      className={`${inputClass} ${shippingErrors[key] ? inputErrorClass : ""}`}
                    />
                    {shippingErrors[key] && (
                      <p className="text-danger text-xs mt-1">{shippingErrors[key]}</p>
                    )}
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1.5 block">Street Address *</label>
                  <input
                    value={shipping.address}
                    onChange={(e) => onShippingChange("address", e.target.value)}
                    className={`${inputClass} ${shippingErrors.address ? inputErrorClass : ""}`}
                    placeholder="House, road, area"
                  />
                  {shippingErrors.address && (
                    <p className="text-danger text-xs mt-1">{shippingErrors.address}</p>
                  )}
                </div>
                {(
                  [
                    ["city", "City", true],
                    ["state", "Division / State", false],
                    ["zipCode", "Postal Code", false],
                    ["country", "Country", false],
                  ] as const
                ).map(([key, label, required]) => (
                  <div key={key}>
                    <label className="text-sm font-medium mb-1.5 block">
                      {label}{required ? " *" : ""}
                    </label>
                    <input
                      value={shipping[key]}
                      onChange={(e) => onShippingChange(key, e.target.value)}
                      className={`${inputClass} ${shippingErrors[key as keyof ShippingState] ? inputErrorClass : ""}`}
                    />
                    {shippingErrors[key as keyof ShippingState] && (
                      <p className="text-danger text-xs mt-1">{shippingErrors[key as keyof ShippingState]}</p>
                    )}
                  </div>
                ))}
                <div className="md:col-span-2">
                  <label className="text-sm font-medium mb-1.5 block">Order Notes (optional)</label>
                  <textarea
                    value={shipping.notes}
                    onChange={(e) => onShippingChange("notes", e.target.value)}
                    rows={3}
                    className={inputClass}
                    placeholder="Delivery instructions, bike model, etc."
                  />
                </div>
              </div>
              <div className="flex flex-wrap justify-between gap-3 mt-6 pt-6 border-t border-border">
                <Link href="/cart" className="btn-secondary">
                  <ChevronLeft className="h-4 w-4" /> Back to Cart
                </Link>
                <button
                  type="button"
                  onClick={() => validateShipping() && setStep(2)}
                  className="btn-primary"
                >
                  Continue to Payment <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </section>
          )}

          {step === 2 && (
            <section className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-bold mb-5 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" /> Payment Method
              </h2>
              <div className="space-y-3">
                {paymentOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-colors ${
                      paymentMethod === opt.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === opt.id}
                      onChange={() => {
                        setPaymentMethod(opt.id);
                        setPaymentError("");
                      }}
                      className="mt-1"
                    />
                    <div>
                      <div className="font-semibold">{opt.title}</div>
                      <div className="text-sm text-muted-foreground">{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              {(paymentMethod === "bkash" || paymentMethod === "nagad") && (
                <div className="mt-4">
                  <label className="text-sm font-medium mb-1.5 block">Transaction ID *</label>
                  <input
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className={inputClass}
                    placeholder="Enter payment transaction ID"
                  />
                </div>
              )}

              {paymentError && (
                <p className="text-danger text-sm mt-4 rounded-lg bg-danger/5 border border-danger/20 px-3 py-2">
                  {paymentError}
                </p>
              )}

              <div className="flex flex-wrap justify-between gap-3 mt-6 pt-6 border-t border-border">
                <button type="button" onClick={() => setStep(1)} className="btn-secondary">
                  <ChevronLeft className="h-4 w-4" /> Back to Shipping
                </button>
                <button
                  type="button"
                  onClick={placeOrder}
                  disabled={loading}
                  className="btn-primary min-w-[180px] disabled:opacity-50"
                >
                  {loading ? "Placing Order..." : "Confirm Order"}
                  {!loading && <ChevronRight className="h-4 w-4" />}
                </button>
              </div>
            </section>
          )}
        </div>

        <aside className="lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4 sticky top-24">
            <h2 className="font-bold text-lg">Order Summary</h2>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                    <img
                      src={getProductImageUrl(item.image)}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    <p className="text-sm font-semibold text-primary mt-0.5">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="space-y-2 text-sm border-t border-border pt-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Shipping</span>
                <span>{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-border text-base font-bold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(total)}</span>
              </div>
            </div>
            <div className="rounded-lg bg-muted p-3 text-xs text-muted-foreground flex items-start gap-2">
              <Truck className="h-4 w-4 shrink-0 mt-0.5" />
              Free shipping on orders over {formatPrice(2000)}
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-success shrink-0" />
              Secure checkout · Stock reserved on confirm
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
