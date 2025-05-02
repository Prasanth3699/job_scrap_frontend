import {
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios"; // Added types
import { security } from "@/lib/core/security/security-service"; // Adjust path as needed
import { monitoring } from "@/lib/core/monitoring/monitoring-service"; // Adjust path as needed

// --- Types ---
// Extend Axios config type to hold our custom tracking function
interface AxiosRequestConfigWithTracking extends InternalAxiosRequestConfig {
  endTracking?: () => void;
}

interface AxiosResponseWithTracking extends AxiosResponse {
  config: AxiosRequestConfigWithTracking; // Ensure config type matches request
}

interface AxiosErrorWithTracking extends Error {
  // Use basic Error type
  config?: AxiosRequestConfigWithTracking;
  response?: AxiosResponseWithTracking;
  isAxiosError: boolean; // Property added by Axios
  code?: string;
  message: string;
  name: string;
}

// --- Interceptor Setup ---
export const setupMLInterceptors = (api: AxiosInstance): void => {
  // === Request Interceptor ===
  api.interceptors.request.use(
    (
      config: AxiosRequestConfigWithTracking
    ): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
      const token = security.getToken();

      // Example: Validate token existence (add more complex validation if needed)
      if (!token) {
        console.warn("[Interceptor] No auth token found for request.");
        // Reject the request if token is strictly required
        // return Promise.reject(new Error("No authentication token found"));
        // Or allow request to proceed without token depending on API design
      } else {
        // Add Authorization header if token exists
        config.headers.Authorization = `Bearer ${token}`;
      }

      // Add other common security headers if applicable (except for FormData)
      if (!(config.data instanceof FormData)) {
        // Object.assign(config.headers, security.getSecurityHeaders());
      }

      // Start performance tracking
      try {
        const endTracking = monitoring.startPerformanceTracking(
          `ML_${config.method?.toUpperCase()} ${config.url}`
        );
        config.endTracking = endTracking; // Attach stop function to config
      } catch (perfError) {
        console.error(
          "[Interceptor] Failed to start performance tracking:",
          perfError
        );
      }

      return config; // Proceed with the modified config
    },
    (error: AxiosErrorWithTracking): Promise<never> => {
      // Catch request setup errors
      console.error("[Interceptor] Request Setup Error:", error);
      monitoring.trackError({ message: "ML API request setup error", error });
      return Promise.reject(error); // Reject the promise
    }
  );

  // === Response Interceptor ===
  api.interceptors.response.use(
    (response: AxiosResponseWithTracking): AxiosResponse["data"] => {
      // Success handler
      // Stop performance tracking
      if (response.config?.endTracking) {
        try {
          response.config.endTracking();
        } catch (perfError) {
          console.error(
            "[Interceptor] Failed to end performance tracking:",
            perfError
          );
        }
      }

      monitoring.trackEvent({
        name: "ml_api_success",
        properties: {
          endpoint: response.config?.url,
          method: response.config?.method,
          status: response.status,
        },
      });

      // --- IMPORTANT: Return ONLY response.data ---
      // Perform a basic check before returning
      if (response.data === undefined || response.data === null) {
        console.warn(
          "[Interceptor] response.data is undefined/null before returning. Calling code needs to handle this."
        );
      }
      return response.data; // Return the data payload directly
      // --- END IMPORTANT PART ---
    },
    (error: AxiosErrorWithTracking): Promise<never> => {
      // Error handler
      // Stop performance tracking on error too
      if (error.config?.endTracking) {
        try {
          error.config.endTracking();
        } catch (perfError) {
          console.error(
            "[Interceptor] Failed to end performance tracking on error:",
            perfError
          );
        }
      }

      console.error(
        `[Interceptor] Response Error for ${error.config?.url}:`,
        error.response?.status,
        error.message
      );
      monitoring.trackError({
        message: "ML API response error",
        error, // Pass the whole error object
        metadata: {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          responseData: error.response?.data, // Include response data in metadata if available
        },
      });

      // Reject the promise so the calling code's catch block can handle it
      return Promise.reject(error);
    }
  );
};
