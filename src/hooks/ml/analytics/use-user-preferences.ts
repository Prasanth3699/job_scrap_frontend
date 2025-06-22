import { useQuery } from "@tanstack/react-query";
import { mlAnalyticsClient } from "@/lib/ml/analytics/client";
import { security } from "@/lib/core/security/security-service";
import { monitoring } from "@/lib/core/monitoring";
import { useParams } from "next/navigation";

export function useUserPreferences() {
  const { userId } = useParams<{ userId: string }>();

  return useQuery({
    queryKey: ["ml-analytics", "user-preferences", userId],
    queryFn: async () => {
      try {
        // Validate session and permissions
        if (!security.isAuthenticated()) {
          throw new Error("Authentication required");
        }

        if (!security.hasPermission("view_user_preferences")) {
          throw new Error("Insufficient permissions");
        }

        // Validate userId format
        if (!userId || typeof userId !== "string") {
          throw new Error("Invalid user ID");
        }

        const response = await mlAnalyticsClient.getUserPreferences(userId);

        // Validate response structure
        if (!response || typeof response !== "object") {
          throw new Error("Invalid response format");
        }

        return response;
      } catch (error) {
        monitoring.trackError({
          message: "Failed to fetch user preferences",
          error: error instanceof Error ? error : new Error("Unknown error"),
          metadata: { userId },
        });

        // Rethrow with sanitized message
        throw new Error(
          error instanceof Error
            ? security.sanitizeOutput(error.message)
            : "Failed to load user preferences"
        );
      }
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 10, // 10 minutes
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
