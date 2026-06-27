"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Loader2, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import ProductCard from "@/components/frontend/ProductCard";
import { useWishlistStore } from "@/store/wishlistStore";
import {
  fetchServerWishlist,
  removeFromServerWishlist,
  syncServerWishlist,
} from "@/lib/customerPanelApi";

export default function CustomerWishlistTab() {
  const localItems = useWishlistStore((s) => s.items);
  const localRemove = useWishlistStore((s) => s.remove);
  const [items, setItems] = useState(localItems);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const local = useWishlistStore.getState().items;
        if (local.length > 0) {
          await syncServerWishlist(local.map((i) => i.id));
        }
        const serverItems = await fetchServerWishlist();
        setItems(serverItems as any);
      } catch {
        setItems(useWishlistStore.getState().items);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleRemove = async (id: number) => {
    try {
      await removeFromServerWishlist(id);
      localRemove(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Removed from wishlist");
    } catch {
      toast.error("Failed to remove item");
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl p-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-danger/10">
            <Heart className="h-5 w-5 text-danger fill-danger" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">My Wishlist</h2>
            <p className="text-sm text-muted-foreground">{items.length} saved items</p>
          </div>
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-10 text-center">
          <Heart className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground mb-4">Your wishlist is empty.</p>
          <Link
            href="/shop"
            className="inline-flex px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium"
          >
            Browse Shop
          </Link>
        </div>
      ) : (
        <div className="p-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item) => (
            <div key={item.id} className="relative">
              <ProductCard product={item as any} />
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                className="absolute top-2 left-2 z-10 inline-flex items-center gap-1 text-xs bg-danger text-white px-2 py-1 rounded-md hover:brightness-110"
              >
                <Trash2 className="h-3 w-3" />
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
