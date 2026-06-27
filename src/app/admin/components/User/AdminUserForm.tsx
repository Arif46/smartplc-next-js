"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AdminCrudLabel } from "../shared/AdminCrudLayout";

export interface AdminUser {
  id?: number;
  name: string;
  first_name?: string;
  last_name?: string;
  email: string;
  phone?: string | number;
  role?: string;
}

interface SavePayload {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: number;
  role: string;
  password?: string;
  password_confirmation?: string;
}

interface AdminUserFormProps {
  initial?: Partial<AdminUser> | null;
  formId?: string;
  onSave: (payload: SavePayload) => Promise<void> | void;
}

export default function AdminUserForm({ initial = null, formId = "admin-user-form", onSave }: AdminUserFormProps) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState({
    first_name: initial?.first_name ?? initial?.name?.split(" ")[0] ?? "",
    last_name: initial?.last_name ?? initial?.name?.split(" ").slice(1).join(" ") ?? "",
    email: initial?.email ?? "",
    phone: initial?.phone?.toString() ?? "",
    role: initial?.role ?? "admin",
    password: "",
    password_confirmation: "",
  });

  useEffect(() => {
    setForm({
      first_name: initial?.first_name ?? initial?.name?.split(" ")[0] ?? "",
      last_name: initial?.last_name ?? initial?.name?.split(" ").slice(1).join(" ") ?? "",
      email: initial?.email ?? "",
      phone: initial?.phone?.toString() ?? "",
      role: initial?.role ?? "admin",
      password: "",
      password_confirmation: "",
    });
  }, [initial?.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.first_name.trim() || !form.last_name.trim()) return toast.error("Name is required");
    if (!form.email.trim()) return toast.error("Email is required");
    if (!isEdit && !form.password) return toast.error("Password is required");
    if (form.password && form.password.length < 6) return toast.error("Password must be at least 6 characters");
    if (form.password && form.password !== form.password_confirmation) return toast.error("Passwords do not match");

    const payload: SavePayload = {
      name: `${form.first_name.trim()} ${form.last_name.trim()}`,
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
      email: form.email.trim(),
      phone: Number(form.phone) || 0,
      role: form.role,
    };
    if (form.password) {
      payload.password = form.password;
      payload.password_confirmation = form.password_confirmation;
    }

    try {
      await onSave(payload);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Save failed");
    }
  };

  return (
    <form id={formId} onSubmit={handleSubmit} className="space-y-3">
      <div>
        <AdminCrudLabel required>First Name</AdminCrudLabel>
        <input name="first_name" className="crud-input" value={form.first_name} onChange={handleChange} />
      </div>
      <div>
        <AdminCrudLabel required>Last Name</AdminCrudLabel>
        <input name="last_name" className="crud-input" value={form.last_name} onChange={handleChange} />
      </div>
      <div>
        <AdminCrudLabel required>Email</AdminCrudLabel>
        <input name="email" type="email" className="crud-input" value={form.email} onChange={handleChange} />
      </div>
      <div>
        <AdminCrudLabel>Phone</AdminCrudLabel>
        <input name="phone" className="crud-input" value={form.phone} onChange={handleChange} />
      </div>
      <div>
        <AdminCrudLabel required>Role</AdminCrudLabel>
        <select name="role" className="crud-input" value={form.role} onChange={handleChange}>
          <option value="admin">Admin</option>
          <option value="customer">Customer</option>
        </select>
      </div>
      <div>
        <AdminCrudLabel required={!isEdit}>Password</AdminCrudLabel>
        <input name="password" type="password" className="crud-input" value={form.password} onChange={handleChange} placeholder={isEdit ? "Leave blank to keep current" : ""} />
      </div>
      {form.password && (
        <div>
          <AdminCrudLabel>Confirm Password</AdminCrudLabel>
          <input name="password_confirmation" type="password" className="crud-input" value={form.password_confirmation} onChange={handleChange} />
        </div>
      )}
    </form>
  );
}

export function emptyAdminUserForm(): Partial<AdminUser> {
  return { name: "", email: "", role: "admin" };
}
