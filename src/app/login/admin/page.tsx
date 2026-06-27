"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/store/modalStore";

export default function AdminLoginRedirectPage() {
  const router = useRouter();
  const openLoginModal = useModalStore((s) => s.openLoginModal);

  useEffect(() => {
    openLoginModal();
    router.replace("/");
  }, [openLoginModal, router]);

  return null;
}
