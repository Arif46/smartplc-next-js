"use client";

import React, { useState } from "react";
import { Mail, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setTimeout(() => {
      toast.success("Subscribed! Check your inbox for exclusive deals.");
      setEmail("");
      setLoading(false);
    }, 800);
  };

  return (
    <section className="py-12 md:py-16">
      <div className="rounded-2xl bg-gradient-to-r from-secondary via-secondary to-primary/80 p-8 md:p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 rounded-full bg-white" />
        </div>
        <div className="relative z-10 max-w-xl mx-auto">
          <Mail className="h-10 w-10 text-primary mx-auto mb-4" />
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Get Exclusive Deals & Updates
          </h2>
          <p className="text-white/70 mb-6">
            Subscribe to our newsletter for flash sales, new arrivals, and riding tips.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="flex-1 rounded-xl px-4 py-3 text-sm bg-white/95 text-foreground outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-6 py-3 rounded-xl"
            >
              <Send className="h-4 w-4" />
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
