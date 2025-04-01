// hooks/ml/analytics/use-skill-demand.ts
import { useQuery } from "@tanstack/react-query";
import { mlAnalyticsClient } from "@/lib/ml/analytics/client";
import { monitoring } from "@/lib/core/monitoring";

export function useSkillDemand(days: number = 90) {
  return useQuery({
    queryKey: ["ml-analytics", "skill-demand", days],
    queryFn: async () => {
      try {
        const response = await mlAnalyticsClient.getSkillDemand(days);
        return response.data;
      } catch (error) {
        monitoring.trackError({
          message: "Failed to fetch skill demand",
          error: error instanceof Error ? error : new Error("Unknown error"),
          metadata: { days },
        });
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
