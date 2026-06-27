"use client";

import { useEffect, useState } from "react";

/** Avoid hydration mismatch for zustand persist / localStorage values */
export function useMounted(): boolean {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
