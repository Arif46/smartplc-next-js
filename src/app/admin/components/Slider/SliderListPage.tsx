"use client";

import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import SliderForm from "./SliderForm";
import {
  fetchSliders, createSlider, updateSlider, deleteSlider, toggleSlider, type Slider,
} from "@/lib/sliderApi";
import {
  AdminCrudPage, AdminFormPanel, AdminListPanel, AdminCrudTable,
  AdminStatusToggle, AdminRowActions, AdminPagination, AdminThumb,
} from "../shared/AdminCrudLayout";

const FORM_ID = "slider-form";

export default function SliderListPage() {
  const [items, setItems] = useState<Slider[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Slider | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await fetchSliders());
    } catch {
      toast.error("Failed to load sliders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return items;
    return items.filter((s) =>
      (s.title ?? "").toLowerCase().includes(q) ||
      (s.subtitle ?? "").toLowerCase().includes(q)
    );
  }, [items, search]);

  const lastPage = Math.max(1, Math.ceil(filtered.length / perPage));
  const paged = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const handleAddNew = () => setEditing(null);
  const handleClear = () => setEditing(null);
  const handleEdit = (item: Slider) => setEditing(item);

  const handleSave = async (fd: FormData) => {
    setSaving(true);
    try {
      if (editing?.id) {
        await updateSlider(editing.id, fd);
        toast.success("Slider updated");
      } else {
        await createSlider(fd);
        toast.success("Slider created");
      }
      setEditing(null);
      load();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: Slider) => {
    const result = await Swal.fire({
      title: "Delete slider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteSlider(item.id);
      toast.success("Slider deleted");
      if (editing?.id === item.id) setEditing(null);
      load();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleToggle = async (item: Slider) => {
    try {
      await toggleSlider(item.id);
      load();
    } catch {
      toast.error("Toggle failed");
    }
  };

  return (
    <AdminCrudPage title="Slider List" onAddNew={handleAddNew}>
      <AdminFormPanel
        title={editing?.id ? "Edit Slider" : "Create Slider"}
        formId={FORM_ID}
        saving={saving}
        onClear={handleClear}
      >
        <SliderForm key={editing?.id ?? "new"} initial={editing} formId={FORM_ID} onSave={handleSave} />
      </AdminFormPanel>

      <AdminListPanel
        search={search}
        onSearchChange={(v) => { setSearch(v); setCurrentPage(1); }}
        searchPlaceholder="Search by title..."
        onFilter={() => setCurrentPage(1)}
        footer={
          <AdminPagination
            currentPage={currentPage}
            lastPage={lastPage}
            perPage={perPage}
            onPageChange={setCurrentPage}
            onPerPageChange={(n) => { setPerPage(n); setCurrentPage(1); }}
          />
        }
      >
        <AdminCrudTable>
          <thead>
            <tr>
              <th>SL No</th>
              <th>Image</th>
              <th>Title</th>
              <th>Order</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-400">Loading...</td></tr>
            ) : paged.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-400">No sliders found</td></tr>
            ) : paged.map((item, idx) => (
              <tr key={item.id}>
                <td>{(currentPage - 1) * perPage + idx + 1}</td>
                <td><AdminThumb src={item.desktop_image_url} alt={item.title ?? ""} /></td>
                <td>
                  <p className="font-medium">{item.title || "—"}</p>
                  <p className="text-xs text-slate-400 truncate max-w-[200px]">{item.subtitle}</p>
                </td>
                <td>{item.display_order}</td>
                <td><AdminStatusToggle checked={item.is_active} onChange={() => handleToggle(item)} /></td>
                <td><AdminRowActions onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item)} /></td>
              </tr>
            ))}
          </tbody>
        </AdminCrudTable>
      </AdminListPanel>
    </AdminCrudPage>
  );
}
