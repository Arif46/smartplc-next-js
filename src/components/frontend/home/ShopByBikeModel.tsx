"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchBikeCompanies, type BikeCompany } from "@/lib/shopApi";
import { Bike } from "lucide-react";

interface ShopByBikeModelProps {
  initialCompanies?: BikeCompany[];
}

export default function ShopByBikeModel({ initialCompanies }: ShopByBikeModelProps) {
  const [companies, setCompanies] = useState<BikeCompany[]>(initialCompanies ?? []);

  useEffect(() => {
    if (initialCompanies?.length) return;
    fetchBikeCompanies().then(setCompanies).catch(() => {});
  }, [initialCompanies]);

  if (!companies.length) return null;

  return (
    <section className="py-10 md:py-14">
      <div className="text-center mb-8">
        <h2 className="section-title">Shop by Bike Model</h2>
        <p className="section-subtitle">Select your motorcycle to find compatible parts</p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {companies.map((company) => (
          <div
            key={company.id}
            className="rounded-xl border border-border bg-card p-5 hover:border-primary transition-colors"
          >
            <div className="flex items-center gap-2 mb-3">
              <Bike className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-foreground">{company.name}</h3>
            </div>
            <ul className="space-y-1.5">
              {company.bike_models?.slice(0, 4).map((model) => (
                <li key={model.id}>
                  <Link
                    href={`/shop?bike_model_id=${model.id}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {model.name}
                    {model.engine_cc ? ` (${model.engine_cc}cc)` : ""}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
