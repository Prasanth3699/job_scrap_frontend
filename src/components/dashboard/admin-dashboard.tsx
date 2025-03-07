"use client";

import { useJobs } from "@/hooks/jobs/use-jobs";
import { Play } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { StatsCard } from "@/components/dashboard/stats-card";
import { AnalyticsCharts } from "@/components/dashboard/analytics-charts";
import { ScrapeHistory } from "@/components/dashboard/scrape-history";
import { statsApi } from "@/lib/api/stats-api";
import { DashboardStats } from "@/types/index";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { Cover } from "@/components/ui/cover";

export function AdminDashboard() {
  const { triggerScrape, isScrapingLoading } = useJobs();

  const { data: dashboardStats, isLoading } = useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: statsApi.getDashboardStats,
    refetchInterval: 30000,
    initialData: {
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
    },
  });

  return (
    <div className="w-full p-4 md:p-6">
      {/* Header Section */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              <Cover>Dashboard</Cover>
            </h2>
            <p className="text-muted-foreground mt-1">
              Monitor your scraping performance and analytics
            </p>
          </div>

          <ShinyButton
            onClick={() => triggerScrape()}
            // disabled={isScrapingLoading}
            className="w-full sm:w-auto border border-gray-800 bg-transparent text-white hover:bg-gray-800 transition flex items-center"
          >
            {isScrapingLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Scraping...
              </>
            ) : (
              <div className="flex items-center">
                <Play className="mr-2 h-4 w-4" />
                Start Scraping
              </div>
            )}
          </ShinyButton>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Stats Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatsCard stats={dashboardStats.stats} />
          </div>

          {/* Analytics Charts Row */}
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white dark:bg-neutral-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-800 p-4">
              <AnalyticsCharts data={dashboardStats} />
            </div>
          </div>

          {/* Scrape History */}
          <div className="grid grid-cols-1 gap-4">
            <ScrapeHistory history={dashboardStats.scrapingHistory} />
          </div>
        </div>
      )}
    </div>
  );
}
