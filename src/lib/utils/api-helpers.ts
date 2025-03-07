import { DashboardStats, ScrapingHistory } from "@/types";

export const isDashboardStats = (data: unknown): data is DashboardStats => {
  return (
    data !== null &&
    typeof data === "object" &&
    "stats" in data &&
    "jobsByCategory" in data &&
    "successRate" in data &&
    "scrapingHistory" in data
  );
};

export const isScrapingHistory = (data: unknown): data is ScrapingHistory => {
  return (
    data !== null &&
    typeof data === "object" &&
    "recentSessions" in data &&
    "jobsOverTime" in data
  );
};

export const getDefaultDashboardStats = (): DashboardStats => ({
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
});

export const getDefaultScrapingHistory = (): ScrapingHistory => ({
  recentSessions: [],
  jobsOverTime: [],
});
