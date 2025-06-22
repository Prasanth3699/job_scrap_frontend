import { api } from "./axios-instance";
import { DashboardStats, ScrapingHistory } from "@/types";
import { isDashboardStats, isScrapingHistory } from "@/lib/utils/api-helpers";
import {
  getDefaultDashboardStats,
  getDefaultScrapingHistory,
} from "@/lib/utils/api-helpers";

export const statsApi = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = (await api.get("/stats/dashboard-stats")) as unknown;

      if (isDashboardStats(response)) {
        return response;
      }

      return getDefaultDashboardStats();
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return getDefaultDashboardStats();
    }
  },

  getScrapingHistory: async (): Promise<ScrapingHistory> => {
    try {
      const response = (await api.get("/stats/scraping-history")) as unknown;

      if (isScrapingHistory(response)) {
        return response;
      }

      return getDefaultScrapingHistory();
    } catch (error) {
      console.error("Error fetching scraping history:", error);
      return getDefaultScrapingHistory();
    }
  },
};
