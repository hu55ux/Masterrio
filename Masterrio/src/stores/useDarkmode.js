import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useDarkmode = create(
  persist(
    (set) => ({
      isDarkmodeActive: window.matchMedia("(prefers-color-scheme: dark)").matches,
      toggleDarkmode: () => set((state) => ({ isDarkmodeActive: !state.isDarkmodeActive })),
    }),
    { name: "darkmode" }
  )
);
