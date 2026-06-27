"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Save, RotateCcw, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchBikeCompanies, fetchBikeModelsByCompany } from "@/lib/shopApi";
import { getAllCategory } from "@/lib/categoriesApi";
import { getAllBrand } from "@/lib/brandApi";
import { getProductImageUrl } from "@/lib/productUtils";
import { ProductFormSection, ProductField, ProductDropzone } from "./ProductFormSections";
import ProductRichTextEditor from "./ProductRichTextEditor";
import "react-quill-new/dist/quill.snow.css";

export type ProductStatus = 1 | 2;
export interface Category { id: number; name: string; }
export interface Brand { id: number; name: string; }

export interface Product {
  id?: number;
  name: string;
  slug: string;
  sku?: string;
  category_id: number;
  brand_id: number;
  purchase_price: number;
  sale_price?: number | null;
  cost_price?: number | null;
  stock: number;
  description?: string;
  specification?: string;
  oem_number?: string;
  part_number?: string;
  barcode?: string;
  weight?: number | null;
  warranty?: string;
  video_url?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  is_featured?: boolean;
  is_new_arrival?: boolean;
  is_best_seller?: boolean;
  is_flash_sale?: boolean;
  is_trending?: boolean;
  is_on_sale?: boolean;
  image?: string | null;
  image_url?: string | null;
  status?: ProductStatus;
  category?: Category;
  brand?: Brand;
  bike_models?: { id: number; name: string }[];
}

interface ProductFormProps {
  initial?: Partial<Product>;
  categories?: Category[];
  brands?: Brand[];
  mode: "create" | "edit";
  onSave: (data: FormData) => Promise<void | Product>;
}

const slugify = (v: string) =>
  v.trim().toLowerCase().replace(/[^a-z0-9\-]+/g, "-").replace(/\-+/g, "-").replace(/^\-|\-$/g, "");

const emptyFormState = () => ({
  name: "", slug: "", sku: "", category_id: "", brand_id: "",
  purchase_price: "", sale_price: "", cost_price: "", stock: "",
  description: "", specification: "", oem_number: "", part_number: "",
  barcode: "", weight: "", warranty: "", video_url: "",
  meta_title: "", meta_description: "", meta_keywords: "",
  is_featured: false, is_new_arrival: false, is_best_seller: false,
  is_flash_sale: false, is_trending: false, is_on_sale: false,
  image: null as File | null,
});

