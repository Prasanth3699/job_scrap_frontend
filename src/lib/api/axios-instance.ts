import axios from "axios";

import { authApi } from "./auth-api";
import { security } from "@/lib/core/security/security-service";
import { useAuth } from "@/hooks/auth/use-auth";

export const api = axios.create({
  baseURL:
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1` ||
    "http://localhost:8000/api/v1",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 10000, // 10 seconds
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
    const token = security.getToken();
    if (token) {
      const timeLeft = security.timeLeft(token);
      // 60 sec before expiry trigger a refresh
      if (timeLeft < 60_000) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const { access_token } = await authApi.refreshToken();
            security.setToken(access_token);
            authApi.setAuthToken(access_token);
            processQueue(access_token);
          } catch (e) {
            useAuth.getState().logout();
            return Promise.reject(e);
          } finally {
            isRefreshing = false;
          }
        }

        // if still refreshing, wait until it finishes
        return new Promise((resolve) =>
          requestQueue.push((newToken) => {
            config.headers.Authorization = `Bearer ${newToken}`;
            resolve(config);
          })
        );
      }

      // normal case – token still valid
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (resp) => resp.data, // keep previous behaviour
  async (error) => {
    const original = error.config;
    if (error.response?.status === 401 && !original?._retry) {
      original._retry = true;
      try {
        const { access_token } = await authApi.refreshToken();
        security.setToken(access_token);
        authApi.setAuthToken(access_token);
        original.headers.Authorization = `Bearer ${access_token}`;
        return api(original); // ← retry
      } catch (e) {
        useAuth.getState().logout();
      }
    }
    return Promise.reject(error);
  }
);
