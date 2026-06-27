"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAllCategory } from "@/lib/categoriesApi";
import { AdminCrudLabel } from "../shared/AdminCrudLayout";

export type CategoryStatus = 1 | 2;

export interface Category {
  id: number;
  name: string;
  slug: string;
  status: CategoryStatus;
  parent_id?: number | null;
  description?: string | null;
  image?: string | null;
  image_url?: string | null;
}

interface CategoryFormProps {
  initial?: Partial<Category> | null;
  formId?: string;
  onSave: (payload: FormData) => Promise<void> | void;
}

const slugify = (value: string) =>
  value.trim().toLowerCase().replace(/[^a-z0-9\-]+/g, "-").replace(/\-+/g, "-").replace(/^\-|\-$/g, "");

export default function CategoryForm({ initial = null, formId = "category-form", onSave }: CategoryFormProps) {
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [parentId, setParentId] = useState(String(initial?.parent_id ?? ""));
  const [image, setImage] = useState<File | null>(null);
  const [parents, setParents] = useState<Category[]>([]);
  const [customSlugEdited, setCustomSlugEdited] = useState(!!initial?.slug);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    getAllCategory().then(setParents).catch(() => {});
  }, []);

  useEffect(() => {
    setName(initial?.name ?? "");
    setSlug(initial?.slug ?? "");
    setDescription(initial?.description ?? "");
    setParentId(String(initial?.parent_id ?? ""));
    setImage(null);
    setCustomSlugEdited(!!initial?.slug);
  }, [initial?.id]);

  useEffect(() => {
    if (!customSlugEdited) setSlug(slugify(name || ""));
  }, [name, customSlugEdited]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return setErrors({ name: "Name is required" });

    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("slug", slug.trim() || slugify(name));
    if (description) fd.append("description", description);
    if (parentId) fd.append("parent_id", parentId);
    if (image) fd.append("image", image);

    try {
      await onSave(fd);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Save failed");
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-3">
      <div>
        <AdminCrudLabel required>Category Name</AdminCrudLabel>
        <input className="crud-input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter category name" />
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>
      <div>
        <AdminCrudLabel required>Slug</AdminCrudLabel>
        <input className="crud-input" value={slug} onChange={(e) => { setSlug(e.target.value); setCustomSlugEdited(true); }} />
      </div>
      <div>
        <AdminCrudLabel>Parent Category</AdminCrudLabel>
        <select className="crud-input" value={parentId} onChange={(e) => setParentId(e.target.value)}>
          <option value="">None (Top Level)</option>
          {parents.filter((p) => p.id !== initial?.id).map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>
      <div>
        <AdminCrudLabel>Description</AdminCrudLabel>
        <textarea className="crud-input" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" />
      </div>
      <div>
        <AdminCrudLabel>Category Image</AdminCrudLabel>
        <input type="file" accept="image/*" className="crud-input py-2" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
        {(initial?.image_url || image) && (
          <img
            src={image ? URL.createObjectURL(image) : initial?.image_url!}
            alt=""
            className="mt-2 h-16 rounded-md border object-cover"
          />
        )}
      </div>
    </form>
  );
}

export function emptyCategoryForm() {
  return { id: undefined, name: "", slug: "", description: "", parent_id: null, image_url: null };
}
