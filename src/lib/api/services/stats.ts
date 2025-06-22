import { coreApi } from "../gateway";
import { CORE_ENDPOINTS } from "../endpoints";
import { DashboardStats, ScrapingHistory } from "@/types";
import { isDashboardStats, isScrapingHistory } from "@/lib/utils/api-helpers";
import {
  getDefaultDashboardStats,
  getDefaultScrapingHistory,
} from "@/lib/utils/api-helpers";

/**
 * Analytics and statistics service
 */
export const statsService = {
  /**
   * Get dashboard statistics
   */
  getDashboardStats: async (): Promise<DashboardStats> => {
    try {
      const response = (await coreApi.get(
        CORE_ENDPOINTS.DASHBOARD_STATS
      )) as unknown;

      if (isDashboardStats(response)) {
        return response;
      }

      return getDefaultDashboardStats();
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      return getDefaultDashboardStats();
    }
  },

  /**
   * Get scraping history data
   */
  getScrapingHistory: async (): Promise<ScrapingHistory> => {
    try {
      const response = (await coreApi.get(
        CORE_ENDPOINTS.SCRAPING_HISTORY
      )) as unknown;

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
