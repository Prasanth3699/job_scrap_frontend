"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { formatDuration } from "@/lib/utils";

interface Stats {
  todayJobs: number;
  totalJobs: number;
  successRate: number;
  avgScrapeTime: string | null;
  lastScrapeTime: string | null;
}

interface StatsCardProps {
  stats: Stats;
}

export function StatsCard({ stats }: StatsCardProps) {
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Today&apos;s Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.todayJobs}</div>
          <p className="text-xs text-muted-foreground">
            Total: {stats.totalJobs}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.successRate}%</div>
          <p className="text-xs text-muted-foreground">Last 24 hours</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Scrape</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatDuration(
              parseFloat(stats.avgScrapeTime as unknown as string) || 0
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {stats.lastScrapeTime
              ? formatDistanceToNow(new Date(stats.lastScrapeTime), {
                  addSuffix: true,
                })
              : "No data available"}
          </p>
        </CardContent>
      </Card>
    </>
  );
}
