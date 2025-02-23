"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ScrapingHistoryItem } from "@/types/index";

export function ScrapeHistory({ history }: { history: ScrapingHistoryItem[] }) {
  const recentHistory = history.slice(0, 5);
  const hasMoreItems = history.length > 5;

  return (
    <Card className="bg-neutral-900 border-neutral-800">
      <CardHeader className="flex flex-row items-center justify-between p-4">
        <CardTitle className="text-xl text-white">Scraping History</CardTitle>
        {hasMoreItems && (
          <Link
            href="/dashboard/history"
            className="text-blue-400 hover:text-blue-300 flex items-center text-sm"
          >
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </Link>
        )}
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {recentHistory.length > 0 ? (
          recentHistory.map((item) => (
            <div
              key={item.id}
              className="border-b border-neutral-800 last:border-0 pb-4 last:pb-0"
            >
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <p className="text-white text-base">
                    {item.jobs_found} jobs found
                  </p>
                  <p className="text-neutral-400 text-sm">
                    {format(
                      new Date(item.start_time),
                      "MMM dd, yyyy, hh:mm:ss a"
                    )}
                  </p>
                  {item.error && (
                    <p className="text-red-400 text-sm mt-1">{item.error}</p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium 
                    ${
                      item.status === "success"
                        ? "bg-green-900 text-green-300"
                        : item.status === "running"
                        ? "bg-blue-900 text-blue-300"
                        : "bg-red-900 text-red-300"
                    }`}
                >
                  {item.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-neutral-400">
            No scraping history available
          </div>
        )}
      </CardContent>
    </Card>
  );
}