export default function ProductForm({ initial, categories: categoriesProp, brands: brandsProp, mode, onSave }: ProductFormProps) {
  const router = useRouter();
  const initialCategoryId = initial?.category_id ?? initial?.category?.id ?? "";
  const initialBrandId = initial?.brand_id ?? initial?.brand?.id ?? "";
  const initialBikeIds = (initial?.bike_models ?? []).map((m) => m.id);

  const [categories, setCategories] = useState<Category[]>(categoriesProp ?? []);
  const [brands, setBrands] = useState<Brand[]>(brandsProp ?? []);
  const [lookupsLoading, setLookupsLoading] = useState(!categoriesProp?.length || !brandsProp?.length);
  const [formResetKey, setFormResetKey] = useState(0);
  const [bikeCompanies, setBikeCompanies] = useState<{ id: number; name: string }[]>([]);
  const [bikeModels, setBikeModels] = useState<{ id: number; name: string }[]>([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedBikeIds, setSelectedBikeIds] = useState<number[]>(initialBikeIds);
  const [customSlug, setCustomSlug] = useState(!!initial?.slug);

  const [form, setForm] = useState({
    ...emptyFormState(),
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    sku: initial?.sku ?? "",
    category_id: initialCategoryId ? String(initialCategoryId) : "",
    brand_id: initialBrandId ? String(initialBrandId) : "",
    purchase_price: initial?.purchase_price != null ? String(initial.purchase_price) : "",
    sale_price: initial?.sale_price != null ? String(initial.sale_price) : "",
    cost_price: initial?.cost_price != null ? String(initial.cost_price) : "",
    stock: initial?.stock != null ? String(initial.stock) : "",
    description: initial?.description ?? "",
    specification: initial?.specification ?? "",
    oem_number: initial?.oem_number ?? "",
    part_number: initial?.part_number ?? "",
    barcode: initial?.barcode ?? "",
    weight: initial?.weight != null ? String(initial.weight) : "",
    warranty: initial?.warranty ?? "",
    video_url: initial?.video_url ?? "",
    meta_title: initial?.meta_title ?? "",
    meta_description: initial?.meta_description ?? "",
    meta_keywords: initial?.meta_keywords ?? "",
    is_featured: initial?.is_featured ?? false,
    is_new_arrival: initial?.is_new_arrival ?? false,
    is_best_seller: initial?.is_best_seller ?? false,
    is_flash_sale: initial?.is_flash_sale ?? false,
    is_trending: initial?.is_trending ?? false,
    is_on_sale: initial?.is_on_sale ?? false,
  });

  const [preview, setPreview] = useState<string | null>(() => {
    if (initial?.image_url) return initial.image_url;
    return initial?.image ? getProductImageUrl(initial.image) : null;
  });

  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (categoriesProp?.length) setCategories(categoriesProp);
    if (brandsProp?.length) setBrands(brandsProp);
  }, [categoriesProp, brandsProp]);

  useEffect(() => {
    if (categoriesProp?.length && brandsProp?.length) return;
    setLookupsLoading(true);
    Promise.all([getAllCategory(), getAllBrand()])
      .then(([cats, brs]) => {
        if (cats.length) setCategories(cats);
        if (brs.length) setBrands(brs);
        if (!cats.length) toast.error("No categories found. Create categories first.");
        if (!brs.length) toast.error("No brands found. Create brands first.");
      })
      .catch(() => toast.error("Failed to load categories/brands"))
      .finally(() => setLookupsLoading(false));
  }, [categoriesProp?.length, brandsProp?.length]);

  useEffect(() => { fetchBikeCompanies().then(setBikeCompanies).catch(() => {}); }, []);
  useEffect(() => {
    if (!customSlug) setForm((s) => ({ ...s, slug: slugify(s.name) }));
  }, [form.name, customSlug]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    if (name === "slug") setCustomSlug(true);
    setForm((s) => ({ ...s, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((p) => { const n = { ...p }; delete n[name]; return n; });
  };

  const handleImage = (file: File) => {
    if (file.size / 1024 / 1024 > 4) return setErrors((p) => ({ ...p, image: "Max 4MB" }));
    setForm((s) => ({ ...s, image: file }));
    setPreview(URL.createObjectURL(file));
    setErrors((p) => { const n = { ...p }; delete n.image; return n; });
  };

  const loadModels = async (companyId: string) => {
    setSelectedCompany(companyId);
    if (!companyId) { setBikeModels([]); return; }
    try { setBikeModels(await fetchBikeModelsByCompany(Number(companyId))); }
    catch { setBikeModels([]); }
  };

  const resetForm = () => {
    setForm(emptyFormState());
    setPreview(null);
    setSelectedBikeIds([]);
    setSelectedCompany("");
    setBikeModels([]);
    setCustomSlug(false);
    setErrors({});
    setFormResetKey((k) => k + 1);
    toast.success("Form cleared");
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.slug.trim()) e.slug = "Required";
    if (!form.category_id) e.category_id = "Required";
    if (!form.brand_id) e.brand_id = "Required";
    if (!form.purchase_price || Number(form.purchase_price) <= 0) e.purchase_price = "Required";
    if (form.stock === "" || Number(form.stock) < 0) e.stock = "Invalid";
    if (mode === "create" && !form.image && !preview) e.image = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const buildFormData = () => {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("slug", form.slug);
    if (form.sku) fd.append("sku", form.sku);
    fd.append("category_id", form.category_id);
    fd.append("brand_id", form.brand_id);
    fd.append("purchase_price", form.purchase_price);
    if (form.sale_price) fd.append("sale_price", form.sale_price);
    if (form.cost_price) fd.append("cost_price", form.cost_price);
    fd.append("stock", form.stock);
    fd.append("description", form.description);
    fd.append("specification", form.specification);
    if (form.oem_number) fd.append("oem_number", form.oem_number);
    if (form.part_number) fd.append("part_number", form.part_number);
    if (form.barcode) fd.append("barcode", form.barcode);
    if (form.weight) fd.append("weight", form.weight);
    if (form.warranty) fd.append("warranty", form.warranty);
    if (form.video_url) fd.append("video_url", form.video_url);
    if (form.meta_title) fd.append("meta_title", form.meta_title);
    if (form.meta_description) fd.append("meta_description", form.meta_description);
    if (form.meta_keywords) fd.append("meta_keywords", form.meta_keywords);
    ["is_featured", "is_new_arrival", "is_best_seller", "is_flash_sale", "is_trending", "is_on_sale"].forEach((f) => {
      fd.append(f, (form as any)[f] ? "1" : "0");
    });
    if (form.image) fd.append("image", form.image);
    fd.append("bike_model_ids", JSON.stringify(selectedBikeIds));
    return fd;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return toast.error("Please fix the highlighted fields");
    setSaving(true);
    try {
      await onSave(buildFormData());
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="product-form-page">
      <div className="flex items-center justify-between mb-5">
        <button type="button" onClick={() => router.push("/admin/products")} className="crud-btn-outline">
          <ArrowLeft size={16} /> Back to List
        </button>
        <p className="text-sm text-slate-500">{mode === "create" ? "Fill all required fields to create a product" : "Update product information"}</p>
      </div>

      <ProductFormSection title="General Information">
        <div className="grid grid-cols-12 gap-4">
          <ProductField label="Product Name" required error={errors.name}>
            <input name="name" value={form.name} onChange={handleChange} className="crud-input" placeholder="Enter product name" />
          </ProductField>
          <ProductField label="Slug" required error={errors.slug}>
            <input name="slug" value={form.slug} onChange={handleChange} className="crud-input" />
          </ProductField>
          <ProductField label="SKU">
            <input name="sku" value={form.sku} onChange={handleChange} className="crud-input" placeholder="Auto-generated if empty" />
          </ProductField>
          <ProductField label="Category" required error={errors.category_id}>
            <select
              name="category_id"
              value={form.category_id}
              onChange={handleChange}
              className="crud-input"
              disabled={lookupsLoading}
            >
              <option value="">{lookupsLoading ? "Loading categories..." : "Select category"}</option>
              {categories.map((c) => (
                <option key={c.id} value={String(c.id)}>{c.name}</option>
              ))}
            </select>
          </ProductField>
          <ProductField label="Brand" required error={errors.brand_id}>
            <select
              name="brand_id"
              value={form.brand_id}
              onChange={handleChange}
              className="crud-input"
              disabled={lookupsLoading}
            >
              <option value="">{lookupsLoading ? "Loading brands..." : "Select brand"}</option>
              {brands.map((b) => (
                <option key={b.id} value={String(b.id)}>{b.name}</option>
              ))}
            </select>
          </ProductField>
          <ProductDropzone
            resetKey={formResetKey}
            preview={preview}
            onFile={handleImage}
            error={errors.image}
            required={mode === "create"}
          />
        </div>
      </ProductFormSection>

      <ProductFormSection title="Pricing & Inventory">
        <div className="grid grid-cols-12 gap-4">
          <ProductField label="Purchase Price (৳)" required error={errors.purchase_price}>
            <input name="purchase_price" type="number" step="0.01" value={form.purchase_price} onChange={handleChange} className="crud-input" />
          </ProductField>
          <ProductField label="Sale Price (৳)">
            <input name="sale_price" type="number" step="0.01" value={form.sale_price} onChange={handleChange} className="crud-input" />
          </ProductField>
          <ProductField label="Cost Price (৳)">
            <input name="cost_price" type="number" step="0.01" value={form.cost_price} onChange={handleChange} className="crud-input" />
          </ProductField>
          <ProductField label="Stock Quantity" required error={errors.stock}>
            <input name="stock" type="number" value={form.stock} onChange={handleChange} className="crud-input" />
          </ProductField>
          <ProductField label="Weight (kg)">
            <input name="weight" type="number" step="0.01" value={form.weight} onChange={handleChange} className="crud-input" />
          </ProductField>
          <ProductField label="Warranty">
            <input name="warranty" value={form.warranty} onChange={handleChange} className="crud-input" placeholder="e.g. 6 months" />
          </ProductField>
        </div>
      </ProductFormSection>

      <ProductFormSection title="Product Identifiers">
        <div className="grid grid-cols-12 gap-4">
          <ProductField label="OEM Number"><input name="oem_number" value={form.oem_number} onChange={handleChange} className="crud-input" /></ProductField>
          <ProductField label="Part Number"><input name="part_number" value={form.part_number} onChange={handleChange} className="crud-input" /></ProductField>
          <ProductField label="Barcode"><input name="barcode" value={form.barcode} onChange={handleChange} className="crud-input" /></ProductField>
          <ProductField label="Video URL"><input name="video_url" value={form.video_url} onChange={handleChange} className="crud-input" /></ProductField>
        </div>
      </ProductFormSection>

      <ProductFormSection title="Description & Specification">
        <div className="grid grid-cols-12 gap-4">
          <ProductField label="Short Description" span={12}>
            <textarea name="description" rows={3} value={form.description} onChange={handleChange} className="crud-input" placeholder="Brief product description" />
          </ProductField>
          <ProductField label="Full Specification" span={12}>
            <ProductRichTextEditor
              editorKey={`spec-${formResetKey}`}
              value={form.specification}
              onChange={(v) => setForm((s) => ({ ...s, specification: v }))}
            />
          </ProductField>
        </div>
      </ProductFormSection>

      <ProductFormSection title="Marketing Flags">
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {[
            ["is_featured", "Featured"], ["is_new_arrival", "New Arrival"], ["is_best_seller", "Best Seller"],
            ["is_flash_sale", "Flash Sale"], ["is_trending", "Trending"], ["is_on_sale", "On Sale"],
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 p-3 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-50 text-sm">
              <input type="checkbox" name={key} checked={(form as any)[key]} onChange={handleChange} />
              {label}
            </label>
          ))}
        </div>
      </ProductFormSection>

      <ProductFormSection title="SEO Settings">
        <div className="grid grid-cols-12 gap-4">
          <ProductField label="Meta Title" span={6}><input name="meta_title" value={form.meta_title} onChange={handleChange} className="crud-input" /></ProductField>
          <ProductField label="Meta Keywords" span={6}><input name="meta_keywords" value={form.meta_keywords} onChange={handleChange} className="crud-input" /></ProductField>
          <ProductField label="Meta Description" span={12}>
            <textarea name="meta_description" rows={2} value={form.meta_description} onChange={handleChange} className="crud-input" />
          </ProductField>
        </div>
      </ProductFormSection>

      <ProductFormSection title="Bike Fitment">
        <div className="grid grid-cols-12 gap-4">
          <ProductField label="Bike Company" span={6}>
            <select className="crud-input" value={selectedCompany} onChange={(e) => loadModels(e.target.value)}>
              <option value="">Select company</option>
              {bikeCompanies.map((c) => (
                <option key={c.id} value={String(c.id)}>{c.name}</option>
              ))}
            </select>
          </ProductField>
          {bikeModels.length > 0 && (
            <div className="col-span-12 grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-slate-200 rounded-lg p-3">
              {bikeModels.map((m) => (
                <label key={m.id} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={selectedBikeIds.includes(m.id)} onChange={() =>
                    setSelectedBikeIds((p) => p.includes(m.id) ? p.filter((x) => x !== m.id) : [...p, m.id])
                  } />
                  {m.name}
                </label>
              ))}
            </div>
          )}
          {selectedBikeIds.length > 0 && (
            <p className="col-span-12 text-sm text-slate-500">{selectedBikeIds.length} model(s) selected</p>
          )}
        </div>
      </ProductFormSection>

      <div className="product-form-actions">
        <button type="button" onClick={() => router.push("/admin/products")} className="crud-btn-outline">Cancel</button>
        {mode === "create" && (
          <button type="button" onClick={resetForm} className="crud-btn-outline">
            <RotateCcw size={16} /> Clear
          </button>
        )}
        <button type="submit" disabled={saving} className="crud-btn-primary">
          <Save size={16} /> {saving ? "Saving..." : mode === "create" ? "Create Product" : "Update Product"}
        </button>
      </div>
    </form>
  );
}
