//lib/ml/api/client/interceptors.ts
import { AxiosInstance } from "axios";
import { security } from "@/lib/core/security/security-service";
import { monitoring } from "@/lib/core/monitoring/monitoring-service";

export const setupMLInterceptors = (api: AxiosInstance) => {
  // Request interceptor
  api.interceptors.request.use(
    (config) => {
      const token = security.getToken();
      if (!token) {
        return Promise.reject(new Error("No authentication token found"));
      }

      if (!security.validateToken(token)) {
        return Promise.reject(new Error("Token is invalid or expired"));
      }

      // Handle different content types
      if (config.headers["Content-Type"] === "multipart/form-data") {
        // For multipart/form-data, don't modify headers
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        config.headers.Authorization = `Bearer ${token}`;
        Object.assign(config.headers, security.getSecurityHeaders());
      }

      const endTracking = monitoring.startPerformanceTracking(
        `ML_${config.method?.toUpperCase()} ${config.url}`
      );
      (config as any).endTracking = endTracking;

      return config;
    },
    (error) => {
      monitoring.trackError({
        message: "ML API request error",
        error,
      });
      return Promise.reject(error);
    }
  );

  api.interceptors.response.use(
    (response) => {
      if ((response.config as any).endTracking) {
        (response.config as any).endTracking();
      }

      monitoring.trackEvent({
        name: "ml_api_success",
        properties: {
          endpoint: response.config.url,
          method: response.config.method,
        },
      });

      // Return the entire response for multipart/form-data
      return response.data;
    },
    (error) => {
      if ((error.config as any).endTracking) {
        (error.config as any).endTracking();
      }

      monitoring.trackError({
        message: "ML API response error",
        error,
        metadata: {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
        },
      });

      return Promise.reject(error);
    }
  );
};
