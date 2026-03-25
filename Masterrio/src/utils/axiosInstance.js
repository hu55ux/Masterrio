import axios from "axios";
import { useTokens } from "@/stores/useTokens";

const axiosInstance = axios.create({
  baseURL: "/api", // Vite Proxy sayəsində bu localhost:5071/api kimi işləyəcək
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const { accessToken } = useTokens.getState();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Centralized error handling for responses
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Token is invalid or expired
      useTokens.getState().clearTokens();
      
      // Əgər sorğu onsuz da login üçün idisə, refresh (restart) etmə, sadəcə xətanı göstər.
      if (!error.config.url.toLowerCase().includes("/login")) {
        window.location.href = "/login";
      }
    }

    if (status === 403) {
      console.error("Access denied (403 Forbidden)");
    }

    if (status === 500) {
      console.error("Internal server error (500)");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
