import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";

export const api = axios.create({
  baseURL:
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1` ||
    "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.detail || "An error occurred";

    if (error.response?.status === 401) {
      const token = localStorage.getItem("token");
      if (token) {
        localStorage.removeItem("token");
        Cookies.remove("token");
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login";
      }
    } else if (error.response?.status === 429) {
      toast.error("Too many requests. Please try again later.");
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);
