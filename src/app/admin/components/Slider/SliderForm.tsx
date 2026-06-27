"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import type { Slider } from "@/lib/sliderApi";
import { AdminCrudLabel } from "../shared/AdminCrudLayout";

interface SliderFormProps {
  initial?: Slider | null;
  formId?: string;
  onSave: (data: FormData) => Promise<void>;
}

export default function SliderForm({ initial, formId = "slider-form", onSave }: SliderFormProps) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    subtitle: initial?.subtitle ?? "",
    button_text: initial?.button_text ?? "Shop Now",
    button_url: initial?.button_url ?? "/shop",
    display_order: String(initial?.display_order ?? 0),
    is_active: initial?.is_active ?? true,
  });
  const [desktop, setDesktop] = useState<File | null>(null);
  const [mobile, setMobile] = useState<File | null>(null);

  useEffect(() => {
    setForm({
      title: initial?.title ?? "",
      subtitle: initial?.subtitle ?? "",
      button_text: initial?.button_text ?? "Shop Now",
      button_url: initial?.button_url ?? "/shop",
      display_order: String(initial?.display_order ?? 0),
      is_active: initial?.is_active ?? true,
    });
    setDesktop(null);
    setMobile(null);
  }, [initial?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initial && !desktop) return toast.error("Desktop image is required");

    const fd = new FormData();
    fd.append("title", form.title);
    fd.append("subtitle", form.subtitle);
    fd.append("button_text", form.button_text);
    fd.append("button_url", form.button_url);
    fd.append("display_order", form.display_order);
    fd.append("is_active", form.is_active ? "1" : "0");
    if (desktop) fd.append("desktop_image", desktop);
    if (mobile) fd.append("mobile_image", mobile);

    try {
      await onSave(fd);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Save failed");
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-3">
      <div>
        <AdminCrudLabel>Title</AdminCrudLabel>
        <input className="crud-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
      </div>
      <div>
        <AdminCrudLabel>Subtitle</AdminCrudLabel>
        <input className="crud-input" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
      </div>
      <div>
        <AdminCrudLabel>Button Text</AdminCrudLabel>
        <input className="crud-input" value={form.button_text} onChange={(e) => setForm({ ...form, button_text: e.target.value })} />
      </div>
      <div>
        <AdminCrudLabel>Target Link</AdminCrudLabel>
        <input className="crud-input" value={form.button_url} onChange={(e) => setForm({ ...form, button_url: e.target.value })} placeholder="/shop" />
      </div>
      <div>
        <AdminCrudLabel>Display Order</AdminCrudLabel>
        <input type="number" className="crud-input" value={form.display_order} onChange={(e) => setForm({ ...form, display_order: e.target.value })} />
      </div>
      <div>
        <AdminCrudLabel required={!initial}>Desktop Image</AdminCrudLabel>
        <input type="file" accept="image/*" className="crud-input py-2" onChange={(e) => setDesktop(e.target.files?.[0] ?? null)} />
        {(initial?.desktop_image_url || desktop) && (
          <img src={desktop ? URL.createObjectURL(desktop) : initial?.desktop_image_url!} alt="" className="mt-2 h-20 w-full rounded-md border object-cover" />
        )}
      </div>
      <div>
        <AdminCrudLabel>Mobile Image</AdminCrudLabel>
        <input type="file" accept="image/*" className="crud-input py-2" onChange={(e) => setMobile(e.target.files?.[0] ?? null)} />
        {(initial?.mobile_image_url || mobile) && (
          <img src={mobile ? URL.createObjectURL(mobile) : initial?.mobile_image_url!} alt="" className="mt-2 h-16 rounded-md border object-cover" />
        )}
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-600">
        <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
        Active
      </label>
    </form>
  );
}

export function emptySliderForm(): null {
  return null;
}
