import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: (typeof window !== "undefined" ? localStorage.getItem("chat-theme") : "business") || "business",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));