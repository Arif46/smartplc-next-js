import { create } from "zustand";

type AuthModalView = "closed" | "login" | "register";

interface ModalState {
  authModal: AuthModalView;
  openLoginModal: () => void;
  openRegisterModal: () => void;
  closeAuthModal: () => void;
  openAuthModal: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  authModal: "closed",
  openLoginModal: () => set({ authModal: "login" }),
  openRegisterModal: () => set({ authModal: "register" }),
  closeAuthModal: () => set({ authModal: "closed" }),
  openAuthModal: () => set({ authModal: "login" }),
}));

export const useIsAuthModalOpen = () => useModalStore((s) => s.authModal !== "closed");
