import axios from "axios";
import { authService } from "@/lib/api/services/auth";
import { security } from "@/lib/core/security/security-service";
import { useAuth } from "@/hooks/auth/use-auth";

// Create the main API instance using the gateway
export const api = axios.create({
  baseURL:
    `${process.env.NEXT_PUBLIC_GATEWAY_ORIGIN}/api` || "http://localhost/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000,
});

let isRefreshing = false;
let requestQueue: ((t: string) => void)[] = [];

const processQueue = (token?: string) => {
  requestQueue.forEach((cb) => cb(token as string));
  requestQueue = [];
};

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    console.log("Making request to:", config.baseURL + config.url);

    const token = security.getToken();
    if (token) {
      const timeLeft = security.timeLeft(token);
      if (timeLeft < 60_000) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const { access_token } = await authService.refreshToken();
            security.setToken(access_token);
            authService.setAuthToken(access_token);
            processQueue(access_token);
          } catch (e) {
            useAuth.getState().logout();
            return Promise.reject(e);
          } finally {
            isRefreshing = false;
          }
        }

        return new Promise((resolve) =>
          requestQueue.push((newToken) => {
            config.headers.Authorization = `Bearer ${newToken}`;
            resolve(config);
          })
        );
      }

      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (resp) => resp.data,
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true;
      try {
        const { access_token } = await authService.refreshToken();
        security.setToken(access_token);
        authService.setAuthToken(access_token);
        original.headers.Authorization = `Bearer ${access_token}`;
        return api(original);
      } catch (e) {
        useAuth.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);
