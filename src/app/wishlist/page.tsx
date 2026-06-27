"use client";

import Link from "next/link";
import ProductCard from "@/components/frontend/ProductCard";
import EmptyState from "@/components/frontend/ui/EmptyState";
import { useWishlistStore } from "@/store/wishlistStore";
import { Heart } from "lucide-react";

export default function WishlistPage() {
  const { items, remove } = useWishlistStore();

  if (items.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Save parts you love and come back to them anytime."
        actionLabel="Start Shopping"
        actionHref="/shop"
      />
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <Heart className="h-7 w-7 text-danger fill-danger" />
        <div>
          <h1 className="section-title">My Wishlist</h1>
          <p className="section-subtitle">{items.length} saved items</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {items.map((item) => (
          <div key={item.id} className="relative">
            <ProductCard product={item as any} />
            <button
              onClick={() => remove(item.id)}
              className="absolute top-2 left-2 text-xs bg-danger text-white px-2 py-1 rounded-md hover:brightness-110 z-10"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
