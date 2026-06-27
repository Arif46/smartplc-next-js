"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FitmentSelection {
  companyId: number | null;
  companyName: string;
  modelId: number | null;
  modelName: string;
  engineCc: number | null;
  year: number | null;
}

interface FitmentState extends FitmentSelection {
  setCompany: (id: number, name: string) => void;
  setModel: (id: number, name: string, engineCc: number | null) => void;
  setYear: (year: number) => void;
  clear: () => void;
  isSelected: () => boolean;
}

const initial: FitmentSelection = {
  companyId: null,
  companyName: "",
  modelId: null,
  modelName: "",
  engineCc: null,
  year: null,
};

export const useFitmentStore = create<FitmentState>()(
  persist(
    (set, get) => ({
      ...initial,
      setCompany: (id, name) =>
        set({ companyId: id, companyName: name, modelId: null, modelName: "", engineCc: null }),
      setModel: (id, name, engineCc) =>
        set({ modelId: id, modelName: name, engineCc }),
      setYear: (year) => set({ year }),
      clear: () => set(initial),
      isSelected: () => get().modelId !== null,
    }),
    { name: "fitment-storage" }
  )
);
