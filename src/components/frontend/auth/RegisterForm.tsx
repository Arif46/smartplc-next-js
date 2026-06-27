"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Mail, Lock, Eye, EyeOff, Phone, ChevronRight, UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import AuthPageShell from "@/components/frontend/auth/AuthPageShell";
import SocialAuthButtons from "@/components/frontend/auth/SocialAuthButtons";
import { registerCustomer } from "@/lib/authApi";

interface RegisterFormProps {
  variant?: "page" | "modal";
  onClose?: () => void;
  onSuccess?: () => void;
  onLoginClick?: () => void;
}

export default function RegisterForm({ variant = "page", onClose, onSuccess, onLoginClick }: RegisterFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.password_confirmation) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await registerCustomer(formData);
      toast.success("Account created! Please sign in.");
      onSuccess?.();
      if (variant === "modal" && onLoginClick) {
        onLoginClick();
      } else {
        onClose?.();
        router.push("/");
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      icon={UserPlus}
      title="Create Account"
      subtitle="Join Smart PLC and find parts for your motorcycle"
      backHref={variant === "page" && !onLoginClick ? "/login" : undefined}
      backLabel="Already have an account? Sign in"
      onClose={onClose}
      variant={variant}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="first_name" className="text-sm font-medium mb-1.5 block">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input id="first_name" name="first_name" value={formData.first_name} onChange={handleChange} className="w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-ring outline-none" placeholder="First name" required />
            </div>
          </div>
          <div>
            <label htmlFor="last_name" className="text-sm font-medium mb-1.5 block">Last Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input id="last_name" name="last_name" value={formData.last_name} onChange={handleChange} className="w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-ring outline-none" placeholder="Last name" required />
            </div>
          </div>
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium mb-1.5 block">Phone Number</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-ring outline-none" placeholder="Enter your phone number" required />
          </div>
        </div>
        <div>
          <label htmlFor="register-email" className="text-sm font-medium mb-1.5 block">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input id="register-email" name="email" type="email" value={formData.email} onChange={handleChange} className="w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-ring outline-none" placeholder="Enter your email" required />
          </div>
        </div>
        <div>
          <label htmlFor="register-password" className="text-sm font-medium mb-1.5 block">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input id="register-password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} className="w-full rounded-lg border border-border bg-background pl-10 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-ring outline-none" placeholder="Create a password" required />
            <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="password_confirmation" className="text-sm font-medium mb-1.5 block">Confirm Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input id="password_confirmation" name="password_confirmation" type={showConfirmPassword ? "text" : "password"} value={formData.password_confirmation} onChange={handleChange} className="w-full rounded-lg border border-border bg-background pl-10 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-ring outline-none" placeholder="Confirm your password" required />
            <button type="button" onClick={() => setShowConfirmPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? "Creating account..." : "Create Account"}
          <ChevronRight className="h-4 w-4" />
        </button>
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          {onLoginClick ? (
            <button type="button" onClick={onLoginClick} className="text-primary font-semibold hover:underline">Sign in</button>
          ) : (
            <Link href="/login" className="text-primary font-semibold hover:underline">Sign in</Link>
          )}
        </p>
      </form>
      <SocialAuthButtons />
    </AuthPageShell>
  );
}
