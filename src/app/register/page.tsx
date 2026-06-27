"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/store/modalStore";

export default function RegisterRedirectPage() {
  const router = useRouter();
  const openRegisterModal = useModalStore((s) => s.openRegisterModal);

  useEffect(() => {
    openRegisterModal();
    router.replace("/");
  }, [openRegisterModal, router]);

  return null;
}
