import { create } from "zustand";
import { persist } from "zustand/middleware";

const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: "system", // "light" | "dark" | "system"

      resolvedTheme: () => {
        const { theme } = get();
        if (theme !== "system") return theme;
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      },

      setTheme: (theme) => set({ theme }),

      cycleTheme: () => {
        const order = ["light", "dark", "system"];
        const current = get().theme;
        const next = order[(order.indexOf(current) + 1) % order.length];
        set({ theme: next });
      },
    }),
    {
      name: "protrackr-theme",
      version: 1,
    },
  ),
);

export default useThemeStore;
