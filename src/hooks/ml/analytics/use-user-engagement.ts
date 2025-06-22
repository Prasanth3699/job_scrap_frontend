// hooks/ml/analytics/use-user-engagement.ts
import { useQuery } from "@tanstack/react-query";
import { mlAnalyticsClient } from "@/lib/ml/analytics/client";
import { security } from "@/lib/core/security/security-service";
import { monitoring } from "@/lib/core/monitoring";

export function useUserEngagement(days: number = 30) {
  return useQuery({
    queryKey: ["ml-analytics", "user-engagement", days],
    queryFn: async () => {
      try {
        // Validate session before making request
        await security.refreshTokenIfNeeded();

        if (!security.isAuthenticated()) {
          monitoring.trackError({
            message: "Unauthorized analytics access attempt",
            error: new Error("Unauthorized access"),
            metadata: { days },
          });
          throw new Error("Session expired. Please log in again.");
        }

        const response = await mlAnalyticsClient.getUserEngagement(days);

        // Validate response structure
        if (!response || typeof response !== "object") {
          throw new Error("Invalid response format");
        }

        return response;
      } catch (error) {
        monitoring.trackError({
          message: "Failed to fetch user engagement",
          error: error instanceof Error ? error : new Error("Unknown error"),
          metadata: { days },
        });

        // Rethrow with sanitized message
        throw new Error(
          error instanceof Error
            ? error.message
            : "Failed to load engagement data"
        );
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      // Don't retry if it's an authentication error
      if (
        error.message.includes("Session expired") ||
        error.message.includes("Unauthorized")
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });
}
