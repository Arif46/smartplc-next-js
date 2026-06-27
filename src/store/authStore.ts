// store/authStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "customer" | string;
}

interface AuthState {
    isAuthenticated: boolean;
    user: { role: string; first_name?: string; name?: string; email?: string } | null;
    token: string | null;
    setUser: (user: any) => void; 
    login: (token: string, user: any) => void;
    logout: () => void;
  }

export const useAuthStore = create<AuthState>()(
    persist(
      (set) => ({
        isAuthenticated: false,
        user: null,
        token: null,
        setUser: (user) => set({ user }),
        login: (token, user) => set({ isAuthenticated: true, token, user }),
        logout: () => set({ isAuthenticated: false, token: null, user: null }),
      }),
      { name: 'auth-storage' }
      // { name: 'auth-storage', getStorage: () => localStorage }
    )
  );

// if (typeof window !== "undefined") {
//     window.addEventListener('storage', (event) => {
//       if (event.key === 'auth-storage' && event.newValue === null) {
//         // user logged out in another tab
//         window.location.href = '/';
//       }
//     });
// }
