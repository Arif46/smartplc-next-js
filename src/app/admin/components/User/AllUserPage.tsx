"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import AdminUserForm, { AdminUser, emptyAdminUserForm } from "./AdminUserForm";
import { fetchusers, createUser, updateUser, deleteUser } from "@/lib/userApi";
import {
  AdminCrudPage, AdminFormPanel, AdminListPanel, AdminCrudTable,
  AdminRowActions, AdminPagination, AdminTypeBadge, AdminThumb,
} from "../shared/AdminCrudLayout";

const FORM_ID = "admin-user-form";

export default function AllUserPage() {
  const [items, setItems] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Partial<AdminUser> | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const loadData = async (query = search, page = currentPage, size = perPage) => {
    setLoading(true);
    try {
      const res = await fetchusers(query, page, size, "admin");
      const admins = res.data.map((u: any) => ({
          id: Number(u.id),
          name: String(u.name ?? ""),
          first_name: u.first_name,
          last_name: u.last_name,
          email: String(u.email ?? ""),
          phone: u.phone,
          role: u.role,
        }));
      setItems(admins);
      if (res.meta) {
        setCurrentPage(res.meta.current_page);
        setLastPage(res.meta.last_page);
      }
    } catch {
      toast.error("Failed to load admin users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData("", 1); }, []);
  useEffect(() => {
    const t = setTimeout(() => loadData(search, 1), 350);
    return () => clearTimeout(t);
  }, [search, perPage]);

  const handleAddNew = () => setEditing(emptyAdminUserForm());
  const handleClear = () => setEditing(emptyAdminUserForm());
  const handleEdit = (item: AdminUser) => setEditing(item);

  const handleSave = async (payload: any) => {
    setSaving(true);
    try {
      if (editing?.id) {
        await updateUser(editing.id, payload);
        toast.success("Admin user updated");
      } else {
        await createUser(payload);
        toast.success("Admin user created");
      }
      setEditing(emptyAdminUserForm());
      loadData(search, editing?.id ? currentPage : 1);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: AdminUser) => {
    const result = await Swal.fire({
      title: "Delete admin user?",
      text: `"${item.name}" will be permanently removed.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteUser(item.id!);
      toast.success("User deleted");
      if (editing?.id === item.id) setEditing(emptyAdminUserForm());
      loadData(search, currentPage);
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <AdminCrudPage title="Admin User List" onAddNew={handleAddNew}>
      <AdminFormPanel
        title={editing?.id ? "Edit Admin User" : "Create Admin User"}
        formId={FORM_ID}
        saving={saving}
        onClear={handleClear}
      >
        <AdminUserForm key={editing?.id ?? "new"} initial={editing} formId={FORM_ID} onSave={handleSave} />
      </AdminFormPanel>

      <AdminListPanel
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name or email..."
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
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-8 text-slate-400">Loading...</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-8 text-slate-400">No admin users found</td></tr>
            ) : items.map((item, idx) => (
              <tr key={item.id}>
                <td>{(currentPage - 1) * perPage + idx + 1}</td>
                <td>
                  <div className="flex items-center gap-2">
                    <AdminThumb src={null} alt={item.name} rounded="full" />
                    <span className="font-medium">{item.name}</span>
                  </div>
                </td>
                <td className="text-slate-600">{item.email}</td>
                <td><AdminTypeBadge label="Admin" variant="green" /></td>
                <td><AdminRowActions onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item)} /></td>
              </tr>
            ))}
          </tbody>
        </AdminCrudTable>
      </AdminListPanel>
    </AdminCrudPage>
  );
}
