"use client";

import React from "react";
import {
  Plus, Filter, Save, RotateCcw, Pencil, Trash2,
  ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight,
} from "lucide-react";

/* ── Page shell ── */
export function AdminCrudPage({
  title,
  onAddNew,
  children,
}: {
  title: string;
  onAddNew: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">{title}</h1>
        <button type="button" onClick={onAddNew} className="crud-btn-primary">
          <Plus size={16} /> Add New
        </button>
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">{children}</div>
    </div>
  );
}

/* ── Left form panel ── */
export function AdminFormPanel({
  title,
  children,
  formId = "crud-form",
  saving = false,
  onClear,
}: {
  title: string;
  children: React.ReactNode;
  formId?: string;
  saving?: boolean;
  onClear: () => void;
}) {
  return (
    <div className="xl:col-span-4">
      <div className="crud-card h-full flex flex-col">
        <div className="crud-card-header">
          <h2 className="font-semibold text-slate-800">{title}</h2>
        </div>
        <div className="crud-card-body flex-1">{children}</div>
        <div className="crud-card-footer flex gap-2">
          <button type="submit" form={formId} disabled={saving} className="crud-btn-primary flex-1 justify-center">
            <Save size={16} /> {saving ? "Saving..." : "Save"}
          </button>
          <button type="button" onClick={onClear} disabled={saving} className="crud-btn-outline flex-1 justify-center">
            <RotateCcw size={16} /> Clear
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Right list panel ── */
export function AdminListPanel({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  onFilter,
  footer,
  children,
}: {
  search: string;
  onSearchChange: (v: string) => void;
  searchPlaceholder?: string;
  onFilter?: () => void;
  footer?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="xl:col-span-8">
      <div className="crud-card">
        <div className="crud-card-body border-b border-slate-100 pb-0">
          <div className="flex gap-2 mb-4">
            <input
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={searchPlaceholder}
              className="crud-input flex-1"
            />
            <button type="button" onClick={onFilter ?? (() => {})} className="crud-btn-primary shrink-0">
              <Filter size={16} /> Filter
            </button>
          </div>
          <div className="overflow-x-auto">{children}</div>
        </div>
        {footer && <div className="crud-card-footer">{footer}</div>}
      </div>
    </div>
  );
}

/* ── Table helpers ── */
export function AdminCrudTable({ children }: { children: React.ReactNode }) {
  return <table className="crud-table w-full">{children}</table>;
}

export function AdminCrudLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="crud-label">
      {children}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </label>
  );
}

export function AdminStatusToggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button type="button" onClick={onChange} className="crud-toggle" aria-pressed={checked}>
      <span className={`crud-toggle-track ${checked ? "active" : ""}`}>
        <span className="crud-toggle-thumb" />
      </span>
    </button>
  );
}

export function AdminRowActions({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <button type="button" onClick={onEdit} title="Edit" className="crud-action-btn edit">
        <Pencil size={14} />
      </button>
      <button type="button" onClick={onDelete} title="Delete" className="crud-action-btn delete">
        <Trash2 size={14} />
      </button>
    </div>
  );
}

export function AdminTypeBadge({ label, variant = "blue" }: { label: string; variant?: "blue" | "green" | "gray" }) {
  const cls = { blue: "crud-badge-blue", green: "crud-badge-green", gray: "crud-badge-gray" }[variant];
  return <span className={`crud-badge ${cls}`}>{label}</span>;
}

export function AdminPagination({
  currentPage,
  lastPage,
  perPage,
  onPageChange,
  onPerPageChange,
  rowsLabel = "Show",
}: {
  currentPage: number;
  lastPage: number;
  perPage: number;
  onPageChange: (p: number) => void;
  onPerPageChange: (n: number) => void;
  rowsLabel?: string;
}) {
  const pages = Array.from({ length: Math.min(lastPage, 5) }, (_, i) => {
    if (lastPage <= 5) return i + 1;
    if (currentPage <= 3) return i + 1;
    if (currentPage >= lastPage - 2) return lastPage - 4 + i;
    return currentPage - 2 + i;
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full">
      <div className="flex items-center gap-1">
        <button type="button" disabled={currentPage === 1} onClick={() => onPageChange(1)} className="crud-page-btn">
          <ChevronsLeft size={16} />
        </button>
        <button type="button" disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)} className="crud-page-btn">
          <ChevronLeft size={16} />
        </button>
        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`crud-page-btn ${p === currentPage ? "active" : ""}`}
          >
            {p}
          </button>
        ))}
        <button type="button" disabled={currentPage === lastPage} onClick={() => onPageChange(currentPage + 1)} className="crud-page-btn">
          <ChevronRight size={16} />
        </button>
        <button type="button" disabled={currentPage === lastPage} onClick={() => onPageChange(lastPage)} className="crud-page-btn">
          <ChevronsRight size={16} />
        </button>
      </div>
      <div className="flex items-center gap-2 text-sm text-slate-600">
        <span title="Rows per page">{rowsLabel}</span>
        <select
          value={perPage}
          onChange={(e) => onPerPageChange(Number(e.target.value))}
          className="crud-input w-auto py-1.5 min-w-[4.5rem]"
          aria-label="Rows per page"
        >
          {[5, 10, 25, 50].map((n) => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>
    </div>
  );
}

export function AdminThumb({ src, alt, rounded = "md" }: { src?: string | null; alt?: string; rounded?: "md" | "full" }) {
  if (!src) {
    return <div className={`w-9 h-9 bg-slate-100 ${rounded === "full" ? "rounded-full" : "rounded-md"}`} />;
  }
  return (
    <img
      src={src}
      alt={alt ?? ""}
      className={`w-9 h-9 object-cover border border-slate-200 ${rounded === "full" ? "rounded-full" : "rounded-md"}`}
    />
  );
}
