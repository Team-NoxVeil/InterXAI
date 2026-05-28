import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: BASE_URL,
});

// Request Interceptor: Attach token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    // Check for user token first, then org token
    const token =
      localStorage.getItem("token") || localStorage.getItem("org_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response Interceptor: Handle global 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const url = error.config?.url || "";
      // Do not trigger global redirect for login or signup endpoints
      if (url.includes("/login") || url.includes("/signup")) {
        return Promise.reject(error);
      }

      // Clear tokens
      localStorage.removeItem("token");
      localStorage.removeItem("org_token");

      // Dispatch custom event so App.tsx can cleanly update the page state
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    return Promise.reject(error);
  },
);
