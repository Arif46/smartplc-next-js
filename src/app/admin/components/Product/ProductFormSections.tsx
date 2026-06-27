"use client";

import React from "react";

export function ProductFormSection({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`product-form-section ${className}`}>
      <h3 className="product-form-section-title">{title}</h3>
      <div className="product-form-section-body">{children}</div>
    </section>
  );
}

export function ProductField({
  label,
  required,
  error,
  children,
  span = 3,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
  span?: 3 | 4 | 6 | 8 | 12;
}) {
  const spanClass = {
    3: "xl:col-span-3",
    4: "xl:col-span-4",
    6: "xl:col-span-6",
    8: "xl:col-span-8",
    12: "xl:col-span-12",
  }[span];

  return (
    <div className={`col-span-12 ${spanClass}`}>
      <label className="product-field-label">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export function ProductDropzone({
  preview,
  onFile,
  error,
  required,
  resetKey = 0,
}: {
  preview?: string | null;
  onFile: (file: File) => void;
  error?: string;
  required?: boolean;
  resetKey?: number | string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);

  React.useEffect(() => {
    if (inputRef.current) inputRef.current.value = "";
  }, [resetKey]);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    onFile(file);
  };

  return (
    <div className="col-span-12 xl:col-span-6" key={resetKey}>
      <label className="product-field-label">
        Product Photo
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div
        className={`product-dropzone ${dragOver ? "drag-over" : ""}`}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <img src={preview} alt="Preview" className="max-h-40 mx-auto rounded-lg object-contain" />
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-slate-600">Drag &amp; Drop photo or <span className="text-blue-600 font-medium">Browse</span></p>
            <p className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP up to 4MB</p>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
