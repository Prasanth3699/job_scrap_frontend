// hooks/ml/analytics/use-job-availability.ts
import { useQuery } from "@tanstack/react-query";
import { mlAnalyticsClient } from "@/lib/ml/analytics/client";
import { security } from "@/lib/core/security/security-service";
import { monitoring } from "@/lib/core/monitoring";

export function useJobAvailability(days: number = 90) {
  return useQuery({
    queryKey: ["ml-analytics", "job-availability", days],
    queryFn: async () => {
      try {
        if (!security.isAuthenticated()) {
          throw new Error("Authentication required");
        }

        if (!security.hasPermission("admin")) {
          throw new Error("Insufficient permissions");
        }

        const response = await mlAnalyticsClient.getJobAvailability(days);
        return response;
      } catch (error) {
        monitoring.trackError({
          message: "Failed to fetch job availability",
          error: error instanceof Error ? error : new Error("Unknown error"),
          metadata: { days },
        });
        throw error;
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}
