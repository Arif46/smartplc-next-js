"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrderSuccessLegacyRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/order/success");
  }, [router]);
  return null;
}
