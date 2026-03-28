import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useTokens = create(
  persist(
    (set) => ({
      accessToken: "",
      refreshToken: "",
      userId: "",
      role: "",
      loading: false,
      setLoading: (loading) => set({ loading }),
      setAccessToken: (accessToken) => {
        let userId = "";
        let role = "";
        if (accessToken) {
          try {
            const payload = JSON.parse(atob(accessToken.split('.')[1]));
            userId = payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"] || payload.sub || payload.id || "";
            let rawRole = payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload.role || "";
            role = Array.isArray(rawRole) ? rawRole[0] : rawRole;
          } catch (e) {
            console.error("Error decoding token:", e);
          }
        }
        set({ 
          accessToken, 
          userId: userId || useTokens.getState().userId,
          role: role || useTokens.getState().role 
        });
      },
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      setUserId: (userId) => set({ userId }),
      clearTokens: () => set({ accessToken: "", refreshToken: "", userId: "", role: "" }),
    }),
    { name: "tokens" }
  )
);
