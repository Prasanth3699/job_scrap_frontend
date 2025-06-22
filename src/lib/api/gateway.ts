import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { security } from "../core/security/security-service";
import { monitoring } from "../core/monitoring/monitoring-service";
import { SERVICE_PATHS } from "../config/service-paths";

/**
 * Configuration for gateway services
 */
interface GatewayConfig {
  path: string;
  timeout?: number;
  headers?: Record<string, string>;
}

/**
 * Creates and configures an Axios instance for a specific gateway service
 */
export function createServiceClient(config: GatewayConfig): AxiosInstance {
  const baseURL = makeGatewayUrl(config.path);

  const instance = axios.create({
    baseURL,
    timeout: config.timeout || 10000,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...config.headers,
    },
  });

  // Add request interceptor
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      // Handle undefined baseURL and url with empty string fallbacks
      const baseUrl = config.baseURL || "";
      const url = config.url || "";
      console.log("Making request to:", baseUrl + url);

      // Attach auth token if available
      const token = security.getToken();
      if (token) {
        // Check if token needs refresh
        if (security.timeLeft(token) < 60_000) {
          await security.refreshTokenIfNeeded();
          const newToken = security.getToken();
          if (newToken) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${newToken}`;
          }
        } else {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }

      // Attach performance tracking
      const endTracking = monitoring.startPerformanceTracking(
        `API_${config.method?.toUpperCase() || "UNKNOWN"} ${url}`
      );

      // Add tracking to config
      (
        config as InternalAxiosRequestConfig & { endTracking?: () => void }
      ).endTracking = endTracking;

      // Add security headers
      config.headers = config.headers || {};
      Object.assign(config.headers, security.getSecurityRequestHeaders());

      return config;
    },
    (error: Error) => {
      monitoring.trackError({
        message: "API request error",
        error,
      });
      return Promise.reject(error);
    }
  );

  // Add response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      // End performance tracking
      const configWithTracking =
        response.config as InternalAxiosRequestConfig & {
          endTracking?: () => void;
        };
      if (configWithTracking.endTracking) {
        configWithTracking.endTracking();
      }

      // Track successful API call
      monitoring.trackEvent({
        name: "api_success",
        properties: {
          endpoint: response.config.url || "unknown",
          method: response.config.method || "unknown",
          status: response.status,
        },
      });

      // Return only the data portion of the response
      return response.data;
    },
    async (error: unknown) => {
      // Properly type the error
      interface AxiosErrorWithConfig {
        config?: AxiosRequestConfig & {
          endTracking?: () => void;
          _retry?: boolean;
        };
        response?: {
          status: number;
        };
      }

      const axiosError = error as AxiosErrorWithConfig;

      // End performance tracking
      if (axiosError.config?.endTracking) {
        axiosError.config.endTracking();
      }

      // Handle 401 unauthorized errors (token expired)
      if (axiosError.response?.status === 401) {
        const originalRequest = axiosError.config;

        // Prevent infinite loop
        if (originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Try to refresh token
            const refreshed = await security.refreshTokenIfNeeded();
            if (refreshed) {
              // Retry with new token
              const token = security.getToken();
              if (token && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return instance(originalRequest);
              }
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            // Force logout on refresh failure
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }
      }

      // Track API error
      monitoring.trackError({
        message: "API response error",
        error: error instanceof Error ? error : new Error(String(error)),
        metadata: {
          url: axiosError.config?.url || "unknown",
          method: axiosError.config?.method || "unknown",
          status: axiosError.response?.status,
        },
      });

      return Promise.reject(error);
    }
  );

  return instance;
}

/**
 * Generates a complete URL for a gateway service
 * Works in both browser and server contexts
 */
export function makeGatewayUrl(path: string): string {
  const origin = process.env.NEXT_PUBLIC_GATEWAY_ORIGIN || "http://localhost";
  return `${origin}${path}`;
}

/**
 * Creates a WebSocket URL through the gateway
 */
export function makeWebSocketUrl(path: string, endpoint: string = ""): string {
  const origin = process.env.NEXT_PUBLIC_GATEWAY_ORIGIN || "http://localhost";
  // Replace http(s) with ws(s)
  const wsOrigin = origin.replace(/^http/, "ws");
  return `${wsOrigin}${path}${endpoint}`;
}

/**
 * Main API client for the core service
 */
export const coreApi = createServiceClient({
  path: SERVICE_PATHS.CORE,
  timeout: 10000,
});

/**
 * ML service client
 */
export const mlApi = createServiceClient({
  path: SERVICE_PATHS.ML,
  timeout: 30000, // Longer timeout for ML operations
});

/**
 * LLM service client
 */
export const llmApi = createServiceClient({
  path: SERVICE_PATHS.LLM,
  timeout: 90000, // Very long timeout for LLM operations
});

/**
 * Helper to check gateway health
 */
export async function checkGatewayHealth(): Promise<boolean> {
  try {
    const response = await axios.get(`${makeGatewayUrl("/health")}`, {
      timeout: 5000,
    });
    return response.status === 200;
  } catch (error) {
    console.error("API Gateway health check failed:", error);
    return false;
  }
}
