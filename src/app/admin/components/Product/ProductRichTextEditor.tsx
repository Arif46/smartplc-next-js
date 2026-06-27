"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill-new");
    return RQ;
  },
  {
    ssr: false,
    loading: () => (
      <div className="product-quill-editor border border-slate-200 rounded-lg bg-slate-50 h-[280px] flex items-center justify-center text-sm text-slate-400">
        Loading editor...
      </div>
    ),
  }
);

const TOOLBAR = [
  [{ header: [1, 2, 3, 4, false] }],
  [{ size: ["small", false, "large", "huge"] }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ list: "ordered" }, { list: "bullet" }],
  [{ indent: "-1" }, { indent: "+1" }],
  [{ align: [] }],
  ["blockquote", "code-block"],
  ["link", "image"],
  ["clean"],
];

const FORMATS = [
  "header", "size", "bold", "italic", "underline", "strike",
  "color", "background", "script", "list", "bullet", "indent",
  "align", "blockquote", "code-block", "link", "image",
];

interface Props {
  value: string;
  onChange: (value: string) => void;
  editorKey?: string | number;
  placeholder?: string;
}

export default function ProductRichTextEditor({ value, onChange, editorKey = "spec", placeholder }: Props) {
  const modules = useMemo(
    () => ({
      toolbar: TOOLBAR,
      clipboard: { matchVisual: false },
    }),
    []
  );

  return (
    <div className="product-quill-editor" key={editorKey}>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        formats={FORMATS}
        placeholder={placeholder ?? "Enter full product specification..."}
      />
    </div>
  );
}
