// lib/llm/client/interceptors.ts
import {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { security } from "@/lib/core/security/security-service";
import { monitoring } from "@/lib/core/monitoring/monitoring-service";

/* ------------------------------------------------------------------ */
/*  Extra field (endTracking) that we inject into the request config  */
/* ------------------------------------------------------------------ */
interface TrackableRequestConfig<D = unknown>
  extends InternalAxiosRequestConfig<D> {
  endTracking?: () => void;
}

/* ------------------------------------------------------------------ */
/*  Response whose config is TrackableRequestConfig                   */
/* ------------------------------------------------------------------ */
type TrackableAxiosResponse<T = unknown, D = unknown> = AxiosResponse<T, D> & {
  config: TrackableRequestConfig<D>;
};

/* ------------------------------------------------------------------ */
/*  Interceptor setup                                                 */
/* ------------------------------------------------------------------ */
export const setupLLMInterceptors = (api: AxiosInstance): void => {
  /* ────────────────  REQUEST  ──────────────── */
  api.interceptors.request.use(
    (config: TrackableRequestConfig) => {
      /* ---- security checks -------------------------------------------------- */
      const token = security.getToken();
      if (!token) {
        return Promise.reject(new Error("No authentication token found"));
      }
      if (!security.validateToken(token)) {
        return Promise.reject(new Error("Token is invalid or expired"));
      }

      /* ---- inject auth + security headers ----------------------------------- */
      config.headers.Authorization = `Bearer ${token}`;
      Object.assign(config.headers, security.getSecurityHeaders());

      /* ---- start performance timer ------------------------------------------ */
      config.endTracking = monitoring.startPerformanceTracking(
        `LLM_${config.method?.toUpperCase()} ${config.url}`
      );

      return config;
    },
    (err: AxiosError) => {
      monitoring.trackError({
        message: "LLM API request error",
        error: err,
      });
      return Promise.reject(err);
    }
  );

  /* ────────────────  RESPONSE  ─────────────── */
  api.interceptors.response.use(
    (response: TrackableAxiosResponse) => {
      /* ---- stop performance timer ------------------------------------------- */
      response.config.endTracking?.();

      /* ---- success event ---------------------------------------------------- */
      monitoring.trackEvent({
        name: "llm_api_success",
        properties: {
          endpoint: response.config.url,
          method: response.config.method,
        },
      });

      /* ---- hand the *payload* to callers ------------------------------------ */
      return Promise.resolve(response);
    },
    (err: AxiosError) => {
      /* ---- stop timer if it was started ------------------------------------- */
      const cfg = err.config as TrackableRequestConfig | undefined;
      cfg?.endTracking?.();

      /* ---- error event ------------------------------------------------------ */
      monitoring.trackError({
        message: "LLM API response error",
        error: err,
        metadata: {
          url: cfg?.url,
          method: cfg?.method,
          status: err.response?.status,
        },
      });

      return Promise.reject(err);
    }
  );
};
