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
      // Əgər sorğu onsuz da login və ya refresh üçündürsə, təkrar etmə, sadəcə xəta at.
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
          // Sending both tokens in case the backend requires the expired token too.
          axiosInstance.post("/Auth/refresh", { accessToken, refreshToken })
            .then(({ data }) => {
              // Determine new tokens from typical response shapes
              const newAccess = data.accessToken || data.data?.accessToken;
              const newRefresh = data.refreshToken || data.data?.refreshToken;

              if (newAccess && newRefresh) {
                state.setAccessToken(newAccess);
                state.setRefreshToken(newRefresh);

                axiosInstance.defaults.headers.common['Authorization'] = 'Bearer ' + newAccess;
                originalRequest.headers['Authorization'] = 'Bearer ' + newAccess;

                processQueue(null, newAccess);
                resolve(axiosInstance(originalRequest));
              } else {
                throw new Error("Invalid refresh response");
              }
            })
            .catch((err) => {
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
