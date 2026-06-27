"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import CategoryForm, { Category, emptyCategoryForm } from "./CategoryForm";
import {
  fetchCategories, createCategory, updateCategory, deleteCategory, toggleCategoryStatus,
} from "@/lib/categoriesApi";
import {
  AdminCrudPage, AdminFormPanel, AdminListPanel, AdminCrudTable,
  AdminStatusToggle, AdminRowActions, AdminPagination, AdminThumb,
} from "../shared/AdminCrudLayout";

const FORM_ID = "category-form";

export default function CategoryListPage() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Partial<Category> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const loadData = async (query = search, page = currentPage, size = perPage) => {
    setLoading(true);
    try {
      const res = await fetchCategories(query, page, size);
      setItems(res.data);
      if (res.meta) {
        setCurrentPage(res.meta.current_page);
        setLastPage(res.meta.last_page);
      }
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData("", 1); }, []);
  useEffect(() => {
    const t = setTimeout(() => loadData(search, 1), 350);
    return () => clearTimeout(t);
  }, [search, perPage]);

  const handleAddNew = () => setEditing(emptyCategoryForm());
  const handleClear = () => setEditing(emptyCategoryForm());
  const handleEdit = (item: Category) => setEditing(item);

  const handleSave = async (fd: FormData) => {
    setSaving(true);
    try {
      if (editing?.id) {
        await updateCategory(editing.id, fd);
        toast.success("Category updated");
      } else {
        await createCategory(fd);
        toast.success("Category created");
      }
      setEditing(emptyCategoryForm());
      loadData(search, editing?.id ? currentPage : 1);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: Category) => {
    const result = await Swal.fire({
      title: "Delete category?",
      text: `"${item.name}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteCategory(item.id);
      toast.success("Category deleted");
      if (editing?.id === item.id) setEditing(emptyCategoryForm());
      loadData(search, currentPage);
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleToggle = async (item: Category) => {
    try {
      await toggleCategoryStatus(item.id);
      loadData(search, currentPage);
    } catch {
      toast.error("Status update failed");
    }
  };

  return (
    <AdminCrudPage title="Category List" onAddNew={handleAddNew}>
      <AdminFormPanel
        title={editing?.id ? "Edit Category" : "Create Category"}
        formId={FORM_ID}
        saving={saving}
        onClear={handleClear}
      >
        <CategoryForm key={editing?.id ?? "new"} initial={editing} formId={FORM_ID} onSave={handleSave} />
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
              <th>Image</th>
              <th>Category Name</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-400">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-8 text-slate-400">No categories found</td></tr>
            ) : items.map((item, idx) => (
              <tr key={item.id}>
                <td>{(currentPage - 1) * perPage + idx + 1}</td>
                <td><AdminThumb src={item.image_url} alt={item.name} /></td>
                <td className="font-medium">{item.name}</td>
                <td className="text-slate-500 text-sm">{item.slug}</td>
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
