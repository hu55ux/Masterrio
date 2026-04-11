import axios from "axios";
import { useTokens } from "@/stores/useTokens";

const axiosInstance = axios.create({
  baseURL: "/api",
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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Centralized error handling for responses
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401) {
      if (originalRequest.url.toLowerCase().includes("/login") || originalRequest.url.toLowerCase().includes("/refresh")) {
        useTokens.getState().clearTokens();
        if (!originalRequest.url.toLowerCase().includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }

      if (!originalRequest._retry) {
        if (isRefreshing) {
          return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return axiosInstance(originalRequest);
          }).catch(err => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const state = useTokens.getState();
        const { accessToken, refreshToken } = state;

        return new Promise(function (resolve, reject) {
          // Bypassing axiosInstance to prevent injecting the expired Authorization header.
          // Confirmed request body structure: { "refreshToken": "string" }
          axios.post("/api/Auth/refresh", { 
            refreshToken: refreshToken 
          }, {
            headers: { "Content-Type": "application/json" }
          })
            .then(({ data }) => {
              // Confirmed response structure: { "success": true, "data": { "accessToken": "...", "refreshToken": "..." } }
              // Accessing data.data as the payload container.
              const payload = data?.data;
              const newAccess = payload?.accessToken;
              const newRefresh = payload?.refreshToken;

              if (newAccess && newRefresh) {
                state.setAccessToken(newAccess);
                state.setRefreshToken(newRefresh);
                
                // If the response includes user ID, update it as well (matches Login behavior)
                if (payload?.id) state.setUserId(payload.id);

                axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newAccess;
                originalRequest.headers['Authorization'] = 'Bearer ' + newAccess;

                processQueue(null, newAccess);
                resolve(axiosInstance(originalRequest));
              } else {
                console.error("Token refresh failed: response missing expected data properties", data);
                throw new Error("Invalid refresh response structure");
              }
            })
            .catch((err) => {
              console.error("Critical: Token refresh failed", err.response?.data || err.message);
              processQueue(err, null);
              state.clearTokens();
              window.location.href = "/login";
              reject(err);
            })
            .finally(() => {
              isRefreshing = false;
            });
        });
      }

      // If retry is true but we still got 401
      useTokens.getState().clearTokens();
      window.location.href = "/login";
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
