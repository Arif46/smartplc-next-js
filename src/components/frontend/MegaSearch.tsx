"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { liveSearch } from "@/lib/shopApi";
import { getProductImageUrl, formatPrice, getEffectivePrice } from "@/lib/productUtils";

interface MegaSearchProps {
  className?: string;
}

export default function MegaSearch({ className = "" }: MegaSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) {
      setResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await liveSearch(query);
        setResults(data);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder="Search parts, SKU, OEM number..."
          className="w-full h-11 rounded-xl border border-border bg-background pl-4 pr-24 text-sm focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-shadow"
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-9 px-4 rounded-lg bg-primary text-primary-foreground flex items-center gap-1.5 text-sm font-semibold hover:brightness-110 transition-all"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          Search
        </button>
      </form>

      {open && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border bg-card shadow-2xl z-50 overflow-hidden animate-fade-in-up">
          <div className="max-h-80 overflow-y-auto">
            {results.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setOpen(false);
                  router.push(`/product/${item.slug}`);
                }}
                className="w-full flex items-center gap-3 p-3 hover:bg-muted transition-colors text-left"
              >
                <img
                  src={getProductImageUrl(item.image)}
                  alt={item.name}
                  className="w-12 h-12 rounded-lg object-cover bg-muted"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.brand?.name}</p>
                </div>
                <span className="text-sm font-bold text-primary shrink-0">
                  {formatPrice(getEffectivePrice(item))}
                </span>
              </button>
            ))}
          </div>
          <button
            onClick={handleSubmit as any}
            className="w-full p-3 text-sm font-medium text-primary border-t border-border hover:bg-muted transition-colors"
          >
            View all results for &quot;{query}&quot;
          </button>
        </div>
      )}
    </div>
  );
}
