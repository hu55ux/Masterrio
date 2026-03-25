import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTokens = create(
  persist(
    (set) => ({
      accessToken: "",
      refreshToken: "",
      userId: "",
      loading: false,
      setLoading: (loading) => set({ loading }),
      setAccessToken: (accessToken) => {
        let userId = "";
        if (accessToken) {
          try {
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || payload.sub || payload.id || "";
          } catch (e) {
            console.error("Error decoding token for initial ID:", e);
          }
        }
        set({ accessToken, userId: userId || useTokens.getState().userId });
      },
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      setUserId: (userId) => set({ userId }),
      clearTokens: () => set({ accessToken: "", refreshToken: "", userId: "" }),
    }),
    { name: "tokens" }
  )
);
