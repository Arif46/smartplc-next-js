"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import BrandForm, { Brand, emptyBrandForm } from "./BrandForm";
import {
  fetchBrands, createBrand, updateBrand, deleteBrand, toggleBrandStatus,
} from "@/lib/brandApi";
import {
  AdminCrudPage, AdminFormPanel, AdminListPanel, AdminCrudTable,
  AdminStatusToggle, AdminRowActions, AdminPagination, AdminThumb, AdminTypeBadge,
} from "../shared/AdminCrudLayout";

const FORM_ID = "brand-form";

export default function BrandListPage() {
  const [items, setItems] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Partial<Brand> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const loadData = async (query = search, page = currentPage, size = perPage) => {
    setLoading(true);
    try {
      const res = await fetchBrands(query, page, size);
      setItems(res.data);
      if (res.meta) {
        setCurrentPage(res.meta.current_page);
        setLastPage(res.meta.last_page);
      }
    } catch {
      toast.error("Failed to load brands");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData("", 1); }, []);
  useEffect(() => {
    const t = setTimeout(() => loadData(search, 1), 350);
    return () => clearTimeout(t);
  }, [search, perPage]);

  const handleAddNew = () => setEditing(emptyBrandForm());
  const handleClear = () => setEditing(emptyBrandForm());
  const handleEdit = (item: Brand) => setEditing(item);

  const handleSave = async (fd: FormData) => {
    setSaving(true);
    try {
      if (editing?.id) {
        await updateBrand(editing.id, fd);
        toast.success("Brand updated");
      } else {
        await createBrand(fd);
        toast.success("Brand created");
      }
      setEditing(emptyBrandForm());
      loadData(search, editing?.id ? currentPage : 1);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: Brand) => {
    const result = await Swal.fire({
      title: "Delete brand?",
      text: `"${item.name}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteBrand(item.id);
      toast.success("Brand deleted");
      if (editing?.id === item.id) setEditing(emptyBrandForm());
      loadData(search, currentPage);
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleToggle = async (item: Brand) => {
    try {
      await toggleBrandStatus(item.id);
      loadData(search, currentPage);
    } catch {
      toast.error("Status update failed");
    }
  };

  return (
    <AdminCrudPage title="Brand List" onAddNew={handleAddNew}>
      <AdminFormPanel
        title={editing?.id ? "Edit Brand" : "Create Brand"}
        formId={FORM_ID}
        saving={saving}
        onClear={handleClear}
      >
        <BrandForm key={editing?.id ?? "new"} initial={editing} formId={FORM_ID} onSave={handleSave} />
      </AdminFormPanel>

      <AdminListPanel
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name or slug..."
        onFilter={() => loadData(search, 1)}
        footer={
          <AdminPagination
            currentPage={currentPage}
            lastPage={lastPage}
            perPage={perPage}
            onPageChange={(p) => loadData(search, p)}
            onPerPageChange={(n) => { setPerPage(n); setCurrentPage(1); }}
          />
        }
      >
        <AdminCrudTable>
          <thead>
            <tr>
              <th>SL No</th>
              <th>Logo</th>
              <th>Brand Name</th>
              <th>Featured</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-400">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-400">No brands found</td></tr>
            ) : items.map((item, idx) => (
              <tr key={item.id}>
                <td>{(currentPage - 1) * perPage + idx + 1}</td>
                <td><AdminThumb src={item.logo_url} alt={item.name} /></td>
                <td className="font-medium">{item.name}</td>
                <td>
                  {item.is_featured
                    ? <AdminTypeBadge label="Featured" variant="green" />
                    : <AdminTypeBadge label="Standard" variant="gray" />}
                </td>
                <td><AdminStatusToggle checked={item.status === 1} onChange={() => handleToggle(item)} /></td>
                <td><AdminRowActions onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item)} /></td>
              </tr>
            ))}
          </tbody>
        </AdminCrudTable>
      </AdminListPanel>
    </AdminCrudPage>
  );
}
