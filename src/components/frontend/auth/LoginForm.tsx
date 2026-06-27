"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ChevronRight, Bike } from "lucide-react";
import toast from "react-hot-toast";
import AuthPageShell from "@/components/frontend/auth/AuthPageShell";
import SocialAuthButtons from "@/components/frontend/auth/SocialAuthButtons";
import { loginWithEmail } from "@/lib/authApi";
import { useAuthStore } from "@/store/authStore";

type LoginMode = "customer" | "admin" | "auto";

interface LoginFormProps {
  mode?: LoginMode;
  redirectTo?: string;
  variant?: "page" | "modal";
  onClose?: () => void;
  onSuccess?: () => void;
  onRegisterClick?: () => void;
}

export default function LoginForm({
  mode = "auto",
  redirectTo,
  variant = "page",
  onClose,
  onSuccess,
  onRegisterClick,
}: LoginFormProps) {
  const router = useRouter();
  const loginStore = useAuthStore((s) => s.login);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const isModal = variant === "modal";
  const title = mode === "admin" ? "Admin Login" : "Welcome Back";
  const subtitle =
    mode === "admin"
      ? "Secure access to Smart PLC admin dashboard"
      : "Sign in to shop parts for your motorcycle";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginWithEmail(formData.email, formData.password);
      const role = res.user.role;

      if (mode === "admin" && role !== "admin") {
        toast.error("This account is not an admin user.");
        return;
      }

      loginStore(res.token, res.user);
      toast.success(role === "admin" ? "Welcome, Admin!" : "Welcome back!");
      onSuccess?.();
      onClose?.();

      if (redirectTo) {
        router.push(redirectTo);
      } else if (role === "admin") {
        router.push("/admin");
      } else if (role === "customer") {
        router.push("/customer");
      } else {
        router.push("/");
      }
    } catch {
      toast.error("Incorrect email or password. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthPageShell
      icon={Bike}
      title={title}
      subtitle={subtitle}
      backHref={!isModal && mode !== "admin" ? "/" : undefined}
      backLabel="Back to store"
      onClose={onClose}
      variant={variant}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="login-email" className="text-sm font-medium mb-1.5 block">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="login-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((p) => ({ ...p, email: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background pl-10 pr-3 py-2.5 text-sm focus:ring-2 focus:ring-ring outline-none"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="login-password" className="text-sm font-medium mb-1.5 block">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => setFormData((p) => ({ ...p, password: e.target.value }))}
              className="w-full rounded-lg border border-border bg-background pl-10 pr-10 py-2.5 text-sm focus:ring-2 focus:ring-ring outline-none"
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? "Signing in..." : "Sign In"}
          <ChevronRight className="h-4 w-4" />
        </button>
        {!isModal && onRegisterClick ? (
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <button type="button" onClick={onRegisterClick} className="text-primary font-semibold hover:underline">
              Create account
            </button>
          </p>
        ) : null}
      </form>
      <SocialAuthButtons />
    </AuthPageShell>
  );
}
