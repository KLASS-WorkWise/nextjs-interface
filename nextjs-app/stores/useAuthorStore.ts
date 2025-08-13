import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type AuthState = {
  username: string | null;
  accessToken: string | null;
  isHydrated: boolean;
  setAuth: (username: string, accessToken: string) => void;
  logout: () => void;
  setHydrated: (hydrated: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        username: null,
        accessToken: null,
        isHydrated: false,
        setAuth: (username, accessToken) => set({ username, accessToken }),
        logout: () => set({ username: null, accessToken: null }),
        setHydrated: (hydrated) => set({ isHydrated: hydrated }),
      }),
      {
        name: "auth-storage",
        onRehydrateStorage: () => (state) => {
          state?.setHydrated(true);
        },
      }
    )
  )
);