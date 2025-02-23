"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { formatDuration } from "@/lib/utils";
import { Confetti, type ConfettiRef } from "@/components/magicui/confetti";
import { useRef } from "react";

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
  const confettiRef = useRef<ConfettiRef>(null);

  // Function to trigger confetti at the bottom of the card
  const triggerConfetti = () => {
    if (!confettiRef.current) return;

    confettiRef.current?.fire({
      origin: {
        x: 0.5, // Center horizontally
        y: 1, // Start from bottom of the card
      },
      spread: 120,
      startVelocity: 20,
      gravity: 0.6,
      scalar: 1.1,
    });
  };
  return (
    <>
      <div
        className="relative"
        onMouseEnter={triggerConfetti} // Fires confetti when hovered
      >
        {/* Confetti inside the card */}
        <Confetti
          ref={confettiRef}
          className="absolute left-0 bottom-0 z-10 w-full h-full pointer-events-none"
        />
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
      </div>

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
