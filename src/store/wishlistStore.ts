"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface WishlistItem {
  id: number;
  slug: string;
  name: string;
  purchase_price: number;
  sale_price?: number | null;
  image: string;
  stock: number;
}

interface WishlistState {
  items: WishlistItem[];
  add: (item: WishlistItem) => void;
  remove: (id: number) => void;
  toggle: (item: WishlistItem) => void;
  has: (id: number) => boolean;
  count: () => number;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        if (!get().items.some((i) => i.id === item.id)) {
          set({ items: [...get().items, item] });
        }
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      toggle: (item) => {
        if (get().has(item.id)) get().remove(item.id);
        else get().add(item);
      },
      has: (id) => get().items.some((i) => i.id === id),
      count: () => get().items.length,
    }),
    { name: "wishlist-storage" }
  )
);
