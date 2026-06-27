"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CompareItem {
  id: number;
  slug: string;
  name: string;
  purchase_price: number;
  image: string;
  brand?: { name: string };
  specification?: string;
}

interface CompareState {
  items: CompareItem[];
  maxItems: number;
  add: (item: CompareItem) => boolean;
  remove: (id: number) => void;
  clear: () => void;
  has: (id: number) => boolean;
}

export const useCompareStore = create<CompareState>()(
  persist(
    (set, get) => ({
      items: [],
      maxItems: 4,
      add: (item) => {
        if (get().items.some((i) => i.id === item.id)) return true;
        if (get().items.length >= get().maxItems) return false;
        set({ items: [...get().items, item] });
        return true;
      },
      remove: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      clear: () => set({ items: [] }),
      has: (id) => get().items.some((i) => i.id === id),
    }),
    { name: "compare-storage" }
  )
);
