import { security } from "@/lib/core/security/security-service";
import { AxiosInstance } from "axios";

export const setupSecurityMiddleware = (api: AxiosInstance) => {
  api.interceptors.request.use(
    async (config) => {
      // Check and refresh token if needed
      await security.refreshTokenIfNeeded();

      const token = security.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add security headers
      Object.assign(config.headers, security.getSecurityHeaders());

      return config;
    },
    (error) => Promise.reject(error)
  );

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        security.clearAllTokens();
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }
  );
};
