// lib/api/gateway.ts
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { security } from "../core/security/security-service";
import { monitoring } from "../core/monitoring/monitoring-service";
import { SERVICE_PATHS } from "../config/service-paths";

interface GatewayConfig {
  path: string;
  timeout?: number;
  headers?: Record<string, string>;
}

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

  // Request interceptor
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const baseUrl = config.baseURL || "";
      const url = config.url || "";
      console.log("🚀 Making request to:", baseUrl + url);

      const token = security.getToken();
      if (token) {
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

      const endTracking = monitoring.startPerformanceTracking(
        `API_${config.method?.toUpperCase() || "UNKNOWN"} ${url}`
      );

      (
        config as InternalAxiosRequestConfig & { endTracking?: () => void }
      ).endTracking = endTracking;

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

  // Response interceptor
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      const configWithTracking =
        response.config as InternalAxiosRequestConfig & {
          endTracking?: () => void;
        };
      if (configWithTracking.endTracking) {
        configWithTracking.endTracking();
      }

      monitoring.trackEvent({
        name: "api_success",
        properties: {
          endpoint: response.config.url || "unknown",
          method: response.config.method || "unknown",
          status: response.status,
        },
      });

      return response.data;
    },
    async (error: unknown) => {
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

      if (axiosError.config?.endTracking) {
        axiosError.config.endTracking();
      }

      if (axiosError.response?.status === 401) {
        const originalRequest = axiosError.config;

        if (originalRequest && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshed = await security.refreshTokenIfNeeded();
            if (refreshed) {
              const token = security.getToken();
              if (token && originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return instance(originalRequest);
              }
            }
          } catch (refreshError) {
            console.error("Token refresh failed:", refreshError);
            window.location.href = "/login";
            return Promise.reject(refreshError);
          }
        }
      }

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
 * Fixed URL construction
 */
export function makeGatewayUrl(path: string): string {
  const origin = process.env.NEXT_PUBLIC_GATEWAY_ORIGIN || "http://localhost";
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  const fullUrl = `${origin}${normalizedPath}`;

  console.log("🌐 Gateway URL constructed:", fullUrl);
  return fullUrl;
}

export function makeWebSocketUrl(path: string, endpoint: string = ""): string {
  const origin = process.env.NEXT_PUBLIC_GATEWAY_ORIGIN || "http://localhost";
  const wsOrigin = origin.replace(/^http/, "ws");
  return `${wsOrigin}${path}${endpoint}`;
}

/**
 * Service clients
 */
export const coreApi = createServiceClient({
  path: SERVICE_PATHS.CORE,
  timeout: 10000,
});

export const mlApi = createServiceClient({
  path: SERVICE_PATHS.ML,
  timeout: 30000,
});

export const llmApi = createServiceClient({
  path: SERVICE_PATHS.LLM,
  timeout: 90000,
});

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
