import axios from "axios";
import { toast } from "sonner";
import Cookies from "js-cookie";
import {
  EmailConfig,
  SchedulerConfig,
  DashboardStats,
  ScrapingHistory,
  JobsQueryParams,
} from "@/types";

const api = axios.create({
  baseURL:
    `${process.env.NEXT_PUBLIC_API_URL}/api/v1` ||
    "http://localhost:8000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

interface LoginResponse {
  access_token: string;
  token_type: string;
}

interface RegisterResponse {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
}

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.detail || "An error occurred";

    if (error.response?.status === 401) {
      // If user is already logged in and session expires -> Logout
      const token = localStorage.getItem("token");
      if (token) {
        localStorage.removeItem("token");
        Cookies.remove("token");
        toast.error("Session expired. Please log in again.");
        window.location.href = "/login"; // Redirect ONLY if user was already logged in
      }
    } else {
      toast.error(message);
    }

    return Promise.reject(error);
  }
);

export const authApi = {
  setAuthToken: (token: string | null) => {
    if (token) {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common["Authorization"];
    }
  },
  login: async (credentials: {
    email: string;
    password: string;
  }): Promise<LoginResponse> => {
    try {
      const response = await api.post("/auth/login", credentials);
      console.log(response);

      return response as unknown as LoginResponse;
    } catch (error) {
      throw error;
    }
  },
  register: async (userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<RegisterResponse> => {
    try {
      return await api.post("/auth/register", userData);
      // return response;
    } catch (error) {
      throw error;
    }
  },
};

export const settingsApi = {
  getSettings: async () => {
    try {
      const response = await api.get("/settings");

      return response;
    } catch (error) {
      console.error("Error fetching settings:", error);
      throw error;
    }
  },

  updateEmailConfig: async (emailConfig: EmailConfig) => {
    try {
      const response = await api.put("/settings/email", emailConfig);
      return response;
    } catch (error) {
      console.error("Error updating email config:", error);
      throw error;
    }
  },

  updateCronConfig: async (schedulerConfig: SchedulerConfig) => {
    try {
      const response = await api.put("/settings/scheduler", schedulerConfig);
      return response;
    } catch (error) {
      console.error("Error updating scheduler config:", error);
      throw error;
    }
  },
};

export const statsApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      // First, type the response as unknown
      const response = (await api.get("/stats/dashboard-stats")) as unknown;

      // Type guard function to check if response matches DashboardStats structure
      const isDashboardStats = (data: unknown): data is DashboardStats => {
        return (
          data !== null &&
          typeof data === "object" &&
          "stats" in data &&
          "jobsByCategory" in data &&
          "successRate" in data &&
          "scrapingHistory" in data
        );
      };

      // Check if response matches the expected structure
      if (isDashboardStats(response)) {
        return response;
      }

      console.log("Invalid response structure:", response);
      // Return default data if response doesn't match expected structure
      return {
        stats: {
          todayJobs: 0,
          totalJobs: 0,
          successRate: 0,
          avgScrapeTime: "N/A",
          lastScrapeTime: null,
        },
        jobsByCategory: [],
        successRate: [
          { name: "Success", value: 0 },
          { name: "Failed", value: 1 },
        ],
        scrapingHistory: [],
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return {
        stats: {
          todayJobs: 0,
          totalJobs: 0,
          successRate: 0,
          avgScrapeTime: "N/A",
          lastScrapeTime: null,
        },
        jobsByCategory: [],
        successRate: [
          { name: "Success", value: 0 },
          { name: "Failed", value: 1 },
        ],
        scrapingHistory: [],
      };
    }
  },
  getScrapingHistory: async (): Promise<ScrapingHistory> => {
    try {
      // First, type the response as unknown
      const response = (await api.get("/stats/scraping-history")) as unknown;

      // Type guard function to check if response matches ScrapingHistory structure
      const isScrapingHistory = (data: unknown): data is ScrapingHistory => {
        return (
          data !== null &&
          typeof data === "object" &&
          "recentSessions" in data &&
          "jobsOverTime" in data
        );
      };

      if (isScrapingHistory(response)) {
        return response;
      }

      console.log("Invalid response structure:", response);
      return {
        recentSessions: [],
        jobsOverTime: [],
      };
    } catch (error) {
      console.error("Error fetching scraping history:", error);
      return {
        recentSessions: [],
        jobsOverTime: [],
      };
    }
  },
};

export const jobsApi = {
  getJobs: async (params?: JobsQueryParams) => {
    try {
      const response = await api.get("/jobs", { params });
      return response;
    } catch (error) {
      console.error("Error fetching jobs:", error);
      throw error;
    }
  },

  triggerScrape: async () => {
    try {
      const response = await api.post("/jobs/scrape");
      return response;
    } catch (error) {
      console.error("Error triggering scrape:", error);
      throw error;
    }
  },
};
