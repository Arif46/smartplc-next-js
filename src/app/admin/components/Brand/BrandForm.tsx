"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AdminCrudLabel } from "../shared/AdminCrudLayout";

export type BrandStatus = 1 | 2;

export interface Brand {
  id: number;
  name: string;
  slug: string;
  status: BrandStatus;
  description?: string | null;
  is_featured?: boolean;
  logo?: string | null;
  logo_url?: string | null;
}

interface BrandFormProps {
  initial?: Partial<Brand> | null;
  formId?: string;
  onSave: (payload: FormData) => Promise<void> | void;
}

const slugify = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9\-]+/g, "-").replace(/\-+/g, "-").replace(/^\-|\-$/g, "");

export default function BrandForm({ initial = null, formId = "brand-form", onSave }: BrandFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [isFeatured, setIsFeatured] = useState(initial?.is_featured ?? false);
  const [logo, setLogo] = useState<File | null>(null);
  const [customSlugEdited, setCustomSlugEdited] = useState(!!initial?.slug);

  useEffect(() => {
    setName(initial?.name ?? "");
    setSlug(initial?.slug ?? "");
    setDescription(initial?.description ?? "");
    setIsFeatured(initial?.is_featured ?? false);
    setLogo(null);
    setCustomSlugEdited(!!initial?.slug);
  }, [initial?.id]);

  useEffect(() => {
    if (!customSlugEdited) setSlug(slugify(name || ""));
  }, [name, customSlugEdited]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Brand name is required");

    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("slug", slug.trim() || slugify(name));
    if (description) fd.append("description", description);
    fd.append("is_featured", isFeatured ? "1" : "0");
    if (logo) fd.append("logo", logo);

    try {
      await onSave(fd);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Save failed");
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-3">
      <div>
        <AdminCrudLabel required>Brand Name</AdminCrudLabel>
        <input className="crud-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter brand name" />
      </div>
      <div>
        <AdminCrudLabel required>Slug</AdminCrudLabel>
        <input className="crud-input" value={slug} onChange={(e) => { setSlug(e.target.value); setCustomSlugEdited(true); }} />
      </div>
      <div>
        <AdminCrudLabel>Description</AdminCrudLabel>
        <textarea className="crud-input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div>
        <AdminCrudLabel>Brand Logo</AdminCrudLabel>
        <input type="file" accept="image/*" className="crud-input py-2" onChange={(e) => setLogo(e.target.files?.[0] ?? null)} />
        {(initial?.logo_url || logo) && (
          <img
            src={logo ? URL.createObjectURL(logo) : initial?.logo_url!}
            alt=""
            className="mt-2 h-16 rounded-md border object-contain bg-slate-50 p-1"
          />
        )}
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
        Featured on homepage
      </label>
    </form>
  );
}

export function emptyBrandForm() {
  return { id: undefined, name: "", slug: "", description: "", is_featured: false, logo_url: null };
}
