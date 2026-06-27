"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { fetchAvailableCategories } from "@/lib/homeApi";

export default function Footer() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchAvailableCategories().then(setCategories).catch(console.error);
  }, []);

  return (
    <footer className="bg-secondary text-secondary-foreground mt-auto">
      {/* Trust bar */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center text-xs sm:text-sm">
          <span>✓ Free Shipping over ৳2,000</span>
          <span>✓ Genuine Parts Guaranteed</span>
          <span>✓ 7-Day Easy Returns</span>
          <span>✓ Expert Rider Support</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Brand */}
        <div className="lg:col-span-2">
          <h3 className="text-xl font-bold text-white mb-3">Smart PLC Eco System</h3>
          <p className="text-white/60 text-sm leading-relaxed mb-4">
            Bangladesh&apos;s premium destination for motorcycle parts. Engine, brakes, exhaust,
            electrical & more — with vehicle fitment matching for every ride.
          </p>
          <div className="flex gap-3">
            {[Facebook, Instagram, Youtube].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="p-2 rounded-lg bg-white/10 hover:bg-primary transition-colors"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="font-semibold text-white mb-4">Shop</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/shop" className="hover:text-primary transition-colors">All Products</Link></li>
            <li><Link href="/flash-sale" className="hover:text-primary transition-colors">Flash Sale</Link></li>
            <li><Link href="/new-arrivals" className="hover:text-primary transition-colors">New Arrivals</Link></li>
            <li><Link href="/best-sellers" className="hover:text-primary transition-colors">Best Sellers</Link></li>
            {categories.slice(0, 4).map((cat) => (
              <li key={cat.id}>
                <Link href={`/category/${cat.slug}`} className="hover:text-primary transition-colors">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="font-semibold text-white mb-4">Support</h4>
          <ul className="space-y-2 text-sm text-white/60">
            <li><Link href="/contact-us" className="hover:text-primary transition-colors">Contact Us</Link></li>
            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
            <li><Link href="/about-us" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-semibold text-white mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-white/60">
            <li className="flex items-start gap-2">
              <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-primary" />
              Ko-27/A Rosulbag, Mohakhali, Dhaka-1212
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              +880 1810 447906
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              smartplcbd@gmail.com
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-sm text-white/40">
        <p>&copy; {new Date().getFullYear()} Smart PLC Eco System. All rights reserved.</p>
      </div>
    </footer>
  );
}
