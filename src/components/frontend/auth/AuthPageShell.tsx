"use client";

import React from "react";
import Link from "next/link";
import { LucideIcon, X, ChevronRight } from "lucide-react";

interface AuthPageShellProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  backHref?: string;
  backLabel?: string;
  onClose?: () => void;
  variant?: "page" | "modal";
}

export default function AuthPageShell({
  icon: Icon,
  title,
  subtitle,
  children,
  footer,
  backHref = "/",
  backLabel = "Back to store",
  onClose,
  variant = "page",
}: AuthPageShellProps) {
  const card = (
    <div className="relative w-full max-w-lg rounded-2xl bg-card border border-border shadow-2xl animate-fade-in-up">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Icon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="font-bold text-lg">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        ) : null}
      </div>

      <div className="p-5 space-y-4">{children}</div>

      {footer ? <div className="flex gap-3 p-5 border-t border-border">{footer}</div> : null}

      {backHref && !onClose ? (
        <div className="px-5 pb-5">
          <Link
            href={backHref}
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            {backLabel} <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      ) : null}
    </div>
  );

  if (variant === "modal") {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
        {card}
      </div>
    );
  }

  return (
    <div className="flex justify-center py-4 md:py-8">
      {card}
    </div>
  );
}
