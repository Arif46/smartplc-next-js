"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart, Heart, User, Bike, GitCompare, Sun, Moon, Menu, X,
} from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

import CartSidebar from "./CartSidebar";
import AuthModal from "./AuthModal";
import MegaSearch from "./MegaSearch";
import VehicleFitmentModal from "./VehicleFitmentModal";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/useCartStore";
import { useModalStore } from "@/store/modalStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useCompareStore } from "@/store/compareStore";
import { useFitmentStore } from "@/store/fitmentStore";
import { useThemeStore } from "@/store/themeStore";
import { useMounted } from "@/hooks/useMounted";

import logo from "../../../public/logo.png";

const navLinks = [
  { label: "Shop", href: "/shop" },
  { label: "Flash Sale", href: "/flash-sale", highlight: true },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact-us" },
];

export default function Header() {
  const router = useRouter();
  const { isAuthenticated, logout, user } = useAuthStore();
  const { items } = useCartStore();
  const { openAuthModal, isAuthModalOpen, closeAuthModal } = useModalStore();
  const wishlistCount = useWishlistStore((s) => s.count());
  const compareItems = useCompareStore((s) => s.items);
  const fitment = useFitmentStore();
  const { isDark, toggleTheme } = useThemeStore();
  const mounted = useMounted();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoginMenuOpen, setIsLoginMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFitmentOpen, setIsFitmentOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/");
  };

  return (
    <>
      {/* Promo bar */}
      <div className="bg-primary text-primary-foreground text-center text-xs sm:text-sm py-2 px-4 font-medium">
        Free shipping on orders over ৳2,000 · Use code <strong>WELCOME10</strong> for 10% off
      </div>

      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main row */}
          <div className="flex items-center gap-3 h-16 md:h-[72px]">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="shrink-0">
              <Image src={logo} alt="Smart PLC Eco System" className="w-28 md:w-36 h-auto" priority />
            </Link>

            <button
              onClick={() => setIsFitmentOpen(true)}
              className="hidden md:flex items-center gap-2 shrink-0 rounded-xl bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground hover:brightness-110 transition-all"
            >
              <Bike className="h-4 w-4" />
              {mounted && fitment.isSelected() ? (
                <span className="max-w-[120px] truncate">{fitment.modelName}</span>
              ) : (
                "Shop Your Ride"
              )}
            </button>

            <MegaSearch className="hidden md:block flex-1 max-w-2xl mx-auto" />

            <div className="flex items-center gap-1 sm:gap-2 ml-auto">
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-muted transition-colors hidden sm:block"
                aria-label="Toggle theme"
              >
                {mounted ? (isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />) : <Moon className="h-5 w-5" />}
              </button>

              <Link href="/wishlist" className="relative p-2 rounded-lg hover:bg-muted transition-colors">
                <Heart className="h-5 w-5" />
                {mounted && wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-danger text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold px-1">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link href="/compare" className="relative p-2 rounded-lg hover:bg-muted transition-colors hidden sm:block">
                <GitCompare className="h-5 w-5" />
                {mounted && compareItems.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-accent text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold px-1">
                    {compareItems.length}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 rounded-lg hover:bg-muted transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {mounted && cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold px-1">
                    {cartCount}
                  </span>
                )}
              </button>

              <div className="relative">
                {!mounted ? (
                  <button type="button" className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-muted text-sm" aria-label="Login">
                    <User className="h-5 w-5" />
                    <span className="hidden sm:inline">Login</span>
                  </button>
                ) : isAuthenticated ? (
                  <>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-muted text-sm"
                    >
                      <User className="h-5 w-5" />
                      <span className="hidden lg:inline max-w-[80px] truncate">
                        {user?.first_name || "Account"}
                      </span>
                    </button>
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-1 w-48 rounded-xl border border-border bg-card shadow-xl z-30 overflow-hidden animate-fade-in-up">
                        <Link href="/customer" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-muted">
                          Dashboard
                        </Link>
                        <Link href="/customer?tab=orders" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-muted">
                          Orders
                        </Link>
                        <Link href="/wishlist" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-muted">
                          Wishlist
                        </Link>
                        {user?.role === "admin" && (
                          <Link href="/admin" onClick={() => setIsUserMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-muted">
                            Admin Panel
                          </Link>
                        )}
                        <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm text-danger hover:bg-muted border-t border-border">
                          Sign Out
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsLoginMenuOpen(!isLoginMenuOpen)}
                      className="flex items-center gap-1.5 p-2 rounded-lg hover:bg-muted text-sm"
                    >
                      <User className="h-5 w-5" />
                      <span className="hidden sm:inline">Login</span>
                    </button>
                    {isLoginMenuOpen && (
                      <div className="absolute right-0 mt-1 w-52 rounded-xl border border-border bg-card shadow-xl z-30 overflow-hidden animate-fade-in-up">
                        <Link href="/login" onClick={() => setIsLoginMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-muted">
                          Customer Login
                        </Link>
                        <Link href="/login/admin" onClick={() => setIsLoginMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-muted">
                          Admin Login
                        </Link>
                        <Link href="/register" onClick={() => setIsLoginMenuOpen(false)} className="block px-4 py-2.5 text-sm hover:bg-muted border-t border-border">
                          Sign Up
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden pb-3">
            <MegaSearch />
          </div>

          {/* Nav links */}
          <nav className="hidden lg:flex items-center gap-1 border-t border-border py-2 -mx-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors hover:bg-muted ${
                  link.highlight ? "text-danger" : "text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/about-us" className="px-3 py-1.5 rounded-lg text-sm font-semibold text-muted-foreground hover:bg-muted ml-auto">
              About Us
            </Link>
          </nav>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card animate-fade-in-up">
            <div className="px-4 py-3 space-y-1">
              <button
                onClick={() => { setIsFitmentOpen(true); setMobileMenuOpen(false); }}
                className="w-full btn-primary mb-3"
              >
                <Bike className="h-4 w-4" /> Shop Your Ride
              </button>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <VehicleFitmentModal isOpen={isFitmentOpen} onClose={() => setIsFitmentOpen(false)} />
    </>
  );
}
