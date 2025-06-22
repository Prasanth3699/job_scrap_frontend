import { security } from "@/lib/core/security/security-service";
import { authApi } from "@/lib/api/auth-api";
import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from "axios";
import { useAuth } from "@/hooks/auth/use-auth";

/**
 * Adds security headers, attaches / refreshes the access token
 * and handles 401 responses.
 */
export const setupSecurityMiddleware = (api: AxiosInstance) => {
  let isRefreshing = false;
  let queue: ((token: string | null) => void)[] = [];

  const processQueue = (token: string | null) => {
    queue.forEach((cb) => cb(token));
    queue = [];
  };

  /* ──────────────────────────────────────────────
     REQUEST INTERCEPTOR
  ────────────────────────────────────────────── */
  api.interceptors.request.use(
    async (
      config: InternalAxiosRequestConfig
    ): Promise<InternalAxiosRequestConfig> => {
      /* refresh if token will expire in < 60 s */
      await security.refreshTokenIfNeeded();

      const token = security.getToken();
      if (!config.headers) {
        config.headers = {} as Record<string, string>;
      }
      const hdr = config.headers as Record<string, string>;

      if (token) {
        hdr.Authorization = `Bearer ${token}`;
      }

      /* ensure headers object exists, then merge security headers */
      Object.assign(
        config.headers as Record<string, string>,
        security.getSecurityHeaders()
      );

      return config;
    },
    (error) => Promise.reject(error)
  );

  /* ──────────────────────────────────────────────
     RESPONSE INTERCEPTOR
  ────────────────────────────────────────────── */
  api.interceptors.response.use(
    (response) => response.data,
    async (error: AxiosError) => {
      const original = error.config as InternalAxiosRequestConfig & {
        _retry?: boolean;
      };

      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;

        /* first tab that hits 401 triggers refresh */
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const { access_token } = await authApi.refreshToken();
            security.setToken(access_token);

            /* helper cookie for Next.js edge middleware */
            document.cookie =
              "access_token=" +
              access_token +
              "; Path=/; SameSite=Strict; Secure";

            processQueue(access_token);
          } catch (e) {
            processQueue(null);
            useAuth.getState().logout();
            return Promise.reject(e);
          } finally {
            isRefreshing = false;
          }
        }

        /* all other requests wait until refresh is done */
        return new Promise((resolve, reject) => {
          queue.push((newToken) => {
            if (!newToken) return reject(error);
            original.headers.Authorization = `Bearer ${newToken}`;
            resolve(api(original));
          });
        });
      }

      return Promise.reject(error);
    }
  );
};
