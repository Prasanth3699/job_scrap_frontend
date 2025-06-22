// components/ml/analytics/UserEngagementCard.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useUserEngagement } from "@/hooks/ml/analytics/use-user-engagement";
import { security } from "@/lib/core/security/security-service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AlertTriangle } from "lucide-react";

export function UserEngagementCard() {
  const router = useRouter();
  const { data, isLoading, error, refetch } = useUserEngagement();

  const handleRefresh = async () => {
    try {
      // Verify session before refresh
      if (!(await security.refreshTokenIfNeeded())) {
        toast.error("Session expired. Redirecting to login...");
        router.push("/login");
        return;
      }
      await refetch();
      toast.success("Data refreshed successfully");
    } catch (err) {
      toast.error("Refresh failed. Please try again.");
      console.error("Refresh failed:", err);
    }
  };

  if (
    error?.message.includes("Session expired") ||
    error?.message.includes("Authentication")
  ) {
    toast.error("Your session has expired. Please log in again.", {
      action: {
        label: "Login",
        onClick: () => router.push("/login"),
      },
      duration: 5000,
    });
    return null;
  }

  return (
    <Card className="border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Engagement</CardTitle>
        <Button onClick={handleRefresh} disabled={isLoading}>
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-4 w-4" />
            <span>
              {security.sanitizeOutput(error.message) || "Failed to load data"}
            </span>
          </div>
        ) : (
          <div className="grid gap-4">
            {/* Secure metrics display */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Users</span>
              <span className="font-medium">
                {security.sanitizeOutput(data?.data?.total_users) || 0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Daily Active Users
              </span>
              <span className="font-medium">
                {security.sanitizeOutput(data?.data?.daily_active_users_avg) ||
                  0}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                Actions per User
              </span>
              <span className="font-medium">
                {security.sanitizeOutput(data?.data?.actions_per_user_avg) || 0}
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
