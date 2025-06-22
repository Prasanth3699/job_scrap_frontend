import { useQuery } from "@tanstack/react-query";
import { mlAnalyticsClient } from "@/lib/ml/analytics/client";
import { security } from "@/lib/core/security/security-service";
import { monitoring } from "@/lib/core/monitoring";

export function useSalaryTrends(jobTitle?: string) {
  return useQuery({
    queryKey: ["ml-analytics", "salary-trends", jobTitle],
    queryFn: async () => {
      try {
        // Validate session
        if (!security.isAuthenticated()) {
          throw new Error("Authentication required");
        }

        if (!security.hasPermission("view_salary_data")) {
          throw new Error("Insufficient permissions");
        }

        // Validate jobTitle if provided
        if (jobTitle && typeof jobTitle !== "string") {
          throw new Error("Invalid job title format");
        }

        const response = await mlAnalyticsClient.getSalaryTrends(jobTitle);

        // Validate response structure
        if (!response || typeof response !== "object") {
          throw new Error("Invalid response format");
        }

        return response;
      } catch (error) {
        monitoring.trackError({
          message: "Failed to fetch salary trends",
          error: error instanceof Error ? error : new Error("Unknown error"),
          metadata: { jobTitle },
        });

        throw new Error(
          error instanceof Error
            ? security.sanitizeOutput(error.message)
            : "Failed to load salary data"
        );
      }
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    retry: (failureCount, error) => {
      // Don't retry on permission or auth errors
      if (
        error.message.includes("Authentication") ||
        error.message.includes("permissions")
      ) {
        return false;
      }
      return failureCount < 3;
    },
  });
}
