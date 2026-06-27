"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Bike, X, ChevronRight } from "lucide-react";
import { fetchBikeCompanies, type BikeCompany } from "@/lib/shopApi";
import { useFitmentStore } from "@/store/fitmentStore";

interface VehicleFitmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VehicleFitmentModal({ isOpen, onClose }: VehicleFitmentModalProps) {
  const [companies, setCompanies] = useState<BikeCompany[]>([]);
  const [loading, setLoading] = useState(false);
  const fitment = useFitmentStore();

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    fetchBikeCompanies()
      .then(setCompanies)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [isOpen]);

  if (!isOpen) return null;

  const selectedCompany = companies.find((c) => c.id === fitment.companyId);
  const models = selectedCompany?.bike_models ?? [];

  const handleApply = () => {
    if (fitment.modelId) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg rounded-2xl bg-card border border-border shadow-2xl animate-fade-in-up">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bike className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Shop Your Ride</h2>
              <p className="text-sm text-muted-foreground">Find parts that fit your motorcycle</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Manufacturer</label>
            <select
              value={fitment.companyId ?? ""}
              onChange={(e) => {
                const c = companies.find((x) => x.id === Number(e.target.value));
                if (c) fitment.setCompany(c.id, c.name);
              }}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-ring outline-none"
            >
              <option value="">Select brand...</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Model</label>
            <select
              value={fitment.modelId ?? ""}
              onChange={(e) => {
                const m = models.find((x) => x.id === Number(e.target.value));
                if (m) fitment.setModel(m.id, m.name, m.engine_cc);
              }}
              disabled={!fitment.companyId}
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm focus:ring-2 focus:ring-ring outline-none disabled:opacity-50"
            >
              <option value="">Select model...</option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}{m.engine_cc ? ` (${m.engine_cc}cc)` : ""}
                </option>
              ))}
            </select>
          </div>

          {fitment.isSelected() && (
            <div className="rounded-lg bg-muted p-3 text-sm">
              <span className="text-muted-foreground">Selected: </span>
              <span className="font-semibold">
                {fitment.companyName} {fitment.modelName}
                {fitment.engineCc ? ` · ${fitment.engineCc}cc` : ""}
              </span>
            </div>
          )}
        </div>

        <div className="flex gap-3 p-5 border-t border-border">
          <button onClick={fitment.clear} className="btn-secondary flex-1">
            Clear
          </button>
          <button
            onClick={handleApply}
            disabled={!fitment.modelId}
            className="btn-primary flex-1 disabled:opacity-50"
          >
            Shop Parts
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {fitment.isSelected() && (
          <div className="px-5 pb-5">
            <Link
              href={`/shop?bike_model_id=${fitment.modelId}`}
              onClick={onClose}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View compatible parts <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
